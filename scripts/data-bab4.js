/* =====================================================================
 * Pengambilan data pendukung BAB IV Hasil dan Pembahasan
 * ---------------------------------------------------------------------
 * Mengambil struktur tabel basis data hasil implementasi, jumlah record
 * pada setiap tabel, serta rekapitulasi nilai siswa langsung dari MySQL.
 *
 * Jalankan: node scripts/data-bab4.js
 * Keluaran: docs-bab4/data/struktur-basisdata.json
 *           docs-bab4/data/statistik-sistem.json
 * ===================================================================== */
const fs = require('fs');
const path = require('path');
const BACKEND_MODULES = path.join(__dirname, '..', 'backend', 'node_modules');
require(path.join(BACKEND_MODULES, 'dotenv'))
  .config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mysql = require(path.join(BACKEND_MODULES, 'mysql2', 'promise'));

const OUT = path.join(__dirname, '..', 'docs-bab4', 'data');

const DESKRIPSI_TABEL = {
  users: 'Menyimpan data akun seluruh pengguna sistem (administrator, guru, dan siswa)',
  periode: 'Menyimpan periode pembelajaran (tahun ajaran dan semester) beserta status penguncian',
  kelas: 'Menyimpan data rombongan belajar pada sebuah periode pembelajaran',
  guru: 'Menyimpan data detail profil guru yang berelasi dengan tabel users',
  siswa: 'Menyimpan data detail profil siswa yang berelasi dengan tabel users',
  siswa_kelas: 'Menyimpan keanggotaan siswa pada sebuah kelas di setiap periode',
  mata_pelajaran: 'Menyimpan katalog mata pelajaran sekolah',
  kelas_mapel: 'Menyimpan pengampuan, yaitu mata pelajaran pada sebuah kelas beserta guru pengampunya',
  pertemuan: 'Menyimpan urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran',
  materi: 'Menyimpan materi pembelajaran (teks, berkas, video, atau tautan) pada sebuah pertemuan',
  tugas: 'Menyimpan data tugas dan kuis beserta tipe dan batas waktunya',
  soal: 'Menyimpan butir soal pilihan ganda maupun esai pada sebuah kuis',
  pengumpulan_tugas: 'Menyimpan data pengumpulan jawaban tugas oleh siswa',
  jawaban_siswa: 'Menyimpan jawaban siswa pada setiap butir soal kuis',
  nilai: 'Menyimpan data nilai siswa hasil penilaian guru maupun koreksi otomatis',
  forum_diskusi: 'Menyimpan topik dan balasan forum diskusi pada sebuah pertemuan',
};

const KETERANGAN_KOLOM = {
  id: 'Kunci utama (primary key)',
  nama: 'Nama pengguna',
  email: 'Alamat surel yang digunakan untuk login',
  password: 'Kata sandi yang telah dienkripsi menggunakan bcrypt',
  role: 'Level hak akses pengguna (admin, guru, siswa)',
  foto: 'Nama berkas foto profil pengguna',
  aktif: 'Status keaktifan akun pengguna',
  created_at: 'Waktu pembuatan data',
  id_user: 'Kunci tamu ke tabel users',
  id_kelas: 'Kunci tamu ke tabel kelas',
  id_guru: 'Kunci tamu ke tabel guru',
  id_siswa: 'Kunci tamu ke tabel siswa',
  id_mapel: 'Kunci tamu ke tabel mata_pelajaran',
  id_tugas: 'Kunci tamu ke tabel tugas',
  id_soal: 'Kunci tamu ke tabel soal',
  id_kumpul: 'Kunci tamu ke tabel pengumpulan_tugas',
  id_pengumpulan: 'Kunci tamu ke tabel pengumpulan_tugas',
  id_parent: 'Kunci tamu ke pesan induk pada forum diskusi',
  id_periode: 'Kunci tamu ke tabel periode',
  id_kelas_mapel: 'Kunci tamu ke tabel kelas_mapel',
  id_pertemuan: 'Kunci tamu ke tabel pertemuan',
  kode: 'Kode periode (contoh 2026/1) atau kode mata pelajaran',
  semester: 'Semester pembelajaran (1 = ganjil, 2 = genap)',
  status: 'Status periode: draft, aktif, atau terkunci',
  dikunci_oleh: 'Administrator yang mengunci periode pembelajaran',
  tgl_dikunci: 'Waktu periode dikunci oleh administrator',
  tgl_mulai: 'Tanggal mulai periode pembelajaran',
  tgl_selesai: 'Tanggal berakhir periode pembelajaran',
  wali_kelas: 'Nama wali kelas',
  kelompok: 'Kelompok mata pelajaran (wajib, peminatan, muatan lokal)',
  nomor: 'Nomor urut pertemuan',
  tanggal: 'Tanggal pelaksanaan pertemuan',
  url: 'Tautan video atau sumber belajar daring',
  nip: 'Nomor Induk Pegawai guru',
  nis: 'Nomor Induk Siswa',
  mapel: 'Mata pelajaran yang diampu guru',
  tgl_lahir: 'Tanggal lahir',
  alamat: 'Alamat tempat tinggal',
  nama_kelas: 'Nama rombongan belajar',
  tingkat: 'Tingkat kelas (X, XI, XII)',
  tahun_ajaran: 'Tahun ajaran berjalan',
  kode: 'Kode mata pelajaran',
  deskripsi: 'Uraian singkat',
  judul: 'Judul materi, tugas, atau topik diskusi',
  konten: 'Isi atau uraian materi pembelajaran',
  file: 'Nama berkas lampiran yang diunggah',
  tgl_upload: 'Waktu materi diunggah',
  deadline: 'Batas waktu pengumpulan tugas',
  tipe: 'Jenis data (tugas/kuis atau pilihan ganda/esai)',
  pertanyaan: 'Teks pertanyaan butir soal',
  pilihan_a: 'Teks pilihan jawaban A',
  pilihan_b: 'Teks pilihan jawaban B',
  pilihan_c: 'Teks pilihan jawaban C',
  pilihan_d: 'Teks pilihan jawaban D',
  jawaban_benar: 'Kunci jawaban butir soal pilihan ganda',
  bobot: 'Bobot poin butir soal',
  urutan: 'Nomor urut butir soal',
  jawaban: 'Jawaban teks yang dikumpulkan siswa',
  tgl_kumpul: 'Waktu pengumpulan tugas',
  terlambat: 'Penanda pengumpulan melewati batas waktu',
  pilihan: 'Pilihan jawaban yang dipilih siswa',
  jawaban_teks: 'Jawaban esai siswa',
  benar: 'Hasil koreksi otomatis butir pilihan ganda',
  skor: 'Nilai yang diperoleh',
  catatan: 'Catatan atau umpan balik dari guru',
  tgl_penilaian: 'Waktu penilaian dilakukan',
  pesan: 'Isi pesan pada forum diskusi',
  tgl_post: 'Waktu pesan dikirim',
};

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_smakk',
  });

  const urutan = Object.keys(DESKRIPSI_TABEL);
  const struktur = [];
  const statistik = [];

  for (const tabel of urutan) {
    const [kolom] = await conn.query(`SHOW FULL COLUMNS FROM \`${tabel}\``);
    const [[{ jml }]] = await conn.query(`SELECT COUNT(*) jml FROM \`${tabel}\``);
    struktur.push({
      tabel,
      deskripsi: DESKRIPSI_TABEL[tabel],
      jumlah_record: jml,
      kolom: kolom.map((k) => ({
        nama: k.Field,
        tipe: k.Type,
        null: k.Null === 'YES' ? 'Ya' : 'Tidak',
        kunci: k.Key === 'PRI' ? 'Primary Key'
          : k.Key === 'MUL' ? 'Foreign Key'
            : k.Key === 'UNI' ? 'Unique' : '-',
        keterangan: KETERANGAN_KOLOM[k.Field] || '-',
      })),
    });
    statistik.push({ tabel, deskripsi: DESKRIPSI_TABEL[tabel], jumlah_record: jml });
  }

  // Rekapitulasi nilai seluruh siswa sebagai bukti keberjalanan modul penilaian
  const [rekap] = await conn.query(`
    SELECT u.nama AS siswa, k.nama_kelas AS kelas, per.kode AS periode,
           mp.nama AS mapel, pt.nomor AS pertemuan, t.judul AS tugas, t.tipe,
           n.skor, p.terlambat
    FROM pengumpulan_tugas p
    JOIN siswa s ON s.id = p.id_siswa
    JOIN users u ON u.id = s.id_user
    JOIN tugas t ON t.id = p.id_tugas
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode per ON per.id = k.id_periode
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    ORDER BY per.kode DESC, u.nama, mp.nama, pt.nomor
  `);

  const [ringkas] = await conn.query(`
    SELECT per.kode AS periode, mp.nama AS mapel, k.nama_kelas AS kelas,
           pt.nomor AS pertemuan, t.judul AS tugas, t.tipe,
           COUNT(p.id) AS jumlah_kumpul,
           SUM(CASE WHEN n.skor IS NOT NULL THEN 1 ELSE 0 END) AS sudah_dinilai,
           ROUND(AVG(n.skor), 2) AS rata_rata,
           MIN(n.skor) AS nilai_terendah, MAX(n.skor) AS nilai_tertinggi
    FROM tugas t
    JOIN pertemuan pt ON pt.id = t.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode per ON per.id = k.id_periode
    LEFT JOIN pengumpulan_tugas p ON p.id_tugas = t.id
    LEFT JOIN nilai n ON n.id_kumpul = p.id
    GROUP BY t.id ORDER BY per.kode DESC, mp.nama, k.nama_kelas, pt.nomor
  `);

  // Daftar periode pembelajaran beserta status penguncian
  const [periode] = await conn.query(`
    SELECT p.kode, p.tahun_ajaran, p.semester, p.status, p.tgl_mulai, p.tgl_selesai,
           u.nama AS dikunci_oleh, p.tgl_dikunci,
           (SELECT COUNT(*) FROM kelas k WHERE k.id_periode = p.id) AS jumlah_kelas
    FROM periode p LEFT JOIN users u ON u.id = p.dikunci_oleh
    ORDER BY p.kode DESC`);

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'struktur-basisdata.json'),
    JSON.stringify(struktur, null, 2), 'utf8');
  fs.writeFileSync(path.join(OUT, 'statistik-sistem.json'),
    JSON.stringify({ statistik, periode, rekap_nilai: rekap, ringkasan_tugas: ringkas },
      null, 2), 'utf8');

  console.log(`[OK] ${struktur.length} tabel didokumentasikan`);
  console.log(`[OK] ${rekap.length} baris rekap nilai, ${ringkas.length} baris ringkasan tugas`);
  console.log(`Disimpan di ${OUT}`);
  await conn.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
