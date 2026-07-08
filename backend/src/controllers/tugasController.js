const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

async function siswaIdOf(userId) {
  const [s] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [userId]);
  return s.length ? s[0].id : null;
}
async function assertMapelMilikGuru(userId, id_mapel) {
  const gid = await guruIdOf(userId);
  const [rows] = await pool.query(
    'SELECT id FROM mata_pelajaran WHERE id = ? AND id_guru = ?', [id_mapel, gid]);
  return rows.length > 0;
}

// GET /api/tugas?id_mapel=..
exports.list = asyncHandler(async (req, res) => {
  const { id_mapel } = req.query;
  const params = [];
  const where = [];
  if (id_mapel) { where.push('t.id_mapel = ?'); params.push(id_mapel); }
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('mp.id_guru = ?'); params.push(gid);
  }
  let sql = `
    SELECT t.*, mp.nama AS nama_mapel,
           (SELECT COUNT(*) FROM pengumpulan_tugas p WHERE p.id_tugas = t.id) AS jumlah_kumpul
    FROM tugas t JOIN mata_pelajaran mp ON mp.id = t.id_mapel
  `;
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY t.deadline IS NULL, t.deadline ASC';
  const [rows] = await pool.query(sql, params);

  // Tandai status pengumpulan bagi siswa
  if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    for (const t of rows) {
      const [p] = await pool.query(
        `SELECT p.id, p.tgl_kumpul, p.terlambat, n.skor
         FROM pengumpulan_tugas p LEFT JOIN nilai n ON n.id_kumpul = p.id
         WHERE p.id_tugas = ? AND p.id_siswa = ?`, [t.id, sid]);
      t.pengumpulan = p.length ? p[0] : null;
    }
  }
  res.json(rows);
});

// POST /api/tugas  (guru)
exports.create = asyncHandler(async (req, res) => {
  const { id_mapel, judul, deskripsi, deadline, tipe } = req.body;
  if (!id_mapel || !judul)
    return res.status(400).json({ message: 'Mata pelajaran dan judul wajib diisi' });
  if (!(await assertMapelMilikGuru(req.user.id, id_mapel)))
    return res.status(403).json({ message: 'Mata pelajaran bukan milik Anda' });
  const [r] = await pool.query(
    'INSERT INTO tugas (id_mapel, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?,?)',
    [id_mapel, judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas']
  );
  res.status(201).json({ id: r.insertId, message: 'Tugas berhasil dibuat' });
});

// PUT /api/tugas/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, deskripsi, deadline, tipe } = req.body;
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });
  await pool.query(
    'UPDATE tugas SET judul = ?, deskripsi = ?, deadline = ?, tipe = ? WHERE id = ?',
    [judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas', req.params.id]
  );
  res.json({ message: 'Tugas berhasil diperbarui' });
});

// DELETE /api/tugas/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });
  await pool.query('DELETE FROM tugas WHERE id = ?', [req.params.id]);
  res.json({ message: 'Tugas berhasil dihapus' });
});

// POST /api/tugas/:id/submit  (siswa) -> multipart: jawaban, file
exports.submit = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  if (!sid) return res.status(400).json({ message: 'Data siswa tidak ditemukan' });

  const [t] = await pool.query('SELECT * FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

  const terlambat = t[0].deadline && new Date() > new Date(t[0].deadline) ? 1 : 0;
  const file = req.file ? req.file.filename : null;
  const { jawaban } = req.body;

  // Upsert: satu siswa satu pengumpulan per tugas
  await pool.query(
    `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, file, jawaban, terlambat)
     VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE file = VALUES(file), jawaban = VALUES(jawaban),
       terlambat = VALUES(terlambat), tgl_kumpul = CURRENT_TIMESTAMP`,
    [req.params.id, sid, file, jawaban || null, terlambat]
  );
  res.json({ message: terlambat ? 'Terkumpul (terlambat)' : 'Tugas berhasil dikumpulkan' });
});

// GET /api/tugas/:id/pengumpulan  (guru) -> daftar pengumpulan siswa
exports.listPengumpulan = asyncHandler(async (req, res) => {
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });

  const [rows] = await pool.query(`
    SELECT p.*, u.nama AS nama_siswa, s.nis,
           n.id AS id_nilai, n.skor, n.catatan
    FROM pengumpulan_tugas p
    JOIN siswa s ON s.id = p.id_siswa
    JOIN users u ON u.id = s.id_user
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    WHERE p.id_tugas = ?
    ORDER BY u.nama
  `, [req.params.id]);
  res.json(rows);
});
