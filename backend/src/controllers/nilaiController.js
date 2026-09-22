const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf, siswaIdOf, kelasMapelDariTugas, kelasMapelMilikGuru } = require('../utils/akses');

// POST /api/nilai  (guru) -> penilaian tugas biasa (tanpa butir soal)
exports.beriNilai = asyncHandler(async (req, res) => {
  const { id_kumpul, skor, catatan } = req.body;
  if (!id_kumpul || skor === undefined || skor === '')
    return res.status(400).json({ message: 'Pengumpulan dan skor wajib diisi' });
  const angka = Number(skor);
  if (Number.isNaN(angka) || angka < 0 || angka > 100)
    return res.status(400).json({ message: 'Skor harus berupa angka 0 sampai 100' });

  const [[pg]] = await pool.query('SELECT id_tugas FROM pengumpulan_tugas WHERE id = ?', [id_kumpul]);
  if (!pg) return res.status(404).json({ message: 'Pengumpulan tidak ditemukan' });

  const idKm = await kelasMapelDariTugas(pg.id_tugas);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan pengumpulan pada kelas yang Anda ampu' });

  const gid = await guruIdOf(req.user.id);
  await pool.query(`
    INSERT INTO nilai (id_kumpul, id_guru, skor, catatan) VALUES (?,?,?,?)
    ON DUPLICATE KEY UPDATE skor = VALUES(skor), catatan = VALUES(catatan),
      id_guru = VALUES(id_guru), tgl_penilaian = CURRENT_TIMESTAMP`,
    [id_kumpul, gid, angka, catatan || null]);
  res.json({ message: 'Nilai berhasil disimpan' });
});

// GET /api/nilai/saya?id_periode=..  (siswa)
//   Rekap nilai dikelompokkan per mata pelajaran, bukan digabung menjadi
//   satu daftar panjang, dan dapat ditelusuri per periode pembelajaran.
exports.rekapSiswa = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  if (!sid) return res.json({ periode: null, daftar_periode: [], mapel: [] });

  // Periode yang pernah diikuti siswa
  const [daftarPeriode] = await pool.query(`
    SELECT DISTINCT p.id, p.kode, p.tahun_ajaran, p.semester, p.status, k.nama_kelas, k.tingkat
    FROM siswa_kelas sk
    JOIN kelas k ON k.id = sk.id_kelas
    JOIN periode p ON p.id = k.id_periode
    WHERE sk.id_siswa = ?
    ORDER BY p.tahun_ajaran DESC, p.semester DESC`, [sid]);

  const idPeriode = req.query.id_periode
    || (daftarPeriode.find((p) => p.status === 'aktif') || daftarPeriode[0] || {}).id;
  if (!idPeriode) return res.json({ periode: null, daftar_periode: daftarPeriode, mapel: [] });

  const periode = daftarPeriode.find((p) => String(p.id) === String(idPeriode)) || null;

  // Seluruh tugas pada periode tersebut, termasuk yang belum dikumpulkan
  const [baris] = await pool.query(`
    SELECT km.id AS id_kelas_mapel, mp.nama AS nama_mapel, mp.kode AS kode_mapel,
           gu.nama AS nama_guru, k.nama_kelas,
           pt.nomor AS nomor_pertemuan, t.id AS id_tugas, t.judul AS judul_tugas,
           t.tipe, t.deadline,
           pg.id AS id_pengumpulan, pg.tgl_kumpul, pg.terlambat,
           n.skor, n.catatan, n.tgl_penilaian
    FROM siswa_kelas sk
    JOIN kelas k ON k.id = sk.id_kelas
    JOIN kelas_mapel km ON km.id_kelas = k.id
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    LEFT JOIN guru g ON g.id = km.id_guru
    LEFT JOIN users gu ON gu.id = g.id_user
    JOIN pertemuan pt ON pt.id_kelas_mapel = km.id
    JOIN tugas t ON t.id_pertemuan = pt.id
    LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id AND pg.id_siswa = ?
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE sk.id_siswa = ? AND k.id_periode = ?
    ORDER BY mp.nama, pt.nomor, t.deadline`, [sid, sid, idPeriode]);

  // Pengelompokan per mata pelajaran
  const petaMapel = new Map();
  for (const b of baris) {
    if (!petaMapel.has(b.id_kelas_mapel)) {
      petaMapel.set(b.id_kelas_mapel, {
        id_kelas_mapel: b.id_kelas_mapel,
        nama_mapel: b.nama_mapel,
        kode_mapel: b.kode_mapel,
        nama_guru: b.nama_guru,
        nama_kelas: b.nama_kelas,
        tugas: [],
      });
    }
    const lewat = b.deadline && new Date(b.deadline.replace(' ', 'T')) < new Date();
    petaMapel.get(b.id_kelas_mapel).tugas.push({
      id_tugas: b.id_tugas,
      judul_tugas: b.judul_tugas,
      tipe: b.tipe,
      nomor_pertemuan: b.nomor_pertemuan,
      deadline: b.deadline,
      tgl_kumpul: b.tgl_kumpul,
      terlambat: !!b.terlambat,
      skor: b.skor,
      catatan: b.catatan,
      status: b.skor != null ? 'dinilai'
        : b.id_pengumpulan ? 'menunggu_penilaian'
          : lewat ? 'tidak_dikumpulkan' : 'belum_dikerjakan',
    });
  }

  // Rata-rata per mata pelajaran + rangkuman keseluruhan
  const mapel = [...petaMapel.values()].map((m) => {
    const dinilai = m.tugas.filter((t) => t.skor != null);
    const rata = dinilai.length
      ? Math.round((dinilai.reduce((a, t) => a + Number(t.skor), 0) / dinilai.length) * 100) / 100
      : null;
    return {
      ...m,
      jumlah_tugas: m.tugas.length,
      jumlah_dinilai: dinilai.length,
      jumlah_missing: m.tugas.filter((t) => t.status === 'tidak_dikumpulkan').length,
      rata_rata: rata,
    };
  });

  const semuaDinilai = mapel.filter((m) => m.rata_rata != null);
  const rataKeseluruhan = semuaDinilai.length
    ? Math.round((semuaDinilai.reduce((a, m) => a + m.rata_rata, 0) / semuaDinilai.length) * 100) / 100
    : null;

  res.json({
    periode,
    daftar_periode: daftarPeriode,
    mapel,
    ringkasan: {
      jumlah_mapel: mapel.length,
      jumlah_tugas: mapel.reduce((a, m) => a + m.jumlah_tugas, 0),
      jumlah_dinilai: mapel.reduce((a, m) => a + m.jumlah_dinilai, 0),
      jumlah_missing: mapel.reduce((a, m) => a + m.jumlah_missing, 0),
      rata_rata: rataKeseluruhan,
    },
  });
});

// GET /api/nilai/kelas-mapel/:id  (guru) -> rekap nilai satu kelas mata pelajaran
exports.rekapKelasMapel = asyncHandler(async (req, res) => {
  const idKm = req.params.id;
  if (req.user.role === 'guru' && !(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan kelas mata pelajaran yang Anda ampu' });

  const [tugas] = await pool.query(`
    SELECT t.id, t.judul, t.tipe, pt.nomor AS nomor_pertemuan
    FROM tugas t JOIN pertemuan pt ON pt.id = t.id_pertemuan
    WHERE pt.id_kelas_mapel = ? ORDER BY pt.nomor, t.id`, [idKm]);

  const [siswa] = await pool.query(`
    SELECT s.id, u.nama, s.nis
    FROM kelas_mapel km
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    WHERE km.id = ? ORDER BY u.nama`, [idKm]);

  for (const s of siswa) {
    s.nilai = {};
    for (const t of tugas) {
      const [[n]] = await pool.query(`
        SELECT n.skor FROM pengumpulan_tugas pg
        LEFT JOIN nilai n ON n.id_kumpul = pg.id
        WHERE pg.id_tugas = ? AND pg.id_siswa = ?`, [t.id, s.id]);
      s.nilai[t.id] = n ? n.skor : null;
    }
    const angka = Object.values(s.nilai).filter((v) => v != null).map(Number);
    s.rata_rata = angka.length
      ? Math.round((angka.reduce((a, b) => a + b, 0) / angka.length) * 100) / 100 : null;
  }

  res.json({ tugas, siswa });
});
