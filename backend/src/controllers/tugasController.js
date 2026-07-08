const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf } = require('./mapelController');

async function siswaIdOf(userId) {
  const [s] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [userId]);
  return s.length ? s[0].id : null;
}
async function assertMapelMilikGuru(userId, id_mapel) {
  const gid = await guruIdOf(userId);
  const [rows] = await pool.query(
    'SELECT id FROM mata_pelajaran WHERE id = ? AND id_guru = ?', [id_mapel, gid]);
  return rows.length > 0;
}

// GET /api/tugas?id_mapel=..
exports.list = asyncHandler(async (req, res) => {
  const { id_mapel } = req.query;
  const params = [];
  const where = [];
  if (id_mapel) { where.push('t.id_mapel = ?'); params.push(id_mapel); }
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('mp.id_guru = ?'); params.push(gid);
  }
  let sql = `
    SELECT t.*, mp.nama AS nama_mapel,
           (SELECT COUNT(*) FROM pengumpulan_tugas p WHERE p.id_tugas = t.id) AS jumlah_kumpul,
           (SELECT COUNT(*) FROM soal s WHERE s.id_tugas = t.id) AS jumlah_soal
    FROM tugas t JOIN mata_pelajaran mp ON mp.id = t.id_mapel
  `;
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY t.deadline IS NULL, t.deadline ASC';
  const [rows] = await pool.query(sql, params);

  // Tandai status pengumpulan bagi siswa
  if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    for (const t of rows) {
      const [p] = await pool.query(
        `SELECT p.id, p.tgl_kumpul, p.terlambat, n.skor
         FROM pengumpulan_tugas p LEFT JOIN nilai n ON n.id_kumpul = p.id
         WHERE p.id_tugas = ? AND p.id_siswa = ?`, [t.id, sid]);
      t.pengumpulan = p.length ? p[0] : null;
    }
  }
  res.json(rows);
});

// POST /api/tugas  (guru)
exports.create = asyncHandler(async (req, res) => {
  const { id_mapel, judul, deskripsi, deadline, tipe } = req.body;
  if (!id_mapel || !judul)
    return res.status(400).json({ message: 'Mata pelajaran dan judul wajib diisi' });
  if (!(await assertMapelMilikGuru(req.user.id, id_mapel)))
    return res.status(403).json({ message: 'Mata pelajaran bukan milik Anda' });
  const [r] = await pool.query(
    'INSERT INTO tugas (id_mapel, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?,?)',
    [id_mapel, judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas']
  );
  res.status(201).json({ id: r.insertId, message: 'Tugas berhasil dibuat' });
});

// PUT /api/tugas/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, deskripsi, deadline, tipe } = req.body;
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });
  await pool.query(
    'UPDATE tugas SET judul = ?, deskripsi = ?, deadline = ?, tipe = ? WHERE id = ?',
    [judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas', req.params.id]
  );
  res.json({ message: 'Tugas berhasil diperbarui' });
});

// DELETE /api/tugas/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });
  await pool.query('DELETE FROM tugas WHERE id = ?', [req.params.id]);
  res.json({ message: 'Tugas berhasil dihapus' });
});

// Hitung ulang & finalisasi nilai sebuah pengumpulan berbasis soal.
//  - PG sudah terkoreksi otomatis saat submit.
//  - Bila masih ada esai yang belum dinilai -> status pending (nilai belum final).
//  - Bila semua butir sudah terskor -> tulis skor akhir (normalisasi 0-100) ke tabel nilai.
async function hitungUlangNilai(conn, id_pengumpulan, gid, catatan) {
  const [[p]] = await conn.query('SELECT id_tugas FROM pengumpulan_tugas WHERE id = ?', [id_pengumpulan]);
  if (!p) return { status: 'not_found' };

  const [[agg]] = await conn.query(
    'SELECT COUNT(*) jml, COALESCE(SUM(bobot),0) total_bobot FROM soal WHERE id_tugas = ?', [p.id_tugas]);
  if (agg.jml === 0) return { status: 'no_soal' }; // tugas biasa, dinilai manual

  const [jwb] = await conn.query(`
    SELECT j.skor, s.tipe FROM jawaban_siswa j
    JOIN soal s ON s.id = j.id_soal WHERE j.id_pengumpulan = ?`, [id_pengumpulan]);

  const adaEsaiBelumDinilai = jwb.some((j) => j.tipe === 'esai' && j.skor === null);
  if (adaEsaiBelumDinilai) {
    await conn.query('DELETE FROM nilai WHERE id_kumpul = ?', [id_pengumpulan]);
    return { status: 'pending' };
  }

  const earned = jwb.reduce((a, j) => a + Number(j.skor || 0), 0);
  const skorAkhir = agg.total_bobot > 0 ? Math.round((earned / agg.total_bobot) * 10000) / 100 : 0;
  await conn.query(`
    INSERT INTO nilai (id_kumpul, id_guru, skor, catatan) VALUES (?,?,?,?)
    ON DUPLICATE KEY UPDATE skor = VALUES(skor),
      catatan = COALESCE(VALUES(catatan), catatan),
      id_guru = COALESCE(VALUES(id_guru), id_guru), tgl_penilaian = CURRENT_TIMESTAMP`,
    [id_pengumpulan, gid || null, skorAkhir, catatan || null]);
  return { status: 'final', skor: skorAkhir };
}

// POST /api/tugas/:id/submit  (siswa)
//  - Kuis berbasis soal  : body JSON { jawaban: [{id_soal, pilihan, jawaban_teks}] } -> auto koreksi PG
//  - Tugas biasa         : multipart { jawaban (teks), file }
exports.submit = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  if (!sid) return res.status(400).json({ message: 'Data siswa tidak ditemukan' });

  const [t] = await pool.query('SELECT * FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

  const [soal] = await pool.query('SELECT * FROM soal WHERE id_tugas = ?', [req.params.id]);
  const terlambat = t[0].deadline && new Date() > new Date(t[0].deadline) ? 1 : 0;

  // ---- Tugas biasa (tanpa soal) ----
  if (soal.length === 0) {
    const file = req.file ? req.file.filename : null;
    await pool.query(
      `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, file, jawaban, terlambat)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE file = VALUES(file), jawaban = VALUES(jawaban),
         terlambat = VALUES(terlambat), tgl_kumpul = CURRENT_TIMESTAMP`,
      [req.params.id, sid, file, req.body.jawaban || null, terlambat]);
    return res.json({ message: terlambat ? 'Terkumpul (terlambat)' : 'Tugas berhasil dikumpulkan' });
  }

  // ---- Kuis berbasis soal ----
  let jawaban = req.body.jawaban;
  if (typeof jawaban === 'string') { try { jawaban = JSON.parse(jawaban); } catch { jawaban = []; } }
  if (!Array.isArray(jawaban)) jawaban = [];
  const byId = new Map(jawaban.map((j) => [Number(j.id_soal), j]));

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [pRes] = await conn.query(
      `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, terlambat) VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE terlambat = VALUES(terlambat), tgl_kumpul = CURRENT_TIMESTAMP,
         id = LAST_INSERT_ID(id)`,
      [req.params.id, sid, terlambat]);
    const pid = pRes.insertId;

    await conn.query('DELETE FROM jawaban_siswa WHERE id_pengumpulan = ?', [pid]);

    for (const s of soal) {
      const a = byId.get(s.id) || {};
      if (s.tipe === 'pilihan_ganda') {
        const pilihan = (a.pilihan || '').toString().trim().toUpperCase() || null;
        const benar = pilihan && pilihan === s.jawaban_benar ? 1 : 0;
        await conn.query(
          `INSERT INTO jawaban_siswa (id_pengumpulan, id_soal, pilihan, benar, skor) VALUES (?,?,?,?,?)`,
          [pid, s.id, pilihan, benar, benar ? s.bobot : 0]);
      } else {
        await conn.query(
          `INSERT INTO jawaban_siswa (id_pengumpulan, id_soal, jawaban_teks, skor) VALUES (?,?,?,NULL)`,
          [pid, s.id, a.jawaban_teks || null]);
      }
    }

    const hasil = await hitungUlangNilai(conn, pid, null, null);
    await conn.commit();
    res.json({
      message: terlambat ? 'Jawaban terkumpul (terlambat)' : 'Jawaban berhasil dikumpulkan',
      status: hasil.status,
      skor: hasil.status === 'final' ? hasil.skor : null,
    });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

// GET /api/tugas/:id/kerjakan  (siswa) -> soal + jawaban siswa (kunci disembunyikan sebelum dinilai)
exports.kerjakan = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  const [t] = await pool.query('SELECT * FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

  const [soal] = await pool.query(
    'SELECT * FROM soal WHERE id_tugas = ? ORDER BY urutan, id', [req.params.id]);

  const [[p]] = await pool.query(
    `SELECT p.id, p.tgl_kumpul, p.terlambat, n.skor
     FROM pengumpulan_tugas p LEFT JOIN nilai n ON n.id_kumpul = p.id
     WHERE p.id_tugas = ? AND p.id_siswa = ?`, [req.params.id, sid]);

  const graded = !!(p && p.skor !== null && p.skor !== undefined);

  let jwbMap = {};
  if (p) {
    const [jwb] = await pool.query('SELECT * FROM jawaban_siswa WHERE id_pengumpulan = ?', [p.id]);
    jwb.forEach((j) => { jwbMap[j.id_soal] = j; });
  }

  const soalOut = soal.map((s) => {
    const j = jwbMap[s.id] || null;
    return {
      id: s.id, pertanyaan: s.pertanyaan, tipe: s.tipe, bobot: s.bobot,
      pilihan_a: s.pilihan_a, pilihan_b: s.pilihan_b, pilihan_c: s.pilihan_c, pilihan_d: s.pilihan_d,
      // Kunci jawaban & koreksi hanya dibuka setelah dinilai
      jawaban_benar: graded ? s.jawaban_benar : undefined,
      jawaban: j ? {
        pilihan: j.pilihan, jawaban_teks: j.jawaban_teks,
        benar: graded ? j.benar : undefined,
        skor: graded ? j.skor : undefined,
      } : null,
    };
  });

  res.json({
    tugas: { id: t[0].id, judul: t[0].judul, deskripsi: t[0].deskripsi, deadline: t[0].deadline, tipe: t[0].tipe },
    berbasis_soal: soal.length > 0,
    sudah_kumpul: !!p,
    graded,
    total_skor: graded ? p.skor : null,
    soal: soalOut,
  });
});

// GET /api/tugas/:id/pengumpulan  (guru) -> daftar pengumpulan siswa
exports.listPengumpulan = asyncHandler(async (req, res) => {
  const [t] = await pool.query('SELECT id_mapel FROM tugas WHERE id = ?', [req.params.id]);
  if (!t.length) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, t[0].id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });

  const [rows] = await pool.query(`
    SELECT p.*, u.nama AS nama_siswa, s.nis,
           n.id AS id_nilai, n.skor, n.catatan,
           (SELECT COUNT(*) FROM jawaban_siswa j JOIN soal so ON so.id = j.id_soal
             WHERE j.id_pengumpulan = p.id AND so.tipe = 'esai' AND j.skor IS NULL) AS esai_belum_dinilai
    FROM pengumpulan_tugas p
    JOIN siswa s ON s.id = p.id_siswa
    JOIN users u ON u.id = s.id_user
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    WHERE p.id_tugas = ?
    ORDER BY u.nama
  `, [req.params.id]);
  res.json(rows);
});

// GET /api/pengumpulan/:id  (guru) -> detail jawaban per soal untuk dinilai
exports.detailPengumpulan = asyncHandler(async (req, res) => {
  const [[p]] = await pool.query(`
    SELECT p.*, t.id_mapel, t.judul, u.nama AS nama_siswa, n.skor AS skor_akhir, n.catatan
    FROM pengumpulan_tugas p
    JOIN tugas t ON t.id = p.id_tugas
    JOIN siswa s ON s.id = p.id_siswa
    JOIN users u ON u.id = s.id_user
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    WHERE p.id = ?`, [req.params.id]);
  if (!p) return res.status(404).json({ message: 'Pengumpulan tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, p.id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });

  const [soal] = await pool.query(`
    SELECT s.*, j.pilihan, j.jawaban_teks, j.benar, j.skor AS skor_didapat
    FROM soal s
    LEFT JOIN jawaban_siswa j ON j.id_soal = s.id AND j.id_pengumpulan = ?
    WHERE s.id_tugas = ? ORDER BY s.urutan, s.id`, [p.id, p.id_tugas]);

  res.json({ pengumpulan: p, soal });
});

// POST /api/pengumpulan/:id/nilai  (guru) -> simpan skor esai lalu finalisasi nilai
//   body: { scores: [{id_soal, skor}], catatan }
exports.nilaiEsai = asyncHandler(async (req, res) => {
  const gid = await guruIdOf(req.user.id);
  const [[p]] = await pool.query(`
    SELECT p.id, t.id_mapel FROM pengumpulan_tugas p
    JOIN tugas t ON t.id = p.id_tugas WHERE p.id = ?`, [req.params.id]);
  if (!p) return res.status(404).json({ message: 'Pengumpulan tidak ditemukan' });
  if (!(await assertMapelMilikGuru(req.user.id, p.id_mapel)))
    return res.status(403).json({ message: 'Bukan tugas milik Anda' });

  const { scores, catatan } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const sc of scores || []) {
      // Batasi skor esai antara 0 dan bobot soal
      const [[s]] = await conn.query('SELECT bobot FROM soal WHERE id = ? AND tipe = "esai"', [sc.id_soal]);
      if (!s) continue;
      let skor = Number(sc.skor);
      if (isNaN(skor)) skor = 0;
      skor = Math.max(0, Math.min(skor, s.bobot));
      await conn.query(
        'UPDATE jawaban_siswa SET skor = ? WHERE id_pengumpulan = ? AND id_soal = ?',
        [skor, p.id, sc.id_soal]);
    }
    const hasil = await hitungUlangNilai(conn, p.id, gid, catatan);
    await conn.commit();
    res.json({ message: 'Penilaian disimpan', status: hasil.status, skor: hasil.skor ?? null });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});
