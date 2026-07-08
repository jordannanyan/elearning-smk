const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

// Cek apakah tugas ini berada pada mapel milik guru login
async function assertTugasMilikGuru(userId, id_tugas) {
  const gid = await guruIdOf(userId);
  const [rows] = await pool.query(`
    SELECT t.id FROM tugas t
    JOIN mata_pelajaran mp ON mp.id = t.id_mapel
    WHERE t.id = ? AND mp.id_guru = ?`, [id_tugas, gid]);
  return rows.length > 0;
}
exports.assertTugasMilikGuru = assertTugasMilikGuru;

function normalizePilihan(v) {
  const c = (v || '').toString().trim().toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(c) ? c : null;
}

// GET /api/tugas/:id/soal  (guru) -> soal lengkap termasuk kunci jawaban
exports.list = asyncHandler(async (req, res) => {
  if (!(await assertTugasMilikGuru(req.user.id, req.params.id)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });
  const [rows] = await pool.query(
    'SELECT * FROM soal WHERE id_tugas = ? ORDER BY urutan, id', [req.params.id]);
  res.json(rows);
});

// POST /api/tugas/:id/soal  (guru)
exports.create = asyncHandler(async (req, res) => {
  const id_tugas = req.params.id;
  if (!(await assertTugasMilikGuru(req.user.id, id_tugas)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });

  const { pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot } = req.body;
  if (!pertanyaan) return res.status(400).json({ message: 'Pertanyaan wajib diisi' });
  const isPG = tipe === 'pilihan_ganda';
  if (isPG) {
    if (!pilihan_a || !pilihan_b) return res.status(400).json({ message: 'Minimal pilihan A dan B diisi' });
    if (!normalizePilihan(jawaban_benar)) return res.status(400).json({ message: 'Kunci jawaban (A/B/C/D) wajib untuk pilihan ganda' });
  }

  const [[{ maxUrut }]] = await pool.query(
    'SELECT COALESCE(MAX(urutan),0) maxUrut FROM soal WHERE id_tugas = ?', [id_tugas]);

  const [r] = await pool.query(
    `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot, urutan)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id_tugas, pertanyaan, isPG ? 'pilihan_ganda' : 'esai',
      isPG ? (pilihan_a || null) : null, isPG ? (pilihan_b || null) : null,
      isPG ? (pilihan_c || null) : null, isPG ? (pilihan_d || null) : null,
      isPG ? normalizePilihan(jawaban_benar) : null,
      Number(bobot) > 0 ? Number(bobot) : 10, maxUrut + 1]
  );
  res.status(201).json({ id: r.insertId, message: 'Soal berhasil ditambahkan' });
});

// PUT /api/soal/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const [s] = await pool.query('SELECT id_tugas FROM soal WHERE id = ?', [req.params.id]);
  if (!s.length) return res.status(404).json({ message: 'Soal tidak ditemukan' });
  if (!(await assertTugasMilikGuru(req.user.id, s[0].id_tugas)))
    return res.status(403).json({ message: 'Bukan soal milik Anda' });

  const { pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot } = req.body;
  const isPG = tipe === 'pilihan_ganda';
  if (isPG && !normalizePilihan(jawaban_benar))
    return res.status(400).json({ message: 'Kunci jawaban (A/B/C/D) wajib untuk pilihan ganda' });

  await pool.query(
    `UPDATE soal SET pertanyaan=?, tipe=?, pilihan_a=?, pilihan_b=?, pilihan_c=?, pilihan_d=?,
      jawaban_benar=?, bobot=? WHERE id=?`,
    [pertanyaan, isPG ? 'pilihan_ganda' : 'esai',
      isPG ? (pilihan_a || null) : null, isPG ? (pilihan_b || null) : null,
      isPG ? (pilihan_c || null) : null, isPG ? (pilihan_d || null) : null,
      isPG ? normalizePilihan(jawaban_benar) : null,
      Number(bobot) > 0 ? Number(bobot) : 10, req.params.id]
  );
  res.json({ message: 'Soal berhasil diperbarui' });
});

// DELETE /api/soal/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [s] = await pool.query('SELECT id_tugas FROM soal WHERE id = ?', [req.params.id]);
  if (!s.length) return res.status(404).json({ message: 'Soal tidak ditemukan' });
  if (!(await assertTugasMilikGuru(req.user.id, s[0].id_tugas)))
    return res.status(403).json({ message: 'Bukan soal milik Anda' });
  await pool.query('DELETE FROM soal WHERE id = ?', [req.params.id]);
  res.json({ message: 'Soal berhasil dihapus' });
});
