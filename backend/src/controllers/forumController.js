const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/forum?id_mapel=..  -> thread utama + balasannya
exports.list = asyncHandler(async (req, res) => {
  const { id_mapel } = req.query;
  if (!id_mapel) return res.status(400).json({ message: 'id_mapel wajib diisi' });

  const [threads] = await pool.query(`
    SELECT f.*, u.nama AS nama_user, u.role
    FROM forum_diskusi f JOIN users u ON u.id = f.id_user
    WHERE f.id_mapel = ? AND f.id_parent IS NULL
    ORDER BY f.tgl_post DESC
  `, [id_mapel]);

  for (const th of threads) {
    const [replies] = await pool.query(`
      SELECT f.*, u.nama AS nama_user, u.role
      FROM forum_diskusi f JOIN users u ON u.id = f.id_user
      WHERE f.id_parent = ? ORDER BY f.tgl_post ASC
    `, [th.id]);
    th.balasan = replies;
  }
  res.json(threads);
});

// POST /api/forum  -> thread baru atau balasan (jika ada id_parent)
exports.create = asyncHandler(async (req, res) => {
  const { id_mapel, judul, pesan, id_parent } = req.body;
  if (!id_mapel || !pesan)
    return res.status(400).json({ message: 'Mata pelajaran dan pesan wajib diisi' });
  const [r] = await pool.query(
    'INSERT INTO forum_diskusi (id_mapel, id_user, judul, pesan, id_parent) VALUES (?,?,?,?,?)',
    [id_mapel, req.user.id, judul || null, pesan, id_parent || null]
  );
  res.status(201).json({ id: r.insertId, message: 'Pesan terkirim' });
});

// DELETE /api/forum/:id  -> pemilik pesan atau admin
exports.remove = asyncHandler(async (req, res) => {
  const [f] = await pool.query('SELECT id_user FROM forum_diskusi WHERE id = ?', [req.params.id]);
  if (!f.length) return res.status(404).json({ message: 'Pesan tidak ditemukan' });
  if (req.user.role !== 'admin' && f[0].id_user !== req.user.id)
    return res.status(403).json({ message: 'Tidak boleh menghapus pesan ini' });
  await pool.query('DELETE FROM forum_diskusi WHERE id = ?', [req.params.id]);
  res.json({ message: 'Pesan dihapus' });
});
