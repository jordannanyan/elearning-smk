const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/kelas?id_periode=..
//   Tanpa parameter, kelas yang ditampilkan adalah kelas pada periode aktif.
exports.list = asyncHandler(async (req, res) => {
  const { id_periode, semua } = req.query;
  const where = [];
  const params = [];
  if (id_periode) { where.push('k.id_periode = ?'); params.push(id_periode); }
  else if (!semua) where.push("p.status = 'aktif'");

  const [rows] = await pool.query(`
    SELECT k.*, p.kode AS kode_periode, p.tahun_ajaran, p.semester, p.status AS status_periode,
           (SELECT COUNT(*) FROM siswa_kelas sk WHERE sk.id_kelas = k.id) AS jumlah_siswa,
           (SELECT COUNT(*) FROM kelas_mapel km WHERE km.id_kelas = k.id) AS jumlah_mapel
    FROM kelas k
    JOIN periode p ON p.id = k.id_periode
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY p.tahun_ajaran DESC, p.semester DESC, k.tingkat, k.nama_kelas
  `, params);
  res.json(rows);
});

// POST /api/kelas  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { id_periode, nama_kelas, tingkat, wali_kelas } = req.body;
  if (!id_periode || !nama_kelas || !tingkat)
    return res.status(400).json({ message: 'Periode, nama kelas, dan tingkat wajib diisi' });

  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [id_periode]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status === 'terkunci')
    return res.status(423).json({ message: `Periode ${p[0].kode} terkunci, kelas baru tidak dapat ditambahkan` });

  const [ada] = await pool.query(
    'SELECT id FROM kelas WHERE id_periode = ? AND nama_kelas = ?', [id_periode, nama_kelas]);
  if (ada.length)
    return res.status(409).json({ message: `Kelas ${nama_kelas} sudah ada pada periode ${p[0].kode}` });

  const [r] = await pool.query(
    'INSERT INTO kelas (id_periode, nama_kelas, tingkat, wali_kelas) VALUES (?,?,?,?)',
    [id_periode, nama_kelas, tingkat, wali_kelas || null]
  );
  res.status(201).json({ id: r.insertId, message: 'Kelas berhasil dibuat' });
});

// PUT /api/kelas/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { nama_kelas, tingkat, wali_kelas } = req.body;
  const [r] = await pool.query(
    'UPDATE kelas SET nama_kelas = ?, tingkat = ?, wali_kelas = ? WHERE id = ?',
    [nama_kelas, tingkat, wali_kelas || null, req.params.id]
  );
  if (!r.affectedRows) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  res.json({ message: 'Kelas berhasil diperbarui' });
});

// DELETE /api/kelas/:id  (admin)
//   Kelas yang sudah berisi siswa atau mata pelajaran tidak dihapus
//   langsung agar data pembelajaran tidak ikut hilang.
exports.remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const [[{ siswa }]] = await pool.query(
    'SELECT COUNT(*) siswa FROM siswa_kelas WHERE id_kelas = ?', [id]);
  const [[{ mapel }]] = await pool.query(
    'SELECT COUNT(*) mapel FROM kelas_mapel WHERE id_kelas = ?', [id]);
  if (siswa > 0 || mapel > 0)
    return res.status(409).json({
      message: `Kelas tidak dapat dihapus karena masih memiliki ${siswa} siswa dan ` +
        `${mapel} mata pelajaran. Kosongkan kelas terlebih dahulu atau kunci periodenya.` });

  const [r] = await pool.query('DELETE FROM kelas WHERE id = ?', [id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  res.json({ message: 'Kelas berhasil dihapus' });
});

// GET /api/kelas/:id/siswa  -> daftar siswa pada sebuah kelas
exports.anggota = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT sk.id AS id_anggota, s.id AS id_siswa, u.nama, u.email, s.nis, u.aktif
    FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    WHERE sk.id_kelas = ?
    ORDER BY u.nama
  `, [req.params.id]);
  res.json(rows);
});

// POST /api/kelas/:id/siswa  (admin) -> menambahkan siswa ke kelas
exports.tambahAnggota = asyncHandler(async (req, res) => {
  const { id_siswa } = req.body;
  if (!id_siswa) return res.status(400).json({ message: 'Siswa wajib dipilih' });
  const [ada] = await pool.query(
    'SELECT id FROM siswa_kelas WHERE id_kelas = ? AND id_siswa = ?', [req.params.id, id_siswa]);
  if (ada.length) return res.status(409).json({ message: 'Siswa sudah terdaftar pada kelas ini' });
  await pool.query('INSERT INTO siswa_kelas (id_kelas, id_siswa) VALUES (?,?)',
    [req.params.id, id_siswa]);
  res.status(201).json({ message: 'Siswa berhasil ditambahkan ke kelas' });
});

// DELETE /api/kelas/:id/siswa/:idSiswa  (admin)
exports.hapusAnggota = asyncHandler(async (req, res) => {
  const [r] = await pool.query('DELETE FROM siswa_kelas WHERE id_kelas = ? AND id_siswa = ?',
    [req.params.id, req.params.idSiswa]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Siswa tidak terdaftar pada kelas ini' });
  res.json({ message: 'Siswa dikeluarkan dari kelas' });
});
