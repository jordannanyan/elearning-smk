const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Memverifikasi token JWT lalu memuat data user ke req.user
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, nama, email, role, aktif FROM users WHERE id = ?',
      [payload.id]
    );
    if (!rows.length) return res.status(401).json({ message: 'User tidak ditemukan' });
    if (!rows[0].aktif) return res.status(403).json({ message: 'Akun dinonaktifkan' });

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
}

// Membatasi akses berdasarkan role, contoh: authorize('admin')
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak untuk role Anda' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
