const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// ---------------------------------------------------------------------
// Pengelolaan pengguna menggunakan prinsip penonaktifan akun (soft delete).
// Data guru maupun siswa yang sudah pernah terlibat dalam pembelajaran
// tidak dihapus langsung karena akan memutus relasi pada tabel materi,
// tugas, pengumpulan, dan nilai. Akun cukup dinonaktifkan sehingga tidak
// dapat lagi masuk ke sistem, namun seluruh riwayatnya tetap tersimpan.
// ---------------------------------------------------------------------

// GET /api/users?role=guru|siswa&status=aktif|nonaktif  (admin)
exports.list = asyncHandler(async (req, res) => {
  const { role, status, q } = req.query;
  const where = [];
  const params = [];
  if (role) { where.push('u.role = ?'); params.push(role); }
  if (status === 'aktif') where.push('u.aktif = 1');
  if (status === 'nonaktif') where.push('u.aktif = 0');
  if (q) { where.push('(u.nama LIKE ? OR u.email LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }

  const [rows] = await pool.query(`
    SELECT u.id, u.nama, u.email, u.role, u.aktif, u.created_at,
           g.id AS guru_id, g.nip,
           s.id AS siswa_id, s.nis,
           (SELECT GROUP_CONCAT(DISTINCT k.nama_kelas ORDER BY k.nama_kelas SEPARATOR ', ')
              FROM siswa_kelas sk JOIN kelas k ON k.id = sk.id_kelas
              JOIN periode p ON p.id = k.id_periode
              WHERE sk.id_siswa = s.id AND p.status = 'aktif') AS kelas_aktif,
           (SELECT COUNT(*) FROM kelas_mapel km WHERE km.id_guru = g.id) AS jumlah_pengampuan
    FROM users u
    LEFT JOIN guru g  ON g.id_user = u.id
    LEFT JOIN siswa s ON s.id_user = u.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY u.role, u.nama
  `, params);
  res.json(rows);
});

// POST /api/users  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { nama, email, password, role, nip, nis, id_kelas } = req.body;
  if (!nama || !email || !password || !role)
    return res.status(400).json({ message: 'Nama, email, password, role wajib diisi' });
  if (!['guru', 'siswa', 'admin'].includes(role))
    return res.status(400).json({ message: 'Role tidak valid' });
  if (String(password).length < 6)
    return res.status(400).json({ message: 'Password minimal 6 karakter' });

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
      await conn.query('INSERT INTO guru (id_user, nip) VALUES (?,?)', [u.insertId, nip || null]);
    } else if (role === 'siswa') {
      const [s] = await conn.query('INSERT INTO siswa (id_user, nis) VALUES (?,?)',
        [u.insertId, nis || null]);
      if (id_kelas) {
        await conn.query('INSERT INTO siswa_kelas (id_siswa, id_kelas) VALUES (?,?)',
          [s.insertId, id_kelas]);
      }
    }
    await conn.commit();
    res.status(201).json({ id: u.insertId, message: 'Pengguna berhasil dibuat' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally { conn.release(); }
});

// PUT /api/users/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nama, email, password, aktif, nip, nis, id_kelas } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  const user = rows[0];

  if (email && email !== user.email) {
    const [bentrok] = await pool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, id]);
    if (bentrok.length) return res.status(409).json({ message: 'Email sudah terpakai' });
  }
  if (password && String(password).length < 6)
    return res.status(400).json({ message: 'Password minimal 6 karakter' });

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
    await pool.query('UPDATE guru SET nip = ? WHERE id_user = ?', [nip || null, id]);
  } else if (user.role === 'siswa') {
    await pool.query('UPDATE siswa SET nis = ? WHERE id_user = ?', [nis || null, id]);
    if (id_kelas !== undefined) {
      const [[s]] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [id]);
      if (s) {
        // Ganti penempatan kelas pada periode aktif saja
        await pool.query(`
          DELETE sk FROM siswa_kelas sk
          JOIN kelas k ON k.id = sk.id_kelas
          JOIN periode p ON p.id = k.id_periode
          WHERE sk.id_siswa = ? AND p.status = 'aktif'`, [s.id]);
        if (id_kelas) {
          await pool.query('INSERT IGNORE INTO siswa_kelas (id_siswa, id_kelas) VALUES (?,?)',
            [s.id, id_kelas]);
        }
      }
    }
  }
  res.json({ message: 'Pengguna berhasil diperbarui' });
});

// PUT /api/users/:id/status  (admin) -> mengaktifkan / menonaktifkan akun
exports.ubahStatus = asyncHandler(async (req, res) => {
  const { aktif } = req.body;
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Tidak dapat menonaktifkan akun sendiri' });

  const [r] = await pool.query('UPDATE users SET aktif = ? WHERE id = ?',
    [aktif ? 1 : 0, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  res.json({
    message: aktif
      ? 'Akun berhasil diaktifkan kembali'
      : 'Akun berhasil dinonaktifkan. Pengguna tidak dapat masuk, namun seluruh riwayatnya tetap tersimpan.',
  });
});

// DELETE /api/users/:id  (admin)
//   Penghapusan permanen hanya diizinkan untuk akun yang belum memiliki
//   jejak pembelajaran sama sekali. Selain itu sistem mengarahkan
//   administrator untuk menonaktifkan akun.
exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.user.id)
    return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  const user = rows[0];

  if (user.role === 'guru') {
    const [[g]] = await pool.query('SELECT id FROM guru WHERE id_user = ?', [id]);
    const [[{ jml }]] = await pool.query(
      'SELECT COUNT(*) jml FROM kelas_mapel WHERE id_guru = ?', [g ? g.id : 0]);
    if (jml > 0)
      return res.status(409).json({
        message: `Guru ini masih mengampu ${jml} kelas mata pelajaran sehingga tidak dapat dihapus. ` +
          'Nonaktifkan akunnya agar data pembelajaran tetap utuh.',
        saran: 'nonaktifkan' });
  }

  if (user.role === 'siswa') {
    const [[s]] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [id]);
    const sid = s ? s.id : 0;
    const [[{ kelas }]] = await pool.query(
      'SELECT COUNT(*) kelas FROM siswa_kelas WHERE id_siswa = ?', [sid]);
    const [[{ kumpul }]] = await pool.query(
      'SELECT COUNT(*) kumpul FROM pengumpulan_tugas WHERE id_siswa = ?', [sid]);
    if (kelas > 0 || kumpul > 0)
      return res.status(409).json({
        message: `Siswa ini terdaftar pada ${kelas} kelas dan memiliki ${kumpul} pengumpulan tugas ` +
          'sehingga tidak dapat dihapus. Nonaktifkan akunnya (misalnya karena sudah lulus atau pindah) ' +
          'agar riwayat nilainya tetap tersimpan.',
        saran: 'nonaktifkan' });
  }

  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  res.json({ message: 'Pengguna berhasil dihapus' });
});

// GET /api/users/siswa-tersedia?id_kelas=..  (admin)
//   Siswa aktif yang belum terdaftar pada kelas tersebut.
exports.siswaTersedia = asyncHandler(async (req, res) => {
  const { id_kelas } = req.query;
  const [rows] = await pool.query(`
    SELECT s.id, u.nama, s.nis
    FROM siswa s JOIN users u ON u.id = s.id_user
    WHERE u.aktif = 1
      AND s.id NOT IN (SELECT sk.id_siswa FROM siswa_kelas sk WHERE sk.id_kelas = ?)
    ORDER BY u.nama`, [id_kelas || 0]);
  res.json(rows);
});
