const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const {
  kelasMapelDariPertemuan, kelasMapelMilikGuru, berhakAtasPertemuan,
} = require('../utils/akses');

// ---------------------------------------------------------------------
// Forum diskusi menyatu di dalam pertemuan pembelajaran.
// Topik diskusi hanya dapat dibuka oleh guru pengampu, sedangkan siswa
// menanggapi melalui balasan. Dengan demikian diskusi selalu berada pada
// konteks materi yang sedang dipelajari.
// ---------------------------------------------------------------------

// GET /api/forum?id_pertemuan=..
exports.list = asyncHandler(async (req, res) => {
  const { id_pertemuan } = req.query;
  if (!id_pertemuan) return res.status(400).json({ message: 'Pertemuan wajib dipilih' });
  if (!(await berhakAtasPertemuan(req.user, id_pertemuan)))
    return res.status(403).json({ message: 'Anda tidak memiliki akses pada pertemuan ini' });

  const [threads] = await pool.query(`
    SELECT f.*, u.nama AS nama_user, u.role
    FROM forum_diskusi f JOIN users u ON u.id = f.id_user
    WHERE f.id_pertemuan = ? AND f.id_parent IS NULL
    ORDER BY f.tgl_post DESC`, [id_pertemuan]);

  for (const th of threads) {
    const [replies] = await pool.query(`
      SELECT f.*, u.nama AS nama_user, u.role
      FROM forum_diskusi f JOIN users u ON u.id = f.id_user
      WHERE f.id_parent = ? ORDER BY f.tgl_post ASC`, [th.id]);
    th.balasan = replies;
  }
  res.json(threads);
});

// POST /api/forum -> topik baru (guru) atau balasan (semua peserta)
exports.create = asyncHandler(async (req, res) => {
  const { id_pertemuan, judul, pesan, id_parent } = req.body;
  if (!id_pertemuan || !pesan || !String(pesan).trim())
    return res.status(400).json({ message: 'Pertemuan dan isi pesan wajib diisi' });

  if (!(await berhakAtasPertemuan(req.user, id_pertemuan)))
    return res.status(403).json({ message: 'Anda tidak memiliki akses pada pertemuan ini' });

  // Topik baru hanya boleh dibuka oleh guru pengampu
  if (!id_parent) {
    const idKm = await kelasMapelDariPertemuan(id_pertemuan);
    const bolehBukaTopik = req.user.role === 'admin'
      || (req.user.role === 'guru' && await kelasMapelMilikGuru(req.user.id, idKm));
    if (!bolehBukaTopik)
      return res.status(403).json({
        message: 'Topik diskusi hanya dapat dibuka oleh guru pengampu. ' +
          'Silakan menanggapi topik yang tersedia melalui tombol Balas.' });
    if (!judul || !String(judul).trim())
      return res.status(400).json({ message: 'Judul topik diskusi wajib diisi' });
  } else {
    const [[induk]] = await pool.query(
      'SELECT id, id_pertemuan FROM forum_diskusi WHERE id = ?', [id_parent]);
    if (!induk) return res.status(404).json({ message: 'Topik yang dibalas tidak ditemukan' });
    if (Number(induk.id_pertemuan) !== Number(id_pertemuan))
      return res.status(400).json({ message: 'Balasan tidak sesuai dengan pertemuannya' });
  }

  const [r] = await pool.query(
    'INSERT INTO forum_diskusi (id_pertemuan, id_user, judul, pesan, id_parent) VALUES (?,?,?,?,?)',
    [id_pertemuan, req.user.id, id_parent ? null : judul, pesan, id_parent || null]
  );
  res.status(201).json({
    id: r.insertId,
    message: id_parent ? 'Balasan terkirim' : 'Topik diskusi berhasil dibuka',
  });
});

// DELETE /api/forum/:id -> pemilik pesan, guru pengampu, atau admin
exports.remove = asyncHandler(async (req, res) => {
  const [[f]] = await pool.query(
    'SELECT id_user, id_pertemuan FROM forum_diskusi WHERE id = ?', [req.params.id]);
  if (!f) return res.status(404).json({ message: 'Pesan tidak ditemukan' });

  const idKm = await kelasMapelDariPertemuan(f.id_pertemuan);
  const boleh = req.user.role === 'admin'
    || f.id_user === req.user.id
    || (req.user.role === 'guru' && await kelasMapelMilikGuru(req.user.id, idKm));
  if (!boleh) return res.status(403).json({ message: 'Tidak boleh menghapus pesan ini' });

  await pool.query('DELETE FROM forum_diskusi WHERE id = ?', [req.params.id]);
  res.json({ message: 'Pesan dihapus' });
});
