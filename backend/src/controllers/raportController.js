const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { guruIdOf, siswaIdOf } = require('../utils/akses');

// ---------------------------------------------------------------------
// Raport sementara
// ---------------------------------------------------------------------
// Raport di sini disebut "sementara" karena disusun dari nilai tugas dan
// kuis yang sudah masuk sampai saat halaman dibuka, bukan nilai akhir
// semester. Nilai setiap mata pelajaran merupakan rata-rata seluruh
// tugas yang sudah dinilai guru pada mata pelajaran tersebut.
//
// Guru melihat raport seluruh siswa pada satu kelas, sehingga wali kelas
// dapat memantau kelas binaannya. Siswa melihat raport dirinya sendiri
// pada setiap periode pembelajaran yang pernah diikutinya.
// ---------------------------------------------------------------------

const KKM = 75; // Kriteria Ketuntasan Minimal yang digunakan sekolah

function predikat(nilai) {
  if (nilai == null) return { huruf: '-', keterangan: 'Belum ada nilai' };
  if (nilai >= 90) return { huruf: 'A', keterangan: 'Sangat Baik' };
  if (nilai >= 80) return { huruf: 'B', keterangan: 'Baik' };
  if (nilai >= 70) return { huruf: 'C', keterangan: 'Cukup' };
  return { huruf: 'D', keterangan: 'Perlu Bimbingan' };
}

const bulat = (n) => (n == null ? null : Math.round(Number(n) * 100) / 100);

// Menyusun nilai seluruh siswa pada sebuah kelas, dikelompokkan per mata
// pelajaran. Dipakai bersama oleh raport guru maupun raport siswa agar
// angka yang tampil pada keduanya dihitung dengan cara yang sama persis.
async function nilaiKelas(idKelas) {
  const [[kelas]] = await pool.query(`
    SELECT k.id, k.nama_kelas, k.tingkat, k.id_periode,
           p.kode, p.tahun_ajaran, p.semester, p.status AS status_periode,
           uw.nama AS wali_kelas
    FROM kelas k
    JOIN periode p ON p.id = k.id_periode
    LEFT JOIN guru gw ON gw.id = k.id_wali
    LEFT JOIN users uw ON uw.id = gw.id_user
    WHERE k.id = ?`, [idKelas]);
  if (!kelas) return null;
  kelas.nama_semester = kelas.semester === 1 ? 'Ganjil' : 'Genap';

  const [mapel] = await pool.query(`
    SELECT km.id AS id_kelas_mapel, mp.nama AS nama_mapel, mp.kode AS kode_mapel,
           mp.kelompok, ug.nama AS nama_guru,
           (SELECT COUNT(*) FROM pertemuan pt JOIN tugas t ON t.id_pertemuan = pt.id
             WHERE pt.id_kelas_mapel = km.id) AS jumlah_tugas
    FROM kelas_mapel km
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    LEFT JOIN guru g ON g.id = km.id_guru
    LEFT JOIN users ug ON ug.id = g.id_user
    WHERE km.id_kelas = ?
    ORDER BY mp.kelompok, mp.nama`, [idKelas]);

  const [baris] = await pool.query(`
    SELECT s.id AS id_siswa, u.nama, s.nis, km.id AS id_kelas_mapel,
           COUNT(n.id) AS jumlah_dinilai, AVG(n.skor) AS rata
    FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    JOIN kelas_mapel km ON km.id_kelas = sk.id_kelas
    LEFT JOIN pertemuan pt ON pt.id_kelas_mapel = km.id
    LEFT JOIN tugas t ON t.id_pertemuan = pt.id
    LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id AND pg.id_siswa = s.id
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE sk.id_kelas = ?
    GROUP BY s.id, km.id
    ORDER BY u.nama`, [idKelas]);

  const peta = new Map();
  for (const b of baris) {
    if (!peta.has(b.id_siswa)) {
      peta.set(b.id_siswa, { id_siswa: b.id_siswa, nama: b.nama, nis: b.nis, nilai: {} });
    }
    peta.get(b.id_siswa).nilai[b.id_kelas_mapel] = {
      rata_rata: bulat(b.rata),
      jumlah_dinilai: Number(b.jumlah_dinilai),
    };
  }

  const siswa = [...peta.values()].map((s) => {
    const angka = Object.values(s.nilai).map((v) => v.rata_rata).filter((v) => v != null);
    const rata = angka.length ? bulat(angka.reduce((a, b) => a + b, 0) / angka.length) : null;
    return {
      ...s,
      jumlah_mapel_dinilai: angka.length,
      jumlah_mapel_tuntas: angka.filter((v) => v >= KKM).length,
      rata_rata: rata,
      predikat: predikat(rata),
    };
  });

  // Peringkat hanya diberikan kepada siswa yang sudah memiliki nilai.
  [...siswa].filter((s) => s.rata_rata != null)
    .sort((a, b) => b.rata_rata - a.rata_rata)
    .forEach((s, i) => { s.peringkat = i + 1; });
  siswa.forEach((s) => { if (s.rata_rata == null) s.peringkat = null; });

  return { kelas, mapel, siswa, kkm: KKM };
}

// GET /api/raport/kelas  (guru) -> daftar kelas yang boleh dibuka raportnya
exports.kelasGuru = asyncHandler(async (req, res) => {
  const gid = await guruIdOf(req.user.id);
  if (!gid) return res.json([]);

  const [rows] = await pool.query(`
    SELECT k.id, k.nama_kelas, k.tingkat,
           p.kode, p.tahun_ajaran, p.semester, p.status AS status_periode,
           (k.id_wali = ?) AS wali_kelas,
           (SELECT COUNT(*) FROM siswa_kelas sk WHERE sk.id_kelas = k.id) AS jumlah_siswa,
           (SELECT COUNT(*) FROM kelas_mapel km2 WHERE km2.id_kelas = k.id) AS jumlah_mapel,
           (SELECT GROUP_CONCAT(DISTINCT mp.nama ORDER BY mp.nama SEPARATOR ', ')
              FROM kelas_mapel km3 JOIN mata_pelajaran mp ON mp.id = km3.id_mapel
             WHERE km3.id_kelas = k.id AND km3.id_guru = ?) AS mapel_diajar
    FROM kelas k
    JOIN periode p ON p.id = k.id_periode
    WHERE k.id_wali = ?
       OR EXISTS (SELECT 1 FROM kelas_mapel km WHERE km.id_kelas = k.id AND km.id_guru = ?)
    ORDER BY p.tahun_ajaran DESC, p.semester DESC, k.nama_kelas`,
  [gid, gid, gid, gid]);

  res.json(rows.map((r) => ({
    ...r,
    wali_kelas: !!r.wali_kelas,
    nama_semester: r.semester === 1 ? 'Ganjil' : 'Genap',
  })));
});

// GET /api/raport/kelas/:id  (guru & admin) -> raport sementara satu kelas
exports.raportKelas = asyncHandler(async (req, res) => {
  const idKelas = req.params.id;

  // Guru hanya boleh membuka kelas yang diajarnya atau yang diwalikannya.
  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    const [[boleh]] = await pool.query(`
      SELECT 1 AS ok FROM kelas k
      WHERE k.id = ? AND (k.id_wali = ?
        OR EXISTS (SELECT 1 FROM kelas_mapel km WHERE km.id_kelas = k.id AND km.id_guru = ?))`,
    [idKelas, gid, gid]);
    if (!boleh) {
      return res.status(403).json({ message: 'Bukan kelas yang Anda ajar maupun Anda walikan' });
    }
  }

  const data = await nilaiKelas(idKelas);
  if (!data) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  res.json(data);
});

// GET /api/raport/saya?id_periode=..  (siswa) -> raport dirinya sendiri
exports.raportSiswa = asyncHandler(async (req, res) => {
  const sid = await siswaIdOf(req.user.id);
  if (!sid) return res.json({ identitas: null, daftar_periode: [], kelas: null, mapel: [] });

  // Seluruh periode yang pernah diikuti siswa beserta kelasnya
  const [daftarPeriode] = await pool.query(`
    SELECT p.id AS id_periode, p.kode, p.tahun_ajaran, p.semester, p.status,
           k.id AS id_kelas, k.nama_kelas, k.tingkat
    FROM siswa_kelas sk
    JOIN kelas k ON k.id = sk.id_kelas
    JOIN periode p ON p.id = k.id_periode
    WHERE sk.id_siswa = ?
    ORDER BY p.tahun_ajaran DESC, p.semester DESC`, [sid]);

  const [[identitas]] = await pool.query(`
    SELECT u.nama, s.nis FROM siswa s JOIN users u ON u.id = s.id_user WHERE s.id = ?`, [sid]);

  const periodeRapor = daftarPeriode.map((p) => ({
    ...p, nama_semester: p.semester === 1 ? 'Ganjil' : 'Genap',
  }));

  const terpilih = req.query.id_periode
    ? periodeRapor.find((p) => String(p.id_periode) === String(req.query.id_periode))
    : (periodeRapor.find((p) => p.status === 'aktif') || periodeRapor[0]);

  if (!terpilih) {
    return res.json({
      identitas, daftar_periode: periodeRapor, kelas: null, mapel: [], ringkasan: null, kkm: KKM,
    });
  }

  const data = await nilaiKelas(terpilih.id_kelas);
  const saya = data.siswa.find((s) => s.id_siswa === sid);

  const mapel = data.mapel.map((m) => {
    const n = saya ? saya.nilai[m.id_kelas_mapel] : null;
    const rata = n ? n.rata_rata : null;
    return {
      ...m,
      jumlah_dinilai: n ? n.jumlah_dinilai : 0,
      rata_rata: rata,
      predikat: predikat(rata),
      tuntas: rata == null ? null : rata >= KKM,
    };
  });

  res.json({
    identitas,
    daftar_periode: periodeRapor,
    periode: terpilih,
    kelas: data.kelas,
    mapel,
    ringkasan: {
      rata_rata: saya ? saya.rata_rata : null,
      predikat: predikat(saya ? saya.rata_rata : null),
      peringkat: saya ? saya.peringkat : null,
      jumlah_siswa: data.siswa.length,
      jumlah_mapel: mapel.length,
      jumlah_mapel_dinilai: mapel.filter((m) => m.rata_rata != null).length,
      jumlah_mapel_tuntas: mapel.filter((m) => m.tuntas).length,
    },
    kkm: KKM,
  });
});
