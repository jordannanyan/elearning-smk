const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// Label periode yang ramah dibaca, contoh: "2025/2026 - Ganjil"
const labelSemester = (s) => (Number(s) === 1 ? 'Ganjil' : 'Genap');

function lengkapi(p) {
  return {
    ...p,
    nama_semester: labelSemester(p.semester),
    label: `${p.tahun_ajaran} - ${labelSemester(p.semester)}`,
  };
}

// GET /api/periode -> seluruh periode beserta jumlah kelas di dalamnya
exports.list = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, u.nama AS nama_pengunci,
           (SELECT COUNT(*) FROM kelas k WHERE k.id_periode = p.id) AS jumlah_kelas,
           (SELECT COUNT(*) FROM kelas_mapel km
              JOIN kelas k ON k.id = km.id_kelas WHERE k.id_periode = p.id) AS jumlah_pengampuan
    FROM periode p
    LEFT JOIN users u ON u.id = p.dikunci_oleh
    ORDER BY p.tahun_ajaran DESC, p.semester DESC
  `);
  res.json(rows.map(lengkapi));
});

// GET /api/periode/aktif -> periode yang sedang berjalan
exports.aktif = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM periode WHERE status = 'aktif' LIMIT 1");
  res.json(rows.length ? lengkapi(rows[0]) : null);
});

// POST /api/periode  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { tahun_ajaran, semester, tgl_mulai, tgl_selesai } = req.body;
  if (!tahun_ajaran || !semester)
    return res.status(400).json({ message: 'Tahun ajaran dan semester wajib diisi' });
  if (![1, 2, '1', '2'].includes(semester))
    return res.status(400).json({ message: 'Semester hanya boleh bernilai 1 (ganjil) atau 2 (genap)' });

  // Kode periode dibentuk dari tahun akhir ajaran + nomor semester -> 2026/1
  const tahunAkhir = String(tahun_ajaran).split('/').pop().trim();
  const kode = `${tahunAkhir}/${semester}`;

  const [ada] = await pool.query('SELECT id FROM periode WHERE kode = ?', [kode]);
  if (ada.length) return res.status(409).json({ message: `Periode ${kode} sudah terdaftar` });

  const [r] = await pool.query(
    `INSERT INTO periode (kode, tahun_ajaran, semester, tgl_mulai, tgl_selesai, status)
     VALUES (?,?,?,?,?, 'draft')`,
    [kode, tahun_ajaran, semester, tgl_mulai || null, tgl_selesai || null]
  );
  res.status(201).json({ id: r.insertId, kode, message: `Periode ${kode} berhasil dibuat` });
});

// PUT /api/periode/:id  (admin) -> hanya data deskriptif, bukan status
exports.update = asyncHandler(async (req, res) => {
  const { tahun_ajaran, semester, tgl_mulai, tgl_selesai } = req.body;
  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [req.params.id]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status === 'terkunci')
    return res.status(423).json({ message: `Periode ${p[0].kode} terkunci dan tidak dapat diubah` });

  const tahunAkhir = String(tahun_ajaran || p[0].tahun_ajaran).split('/').pop().trim();
  const sem = semester || p[0].semester;
  const kode = `${tahunAkhir}/${sem}`;

  await pool.query(
    `UPDATE periode SET kode = ?, tahun_ajaran = ?, semester = ?, tgl_mulai = ?, tgl_selesai = ?
     WHERE id = ?`,
    [kode, tahun_ajaran || p[0].tahun_ajaran, sem, tgl_mulai || null, tgl_selesai || null, req.params.id]
  );
  res.json({ message: 'Periode berhasil diperbarui' });
});

// POST /api/periode/:id/aktifkan  (admin)
//   Hanya boleh ada satu periode aktif; periode aktif sebelumnya
//   otomatis dikembalikan ke status draft.
exports.aktifkan = asyncHandler(async (req, res) => {
  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [req.params.id]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status === 'terkunci')
    return res.status(423).json({
      message: `Periode ${p[0].kode} sudah dikunci. Buka kunci terlebih dahulu sebelum mengaktifkannya kembali.` });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("UPDATE periode SET status = 'draft' WHERE status = 'aktif'");
    await conn.query("UPDATE periode SET status = 'aktif' WHERE id = ?", [req.params.id]);
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally { conn.release(); }

  res.json({ message: `Periode ${p[0].kode} berhasil diaktifkan` });
});

// POST /api/periode/:id/kunci  (admin)
exports.kunci = asyncHandler(async (req, res) => {
  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [req.params.id]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status === 'terkunci')
    return res.status(400).json({ message: `Periode ${p[0].kode} memang sudah terkunci` });

  await pool.query(
    "UPDATE periode SET status = 'terkunci', dikunci_oleh = ?, tgl_dikunci = NOW() WHERE id = ?",
    [req.user.id, req.params.id]
  );
  res.json({
    message: `Periode ${p[0].kode} berhasil dikunci. Seluruh data pada periode ini menjadi hanya-baca.`,
  });
});

// POST /api/periode/:id/buka-kunci  (admin)
//   Disediakan untuk keperluan koreksi nilai setelah periode ditutup.
exports.bukaKunci = asyncHandler(async (req, res) => {
  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [req.params.id]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status !== 'terkunci')
    return res.status(400).json({ message: `Periode ${p[0].kode} tidak dalam keadaan terkunci` });

  await pool.query(
    "UPDATE periode SET status = 'draft', dikunci_oleh = NULL, tgl_dikunci = NULL WHERE id = ?",
    [req.params.id]
  );
  res.json({
    message: `Kunci periode ${p[0].kode} berhasil dibuka. Aktifkan periode agar dapat digunakan kembali.`,
  });
});

// DELETE /api/periode/:id  (admin)
//   Periode yang sudah memuat kelas tidak boleh dihapus demi menjaga
//   keutuhan data historis.
exports.remove = asyncHandler(async (req, res) => {
  const [p] = await pool.query('SELECT * FROM periode WHERE id = ?', [req.params.id]);
  if (!p.length) return res.status(404).json({ message: 'Periode tidak ditemukan' });
  if (p[0].status === 'terkunci')
    return res.status(423).json({ message: `Periode ${p[0].kode} terkunci dan tidak dapat dihapus` });

  const [[{ jml }]] = await pool.query(
    'SELECT COUNT(*) jml FROM kelas WHERE id_periode = ?', [req.params.id]);
  if (jml > 0)
    return res.status(409).json({
      message: `Periode ${p[0].kode} tidak dapat dihapus karena sudah memiliki ${jml} kelas. ` +
        'Gunakan penguncian periode untuk mengarsipkannya.' });

  await pool.query('DELETE FROM periode WHERE id = ?', [req.params.id]);
  res.json({ message: `Periode ${p[0].kode} berhasil dihapus` });
});
