const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const {
  guruIdOf, siswaIdOf, kelasMapelMilikGuru,
  kelasMapelDariPertemuan, kelasMapelDariTugas, sisaHari,
} = require('../utils/akses');

// Status pengerjaan tugas dari sudut pandang siswa
function statusSiswa(t) {
  if (t.pengumpulan && t.pengumpulan.skor != null) return 'dinilai';
  if (t.pengumpulan) return 'menunggu_penilaian';
  const lewat = t.deadline && new Date(t.deadline.replace(' ', 'T')) < new Date();
  return lewat ? 'terlewat' : 'belum_dikerjakan';
}

// Tingkat kemendesakan untuk penanda warna pada antarmuka
function urgensi(sisa) {
  if (sisa === null) return 'tanpa_batas';
  if (sisa < 0) return 'lewat';
  if (sisa <= 1) return 'kritis';
  if (sisa <= 3) return 'mendesak';
  return 'aman';
}

const SELECT_TUGAS = `
  SELECT t.*, pt.nomor AS nomor_pertemuan, pt.judul AS judul_pertemuan,
         km.id AS id_kelas_mapel, mp.nama AS nama_mapel, k.nama_kelas, k.tingkat,
         p.kode AS kode_periode, p.status AS status_periode, u.nama AS nama_guru,
         (SELECT COUNT(*) FROM pengumpulan_tugas pg WHERE pg.id_tugas = t.id) AS jumlah_kumpul,
         (SELECT COUNT(*) FROM soal s WHERE s.id_tugas = t.id) AS jumlah_soal
  FROM tugas t
  JOIN pertemuan pt ON pt.id = t.id_pertemuan
  JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
  JOIN mata_pelajaran mp ON mp.id = km.id_mapel
  JOIN kelas k ON k.id = km.id_kelas
  JOIN periode p ON p.id = k.id_periode
  LEFT JOIN guru g  ON g.id = km.id_guru
  LEFT JOIN users u ON u.id = g.id_user
`;

// GET /api/tugas?id_kelas_mapel=..&id_pertemuan=..&id_periode=..
exports.list = asyncHandler(async (req, res) => {
  const { id_kelas_mapel, id_pertemuan, id_periode, semua } = req.query;
  const where = [];
  const params = [];

  if (id_kelas_mapel) { where.push('pt.id_kelas_mapel = ?'); params.push(id_kelas_mapel); }
  if (id_pertemuan) { where.push('t.id_pertemuan = ?'); params.push(id_pertemuan); }
  if (id_periode) { where.push('k.id_periode = ?'); params.push(id_periode); }
  else if (!semua) where.push("p.status = 'aktif'");

  let sql = SELECT_TUGAS;
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('km.id_guru = ?'); params.push(gid);
  } else if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    sql += ' JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas ';
    where.push('sk.id_siswa = ?'); params.push(sid);
  }

  sql += (where.length ? ' WHERE ' + where.join(' AND ') : '');
  sql += ' ORDER BY t.deadline IS NULL, t.deadline ASC';
  const [rows] = await pool.query(sql, params);

  for (const t of rows) {
    t.sisa_hari = sisaHari(t.deadline);
    t.urgensi = urgensi(t.sisa_hari);
  }

  if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    for (const t of rows) {
      const [[pg]] = await pool.query(`
        SELECT pg.id, pg.tgl_kumpul, pg.terlambat, n.skor, n.catatan
        FROM pengumpulan_tugas pg LEFT JOIN nilai n ON n.id_kumpul = pg.id
        WHERE pg.id_tugas = ? AND pg.id_siswa = ?`, [t.id, sid]);
      t.pengumpulan = pg || null;
      t.status = statusSiswa(t);
    }
  }
  res.json(rows);
});

// POST /api/tugas  (guru)
exports.create = asyncHandler(async (req, res) => {
  const { id_pertemuan, judul, deskripsi, deadline, tipe } = req.body;
  if (!id_pertemuan || !judul)
    return res.status(400).json({ message: 'Pertemuan dan judul tugas wajib diisi' });

  const idKm = await kelasMapelDariPertemuan(id_pertemuan);
  if (!idKm) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Pertemuan ini bukan pada kelas yang Anda ampu' });

  const [r] = await pool.query(
    'INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?,?)',
    [id_pertemuan, judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas']
  );
  res.status(201).json({ id: r.insertId, message: 'Tugas berhasil dibuat' });
});

// PUT /api/tugas/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, deskripsi, deadline, tipe } = req.body;
  const idKm = await kelasMapelDariTugas(req.params.id);
  if (!idKm) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan tugas pada kelas yang Anda ampu' });

  await pool.query(
    'UPDATE tugas SET judul = ?, deskripsi = ?, deadline = ?, tipe = ? WHERE id = ?',
    [judul, deskripsi || null, deadline || null, tipe === 'kuis' ? 'kuis' : 'tugas', req.params.id]
  );
  res.json({ message: 'Tugas berhasil diperbarui' });
});

// DELETE /api/tugas/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const idKm = await kelasMapelDariTugas(req.params.id);
  if (!idKm) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan tugas pada kelas yang Anda ampu' });
  await pool.query('DELETE FROM tugas WHERE id = ?', [req.params.id]);
  res.json({ message: 'Tugas berhasil dihapus' });
});

// ---------------------------------------------------------------------
// Perhitungan nilai akhir sebuah pengumpulan berbasis soal
//   - Pilihan ganda dikoreksi otomatis saat pengumpulan.
//   - Selama masih ada esai yang belum dinilai, nilai akhir ditahan.
//   - Setelah seluruh butir terskor, nilai dinormalisasi ke skala 0-100.
// ---------------------------------------------------------------------
async function hitungUlangNilai(conn, id_pengumpulan, gid, catatan) {
  const [[p]] = await conn.query('SELECT id_tugas FROM pengumpulan_tugas WHERE id = ?', [id_pengumpulan]);
  if (!p) return { status: 'not_found' };

  const [[agg]] = await conn.query(
    'SELECT COUNT(*) jml, COALESCE(SUM(bobot),0) total_bobot FROM soal WHERE id_tugas = ?', [p.id_tugas]);
  if (agg.jml === 0) return { status: 'no_soal' };

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
       ON DUPLICATE KEY UPDATE file = COALESCE(VALUES(file), file), jawaban = VALUES(jawaban),
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
          'INSERT INTO jawaban_siswa (id_pengumpulan, id_soal, pilihan, benar, skor) VALUES (?,?,?,?,?)',
          [pid, s.id, pilihan, benar, benar ? s.bobot : 0]);
      } else {
        await conn.query(
          'INSERT INTO jawaban_siswa (id_pengumpulan, id_soal, jawaban_teks, skor) VALUES (?,?,?,NULL)',
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
  } finally { conn.release(); }
});

// GET /api/tugas/:id/kerjakan  (siswa)
exports.kerjakan = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  const [[t]] = await pool.query(`
    SELECT t.*, mp.nama AS nama_mapel, k.nama_kelas, pt.nomor AS nomor_pertemuan,
           p.status AS status_periode, p.kode AS kode_periode, u.nama AS nama_guru
    FROM tugas t
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode p ON p.id = k.id_periode
    LEFT JOIN guru g  ON g.id = km.id_guru
    LEFT JOIN users u ON u.id = g.id_user
    WHERE t.id = ?`, [req.params.id]);
  if (!t) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

  const [soal] = await pool.query(
    'SELECT * FROM soal WHERE id_tugas = ? ORDER BY urutan, id', [req.params.id]);

  const [[p]] = await pool.query(`
    SELECT pg.id, pg.tgl_kumpul, pg.terlambat, pg.jawaban, pg.file, n.skor
    FROM pengumpulan_tugas pg LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE pg.id_tugas = ? AND pg.id_siswa = ?`, [req.params.id, sid]);

  const graded = !!(p && p.skor !== null && p.skor !== undefined);

  const jwbMap = {};
  if (p) {
    const [jwb] = await pool.query('SELECT * FROM jawaban_siswa WHERE id_pengumpulan = ?', [p.id]);
    jwb.forEach((j) => { jwbMap[j.id_soal] = j; });
  }

  const soalOut = soal.map((s) => {
    const j = jwbMap[s.id] || null;
    return {
      id: s.id, pertanyaan: s.pertanyaan, tipe: s.tipe, bobot: s.bobot,
      pilihan_a: s.pilihan_a, pilihan_b: s.pilihan_b, pilihan_c: s.pilihan_c, pilihan_d: s.pilihan_d,
      jawaban_benar: graded ? s.jawaban_benar : undefined,
      jawaban: j ? {
        pilihan: j.pilihan, jawaban_teks: j.jawaban_teks,
        benar: graded ? j.benar : undefined,
        skor: graded ? j.skor : undefined,
      } : null,
    };
  });

  res.json({
    tugas: {
      id: t.id, judul: t.judul, deskripsi: t.deskripsi, deadline: t.deadline, tipe: t.tipe,
      nama_mapel: t.nama_mapel, nama_kelas: t.nama_kelas, nama_guru: t.nama_guru,
      nomor_pertemuan: t.nomor_pertemuan, sisa_hari: sisaHari(t.deadline),
      urgensi: urgensi(sisaHari(t.deadline)),
    },
    periode_terkunci: t.status_periode === 'terkunci',
    kode_periode: t.kode_periode,
    berbasis_soal: soal.length > 0,
    sudah_kumpul: !!p,
    pengumpulan: p || null,
    graded,
    total_skor: graded ? p.skor : null,
    soal: soalOut,
  });
});

// GET /api/tugas/:id/pengumpulan  (guru)
//   Menampilkan seluruh siswa pada kelas, termasuk yang belum mengumpulkan,
//   sehingga tugas yang tidak dikumpulkan (missing) ikut terpantau.
exports.listPengumpulan = asyncHandler(async (req, res) => {
  const idKm = await kelasMapelDariTugas(req.params.id);
  if (!idKm) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan tugas pada kelas yang Anda ampu' });

  const [rows] = await pool.query(`
    SELECT s.id AS id_siswa, u.nama AS nama_siswa, s.nis,
           pg.id, pg.file, pg.jawaban, pg.tgl_kumpul, pg.terlambat,
           n.id AS id_nilai, n.skor, n.catatan,
           (SELECT COUNT(*) FROM jawaban_siswa j JOIN soal so ON so.id = j.id_soal
             WHERE j.id_pengumpulan = pg.id AND so.tipe = 'esai' AND j.skor IS NULL) AS esai_belum_dinilai
    FROM kelas_mapel km
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = ? AND pg.id_siswa = s.id
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE km.id = ?
    ORDER BY u.nama
  `, [req.params.id, idKm]);

  rows.forEach((r) => {
    r.status = r.id ? (r.skor != null ? 'dinilai'
      : r.esai_belum_dinilai > 0 ? 'perlu_nilai_esai' : 'terkumpul') : 'belum_mengumpulkan';
  });
  res.json(rows);
});

// GET /api/pengumpulan/:id  (guru) -> rincian jawaban untuk diperiksa
exports.detailPengumpulan = asyncHandler(async (req, res) => {
  const [[pg]] = await pool.query(`
    SELECT pg.*, u.nama AS nama_siswa, t.judul AS judul_tugas, n.catatan
    FROM pengumpulan_tugas pg
    JOIN siswa s ON s.id = pg.id_siswa
    JOIN users u ON u.id = s.id_user
    JOIN tugas t ON t.id = pg.id_tugas
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE pg.id = ?`, [req.params.id]);
  if (!pg) return res.status(404).json({ message: 'Pengumpulan tidak ditemukan' });

  const idKm = await kelasMapelDariTugas(pg.id_tugas);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan pengumpulan pada kelas yang Anda ampu' });

  const [soal] = await pool.query(`
    SELECT s.*, j.pilihan, j.jawaban_teks, j.benar, j.skor AS skor_didapat
    FROM soal s
    LEFT JOIN jawaban_siswa j ON j.id_soal = s.id AND j.id_pengumpulan = ?
    WHERE s.id_tugas = ? ORDER BY s.urutan, s.id`, [pg.id, pg.id_tugas]);

  res.json({ pengumpulan: pg, soal });
});

// POST /api/pengumpulan/:id/nilai  (guru) -> menilai butir esai lalu finalisasi
exports.nilaiEsai = asyncHandler(async (req, res) => {
  const { scores, catatan } = req.body;
  const [[pg]] = await pool.query('SELECT * FROM pengumpulan_tugas WHERE id = ?', [req.params.id]);
  if (!pg) return res.status(404).json({ message: 'Pengumpulan tidak ditemukan' });

  const idKm = await kelasMapelDariTugas(pg.id_tugas);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan pengumpulan pada kelas yang Anda ampu' });

  const gid = await guruIdOf(req.user.id);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const s of (scores || [])) {
      const [[soal]] = await conn.query('SELECT bobot FROM soal WHERE id = ?', [s.id_soal]);
      if (!soal) continue;
      const nilai = Math.max(0, Math.min(Number(s.skor) || 0, soal.bobot));
      await conn.query('UPDATE jawaban_siswa SET skor = ? WHERE id_pengumpulan = ? AND id_soal = ?',
        [nilai, req.params.id, s.id_soal]);
    }
    const hasil = await hitungUlangNilai(conn, req.params.id, gid, catatan);
    await conn.commit();
    res.json({ message: 'Penilaian berhasil disimpan', ...hasil });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally { conn.release(); }
});

exports.hitungUlangNilai = hitungUlangNilai;
