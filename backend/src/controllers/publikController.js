const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// ---------------------------------------------------------------------
// Data untuk halaman depan (landing page) sekolah. Endpoint ini sengaja
// dapat diakses tanpa login karena hanya memuat profil sekolah beserta
// angka rekapitulasi, tanpa satu pun data pribadi guru maupun siswa.
// ---------------------------------------------------------------------

// GET /api/publik/profil
exports.profil = asyncHandler(async (req, res) => {
  const [[{ total_guru }]] = await pool.query(
    "SELECT COUNT(*) total_guru FROM users WHERE role='guru' AND aktif=1");
  const [[{ total_siswa }]] = await pool.query(
    "SELECT COUNT(*) total_siswa FROM users WHERE role='siswa' AND aktif=1");
  const [[{ total_mapel }]] = await pool.query(
    'SELECT COUNT(*) total_mapel FROM mata_pelajaran WHERE aktif=1');
  const [[periode]] = await pool.query(
    "SELECT kode, tahun_ajaran, semester FROM periode WHERE status='aktif' LIMIT 1");
  const [[{ total_kelas }]] = await pool.query(`
    SELECT COUNT(*) total_kelas FROM kelas k
    JOIN periode p ON p.id = k.id_periode AND p.status = 'aktif'`);

  res.json({
    sekolah: {
      // Identitas diambil apa adanya dari kop surat dan lampiran
      // SK Kepala SMA Negeri 1 Karau Kuala Nomor 421.3/186/14/SMAN 1 KK/VII/2025.
      nama: 'SMA Negeri 1 Karau Kuala',
      penyelenggara: 'Pemerintah Provinsi Kalimantan Tengah',
      alamat: 'Jalan Barito Raya No. 077 RT 24 RW 08, Kelurahan Bangkuang, '
        + 'Kecamatan Karau Kuala, Kabupaten Barito Selatan, Kalimantan Tengah 73761',
      npsn: '30200792',
      nss: '302140209006',
      laman: 'sman1karaukuala.sch.id',
      surel: 'sman1karaukuala@gmail.com',
      kepala_sekolah: 'Yunita Pebrianti, S.Pd',
    },
    statistik: { total_guru, total_siswa, total_kelas, total_mapel },
    periode: periode
      ? { ...periode, nama_semester: periode.semester === 1 ? 'Ganjil' : 'Genap' }
      : null,
  });
});
