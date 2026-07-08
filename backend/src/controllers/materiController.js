const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

// Pastikan guru hanya boleh mengubah mapel miliknya sendiri
async function assertMapelMilikGuru(userId, id_mapel) {
  const gid = await guruIdOf(userId);
  const [rows] = await pool.query(
    'SELECT id FROM mata_pelajaran WHERE id = ? AND id_guru = ?', [id_mapel, gid]);
  return rows.length > 0;
}

// GET /api/materi?id_mapel=..
exports.list = asyncHandler(async (req, res) => {
  const { id_mapel } = req.query;
  let sql = `
    SELECT m.*, mp.nama AS nama_mapel
    FROM materi m JOIN mata_pelajaran mp ON mp.id = m.id_mapel
  `;
  const params = [];
  const where = [];
  if (id_mapel) { where.push('m.id_mapel = ?'); params.push(id_mapel); }
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('mp.id_guru = ?'); params.push(gid);
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY m.tgl_upload DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// POST /api/materi  (guru) -> multipart: id_mapel, judul, konten, file
exports.create = asyncHandler(async (req, res) => {
  const { id_mapel, judul, konten } = req.body;
  if (!id_mapel || !judul)
    return res.status(400).json({ message: 'Mata pelajaran dan judul wajib diisi' });
  if (!(await assertMapelMilikGuru(req.user.id, id_mapel)))
    return res.status(403).json({ message: 'Mata pelajaran bukan milik Anda' });

  const file = req.file ? req.file.filename : null;
  const [r] = await pool.query(
    'INSERT INTO materi (id_mapel, judul, konten, file) VALUES (?,?,?,?)',
    [id_mapel, judul, konten || null, file]
  );
  res.status(201).json({ id: r.insertId, message: 'Materi berhasil ditambahkan' });
});

// PUT /api/materi/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, konten } = req.body;
  const [m] = await pool.query('SELECT id_mapel FROM materi WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Materi tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, m[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan materi milik Anda' });

  const file = req.file ? req.file.filename : undefined;
  if (file !== undefined) {
    await pool.query('UPDATE materi SET judul = ?, konten = ?, file = ? WHERE id = ?',
      [judul, konten || null, file, req.params.id]);
  } else {
    await pool.query('UPDATE materi SET judul = ?, konten = ? WHERE id = ?',
      [judul, konten || null, req.params.id]);
  }
  res.json({ message: 'Materi berhasil diperbarui' });
});

// DELETE /api/materi/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [m] = await pool.query('SELECT id_mapel FROM materi WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Materi tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, m[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan materi milik Anda' });
  await pool.query('DELETE FROM materi WHERE id = ?', [req.params.id]);
  res.json({ message: 'Materi berhasil dihapus' });
});
