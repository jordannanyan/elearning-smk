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
