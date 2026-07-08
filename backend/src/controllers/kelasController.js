const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/kelas
exports.list = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT k.*, COUNT(s.id) AS jumlah_siswa
    FROM kelas k
    LEFT JOIN siswa s ON s.id_kelas = k.id
    GROUP BY k.id
    ORDER BY k.tingkat, k.nama_kelas
  `);
  res.json(rows);
});

// POST /api/kelas  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { nama_kelas, tingkat, tahun_ajaran } = req.body;
  if (!nama_kelas || !tingkat || !tahun_ajaran)
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  const [r] = await pool.query(
    'INSERT INTO kelas (nama_kelas, tingkat, tahun_ajaran) VALUES (?,?,?)',
    [nama_kelas, tingkat, tahun_ajaran]
  );
  res.status(201).json({ id: r.insertId, message: 'Kelas berhasil dibuat' });
});

// PUT /api/kelas/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { nama_kelas, tingkat, tahun_ajaran } = req.body;
  const [r] = await pool.query(
    'UPDATE kelas SET nama_kelas = ?, tingkat = ?, tahun_ajaran = ? WHERE id = ?',
    [nama_kelas, tingkat, tahun_ajaran, req.params.id]
  );
  if (!r.affectedRows) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  res.json({ message: 'Kelas berhasil diperbarui' });
});

// DELETE /api/kelas/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const [r] = await pool.query('DELETE FROM kelas WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  res.json({ message: 'Kelas berhasil dihapus' });
});
