const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users?role=guru|siswa  (admin)
exports.list = asyncHandler(async (req, res) => {
  const { role } = req.query;
  let sql = `
    SELECT u.id, u.nama, u.email, u.role, u.aktif, u.created_at,
           g.id AS guru_id, g.nip, g.mapel,
           s.id AS siswa_id, s.nis, s.id_kelas, k.nama_kelas
    FROM users u
    LEFT JOIN guru g  ON g.id_user  = u.id
    LEFT JOIN siswa s ON s.id_user  = u.id
    LEFT JOIN kelas k ON k.id       = s.id_kelas
  `;
  const params = [];
  if (role) {
    sql += ' WHERE u.role = ?';
    params.push(role);
  }
  sql += ' ORDER BY u.role, u.nama';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// POST /api/users  (admin) -> membuat guru / siswa
exports.create = asyncHandler(async (req, res) => {
  const { nama, email, password, role, nip, mapel, nis, id_kelas } = req.body;
  if (!nama || !email || !password || !role)
    return res.status(400).json({ message: 'Nama, email, password, role wajib diisi' });
  if (!['guru', 'siswa', 'admin'].includes(role))
    return res.status(400).json({ message: 'Role tidak valid' });

  const [exist] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (exist.length) return res.status(409).json({ message: 'Email sudah terpakai' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const hash = await bcrypt.hash(password, 10);
    const [u] = await conn.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?,?,?,?)',
      [nama, email, hash, role]
    );
    if (role === 'guru') {
      await conn.query('INSERT INTO guru (id_user, nip, mapel) VALUES (?,?,?)',
        [u.insertId, nip || null, mapel || null]);
    } else if (role === 'siswa') {
      await conn.query('INSERT INTO siswa (id_user, nis, id_kelas) VALUES (?,?,?)',
        [u.insertId, nis || null, id_kelas || null]);
    }
    await conn.commit();
    res.status(201).json({ id: u.insertId, message: 'Pengguna berhasil dibuat' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

// PUT /api/users/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nama, email, password, aktif, nip, mapel, nis, id_kelas } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  const user = rows[0];

  const fields = [];
  const params = [];
  if (nama !== undefined) { fields.push('nama = ?'); params.push(nama); }
  if (email !== undefined) { fields.push('email = ?'); params.push(email); }
  if (aktif !== undefined) { fields.push('aktif = ?'); params.push(aktif ? 1 : 0); }
  if (password) { fields.push('password = ?'); params.push(await bcrypt.hash(password, 10)); }
  if (fields.length) {
    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  }

  if (user.role === 'guru') {
    await pool.query('UPDATE guru SET nip = ?, mapel = ? WHERE id_user = ?',
      [nip || null, mapel || null, id]);
  } else if (user.role === 'siswa') {
    await pool.query('UPDATE siswa SET nis = ?, id_kelas = ? WHERE id_user = ?',
      [nis || null, id_kelas || null, id]);
  }
  res.json({ message: 'Pengguna berhasil diperbarui' });
});

// DELETE /api/users/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.user.id)
    return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
  const [r] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  res.json({ message: 'Pengguna berhasil dihapus' });
});
