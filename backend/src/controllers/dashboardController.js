const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf, siswaIdOf } = require('../utils/akses');

// ---------------------------------------------------------------------
// Seluruh angka pada dashboard dihitung langsung dari basis data dengan
// lingkup periode pembelajaran yang sedang aktif, sehingga statistik yang
// ditampilkan selalu sama dengan isi menu terkait.
// ---------------------------------------------------------------------

// GET /api/dashboard
exports.summary = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const [[periode]] = await pool.query("SELECT * FROM periode WHERE status = 'aktif' LIMIT 1");
  const idPeriode = periode ? periode.id : null;
  const infoPeriode = periode
    ? { id: periode.id, kode: periode.kode, tahun_ajaran: periode.tahun_ajaran,
      semester: periode.semester, status: periode.status }
    : null;

  if (role === 'admin') {
    const [[{ total_guru }]] = await pool.query(
      "SELECT COUNT(*) total_guru FROM users WHERE role='guru' AND aktif=1");
    const [[{ total_siswa }]] = await pool.query(
      "SELECT COUNT(*) total_siswa FROM users WHERE role='siswa' AND aktif=1");
    const [[{ total_mapel }]] = await pool.query(
      'SELECT COUNT(*) total_mapel FROM mata_pelajaran WHERE aktif=1');
    const [[{ total_periode }]] = await pool.query('SELECT COUNT(*) total_periode FROM periode');

    // Statistik berikut dibatasi pada periode aktif
    const [[{ total_kelas }]] = await pool.query(
      'SELECT COUNT(*) total_kelas FROM kelas WHERE id_periode <=> ?', [idPeriode]);
    const [[{ total_pengampuan }]] = await pool.query(`
      SELECT COUNT(*) total_pengampuan FROM kelas_mapel km
      JOIN kelas k ON k.id = km.id_kelas WHERE k.id_periode <=> ?`, [idPeriode]);
    const [[{ total_materi }]] = await pool.query(`
      SELECT COUNT(*) total_materi FROM materi m
      JOIN pertemuan pt ON pt.id = m.id_pertemuan
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas WHERE k.id_periode <=> ?`, [idPeriode]);
    const [[{ total_tugas }]] = await pool.query(`
      SELECT COUNT(*) total_tugas FROM tugas t
      JOIN pertemuan pt ON pt.id = t.id_pertemuan
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas WHERE k.id_periode <=> ?`, [idPeriode]);
    const [[{ total_pertemuan }]] = await pool.query(`
      SELECT COUNT(*) total_pertemuan FROM pertemuan pt
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas WHERE k.id_periode <=> ?`, [idPeriode]);

    return res.json({
      role, periode: infoPeriode,
      total_guru, total_siswa, total_kelas, total_mapel, total_pengampuan,
      total_pertemuan, total_materi, total_tugas, total_periode,
    });
  }

  if (role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    const [[{ total_kelas_mapel }]] = await pool.query(`
      SELECT COUNT(*) total_kelas_mapel FROM kelas_mapel km
      JOIN kelas k ON k.id = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?`, [gid, idPeriode]);
    const [[{ total_pertemuan }]] = await pool.query(`
      SELECT COUNT(*) total_pertemuan FROM pertemuan pt
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?`, [gid, idPeriode]);
    const [[{ total_materi }]] = await pool.query(`
      SELECT COUNT(*) total_materi FROM materi m
      JOIN pertemuan pt ON pt.id = m.id_pertemuan
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?`, [gid, idPeriode]);
    const [[{ total_tugas }]] = await pool.query(`
      SELECT COUNT(*) total_tugas FROM tugas t
      JOIN pertemuan pt ON pt.id = t.id_pertemuan
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?`, [gid, idPeriode]);
    const [[{ perlu_dinilai }]] = await pool.query(`
      SELECT COUNT(*) perlu_dinilai FROM pengumpulan_tugas pg
      JOIN tugas t ON t.id = pg.id_tugas
      JOIN pertemuan pt ON pt.id = t.id_pertemuan
      JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km.id_kelas
      LEFT JOIN nilai n ON n.id_kumpul = pg.id
      WHERE km.id_guru = ? AND k.id_periode <=> ? AND n.id IS NULL`, [gid, idPeriode]);
    const [[{ total_siswa }]] = await pool.query(`
      SELECT COUNT(DISTINCT sk.id_siswa) total_siswa FROM kelas_mapel km
      JOIN kelas k ON k.id = km.id_kelas
      JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?`, [gid, idPeriode]);

    // Daftar kelas yang diajar, agar guru langsung melihat nama kelasnya
    const [daftarKelas] = await pool.query(`
      SELECT km.id, mp.nama AS nama_mapel, k.nama_kelas, k.tingkat
      FROM kelas_mapel km
      JOIN mata_pelajaran mp ON mp.id = km.id_mapel
      JOIN kelas k ON k.id = km.id_kelas
      WHERE km.id_guru = ? AND k.id_periode <=> ?
      ORDER BY mp.nama, k.nama_kelas`, [gid, idPeriode]);

    return res.json({
      role, periode: infoPeriode,
      total_kelas_mapel, total_pertemuan, total_materi, total_tugas, perlu_dinilai, total_siswa,
      daftar_kelas: daftarKelas,
    });
  }

  // ---- siswa ----
  const sid = await siswaIdOf(req.user.id);
  const [[kelas]] = await pool.query(`
    SELECT k.id, k.nama_kelas, k.tingkat FROM siswa_kelas sk
    JOIN kelas k ON k.id = sk.id_kelas
    WHERE sk.id_siswa = ? AND k.id_periode <=> ? LIMIT 1`, [sid, idPeriode]);

  const [[{ total_mapel }]] = await pool.query(`
    SELECT COUNT(*) total_mapel FROM kelas_mapel km
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    JOIN kelas k ON k.id = km.id_kelas
    WHERE sk.id_siswa = ? AND k.id_periode <=> ?`, [sid, idPeriode]);
  const [[{ total_tugas }]] = await pool.query(`
    SELECT COUNT(*) total_tugas FROM tugas t
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    WHERE sk.id_siswa = ? AND k.id_periode <=> ?`, [sid, idPeriode]);
  const [[{ sudah_kumpul }]] = await pool.query(`
    SELECT COUNT(*) sudah_kumpul FROM pengumpulan_tugas pg
    JOIN tugas t ON t.id = pg.id_tugas
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN kelas k ON k.id = km.id_kelas
    WHERE pg.id_siswa = ? AND k.id_periode <=> ?`, [sid, idPeriode]);
  const [[{ sudah_dinilai }]] = await pool.query(`
    SELECT COUNT(*) sudah_dinilai FROM pengumpulan_tugas pg
    JOIN nilai n ON n.id_kumpul = pg.id
    JOIN tugas t ON t.id = pg.id_tugas
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN kelas k ON k.id = km.id_kelas
    WHERE pg.id_siswa = ? AND k.id_periode <=> ?`, [sid, idPeriode]);

  // Tugas yang tenggatnya tinggal tiga hari atau kurang dan belum dikumpulkan
  const [mendesak] = await pool.query(`
    SELECT t.id, t.judul, t.deadline, mp.nama AS nama_mapel,
           DATEDIFF(t.deadline, NOW()) AS sisa_hari
    FROM tugas t
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id AND pg.id_siswa = ?
    WHERE sk.id_siswa = ? AND k.id_periode <=> ? AND pg.id IS NULL
      AND t.deadline IS NOT NULL AND t.deadline >= NOW()
      AND DATEDIFF(t.deadline, NOW()) <= 3
    ORDER BY t.deadline`, [sid, sid, idPeriode]);

  res.json({
    role, periode: infoPeriode, kelas: kelas || null,
    total_mapel, total_tugas, sudah_kumpul,
    belum_kumpul: total_tugas - sudah_kumpul, sudah_dinilai,
    tugas_mendesak: mendesak,
  });
});
