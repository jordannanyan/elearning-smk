const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf, siswaIdOf } = require('../utils/akses');

// ---------------------------------------------------------------------
// Jadwal mata pelajaran
// ---------------------------------------------------------------------
// Jadwal disimpan persis seperti pada jadwal resmi sekolah: satu baris
// untuk setiap sel tabel, yaitu kelas tertentu pada hari dan jam ke
// berapa, beserta kode gabungan huruf mata pelajaran dan nomor guru
// (misalnya E16). Endpoint di bawah ini mengembalikan data tersebut apa
// adanya beserta legendanya, sehingga tampilan pada sistem dapat disusun
// sama dengan tabel pada SK.
// ---------------------------------------------------------------------

const NAMA_HARI = ['', 'SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT"];

async function jamPelajaran() {
  const [rows] = await pool.query(
    'SELECT kelompok, urutan, jenis, jam_ke, mulai, selesai FROM jam_pelajaran ORDER BY kelompok DESC, urutan');
  return {
    umum: rows.filter((r) => r.kelompok === 'umum'),
    jumat: rows.filter((r) => r.kelompok === 'jumat'),
  };
}

// Periode yang dipakai: dari query, atau periode aktif, atau periode
// mana pun yang jadwalnya sudah terisi.
async function periodeJadwal(idPeriode) {
  if (idPeriode) {
    const [[p]] = await pool.query('SELECT * FROM periode WHERE id = ?', [idPeriode]);
    return p || null;
  }
  const [[aktif]] = await pool.query("SELECT * FROM periode WHERE status = 'aktif' LIMIT 1");
  if (aktif) return aktif;
  const [[ada]] = await pool.query(
    'SELECT p.* FROM periode p JOIN jadwal j ON j.id_periode = p.id GROUP BY p.id LIMIT 1');
  return ada || null;
}

function lengkapi(baris) {
  return {
    ...baris,
    nama_hari: NAMA_HARI[baris.hari] || '-',
    huruf_mapel: baris.kode ? baris.kode.replace(/\d+$/, '') : null,
  };
}

// GET /api/jadwal/sekolah?id_periode=..
//   Seluruh jadwal sekolah dalam susunan yang sama dengan SK.
exports.sekolah = asyncHandler(async (req, res) => {
  const periode = await periodeJadwal(req.query.id_periode);
  if (!periode) return res.json({ periode: null, kelas: [], slot: [], jam: await jamPelajaran() });

  const [kelas] = await pool.query(
    'SELECT id, nama_kelas, tingkat FROM kelas WHERE id_periode = ? ORDER BY tingkat, nama_kelas',
    [periode.id]);

  const [slot] = await pool.query(`
    SELECT j.id, j.id_kelas, k.nama_kelas, k.tingkat, j.hari, j.jam_ke,
           j.kode, j.nama_mapel, j.kegiatan, j.id_guru,
           u.nama AS nama_guru, g.kode_jadwal
    FROM jadwal j
    JOIN kelas k ON k.id = j.id_kelas
    LEFT JOIN guru g ON g.id = j.id_guru
    LEFT JOIN users u ON u.id = g.id_user
    WHERE j.id_periode = ?
    ORDER BY j.hari, j.jam_ke, k.tingkat, k.nama_kelas`, [periode.id]);

  // Legenda kode guru dan kode mata pelajaran disusun dari isi jadwal
  const [kodeGuru] = await pool.query(`
    SELECT g.kode_jadwal AS nomor, u.nama
    FROM guru g JOIN users u ON u.id = g.id_user
    WHERE g.kode_jadwal IS NOT NULL ORDER BY g.kode_jadwal`);

  const [kodeMapel] = await pool.query(`
    SELECT DISTINCT LEFT(kode, 1) AS kode, nama_mapel AS nama
    FROM jadwal WHERE id_periode = ? AND kode IS NOT NULL
    ORDER BY kode`, [periode.id]);

  const [[{ total_periode_berjadwal }]] = await pool.query(
    'SELECT COUNT(DISTINCT id_periode) total_periode_berjadwal FROM jadwal');

  res.json({
    periode: {
      id: periode.id, kode: periode.kode, tahun_ajaran: periode.tahun_ajaran,
      semester: periode.semester, status: periode.status,
      nama_semester: periode.semester === 1 ? 'Ganjil' : 'Genap',
    },
    sekolah: 'SMA Negeri 1 Karau Kuala',
    kelas,
    hari: NAMA_HARI.slice(1),
    jam: await jamPelajaran(),
    slot: slot.map(lengkapi),
    kode_guru: kodeGuru,
    kode_mapel: kodeMapel,
    total_periode_berjadwal,
  });
});

// GET /api/jadwal/saya?id_periode=..
//   Siswa menerima jadwal kelasnya, guru menerima jadwal mengajarnya.
exports.saya = asyncHandler(async (req, res) => {
  const periode = await periodeJadwal(req.query.id_periode);
  const kosong = { periode: null, milik: null, slot: [], jam: await jamPelajaran(),
    hari: NAMA_HARI.slice(1) };
  if (!periode) return res.json(kosong);

  const infoPeriode = {
    id: periode.id, kode: periode.kode, tahun_ajaran: periode.tahun_ajaran,
    semester: periode.semester, status: periode.status,
    nama_semester: periode.semester === 1 ? 'Ganjil' : 'Genap',
  };

  if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    const [[kelas]] = await pool.query(`
      SELECT k.id, k.nama_kelas, k.tingkat, uw.nama AS wali_kelas
      FROM siswa_kelas sk
      JOIN kelas k ON k.id = sk.id_kelas
      LEFT JOIN guru gw ON gw.id = k.id_wali
      LEFT JOIN users uw ON uw.id = gw.id_user
      WHERE sk.id_siswa = ? AND k.id_periode = ?`, [sid, periode.id]);
    if (!kelas) return res.json({ ...kosong, periode: infoPeriode });

    const [slot] = await pool.query(`
      SELECT j.id, j.hari, j.jam_ke, j.kode, j.nama_mapel, j.kegiatan,
             u.nama AS nama_guru
      FROM jadwal j
      LEFT JOIN guru g ON g.id = j.id_guru
      LEFT JOIN users u ON u.id = g.id_user
      WHERE j.id_periode = ? AND j.id_kelas = ?
      ORDER BY j.hari, j.jam_ke`, [periode.id, kelas.id]);

    return res.json({
      periode: infoPeriode,
      milik: { jenis: 'kelas', nama: kelas.nama_kelas, tingkat: kelas.tingkat,
        wali_kelas: kelas.wali_kelas },
      hari: NAMA_HARI.slice(1),
      jam: await jamPelajaran(),
      slot: slot.map(lengkapi),
    });
  }

  // Guru
  const gid = await guruIdOf(req.user.id);
  if (!gid) return res.json({ ...kosong, periode: infoPeriode });

  const [slot] = await pool.query(`
    SELECT j.id, j.hari, j.jam_ke, j.kode, j.nama_mapel, j.kegiatan,
           k.nama_kelas, k.tingkat
    FROM jadwal j
    JOIN kelas k ON k.id = j.id_kelas
    WHERE j.id_periode = ? AND j.id_guru = ?
    ORDER BY j.hari, j.jam_ke`, [periode.id, gid]);

  const [[guru]] = await pool.query(`
    SELECT u.nama, g.kode_jadwal FROM guru g JOIN users u ON u.id = g.id_user WHERE g.id = ?`,
  [gid]);

  res.json({
    periode: infoPeriode,
    milik: { jenis: 'guru', nama: guru.nama, kode_jadwal: guru.kode_jadwal,
      jumlah_jam: slot.filter((s) => !s.kegiatan).length },
    hari: NAMA_HARI.slice(1),
    jam: await jamPelajaran(),
    slot: slot.map(lengkapi),
  });
});

// GET /api/jadwal/periode -> periode yang jadwalnya tersedia
exports.periodeTersedia = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.id, p.kode, p.tahun_ajaran, p.semester, p.status, COUNT(j.id) AS jumlah_jam
    FROM periode p JOIN jadwal j ON j.id_periode = p.id
    GROUP BY p.id ORDER BY p.tahun_ajaran DESC, p.semester DESC`);
  res.json(rows.map((r) => ({ ...r, nama_semester: r.semester === 1 ? 'Ganjil' : 'Genap' })));
});

// ---------------------------------------------------------------------
// Penyusunan jadwal oleh administrator
// ---------------------------------------------------------------------
// Jadwal pertama kali dimuat dari berkas jadwal resmi sekolah, namun
// administrator tetap dapat menyusun dan memperbaikinya dari dalam
// sistem. Kode sel tetap dibentuk mengikuti kebiasaan pada SK, yaitu
// huruf mata pelajaran digabung nomor kode guru, misalnya E16.
// ---------------------------------------------------------------------

const ALFABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Daftar huruf mata pelajaran yang sudah terpakai pada jadwal. Diambil
// dari seluruh periode supaya huruf yang sama tetap berarti mata
// pelajaran yang sama meskipun periodenya berganti.
async function hurufMapel() {
  const [rows] = await pool.query(`
    SELECT DISTINCT LEFT(kode, 1) AS kode, nama_mapel AS nama
    FROM jadwal WHERE kode IS NOT NULL AND nama_mapel IS NOT NULL
    ORDER BY kode`);
  return rows;
}

// Nomor kode guru diberikan otomatis bagi guru yang belum memilikinya,
// mengambil nomor terkecil yang masih kosong.
async function pastikanKodeGuru(idGuru) {
  const [[g]] = await pool.query('SELECT id, kode_jadwal FROM guru WHERE id = ?', [idGuru]);
  if (!g) return null;
  if (g.kode_jadwal) return g.kode_jadwal;
  const [terpakai] = await pool.query(
    'SELECT kode_jadwal FROM guru WHERE kode_jadwal IS NOT NULL');
  const set = new Set(terpakai.map((t) => t.kode_jadwal));
  let n = 1;
  while (set.has(n)) n += 1;
  await pool.query('UPDATE guru SET kode_jadwal = ? WHERE id = ?', [n, idGuru]);
  return n;
}

// GET /api/jadwal/referensi?id_periode=..  (admin)
//   Bahan isian penyusunan jadwal: kelas, jam, mata pelajaran, dan guru.
exports.referensi = asyncHandler(async (req, res) => {
  const periode = await periodeJadwal(req.query.id_periode);
  if (!periode) return res.status(404).json({ message: 'Periode pembelajaran tidak ditemukan' });

  const [kelas] = await pool.query(
    'SELECT id, nama_kelas, tingkat FROM kelas WHERE id_periode = ? ORDER BY tingkat, nama_kelas',
    [periode.id]);

  let mapel = await hurufMapel();
  if (mapel.length === 0) {
    // Jadwal masih kosong sama sekali: huruf diberikan berurutan
    // mengikuti katalog mata pelajaran sekolah.
    const [katalog] = await pool.query(
      'SELECT nama FROM mata_pelajaran WHERE aktif = 1 ORDER BY nama');
    mapel = katalog.slice(0, ALFABET.length)
      .map((m, i) => ({ kode: ALFABET[i], nama: m.nama }));
  }

  const [guru] = await pool.query(`
    SELECT g.id, u.nama, g.kode_jadwal
    FROM guru g JOIN users u ON u.id = g.id_user
    WHERE u.aktif = 1 ORDER BY u.nama`);

  const [kegiatan] = await pool.query(
    'SELECT DISTINCT kegiatan FROM jadwal WHERE kegiatan IS NOT NULL ORDER BY kegiatan');

  res.json({
    periode: {
      id: periode.id, kode: periode.kode, tahun_ajaran: periode.tahun_ajaran,
      semester: periode.semester, status: periode.status,
      nama_semester: periode.semester === 1 ? 'Ganjil' : 'Genap',
    },
    kelas,
    hari: NAMA_HARI.slice(1),
    jam: await jamPelajaran(),
    mapel,
    guru,
    kegiatan: kegiatan.map((k) => k.kegiatan),
  });
});

// POST /api/jadwal  (admin) -> mengisi atau mengubah satu sel jadwal
exports.simpanSlot = asyncHandler(async (req, res) => {
  const { id_kelas, hari, jam_ke, huruf_mapel, nama_mapel, id_guru, kegiatan } = req.body;

  if (!id_kelas || !hari || !jam_ke)
    return res.status(400).json({ message: 'Kelas, hari, dan jam ke wajib diisi' });
  if (Number(hari) < 1 || Number(hari) > 5)
    return res.status(400).json({ message: 'Hari hanya Senin sampai Jumat' });
  if (!kegiatan && !nama_mapel)
    return res.status(400).json({ message: 'Pilih mata pelajaran atau isi kegiatan' });

  const [[kelas]] = await pool.query(
    'SELECT id, id_periode, nama_kelas FROM kelas WHERE id = ?', [id_kelas]);
  if (!kelas) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

  // Satu guru tidak dapat mengajar di dua kelas pada jam yang sama.
  if (id_guru) {
    const [[bentrok]] = await pool.query(`
      SELECT k.nama_kelas, j.nama_mapel FROM jadwal j
      JOIN kelas k ON k.id = j.id_kelas
      WHERE j.id_periode = ? AND j.hari = ? AND j.jam_ke = ?
        AND j.id_guru = ? AND j.id_kelas <> ?`,
    [kelas.id_periode, hari, jam_ke, id_guru, id_kelas]);
    if (bentrok) {
      const [[g]] = await pool.query(
        'SELECT u.nama FROM guru g JOIN users u ON u.id = g.id_user WHERE g.id = ?', [id_guru]);
      return res.status(409).json({
        message: `Jadwal bentrok: ${g ? g.nama : 'Guru tersebut'} sudah mengajar `
          + `${bentrok.nama_mapel || 'mata pelajaran lain'} di kelas ${bentrok.nama_kelas} `
          + `pada hari dan jam yang sama.`,
        bentrok: { kelas: bentrok.nama_kelas, mapel: bentrok.nama_mapel },
      });
    }
  }

  let kode = null;
  if (nama_mapel) {
    const nomor = id_guru ? await pastikanKodeGuru(id_guru) : null;
    const huruf = (huruf_mapel || nama_mapel[0] || '?').toUpperCase().slice(0, 1);
    kode = `${huruf}${nomor || ''}`;
  }

  await pool.query(`
    INSERT INTO jadwal (id_periode, id_kelas, hari, jam_ke, kode, nama_mapel, id_guru, kegiatan)
    VALUES (?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE kode = VALUES(kode), nama_mapel = VALUES(nama_mapel),
      id_guru = VALUES(id_guru), kegiatan = VALUES(kegiatan)`,
  [kelas.id_periode, id_kelas, hari, jam_ke, kode, nama_mapel || null,
    id_guru || null, kegiatan || null]);

  res.json({ message: 'Jadwal berhasil disimpan', kode });
});

// DELETE /api/jadwal/:id  (admin) -> mengosongkan satu sel jadwal
exports.hapusSlot = asyncHandler(async (req, res) => {
  const [r] = await pool.query('DELETE FROM jadwal WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
  res.json({ message: 'Jam pelajaran dikosongkan' });
});
