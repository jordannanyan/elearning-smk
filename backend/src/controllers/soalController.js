const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { kelasMapelDariTugas, kelasMapelMilikGuru } = require('../utils/akses');
const { hapusBerkas } = require('../middleware/upload');

// ---------------------------------------------------------------------
// Lampiran soal
// ---------------------------------------------------------------------
// Pertanyaan maupun setiap pilihan jawaban dapat disertai satu berkas
// gambar atau PDF, untuk soal yang tidak dapat dituliskan sebagai teks
// seperti grafik, struktur kimia, atau potongan bacaan hasil pindaian.
// Nama ruas berkasnya: lampiran, lampiran_a, lampiran_b, lampiran_c,
// dan lampiran_d.
// ---------------------------------------------------------------------
const RUAS_LAMPIRAN = ['lampiran', 'lampiran_a', 'lampiran_b', 'lampiran_c', 'lampiran_d'];

// Berkas yang baru diunggah pada permintaan ini, dikelompokkan per ruas
function berkasMasuk(req) {
  const hasil = {};
  const daftar = Array.isArray(req.files) ? req.files
    : req.files ? Object.values(req.files).flat() : [];
  for (const f of daftar) {
    if (RUAS_LAMPIRAN.includes(f.fieldname)) hasil[f.fieldname] = f.filename;
  }
  return hasil;
}

// Nilai lampiran yang akan disimpan untuk satu ruas:
//   ada berkas baru   -> pakai berkas baru, yang lama dihapus
//   ditandai dihapus  -> dikosongkan, yang lama dihapus
//   selebihnya        -> dipertahankan
function nilaiLampiran(ruas, baruPerRuas, body, lama) {
  if (baruPerRuas[ruas]) {
    if (lama && lama !== baruPerRuas[ruas]) hapusBerkas(lama);
    return baruPerRuas[ruas];
  }
  const tandaHapus = body[`hapus_${ruas}`];
  if (tandaHapus === '1' || tandaHapus === 'true' || tandaHapus === true) {
    hapusBerkas(lama);
    return null;
  }
  return lama || null;
}

// Cek apakah tugas ini berada pada kelas mata pelajaran yang diampu guru login
async function assertTugasMilikGuru(userId, id_tugas) {
  const idKm = await kelasMapelDariTugas(id_tugas);
  if (!idKm) return false;
  return kelasMapelMilikGuru(userId, idKm);
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
  // Pertanyaan boleh kosong apabila soal disampaikan sebagai gambar/PDF
  if (!pertanyaan && !berkasMasuk(req).lampiran)
    return res.status(400).json({ message: 'Isi pertanyaan atau unggah lampiran soal' });
  const isPG = tipe === 'pilihan_ganda';
  if (isPG) {
    const bk = berkasMasuk(req);
    if ((!pilihan_a && !bk.lampiran_a) || (!pilihan_b && !bk.lampiran_b))
      return res.status(400).json({
        message: 'Pilihan A dan B wajib diisi, berupa teks maupun lampiran' });
    if (!normalizePilihan(jawaban_benar)) return res.status(400).json({ message: 'Kunci jawaban (A/B/C/D) wajib untuk pilihan ganda' });
  }

  const [[{ maxUrut }]] = await pool.query(
    'SELECT COALESCE(MAX(urutan),0) maxUrut FROM soal WHERE id_tugas = ?', [id_tugas]);

  const berkas = berkasMasuk(req);
  const [r] = await pool.query(
    `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d,
       lampiran, lampiran_a, lampiran_b, lampiran_c, lampiran_d, jawaban_benar, bobot, urutan)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id_tugas, pertanyaan, isPG ? 'pilihan_ganda' : 'esai',
      isPG ? (pilihan_a || null) : null, isPG ? (pilihan_b || null) : null,
      isPG ? (pilihan_c || null) : null, isPG ? (pilihan_d || null) : null,
      berkas.lampiran || null,
      isPG ? (berkas.lampiran_a || null) : null, isPG ? (berkas.lampiran_b || null) : null,
      isPG ? (berkas.lampiran_c || null) : null, isPG ? (berkas.lampiran_d || null) : null,
      isPG ? normalizePilihan(jawaban_benar) : null,
      Number(bobot) > 0 ? Number(bobot) : 10, maxUrut + 1]
  );
  res.status(201).json({ id: r.insertId, message: 'Soal berhasil ditambahkan' });
});

// PUT /api/soal/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const [s] = await pool.query('SELECT * FROM soal WHERE id = ?', [req.params.id]);
  if (!s.length) return res.status(404).json({ message: 'Soal tidak ditemukan' });
  if (!(await assertTugasMilikGuru(req.user.id, s[0].id_tugas)))
    return res.status(403).json({ message: 'Bukan soal milik Anda' });

  const lamaSoal = s[0];
  const { pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot } = req.body;
  const isPG = tipe === 'pilihan_ganda';
  if (isPG && !normalizePilihan(jawaban_benar))
    return res.status(400).json({ message: 'Kunci jawaban (A/B/C/D) wajib untuk pilihan ganda' });

  const berkas = berkasMasuk(req);
  const lamp = {};
  for (const ruas of RUAS_LAMPIRAN) {
    lamp[ruas] = nilaiLampiran(ruas, berkas, req.body, lamaSoal[ruas]);
  }
  if (!pertanyaan && !lamp.lampiran)
    return res.status(400).json({ message: 'Isi pertanyaan atau unggah lampiran soal' });

  // Beralih ke esai: lampiran pilihan tidak lagi terpakai dan dihapus
  if (!isPG) {
    for (const ruas of ['lampiran_a', 'lampiran_b', 'lampiran_c', 'lampiran_d']) {
      hapusBerkas(lamp[ruas]);
      lamp[ruas] = null;
    }
  }

  await pool.query(
    `UPDATE soal SET pertanyaan=?, tipe=?, pilihan_a=?, pilihan_b=?, pilihan_c=?, pilihan_d=?,
      lampiran=?, lampiran_a=?, lampiran_b=?, lampiran_c=?, lampiran_d=?,
      jawaban_benar=?, bobot=? WHERE id=?`,
    [pertanyaan || null, isPG ? 'pilihan_ganda' : 'esai',
      isPG ? (pilihan_a || null) : null, isPG ? (pilihan_b || null) : null,
      isPG ? (pilihan_c || null) : null, isPG ? (pilihan_d || null) : null,
      lamp.lampiran, lamp.lampiran_a, lamp.lampiran_b, lamp.lampiran_c, lamp.lampiran_d,
      isPG ? normalizePilihan(jawaban_benar) : null,
      Number(bobot) > 0 ? Number(bobot) : 10, req.params.id]
  );
  res.json({ message: 'Soal berhasil diperbarui' });
});

// DELETE /api/soal/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [s] = await pool.query('SELECT * FROM soal WHERE id = ?', [req.params.id]);
  if (!s.length) return res.status(404).json({ message: 'Soal tidak ditemukan' });
  if (!(await assertTugasMilikGuru(req.user.id, s[0].id_tugas)))
    return res.status(403).json({ message: 'Bukan soal milik Anda' });

  // Lampiran jawaban siswa pada soal ini ikut dihapus dari cakram
  const [jwb] = await pool.query(
    'SELECT lampiran FROM jawaban_siswa WHERE id_soal = ? AND lampiran IS NOT NULL',
    [req.params.id]);
  jwb.forEach((j) => hapusBerkas(j.lampiran));
  RUAS_LAMPIRAN.forEach((ruas) => hapusBerkas(s[0][ruas]));

  await pool.query('DELETE FROM soal WHERE id = ?', [req.params.id]);
  res.json({ message: 'Soal berhasil dihapus' });
});
