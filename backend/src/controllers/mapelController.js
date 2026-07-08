const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// Helper: dapatkan guru.id dari user login
async function guruIdOf(userId) {
  const [g] = await pool.query('SELECT id FROM guru WHERE id_user = ?', [userId]);
  return g.length ? g[0].id : null;
}
exports.guruIdOf = guruIdOf;

// GET /api/mapel
// admin -> semua, guru -> miliknya, siswa -> semua (untuk akses materi)
exports.list = asyncHandler(async (req, res) => {
  let sql = `
    SELECT mp.*, u.nama AS nama_guru
    FROM mata_pelajaran mp
    LEFT JOIN guru g ON g.id = mp.id_guru
    LEFT JOIN users u ON u.id = g.id_user
  `;
  const params = [];
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    sql += ' WHERE mp.id_guru = ?';
    params.push(gid);
  }
  sql += ' ORDER BY mp.nama';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// POST /api/mapel  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { nama, kode, deskripsi, id_guru } = req.body;
  if (!nama) return res.status(400).json({ message: 'Nama mata pelajaran wajib diisi' });
  const [r] = await pool.query(
    'INSERT INTO mata_pelajaran (nama, kode, deskripsi, id_guru) VALUES (?,?,?,?)',
    [nama, kode || null, deskripsi || null, id_guru || null]
  );
  res.status(201).json({ id: r.insertId, message: 'Mata pelajaran berhasil dibuat' });
});

// PUT /api/mapel/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { nama, kode, deskripsi, id_guru } = req.body;
  const [r] = await pool.query(
    'UPDATE mata_pelajaran SET nama = ?, kode = ?, deskripsi = ?, id_guru = ? WHERE id = ?',
    [nama, kode || null, deskripsi || null, id_guru || null, req.params.id]
  );
  if (!r.affectedRows) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
  res.json({ message: 'Mata pelajaran berhasil diperbarui' });
});

// DELETE /api/mapel/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const [r] = await pool.query('DELETE FROM mata_pelajaran WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
  res.json({ message: 'Mata pelajaran berhasil dihapus' });
});

// GET /api/guru/options  -> daftar guru untuk dropdown (admin)
exports.guruOptions = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT g.id, u.nama, g.mapel
    FROM guru g JOIN users u ON u.id = g.id_user
    ORDER BY u.nama
  `);
  res.json(rows);
});
