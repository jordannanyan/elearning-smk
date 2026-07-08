const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi' });

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length)
    return res.status(401).json({ message: 'Email atau password salah' });

  const user = rows[0];
  if (!user.aktif) return res.status(403).json({ message: 'Akun dinonaktifkan' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Email atau password salah' });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/password  -> ganti password sendiri
exports.changePassword = asyncHandler(async (req, res) => {
  const { passwordLama, passwordBaru } = req.body;
  if (!passwordBaru || passwordBaru.length < 6)
    return res.status(400).json({ message: 'Password baru minimal 6 karakter' });

  const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
  const ok = await bcrypt.compare(passwordLama || '', rows[0].password);
  if (!ok) return res.status(400).json({ message: 'Password lama salah' });

  const hash = await bcrypt.hash(passwordBaru, 10);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ message: 'Password berhasil diubah' });
});
