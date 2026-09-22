const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf, siswaIdOf } = require('../utils/akses');

// ---------------------------------------------------------------------
// kelas_mapel = "kelas mata pelajaran" (pengampuan)
// Satu mata pelajaran pada satu kelas yang diampu oleh seorang guru dalam
// satu periode. Menjadi wadah pertemuan, materi, tugas, dan forum diskusi.
// ---------------------------------------------------------------------

const SELECT_DASAR = `
  SELECT km.id, km.id_kelas, km.id_mapel, km.id_guru,
         mp.nama AS nama_mapel, mp.kode AS kode_mapel, mp.kelompok,
         k.nama_kelas, k.tingkat, k.id_periode,
         p.kode AS kode_periode, p.tahun_ajaran, p.semester, p.status AS status_periode,
         u.nama AS nama_guru,
         (SELECT COUNT(*) FROM pertemuan pt WHERE pt.id_kelas_mapel = km.id) AS jumlah_pertemuan,
         (SELECT COUNT(*) FROM materi m JOIN pertemuan pt ON pt.id = m.id_pertemuan
            WHERE pt.id_kelas_mapel = km.id) AS jumlah_materi,
         (SELECT COUNT(*) FROM tugas t JOIN pertemuan pt ON pt.id = t.id_pertemuan
            WHERE pt.id_kelas_mapel = km.id) AS jumlah_tugas,
         (SELECT COUNT(*) FROM siswa_kelas sk WHERE sk.id_kelas = km.id_kelas) AS jumlah_siswa
  FROM kelas_mapel km
  JOIN mata_pelajaran mp ON mp.id = km.id_mapel
  JOIN kelas k ON k.id = km.id_kelas
  JOIN periode p ON p.id = k.id_periode
  LEFT JOIN guru g  ON g.id = km.id_guru
  LEFT JOIN users u ON u.id = g.id_user
`;

// Batas waktu terdekat pada sebuah kelas_mapel (untuk kartu mata pelajaran)
async function lengkapiDeadline(rows) {
  for (const r of rows) {
    const [[d]] = await pool.query(`
      SELECT MIN(t.deadline) AS deadline_terdekat
      FROM tugas t JOIN pertemuan pt ON pt.id = t.id_pertemuan
      WHERE pt.id_kelas_mapel = ? AND t.deadline >= NOW()`, [r.id]);
    r.deadline_terdekat = d.deadline_terdekat;
  }
  return rows;
}

// GET /api/kelas-mapel?id_kelas=..&id_periode=..
//   admin -> seluruhnya, guru -> yang diampunya, siswa -> kelas yang diikutinya
exports.list = asyncHandler(async (req, res) => {
  const { id_kelas, id_periode, semua } = req.query;
  const where = [];
  const params = [];

  if (id_kelas) { where.push('km.id_kelas = ?'); params.push(id_kelas); }
  if (id_periode) { where.push('k.id_periode = ?'); params.push(id_periode); }

  let sql = SELECT_DASAR;
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('km.id_guru = ?'); params.push(gid);
  } else if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    sql += ' JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas ';
    where.push('sk.id_siswa = ?'); params.push(sid);
  }
  // Tanpa filter periode, tampilkan periode aktif saja agar tidak bertumpuk
  if (!id_periode && !semua) where.push("p.status = 'aktif'");

  sql += (where.length ? ' WHERE ' + where.join(' AND ') : '');
  sql += ' ORDER BY p.tahun_ajaran DESC, p.semester DESC, k.tingkat, k.nama_kelas, mp.nama';

  const [rows] = await pool.query(sql, params);
  res.json(await lengkapiDeadline(rows));
});

// GET /api/kelas-mapel/:id
exports.detail = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${SELECT_DASAR} WHERE km.id = ?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Kelas mata pelajaran tidak ditemukan' });
  res.json(rows[0]);
});

// POST /api/kelas-mapel  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { id_kelas, id_mapel, id_guru } = req.body;
  if (!id_kelas || !id_mapel)
    return res.status(400).json({ message: 'Kelas dan mata pelajaran wajib dipilih' });

  const [k] = await pool.query(`
    SELECT p.kode, p.status FROM kelas k JOIN periode p ON p.id = k.id_periode WHERE k.id = ?`,
    [id_kelas]);
  if (!k.length) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  if (k[0].status === 'terkunci')
    return res.status(423).json({ message: `Periode ${k[0].kode} terkunci dan tidak dapat diubah` });

  const [ada] = await pool.query(
    'SELECT id FROM kelas_mapel WHERE id_kelas = ? AND id_mapel = ?', [id_kelas, id_mapel]);
  if (ada.length)
    return res.status(409).json({ message: 'Mata pelajaran tersebut sudah ada pada kelas ini' });

  const [r] = await pool.query(
    'INSERT INTO kelas_mapel (id_kelas, id_mapel, id_guru) VALUES (?,?,?)',
    [id_kelas, id_mapel, id_guru || null]
  );
  res.status(201).json({ id: r.insertId, message: 'Pengampuan berhasil ditambahkan' });
});

// PUT /api/kelas-mapel/:id  (admin) -> mengganti guru pengampu
exports.update = asyncHandler(async (req, res) => {
  const { id_guru } = req.body;
  const [r] = await pool.query('UPDATE kelas_mapel SET id_guru = ? WHERE id = ?',
    [id_guru || null, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pengampuan tidak ditemukan' });
  res.json({ message: 'Guru pengampu berhasil diperbarui' });
});

// DELETE /api/kelas-mapel/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const [[{ jml }]] = await pool.query(
    'SELECT COUNT(*) jml FROM pertemuan WHERE id_kelas_mapel = ?', [req.params.id]);
  if (jml > 0)
    return res.status(409).json({
      message: `Pengampuan ini sudah memiliki ${jml} pertemuan beserta materi dan tugasnya, ` +
        'sehingga tidak dapat dihapus. Kunci periodenya untuk mengarsipkan data.' });

  const [r] = await pool.query('DELETE FROM kelas_mapel WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pengampuan tidak ditemukan' });
  res.json({ message: 'Pengampuan berhasil dihapus' });
});
