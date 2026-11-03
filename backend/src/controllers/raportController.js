const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { siswaIdOf } = require('../utils/akses');
const { KKM, predikat, ketuntasan, hitungNilaiAkhir, bulat } = require('../utils/penilaian');

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
             WHERE pt.id_kelas_mapel = km.id) AS jumlah_penilaian,
           (SELECT COALESCE(SUM(t.bobot), 0) FROM pertemuan pt JOIN tugas t ON t.id_pertemuan = pt.id
             WHERE pt.id_kelas_mapel = km.id) AS total_bobot
    FROM kelas_mapel km
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    LEFT JOIN guru g ON g.id = km.id_guru
    LEFT JOIN users ug ON ug.id = g.id_user
    WHERE km.id_kelas = ?
    ORDER BY mp.kelompok, mp.nama`, [idKelas]);

  // Rincian tiap penilaian diambil apa adanya, bukan dirata-ratakan di
  // basis data, karena nilai akhir dihitung menurut bobot masing-masing.
  const [baris] = await pool.query(`
    SELECT s.id AS id_siswa, u.nama, s.nis, km.id AS id_kelas_mapel,
           t.id AS id_tugas, t.tipe, t.bobot, n.skor
    FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    JOIN kelas_mapel km ON km.id_kelas = sk.id_kelas
    LEFT JOIN pertemuan pt ON pt.id_kelas_mapel = km.id
    LEFT JOIN tugas t ON t.id_pertemuan = pt.id
    LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id AND pg.id_siswa = s.id
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE sk.id_kelas = ?
    ORDER BY u.nama`, [idKelas]);

  const peta = new Map();
  for (const b of baris) {
    if (!peta.has(b.id_siswa)) {
      peta.set(b.id_siswa, {
        id_siswa: b.id_siswa, nama: b.nama, nis: b.nis, rincian: new Map(),
      });
    }
    const s = peta.get(b.id_siswa);
    if (!s.rincian.has(b.id_kelas_mapel)) s.rincian.set(b.id_kelas_mapel, []);
    if (b.id_tugas) {
      s.rincian.get(b.id_kelas_mapel).push({ skor: b.skor, bobot: b.bobot, tipe: b.tipe });
    }
  }

  const siswa = [...peta.values()].map((s) => {
    const nilai = {};
    for (const m of mapel) {
      const daftar = s.rincian.get(m.id_kelas_mapel) || [];
      nilai[m.id_kelas_mapel] = hitungNilaiAkhir(daftar);
    }
    // Nilai akhir seluruh mata pelajaran dirangkum menjadi satu angka
    // dengan memberi bobot sama pada setiap mata pelajaran yang sudah
    // memiliki nilai.
    const angka = Object.values(nilai).map((v) => v.nilai_akhir).filter((v) => v != null);
    const keseluruhan = angka.length
      ? bulat(angka.reduce((a, b) => a + b, 0) / angka.length) : null;
    return {
      id_siswa: s.id_siswa, nama: s.nama, nis: s.nis, nilai,
      jumlah_mapel_dinilai: angka.length,
      jumlah_mapel_tuntas: angka.filter((v) => v >= KKM).length,
      nilai_akhir: keseluruhan,
      predikat: predikat(keseluruhan),
      ketuntasan: ketuntasan(keseluruhan),
    };
  });

  // Peringkat hanya diberikan kepada siswa yang sudah memiliki nilai.
  [...siswa].filter((s) => s.nilai_akhir != null)
    .sort((a, b) => b.nilai_akhir - a.nilai_akhir)
    .forEach((s, i) => { s.peringkat = i + 1; });
  siswa.forEach((s) => { if (s.nilai_akhir == null) s.peringkat = null; });

  return { kelas, mapel, siswa, kkm: KKM };
}

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
    return {
      ...m,
      jumlah_dinilai: n ? n.jumlah_dinilai : 0,
      jumlah_penilaian: Number(m.jumlah_penilaian || 0),
      total_bobot: bulat(m.total_bobot),
      bobot_dinilai: n ? n.bobot_dinilai : 0,
      berbobot: n ? n.berbobot : false,
      nilai_akhir: n ? n.nilai_akhir : null,
      predikat: n ? n.predikat : predikat(null),
      ketuntasan: n ? n.ketuntasan : ketuntasan(null),
    };
  });

  const nilaiKeseluruhan = saya ? saya.nilai_akhir : null;

  res.json({
    identitas,
    daftar_periode: periodeRapor,
    periode: terpilih,
    kelas: data.kelas,
    mapel,
    ringkasan: {
      nilai_akhir: nilaiKeseluruhan,
      predikat: predikat(nilaiKeseluruhan),
      ketuntasan: ketuntasan(nilaiKeseluruhan),
      peringkat: saya ? saya.peringkat : null,
      jumlah_siswa: data.siswa.length,
      jumlah_mapel: mapel.length,
      jumlah_mapel_dinilai: mapel.filter((m) => m.nilai_akhir != null).length,
      jumlah_mapel_tuntas: mapel.filter((m) => m.ketuntasan.tuntas).length,
      jumlah_mapel_belum_tuntas: mapel.filter((m) => m.ketuntasan.tuntas === false).length,
    },
    kkm: KKM,
  });
});
