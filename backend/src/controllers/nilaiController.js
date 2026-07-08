const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

// POST /api/nilai  (guru) -> beri/ubah nilai atas sebuah pengumpulan
exports.beriNilai = asyncHandler(async (req, res) => {
  const { id_kumpul, skor, catatan } = req.body;
  if (!id_kumpul || skor === undefined || skor === '')
    return res.status(400).json({ message: 'id_kumpul dan skor wajib diisi' });

  const gid = await guruIdOf(req.user.id);
  // Validasi bahwa pengumpulan ini pada mapel milik guru
  const [chk] = await pool.query(`
    SELECT p.id FROM pengumpulan_tugas p
    JOIN tugas t ON t.id = p.id_tugas
    JOIN mata_pelajaran mp ON mp.id = t.id_mapel
    WHERE p.id = ? AND mp.id_guru = ?`, [id_kumpul, gid]);
  if (!chk.length) return res.status(403).json({ message: 'Bukan pengumpulan pada mapel Anda' });

  await pool.query(`
    INSERT INTO nilai (id_kumpul, id_guru, skor, catatan) VALUES (?,?,?,?)
    ON DUPLICATE KEY UPDATE skor = VALUES(skor), catatan = VALUES(catatan),
      id_guru = VALUES(id_guru), tgl_penilaian = CURRENT_TIMESTAMP`,
    [id_kumpul, gid, skor, catatan || null]);
  res.json({ message: 'Nilai berhasil disimpan' });
});

// GET /api/nilai/saya  (siswa) -> rekap nilai
exports.rekapSiswa = asyncHandler(async (req, res) => {
  const [s] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [req.user.id]);
  if (!s.length) return res.json([]);
  const [rows] = await pool.query(`
    SELECT t.judul AS judul_tugas, t.tipe, mp.nama AS nama_mapel,
           p.tgl_kumpul, p.terlambat, n.skor, n.catatan, n.tgl_penilaian
    FROM pengumpulan_tugas p
    JOIN tugas t ON t.id = p.id_tugas
    JOIN mata_pelajaran mp ON mp.id = t.id_mapel
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    WHERE p.id_siswa = ?
    ORDER BY n.tgl_penilaian IS NULL, p.tgl_kumpul DESC
  `, [s[0].id]);
  res.json(rows);
});
