const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// ---------------------------------------------------------------------
// Mata pelajaran kini berperan sebagai katalog mata pelajaran sekolah.
// Penugasan guru dan kelas dilakukan pada modul pengampuan (kelas_mapel),
// sehingga satu mata pelajaran dapat diampu oleh guru yang berbeda pada
// tingkat kelas yang berbeda.
// ---------------------------------------------------------------------

// GET /api/mapel
exports.list = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT mp.*,
           (SELECT COUNT(*) FROM kelas_mapel km WHERE km.id_mapel = mp.id) AS jumlah_pengampuan,
           (SELECT COUNT(DISTINCT km.id_guru) FROM kelas_mapel km WHERE km.id_mapel = mp.id) AS jumlah_guru
    FROM mata_pelajaran mp
    ORDER BY mp.kelompok, mp.nama
  `);
  res.json(rows);
});

// POST /api/mapel  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { nama, kode, kelompok, deskripsi } = req.body;
  if (!nama) return res.status(400).json({ message: 'Nama mata pelajaran wajib diisi' });
  if (kode) {
    const [ada] = await pool.query('SELECT id FROM mata_pelajaran WHERE kode = ?', [kode]);
    if (ada.length) return res.status(409).json({ message: `Kode ${kode} sudah digunakan` });
  }
  const [r] = await pool.query(
    'INSERT INTO mata_pelajaran (nama, kode, kelompok, deskripsi) VALUES (?,?,?,?)',
    [nama, kode || null, kelompok || null, deskripsi || null]
  );
  res.status(201).json({ id: r.insertId, message: 'Mata pelajaran berhasil dibuat' });
});

// PUT /api/mapel/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { nama, kode, kelompok, deskripsi, aktif } = req.body;
  const [m] = await pool.query('SELECT * FROM mata_pelajaran WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });

  await pool.query(
    `UPDATE mata_pelajaran SET nama = ?, kode = ?, kelompok = ?, deskripsi = ?, aktif = ?
     WHERE id = ?`,
    [nama ?? m[0].nama, kode || null, kelompok || null, deskripsi || null,
      aktif === undefined ? m[0].aktif : (aktif ? 1 : 0), req.params.id]
  );
  res.json({ message: 'Mata pelajaran berhasil diperbarui' });
});

// DELETE /api/mapel/:id  (admin)
//   Mata pelajaran yang sudah pernah diajarkan tidak dihapus langsung,
//   melainkan cukup dinonaktifkan agar riwayat pembelajaran tetap utuh.
exports.remove = asyncHandler(async (req, res) => {
  const [m] = await pool.query('SELECT * FROM mata_pelajaran WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });

  const [[{ jml }]] = await pool.query(
    'SELECT COUNT(*) jml FROM kelas_mapel WHERE id_mapel = ?', [req.params.id]);
  if (jml > 0)
    return res.status(409).json({
      message: `Mata pelajaran "${m[0].nama}" sudah digunakan pada ${jml} pengampuan kelas ` +
        'sehingga tidak dapat dihapus. Nonaktifkan mata pelajaran ini agar tidak dapat dipilih lagi.' });

  await pool.query('DELETE FROM mata_pelajaran WHERE id = ?', [req.params.id]);
  res.json({ message: 'Mata pelajaran berhasil dihapus' });
});

// PUT /api/mapel/:id/status  (admin) -> aktif / nonaktif
exports.ubahStatus = asyncHandler(async (req, res) => {
  const { aktif } = req.body;
  const [r] = await pool.query('UPDATE mata_pelajaran SET aktif = ? WHERE id = ?',
    [aktif ? 1 : 0, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
  res.json({ message: aktif ? 'Mata pelajaran diaktifkan' : 'Mata pelajaran dinonaktifkan' });
});

// GET /api/guru/options  -> daftar guru untuk dropdown (admin)
exports.guruOptions = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT g.id, u.nama, g.nip, u.aktif
    FROM guru g JOIN users u ON u.id = g.id_user
    WHERE u.aktif = 1
    ORDER BY u.nama
  `);
  res.json(rows);
});
