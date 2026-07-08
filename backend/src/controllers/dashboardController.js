const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

// GET /api/dashboard  -> ringkasan sesuai role
exports.summary = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (role === 'admin') {
    const [[{ total_guru }]] = await pool.query("SELECT COUNT(*) total_guru FROM users WHERE role='guru'");
    const [[{ total_siswa }]] = await pool.query("SELECT COUNT(*) total_siswa FROM users WHERE role='siswa'");
    const [[{ total_kelas }]] = await pool.query('SELECT COUNT(*) total_kelas FROM kelas');
    const [[{ total_mapel }]] = await pool.query('SELECT COUNT(*) total_mapel FROM mata_pelajaran');
    const [[{ total_materi }]] = await pool.query('SELECT COUNT(*) total_materi FROM materi');
    const [[{ total_tugas }]] = await pool.query('SELECT COUNT(*) total_tugas FROM tugas');
    return res.json({ role, total_guru, total_siswa, total_kelas, total_mapel, total_materi, total_tugas });
  }

  if (role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    const [[{ total_mapel }]] = await pool.query('SELECT COUNT(*) total_mapel FROM mata_pelajaran WHERE id_guru = ?', [gid]);
    const [[{ total_materi }]] = await pool.query(
      'SELECT COUNT(*) total_materi FROM materi m JOIN mata_pelajaran mp ON mp.id=m.id_mapel WHERE mp.id_guru = ?', [gid]);
    const [[{ total_tugas }]] = await pool.query(
      'SELECT COUNT(*) total_tugas FROM tugas t JOIN mata_pelajaran mp ON mp.id=t.id_mapel WHERE mp.id_guru = ?', [gid]);
    const [[{ perlu_dinilai }]] = await pool.query(`
      SELECT COUNT(*) perlu_dinilai
      FROM pengumpulan_tugas p
      JOIN tugas t ON t.id = p.id_tugas
      JOIN mata_pelajaran mp ON mp.id = t.id_mapel
      LEFT JOIN nilai n ON n.id_kumpul = p.id
      WHERE mp.id_guru = ? AND n.id IS NULL`, [gid]);
    return res.json({ role, total_mapel, total_materi, total_tugas, perlu_dinilai });
  }

  // siswa
  const [s] = await pool.query('SELECT id, id_kelas FROM siswa WHERE id_user = ?', [req.user.id]);
  const sid = s.length ? s[0].id : null;
  const [[{ total_mapel }]] = await pool.query('SELECT COUNT(*) total_mapel FROM mata_pelajaran');
  const [[{ total_tugas }]] = await pool.query('SELECT COUNT(*) total_tugas FROM tugas');
  const [[{ sudah_kumpul }]] = await pool.query(
    'SELECT COUNT(*) sudah_kumpul FROM pengumpulan_tugas WHERE id_siswa = ?', [sid]);
  const [[{ sudah_dinilai }]] = await pool.query(`
    SELECT COUNT(*) sudah_dinilai FROM pengumpulan_tugas p
    JOIN nilai n ON n.id_kumpul = p.id WHERE p.id_siswa = ?`, [sid]);
  res.json({ role, total_mapel, total_tugas, sudah_kumpul, belum_kumpul: total_tugas - sudah_kumpul, sudah_dinilai });
});
