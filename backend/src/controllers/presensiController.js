const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const {
  guruIdOf, siswaIdOf, kelasMapelDariPertemuan,
  kelasMapelMilikGuru, kelasMapelDiikutiSiswa,
} = require('../utils/akses');

// ---------------------------------------------------------------------
// Presensi (daftar hadir) siswa
// ---------------------------------------------------------------------
// Alur yang dipakai mengikuti kebiasaan di kelas:
//   1. Guru membuka presensi pada pertemuan yang sedang berlangsung.
//   2. Selama presensi dibuka, siswa menyatakan kehadirannya sendiri.
//   3. Guru melengkapi keterangan siswa yang sakit, izin, atau alpa,
//      lalu menutup presensi.
//   4. Setelah ditutup, siswa yang belum menyatakan hadir otomatis
//      tercatat alpa dan status tidak dapat diubah siswa lagi.
// ---------------------------------------------------------------------

const STATUS = ['hadir', 'sakit', 'izin', 'alpa'];

const LABEL = {
  hadir: 'Hadir', sakit: 'Sakit', izin: 'Izin', alpa: 'Alpa',
};

// Memastikan pengguna berhak atas pertemuan, sekaligus mengambil datanya
async function pertemuanDan(idPertemuan) {
  const [[pt]] = await pool.query(`
    SELECT pt.id, pt.nomor, pt.judul, pt.tanggal, pt.id_kelas_mapel,
           mp.nama AS nama_mapel, k.id AS id_kelas, k.nama_kelas, p.kode AS kode_periode,
           p.status AS status_periode
    FROM pertemuan pt
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode p ON p.id = k.id_periode
    WHERE pt.id = ?`, [idPertemuan]);
  return pt || null;
}

// Daftar siswa pada kelas sebuah pertemuan
async function siswaPertemuan(idKelas) {
  const [rows] = await pool.query(`
    SELECT s.id, u.nama, s.nis
    FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    WHERE sk.id_kelas = ? ORDER BY u.nama`, [idKelas]);
  return rows;
}

function ringkas(daftar) {
  const r = { hadir: 0, sakit: 0, izin: 0, alpa: 0, belum: 0, total: daftar.length };
  for (const d of daftar) {
    if (!d.status) r.belum += 1;
    else r[d.status] += 1;
  }
  r.persen_hadir = r.total ? Math.round((r.hadir / r.total) * 1000) / 10 : 0;
  return r;
}

// GET /api/pertemuan/:id/presensi
exports.detail = asyncHandler(async (req, res) => {
  const pt = await pertemuanDan(req.params.id);
  if (!pt) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });

  const peran = req.user.role;
  if (peran === 'guru' && !(await kelasMapelMilikGuru(req.user.id, pt.id_kelas_mapel)))
    return res.status(403).json({ message: 'Bukan pertemuan pada kelas yang Anda ampu' });
  if (peran === 'siswa' && !(await kelasMapelDiikutiSiswa(req.user.id, pt.id_kelas_mapel)))
    return res.status(403).json({ message: 'Bukan pertemuan pada kelas Anda' });

  const [[presensi]] = await pool.query(`
    SELECT pr.*, u.nama AS nama_guru
    FROM presensi pr
    LEFT JOIN guru g ON g.id = pr.id_guru
    LEFT JOIN users u ON u.id = g.id_user
    WHERE pr.id_pertemuan = ?`, [req.params.id]);

  if (!presensi) {
    return res.json({ pertemuan: pt, presensi: null, daftar: [], ringkasan: null, saya: null });
  }

  const siswa = await siswaPertemuan(pt.id_kelas);
  const [isi] = await pool.query(
    'SELECT * FROM presensi_siswa WHERE id_presensi = ?', [presensi.id]);
  const peta = new Map(isi.map((i) => [i.id_siswa, i]));

  const daftar = siswa.map((s) => {
    const i = peta.get(s.id);
    return {
      id_siswa: s.id, nama: s.nama, nis: s.nis,
      status: i ? i.status : null,
      label: i ? LABEL[i.status] : 'Belum mengisi',
      keterangan: i ? i.keterangan : null,
      dicatat_oleh: i ? i.dicatat_oleh : null,
      waktu: i ? i.waktu : null,
    };
  });

  let saya = null;
  if (peran === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    saya = daftar.find((d) => d.id_siswa === sid) || null;
  }

  res.json({
    pertemuan: pt,
    presensi: {
      id: presensi.id, status: presensi.status, tanggal: presensi.tanggal,
      catatan: presensi.catatan, nama_guru: presensi.nama_guru,
      tgl_buka: presensi.tgl_buka, tgl_tutup: presensi.tgl_tutup,
    },
    // Siswa hanya menerima rekap kelas dan catatan dirinya sendiri,
    // bukan status kehadiran teman sekelasnya satu per satu.
    daftar: peran === 'siswa' ? [] : daftar,
    ringkasan: ringkas(daftar),
    saya,
  });
});

// POST /api/pertemuan/:id/presensi  (guru) -> membuka presensi
exports.buka = asyncHandler(async (req, res) => {
  const pt = await pertemuanDan(req.params.id);
  if (!pt) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, pt.id_kelas_mapel)))
    return res.status(403).json({ message: 'Bukan pertemuan pada kelas yang Anda ampu' });

  const [[ada]] = await pool.query(
    'SELECT id, status FROM presensi WHERE id_pertemuan = ?', [req.params.id]);
  if (ada && ada.status === 'dibuka')
    return res.status(409).json({ message: 'Presensi pertemuan ini sudah dibuka' });

  const gid = await guruIdOf(req.user.id);
  const tanggal = req.body.tanggal || new Date().toISOString().slice(0, 10);

  if (ada) {
    // Presensi yang sudah ditutup dapat dibuka kembali untuk perbaikan
    await pool.query(
      "UPDATE presensi SET status='dibuka', tgl_tutup=NULL, id_guru=?, tanggal=? WHERE id=?",
      [gid, tanggal, ada.id]);
    return res.json({ message: 'Presensi dibuka kembali', id: ada.id });
  }

  const [r] = await pool.query(
    "INSERT INTO presensi (id_pertemuan, id_guru, tanggal, status) VALUES (?,?,?,'dibuka')",
    [req.params.id, gid, tanggal]);
  res.status(201).json({ message: 'Presensi berhasil dibuka', id: r.insertId });
});

// POST /api/presensi/:id/tutup  (guru)
exports.tutup = asyncHandler(async (req, res) => {
  const [[pr]] = await pool.query('SELECT * FROM presensi WHERE id = ?', [req.params.id]);
  if (!pr) return res.status(404).json({ message: 'Presensi tidak ditemukan' });
  const idKm = await kelasMapelDariPertemuan(pr.id_pertemuan);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan presensi pada kelas yang Anda ampu' });
  if (pr.status === 'ditutup')
    return res.status(409).json({ message: 'Presensi ini sudah ditutup' });

  // Siswa yang belum mengisi dicatat alpa supaya rekap selalu lengkap
  const pt = await pertemuanDan(pr.id_pertemuan);
  const siswa = await siswaPertemuan(pt.id_kelas);
  const [isi] = await pool.query(
    'SELECT id_siswa FROM presensi_siswa WHERE id_presensi = ?', [pr.id]);
  const sudah = new Set(isi.map((i) => i.id_siswa));
  let ditandai = 0;
  for (const s of siswa) {
    if (sudah.has(s.id)) continue;
    await pool.query(
      `INSERT INTO presensi_siswa (id_presensi, id_siswa, status, dicatat_oleh)
       VALUES (?,?,'alpa','guru')`, [pr.id, s.id]);
    ditandai += 1;
  }

  await pool.query(
    "UPDATE presensi SET status='ditutup', tgl_tutup=NOW(), catatan=? WHERE id=?",
    [req.body.catatan || pr.catatan || null, pr.id]);

  res.json({
    message: 'Presensi ditutup'
      + (ditandai ? `. ${ditandai} siswa yang belum mengisi dicatat alpa.` : '.'),
    ditandai_alpa: ditandai,
  });
});

// POST /api/presensi/:id/hadir  (siswa) -> menyatakan hadir
exports.hadir = asyncHandler(async (req, res) => {
  const [[pr]] = await pool.query('SELECT * FROM presensi WHERE id = ?', [req.params.id]);
  if (!pr) return res.status(404).json({ message: 'Presensi tidak ditemukan' });
  if (pr.status !== 'dibuka')
    return res.status(409).json({ message: 'Presensi sudah ditutup guru, kehadiran tidak dapat diisi lagi' });

  const idKm = await kelasMapelDariPertemuan(pr.id_pertemuan);
  if (!(await kelasMapelDiikutiSiswa(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan presensi pada kelas Anda' });

  const sid = await siswaIdOf(req.user.id);
  const [[ada]] = await pool.query(
    'SELECT id, status FROM presensi_siswa WHERE id_presensi = ? AND id_siswa = ?', [pr.id, sid]);
  if (ada && ada.status === 'hadir')
    return res.status(409).json({ message: 'Anda sudah tercatat hadir pada pertemuan ini' });

  // Selama presensi masih dibuka, siswa selalu dapat menyatakan hadir,
  // termasuk apabila guru terlanjur menandainya alpa karena belum masuk
  // kelas. Keterangan guru menjadi final setelah presensi ditutup.

  await pool.query(
    `INSERT INTO presensi_siswa (id_presensi, id_siswa, status, dicatat_oleh)
     VALUES (?,?,'hadir','siswa')
     ON DUPLICATE KEY UPDATE status='hadir', dicatat_oleh='siswa', waktu=CURRENT_TIMESTAMP`,
    [pr.id, sid]);
  res.json({ message: 'Kehadiran Anda berhasil dicatat' });
});

// PUT /api/presensi/:id/siswa/:idSiswa  (guru) -> menetapkan keterangan
exports.setStatus = asyncHandler(async (req, res) => {
  const { status, keterangan } = req.body;
  if (!STATUS.includes(status))
    return res.status(400).json({ message: 'Status kehadiran tidak valid' });

  const [[pr]] = await pool.query('SELECT * FROM presensi WHERE id = ?', [req.params.id]);
  if (!pr) return res.status(404).json({ message: 'Presensi tidak ditemukan' });
  const idKm = await kelasMapelDariPertemuan(pr.id_pertemuan);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan presensi pada kelas yang Anda ampu' });

  await pool.query(
    `INSERT INTO presensi_siswa (id_presensi, id_siswa, status, keterangan, dicatat_oleh)
     VALUES (?,?,?,?,'guru')
     ON DUPLICATE KEY UPDATE status=VALUES(status), keterangan=VALUES(keterangan),
       dicatat_oleh='guru', waktu=CURRENT_TIMESTAMP`,
    [pr.id, req.params.idSiswa, status, keterangan || null]);
  res.json({ message: `Kehadiran siswa dicatat sebagai ${LABEL[status]}` });
});

// GET /api/presensi/kelas-mapel/:id  (guru) -> rekap seluruh pertemuan
exports.rekapKelasMapel = asyncHandler(async (req, res) => {
  const idKm = req.params.id;
  if (req.user.role === 'guru' && !(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan kelas mata pelajaran yang Anda ampu' });

  const [pertemuan] = await pool.query(`
    SELECT pt.id, pt.nomor, pt.judul, pr.id AS id_presensi, pr.status, pr.tanggal
    FROM pertemuan pt
    LEFT JOIN presensi pr ON pr.id_pertemuan = pt.id
    WHERE pt.id_kelas_mapel = ? ORDER BY pt.nomor`, [idKm]);

  const [[km]] = await pool.query(`
    SELECT km.id_kelas, k.nama_kelas, mp.nama AS nama_mapel
    FROM kelas_mapel km
    JOIN kelas k ON k.id = km.id_kelas
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel WHERE km.id = ?`, [idKm]);
  if (!km) return res.status(404).json({ message: 'Kelas mata pelajaran tidak ditemukan' });

  const siswa = await siswaPertemuan(km.id_kelas);
  const [isi] = await pool.query(`
    SELECT ps.id_siswa, ps.status, pr.id_pertemuan
    FROM presensi_siswa ps
    JOIN presensi pr ON pr.id = ps.id_presensi
    JOIN pertemuan pt ON pt.id = pr.id_pertemuan
    WHERE pt.id_kelas_mapel = ?`, [idKm]);

  const peta = new Map();
  for (const i of isi) peta.set(`${i.id_siswa}|${i.id_pertemuan}`, i.status);

  const baris = siswa.map((s) => {
    const kehadiran = {};
    const hitung = { hadir: 0, sakit: 0, izin: 0, alpa: 0 };
    for (const p of pertemuan) {
      const st = peta.get(`${s.id}|${p.id}`) || null;
      kehadiran[p.id] = st;
      if (st) hitung[st] += 1;
    }
    const terlaksana = pertemuan.filter((p) => p.id_presensi).length;
    return {
      id_siswa: s.id, nama: s.nama, nis: s.nis, kehadiran, ...hitung,
      persen_hadir: terlaksana ? Math.round((hitung.hadir / terlaksana) * 1000) / 10 : null,
    };
  });

  res.json({ kelas_mapel: km, pertemuan, siswa: baris });
});

// GET /api/presensi/saya  (siswa) -> rekap kehadiran per mata pelajaran
exports.rekapSiswa = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  if (!sid) return res.json({ mapel: [], ringkasan: null });

  const [baris] = await pool.query(`
    SELECT km.id AS id_kelas_mapel, mp.nama AS nama_mapel, mp.kode AS kode_mapel,
           ug.nama AS nama_guru, k.nama_kelas, p.kode AS kode_periode, p.status AS status_periode,
           pt.id AS id_pertemuan, pt.nomor, pt.judul,
           pr.id AS id_presensi, pr.status AS status_presensi, pr.tanggal,
           ps.status AS kehadiran, ps.keterangan
    FROM siswa_kelas sk
    JOIN kelas k ON k.id = sk.id_kelas
    JOIN periode p ON p.id = k.id_periode
    JOIN kelas_mapel km ON km.id_kelas = k.id
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    LEFT JOIN guru g ON g.id = km.id_guru
    LEFT JOIN users ug ON ug.id = g.id_user
    JOIN pertemuan pt ON pt.id_kelas_mapel = km.id
    JOIN presensi pr ON pr.id_pertemuan = pt.id
    LEFT JOIN presensi_siswa ps ON ps.id_presensi = pr.id AND ps.id_siswa = ?
    WHERE sk.id_siswa = ? AND p.status = 'aktif'
    ORDER BY mp.nama, pt.nomor`, [sid, sid]);

  const peta = new Map();
  for (const b of baris) {
    if (!peta.has(b.id_kelas_mapel)) {
      peta.set(b.id_kelas_mapel, {
        id_kelas_mapel: b.id_kelas_mapel, nama_mapel: b.nama_mapel,
        kode_mapel: b.kode_mapel, nama_guru: b.nama_guru, nama_kelas: b.nama_kelas,
        pertemuan: [], hadir: 0, sakit: 0, izin: 0, alpa: 0, belum: 0,
      });
    }
    const m = peta.get(b.id_kelas_mapel);
    m.pertemuan.push({
      id_pertemuan: b.id_pertemuan, nomor: b.nomor, judul: b.judul,
      tanggal: b.tanggal, status_presensi: b.status_presensi,
      id_presensi: b.id_presensi,
      kehadiran: b.kehadiran, label: b.kehadiran ? LABEL[b.kehadiran] : 'Belum mengisi',
      keterangan: b.keterangan,
    });
    if (b.kehadiran) m[b.kehadiran] += 1; else m.belum += 1;
  }

  const mapel = [...peta.values()].map((m) => ({
    ...m,
    jumlah_pertemuan: m.pertemuan.length,
    persen_hadir: m.pertemuan.length
      ? Math.round((m.hadir / m.pertemuan.length) * 1000) / 10 : null,
  }));

  const total = mapel.reduce((a, m) => ({
    hadir: a.hadir + m.hadir, sakit: a.sakit + m.sakit, izin: a.izin + m.izin,
    alpa: a.alpa + m.alpa, belum: a.belum + m.belum,
    pertemuan: a.pertemuan + m.jumlah_pertemuan,
  }), { hadir: 0, sakit: 0, izin: 0, alpa: 0, belum: 0, pertemuan: 0 });

  res.json({
    mapel,
    ringkasan: {
      ...total,
      persen_hadir: total.pertemuan
        ? Math.round((total.hadir / total.pertemuan) * 1000) / 10 : null,
    },
  });
});
