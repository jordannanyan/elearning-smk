const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const {
  kelasMapelMilikGuru, kelasMapelDiikutiSiswa, berhakAtasPertemuan,
  siswaIdOf, sisaHari,
} = require('../utils/akses');

// ---------------------------------------------------------------------
// Pertemuan menjadi satuan alur pembelajaran. Di dalam satu pertemuan
// tersusun berurutan: materi (teks/file/video/link), tugas & kuis, lalu
// forum diskusi. Susunan ini membuat siswa mengikuti pembelajaran secara
// runut, tidak bertumpuk seperti sebelumnya.
// ---------------------------------------------------------------------

async function bolehAkses(user, idKelasMapel) {
  if (user.role === 'admin') return true;
  if (user.role === 'guru') return kelasMapelMilikGuru(user.id, idKelasMapel);
  return kelasMapelDiikutiSiswa(user.id, idKelasMapel);
}

// GET /api/kelas-mapel/:id/pertemuan  -> daftar pertemuan + ringkasan isinya
exports.list = asyncHandler(async (req, res) => {
  const idKm = req.params.id;
  if (!(await bolehAkses(req.user, idKm)))
    return res.status(403).json({ message: 'Anda tidak memiliki akses pada kelas mata pelajaran ini' });

  const [rows] = await pool.query(`
    SELECT pt.*,
           (SELECT COUNT(*) FROM materi m WHERE m.id_pertemuan = pt.id) AS jumlah_materi,
           (SELECT COUNT(*) FROM tugas t WHERE t.id_pertemuan = pt.id) AS jumlah_tugas,
           (SELECT COUNT(*) FROM forum_diskusi f WHERE f.id_pertemuan = pt.id) AS jumlah_diskusi
    FROM pertemuan pt
    WHERE pt.id_kelas_mapel = ?
    ORDER BY pt.nomor
  `, [idKm]);
  res.json(rows);
});

// GET /api/pertemuan/:id  -> isi lengkap satu pertemuan
exports.detail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!(await berhakAtasPertemuan(req.user, id)))
    return res.status(403).json({ message: 'Anda tidak memiliki akses pada pertemuan ini' });

  const [[pt]] = await pool.query(`
    SELECT pt.*, km.id AS id_kelas_mapel, mp.nama AS nama_mapel, k.nama_kelas, k.tingkat,
           p.kode AS kode_periode, p.status AS status_periode, u.nama AS nama_guru
    FROM pertemuan pt
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode p ON p.id = k.id_periode
    LEFT JOIN guru g  ON g.id = km.id_guru
    LEFT JOIN users u ON u.id = g.id_user
    WHERE pt.id = ?`, [id]);
  if (!pt) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });

  const [materi] = await pool.query(
    'SELECT * FROM materi WHERE id_pertemuan = ? ORDER BY id', [id]);

  const [tugas] = await pool.query(`
    SELECT t.*,
           (SELECT COUNT(*) FROM soal s WHERE s.id_tugas = t.id) AS jumlah_soal,
           (SELECT COUNT(*) FROM pengumpulan_tugas pg WHERE pg.id_tugas = t.id) AS jumlah_kumpul
    FROM tugas t WHERE t.id_pertemuan = ? ORDER BY t.deadline IS NULL, t.deadline`, [id]);
  tugas.forEach((t) => { t.sisa_hari = sisaHari(t.deadline); });

  // Status pengerjaan bagi siswa
  if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    for (const t of tugas) {
      const [[pg]] = await pool.query(`
        SELECT pg.id, pg.tgl_kumpul, pg.terlambat, n.skor
        FROM pengumpulan_tugas pg LEFT JOIN nilai n ON n.id_kumpul = pg.id
        WHERE pg.id_tugas = ? AND pg.id_siswa = ?`, [t.id, sid]);
      t.pengumpulan = pg || null;
    }
  }

  const [diskusi] = await pool.query(`
    SELECT f.*, u.nama AS nama_user, u.role
    FROM forum_diskusi f JOIN users u ON u.id = f.id_user
    WHERE f.id_pertemuan = ? AND f.id_parent IS NULL
    ORDER BY f.tgl_post DESC`, [id]);
  for (const d of diskusi) {
    const [balasan] = await pool.query(`
      SELECT f.*, u.nama AS nama_user, u.role
      FROM forum_diskusi f JOIN users u ON u.id = f.id_user
      WHERE f.id_parent = ? ORDER BY f.tgl_post`, [d.id]);
    d.balasan = balasan;
  }

  res.json({ pertemuan: pt, materi, tugas, diskusi });
});

// POST /api/kelas-mapel/:id/pertemuan  (guru)
exports.create = asyncHandler(async (req, res) => {
  const idKm = req.params.id;
  const { judul, deskripsi, tanggal, nomor } = req.body;
  if (!judul) return res.status(400).json({ message: 'Judul pertemuan wajib diisi' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Kelas mata pelajaran ini bukan yang Anda ampu' });

  let urut = Number(nomor);
  if (!urut) {
    const [[{ maks }]] = await pool.query(
      'SELECT COALESCE(MAX(nomor),0) maks FROM pertemuan WHERE id_kelas_mapel = ?', [idKm]);
    urut = maks + 1;
  }
  const [ada] = await pool.query(
    'SELECT id FROM pertemuan WHERE id_kelas_mapel = ? AND nomor = ?', [idKm, urut]);
  if (ada.length) return res.status(409).json({ message: `Pertemuan ke-${urut} sudah ada` });

  const [r] = await pool.query(
    'INSERT INTO pertemuan (id_kelas_mapel, nomor, judul, deskripsi, tanggal) VALUES (?,?,?,?,?)',
    [idKm, urut, judul, deskripsi || null, tanggal || null]
  );
  res.status(201).json({ id: r.insertId, nomor: urut, message: `Pertemuan ke-${urut} berhasil dibuat` });
});

// PUT /api/pertemuan/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, deskripsi, tanggal } = req.body;
  const [r] = await pool.query(
    'UPDATE pertemuan SET judul = ?, deskripsi = ?, tanggal = ? WHERE id = ?',
    [judul, deskripsi || null, tanggal || null, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });
  res.json({ message: 'Pertemuan berhasil diperbarui' });
});

// DELETE /api/pertemuan/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [r] = await pool.query('DELETE FROM pertemuan WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });
  res.json({ message: 'Pertemuan beserta isinya berhasil dihapus' });
});
