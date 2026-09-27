// =====================================================================
// Seed data Sistem E-Learning SMA Negeri 1 Karau Kuala
// ---------------------------------------------------------------------
// Data guru, mata pelajaran, pembagian tugas mengajar, wali kelas, kelas,
// dan siswa diambil dari data resmi sekolah pada berkas
// src/db/data/sekolah.json yang dihasilkan oleh:
//     python scripts/impor-data-sekolah.py
// Sumber aslinya:
//   - SK Pembagian Tugas Mengajar & Tugas Tambahan TA 2025/2026
//   - Lampiran IV SK tentang Pembagian Tugas Wali Kelas
//   - Daftar Hadir Siswa TA 2025/2026
//
// Dua periode pembelajaran dibuat:
//   2026/1 (TA 2025/2026 Ganjil) -> TERKUNCI, sebagai arsip
//   2026/2 (TA 2025/2026 Genap)  -> AKTIF
//
// Materi, tugas, dan kuis contoh hanya dibuat pada beberapa kelas mata
// pelajaran di kelas X A sebagai bahan peragaan sistem. Data pengumpulan
// tugas dan nilai diisi lewat REST API oleh scripts/blackbox.js.
//
// Jalankan setelah db:init  ->  npm run db:seed
// =====================================================================
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const SEKOLAH = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'sekolah.json'), 'utf8'));

// ---------------------------------------------------------------------
// Berkas contoh untuk materi
// ---------------------------------------------------------------------
function buatPdfContoh(namaFile, baris) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const isi = baris
    .map((t, i) => `BT /F1 12 Tf 60 ${740 - i * 22} Td (${t.replace(/[()\\]/g, '')}) Tj ET`)
    .join('\n');
  const objek = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${isi.length} >>\nstream\n${isi}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offset = [];
  objek.forEach((o, i) => { offset.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const startxref = pdf.length;
  pdf += `xref\n0 ${objek.length + 1}\n0000000000 65535 f \n`;
  offset.forEach((o) => { pdf += `${String(o).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objek.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
  fs.writeFileSync(path.join(uploadDir, namaFile), pdf, 'latin1');
  return namaFile;
}

function salinAsetContoh(namaFile) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const sumber = path.join(__dirname, 'assets', namaFile);
  if (fs.existsSync(sumber)) fs.copyFileSync(sumber, path.join(uploadDir, namaFile));
  return namaFile;
}

function hari(selisih, jam = '23:59:00') {
  const d = new Date();
  d.setDate(d.getDate() + selisih);
  return `${d.toISOString().slice(0, 10)} ${jam}`;
}
function tanggal(selisih) {
  const d = new Date();
  d.setDate(d.getDate() + selisih);
  return d.toISOString().slice(0, 10);
}

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Menghapus data lama & memuat data SMA Negeri 1 Karau Kuala ...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['jawaban_siswa', 'soal', 'nilai', 'pengumpulan_tugas', 'forum_diskusi',
      'tugas', 'materi', 'pertemuan', 'kelas_mapel', 'siswa_kelas', 'mata_pelajaran',
      'siswa', 'guru', 'kelas', 'periode', 'users']) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Satu kali hash dipakai ulang agar proses seed tetap cepat
    const sandiAdmin = bcrypt.hashSync('admin123', 10);
    const sandiGuru = bcrypt.hashSync('guru123', 10);
    const sandiSiswa = bcrypt.hashSync('siswa123', 10);

    // =============================================================
    // Administrator
    // =============================================================
    const [admin] = await conn.query(
      "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'admin')",
      ['Administrator', 'admin@smakk.sch.id', sandiAdmin]);

    // =============================================================
    // Periode pembelajaran
    // =============================================================
    const [pGanjil] = await conn.query(`
      INSERT INTO periode (kode, tahun_ajaran, semester, tgl_mulai, tgl_selesai,
                           status, dikunci_oleh, tgl_dikunci)
      VALUES ('2026/1','2025/2026',1,'2025-07-14','2025-12-19','terkunci', ?, '2025-12-22 10:00:00')`,
      [admin.insertId]);
    const [pGenap] = await conn.query(`
      INSERT INTO periode (kode, tahun_ajaran, semester, tgl_mulai, tgl_selesai, status)
      VALUES ('2026/2','2025/2026',2,'2026-01-05','2026-06-19','aktif')`);
    const P_GANJIL = pGanjil.insertId;
    const P_GENAP = pGenap.insertId;

    // =============================================================
    // Guru (28 orang sesuai SK pembagian tugas)
    // =============================================================
    const guruId = {};          // email -> guru.id
    for (const g of SEKOLAH.guru) {
      const [u] = await conn.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'guru')",
        [g.nama, g.email, sandiGuru]);
      const [row] = await conn.query(
        'INSERT INTO guru (id_user, nip, alamat) VALUES (?,?,?)',
        [u.insertId, g.nip || null,
          [g.jabatan, g.tugas_tambahan].filter(Boolean).join(' · ') || null]);
      guruId[g.email] = row.insertId;
    }

    // =============================================================
    // Katalog mata pelajaran
    // =============================================================
    const mapelId = {};         // nama mapel -> mata_pelajaran.id
    for (const m of SEKOLAH.mata_pelajaran) {
      const [row] = await conn.query(
        'INSERT INTO mata_pelajaran (nama, kode, kelompok, deskripsi) VALUES (?,?,?,?)',
        [m.nama, m.kode, m.kelompok,
          `Mata pelajaran ${m.nama} kelompok ${m.kelompok} pada SMA Negeri 1 Karau Kuala`]);
      mapelId[m.nama] = row.insertId;
    }

    // =============================================================
    // Kelas pada kedua periode, lengkap dengan wali kelasnya
    // =============================================================
    const kelasId = { [P_GANJIL]: {}, [P_GENAP]: {} };
    for (const idPeriode of [P_GANJIL, P_GENAP]) {
      for (const k of SEKOLAH.kelas) {
        const [row] = await conn.query(
          'INSERT INTO kelas (id_periode, nama_kelas, tingkat, id_wali) VALUES (?,?,?,?)',
          [idPeriode, k.nama, k.tingkat, k.wali ? guruId[k.wali] : null]);
        kelasId[idPeriode][k.nama] = row.insertId;
      }
    }

    // =============================================================
    // Siswa beserta penempatan kelasnya pada kedua periode
    // =============================================================
    const siswaId = {};         // email -> siswa.id
    let jumlahSiswa = 0;
    for (const [namaKelas, daftar] of Object.entries(SEKOLAH.siswa)) {
      for (const s of daftar) {
        const [u] = await conn.query(
          "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'siswa')",
          [s.nama, s.email, sandiSiswa]);
        const [row] = await conn.query(
          'INSERT INTO siswa (id_user, nis, alamat) VALUES (?,?,?)',
          [u.insertId, s.nis || s.nisn || null, 'Kecamatan Karau Kuala, Barito Selatan']);
        siswaId[s.email] = row.insertId;
        jumlahSiswa += 1;
        // Siswa berada pada kelas yang sama sepanjang satu tahun ajaran
        for (const idPeriode of [P_GANJIL, P_GENAP]) {
          await conn.query('INSERT INTO siswa_kelas (id_siswa, id_kelas) VALUES (?,?)',
            [row.insertId, kelasId[idPeriode][namaKelas]]);
        }
      }
    }

    // =============================================================
    // Pembagian tugas mengajar (guru x mata pelajaran x kelas)
    // =============================================================
    const km = { [P_GANJIL]: {}, [P_GENAP]: {} };   // "Kelas|Mapel" -> kelas_mapel.id
    let jumlahAjar = 0;
    for (const g of SEKOLAH.guru) {
      for (const a of g.ajar) {
        for (const idPeriode of [P_GANJIL, P_GENAP]) {
          const kunci = `${a.kelas}|${a.mapel}`;
          if (km[idPeriode][kunci]) continue;      // satu mapel satu kali per kelas
          const [row] = await conn.query(
            'INSERT INTO kelas_mapel (id_kelas, id_mapel, id_guru) VALUES (?,?,?)',
            [kelasId[idPeriode][a.kelas], mapelId[a.mapel], guruId[g.email]]);
          km[idPeriode][kunci] = row.insertId;
          if (idPeriode === P_GENAP) jumlahAjar += 1;
        }
      }
    }

    // =============================================================
    // Bahan peragaan: pertemuan, materi, tugas, kuis, dan forum
    // pada beberapa mata pelajaran kelas X A
    // =============================================================
    const fileMtk = buatPdfContoh('modul_persamaan_linear.pdf', [
      'SMA NEGERI 1 KARAU KUALA', 'Modul Matematika Umum Kelas X',
      'Persamaan Linear Satu Variabel', '', 'A. Pengertian',
      'Persamaan linear satu variabel adalah persamaan yang',
      'memuat satu variabel berpangkat satu.', '',
      'B. Bentuk Umum', 'ax + b = 0, dengan a tidak sama dengan 0', '',
      'C. Contoh Soal', '1. Tentukan nilai x dari 2x + 6 = 14',
      '2. Tentukan himpunan penyelesaian 3x - 9 = 0',
    ]);
    const fileBind = buatPdfContoh('modul_teks_deskripsi.pdf', [
      'SMA NEGERI 1 KARAU KUALA', 'Modul Bahasa Indonesia Kelas X',
      'Teks Deskripsi', '', 'A. Pengertian',
      'Teks deskripsi adalah teks yang menggambarkan objek',
      'secara rinci sehingga pembaca seolah melihat sendiri.', '',
      'B. Struktur', '1. Identifikasi', '2. Deskripsi bagian', '3. Penutup / simpulan',
    ]);
    const fileFis = buatPdfContoh('modul_besaran_satuan.pdf', [
      'SMA NEGERI 1 KARAU KUALA', 'Modul Fisika Kelas X',
      'Besaran dan Satuan', '', 'A. Besaran Pokok',
      'Panjang, massa, waktu, suhu, kuat arus, intensitas cahaya,',
      'dan jumlah zat.', '', 'B. Besaran Turunan',
      'Luas, volume, kecepatan, percepatan, gaya, usaha, daya.',
    ]);

    async function buatPertemuan(idKm, nomor, judul, deskripsi, geser) {
      const [r] = await conn.query(
        'INSERT INTO pertemuan (id_kelas_mapel, nomor, judul, deskripsi, tanggal) VALUES (?,?,?,?,?)',
        [idKm, nomor, judul, deskripsi, tanggal(geser)]);
      return r.insertId;
    }
    async function buatMateri(idPertemuan, judul, konten, tipe, file, url) {
      await conn.query(
        'INSERT INTO materi (id_pertemuan, judul, konten, tipe, file, url) VALUES (?,?,?,?,?,?)',
        [idPertemuan, judul, konten, tipe, file || null, url || null]);
    }
    async function buatTugas(idPertemuan, judul, deskripsi, deadline, tipe) {
      const [r] = await conn.query(
        'INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?,?)',
        [idPertemuan, judul, deskripsi, deadline, tipe]);
      return r.insertId;
    }
    async function buatTopik(idPertemuan, emailGuru, judul, pesan) {
      const [[u]] = await conn.query('SELECT id FROM users WHERE email = ?', [emailGuru]);
      const [r] = await conn.query(
        'INSERT INTO forum_diskusi (id_pertemuan, id_user, judul, pesan) VALUES (?,?,?,?)',
        [idPertemuan, u.id, judul, pesan]);
      return r.insertId;
    }

    const G = km[P_GENAP];
    const kmMtk = G['X A|MATEMATIKA UMUM'];
    const kmBind = G['X A|BAHASA INDONESIA'];
    const kmFis = G['X A|FISIKA'];
    const kmBing = G['X A|BAHASA INGGRIS'];

    // ---------- Matematika Umum X A ----------
    const p1 = await buatPertemuan(kmMtk, 1, 'Konsep Persamaan Linear Satu Variabel',
      'Pengenalan bentuk umum persamaan linear satu variabel serta cara menentukan penyelesaiannya.', -21);
    await buatMateri(p1, 'Pengantar Persamaan Linear Satu Variabel',
      'Persamaan linear satu variabel adalah persamaan yang memuat tepat satu variabel berpangkat '
      + 'satu. Bentuk umumnya ax + b = 0 dengan a tidak sama dengan nol.', 'teks');
    await buatMateri(p1, 'Modul Persamaan Linear Satu Variabel (PDF)',
      'Modul lengkap beserta contoh soal dan pembahasan.', 'file', fileMtk);
    await buatMateri(p1, 'Video Pembelajaran Persamaan Linear Satu Variabel',
      'Rekaman penjelasan langkah penyelesaian persamaan linear satu variabel beserta contohnya.',
      'video', salinAsetContoh('video_persamaan_linear.webm'));
    await buatTugas(p1, 'Latihan Persamaan Linear',
      'Kerjakan soal nomor 1-10 pada buku paket halaman 25. Tulis langkah penyelesaian secara '
      + 'lengkap, lalu unggah dalam bentuk berkas atau tuliskan pada kolom jawaban.', hari(9), 'tugas');
    await buatTopik(p1, SEKOLAH.kelas.find((k) => k.nama === 'X A').wali
      ? 'halifah@smakk.sch.id' : 'halifah@smakk.sch.id',
      'Diskusi Pertemuan 1: Persamaan Linear',
      'Selamat pagi anak-anak. Silakan tuliskan di forum ini bagian materi persamaan linear satu '
      + 'variabel yang masih sulit dipahami, nanti Ibu bahas ulang pada pertemuan berikutnya.');

    const p2 = await buatPertemuan(kmMtk, 2, 'Pertidaksamaan Linear Satu Variabel',
      'Sifat-sifat pertidaksamaan linear dan penyajian himpunan penyelesaian pada garis bilangan.', -14);
    await buatMateri(p2, 'Sifat-Sifat Pertidaksamaan Linear',
      'Apabila kedua ruas dikalikan atau dibagi bilangan negatif, maka tanda pertidaksamaan '
      + 'berbalik arah.', 'teks');
    await buatTugas(p2, 'Kuis Persamaan dan Pertidaksamaan Linear',
      'Kuis pilihan ganda mengenai persamaan dan pertidaksamaan linear satu variabel. '
      + 'Dinilai otomatis oleh sistem.', hari(5), 'kuis');
    await buatTopik(p2, 'halifah@smakk.sch.id', 'Tanya Jawab Pertidaksamaan Linear',
      'Bagian mana dari sifat pertidaksamaan yang paling sering membuat kalian keliru? '
      + 'Silakan tanyakan di sini.');

    const p3 = await buatPertemuan(kmMtk, 3, 'Sistem Persamaan Linear Dua Variabel',
      'Penyelesaian SPLDV dengan metode substitusi, eliminasi, dan campuran.', -7);
    await buatMateri(p3, 'Metode Penyelesaian SPLDV',
      'SPLDV dapat diselesaikan dengan metode substitusi, eliminasi, campuran, maupun grafik.', 'teks');
    await buatMateri(p3, 'Video Pengayaan: Transformasi Linear dan Matriks',
      'Tautan video pengayaan mengenai hubungan sistem persamaan linear dengan matriks.',
      'link', null, 'https://www.youtube.com/watch?v=kYB8IZa5AuE');
    await buatTugas(p3, 'Tugas Proyek SPLDV',
      'Susunlah satu soal cerita yang dapat diselesaikan dengan SPLDV beserta penyelesaiannya, '
      + 'kemudian unggah dalam bentuk dokumen.', hari(2), 'tugas');

    // ---------- Bahasa Indonesia X A ----------
    const b1 = await buatPertemuan(kmBind, 1, 'Struktur dan Kaidah Teks Deskripsi',
      'Mengenal struktur teks deskripsi serta kaidah kebahasaan yang digunakan.', -20);
    await buatMateri(b1, 'Pengertian dan Struktur Teks Deskripsi',
      'Teks deskripsi menggambarkan objek secara rinci sehingga pembaca seolah-olah melihat '
      + 'sendiri objek yang digambarkan. Strukturnya terdiri atas identifikasi, deskripsi bagian, '
      + 'dan penutup.', 'teks');
    await buatMateri(b1, 'Modul Teks Deskripsi (PDF)',
      'Modul lengkap teks deskripsi beserta contoh.', 'file', fileBind);
    await buatTugas(b1, 'Tugas Menulis Teks Deskripsi',
      'Buatlah sebuah teks deskripsi bertema "Lingkungan Sekolahku" minimal tiga paragraf '
      + 'sesuai struktur yang telah dipelajari.', hari(7), 'tugas');
    await buatTopik(b1, 'asnin@smakk.sch.id', 'Tips Menulis Teks Deskripsi',
      'Anak-anak, dalam menulis teks deskripsi gunakan pancaindra kalian: apa yang dilihat, '
      + 'didengar, dan dirasakan. Silakan tanyakan di sini jika ada kesulitan.');

    const b2 = await buatPertemuan(kmBind, 2, 'Menelaah Teks Deskripsi',
      'Menelaah penggunaan kata konkret dan majas dalam teks deskripsi.', -13);
    await buatMateri(b2, 'Kata Konkret dan Majas dalam Teks Deskripsi',
      'Kata konkret membuat deskripsi terasa nyata, sedangkan majas membuat deskripsi menjadi '
      + 'lebih hidup.', 'teks');
    await buatTugas(b2, 'Kuis Teks Deskripsi',
      'Kuis singkat mengenai struktur teks deskripsi. Terdiri atas soal pilihan ganda dan satu '
      + 'soal esai.', hari(4), 'kuis');

    // ---------- Fisika X A ----------
    const f1 = await buatPertemuan(kmFis, 1, 'Besaran dan Satuan',
      'Besaran pokok, besaran turunan, dan satuan Sistem Internasional.', -19);
    await buatMateri(f1, 'Besaran Pokok dan Besaran Turunan',
      'Terdapat tujuh besaran pokok dalam Sistem Internasional. Besaran turunan diperoleh dari '
      + 'kombinasi besaran-besaran pokok tersebut.', 'teks');
    await buatMateri(f1, 'Modul Besaran dan Satuan (PDF)',
      'Modul besaran, satuan, dan angka penting.', 'file', fileFis);
    await buatTugas(f1, 'Latihan Soal Besaran dan Satuan',
      'Kerjakan latihan konversi satuan dan penulisan angka penting pada lembar kerja yang telah '
      + 'dibagikan.', hari(-3), 'tugas');
    await buatTopik(f1, 'samjuhdi@smakk.sch.id', 'Pengumpulan Latihan Besaran dan Satuan',
      'Batas waktu pengumpulan latihan soal besaran dan satuan sudah berakhir. Bagi yang belum '
      + 'mengumpulkan, silakan hubungi Bapak dan tetap unggah pekerjaan kalian melalui sistem.');

    const f2 = await buatPertemuan(kmFis, 2, 'Vektor dan Resultan Gaya',
      'Penjumlahan vektor dan penguraian vektor pada sumbu x dan y.', -12);
    await buatMateri(f2, 'Penjumlahan Vektor',
      'Vektor dapat dijumlahkan dengan metode segitiga, jajargenjang, maupun poligon.', 'teks');
    await buatMateri(f2, 'Video Pengayaan: Konsep Vektor',
      'Tautan video pengayaan mengenai konsep vektor dan penguraiannya.',
      'link', null, 'https://www.youtube.com/watch?v=fNk_zzaMoSs');

    // ---------- Bahasa Inggris X A ----------
    const e1 = await buatPertemuan(kmBing, 1, 'Descriptive Text',
      'Social function, generic structure, and language features.', -18);
    await buatMateri(e1, 'Generic Structure of Descriptive Text',
      'A descriptive text consists of identification and description. It commonly uses simple '
      + 'present tense.', 'teks');
    await buatTugas(e1, 'Kuis Descriptive Text',
      'Short quiz about the generic structure and language features of descriptive text.',
      hari(6), 'kuis');

    // ---------- Arsip periode ganjil (2026/1) ----------
    const kmMtkLama = km[P_GANJIL]['X A|MATEMATIKA UMUM'];
    const kmBindLama = km[P_GANJIL]['X A|BAHASA INDONESIA'];
    const lm1 = await buatPertemuan(kmMtkLama, 1, 'Barisan dan Deret Aritmetika',
      'Materi barisan dan deret aritmetika pada semester ganjil tahun ajaran 2025/2026.', -180);
    await buatMateri(lm1, 'Rumus Suku ke-n Barisan Aritmetika',
      'Suku ke-n barisan aritmetika dirumuskan Un = a + (n-1)b.', 'teks');
    const lmTugas = await buatTugas(lm1, 'Latihan Barisan Aritmetika',
      'Kerjakan soal barisan dan deret aritmetika nomor 1 sampai 10.', hari(-160), 'tugas');

    const lb1 = await buatPertemuan(kmBindLama, 1, 'Teks Negosiasi',
      'Struktur dan kaidah teks negosiasi.', -178);
    await buatMateri(lb1, 'Struktur Teks Negosiasi',
      'Teks negosiasi terdiri atas orientasi, pengajuan, penawaran, dan persetujuan.', 'teks');
    const lbTugas = await buatTugas(lb1, 'Tugas Menyusun Teks Negosiasi',
      'Susunlah sebuah teks negosiasi jual beli sesuai struktur yang telah dipelajari.',
      hari(-158), 'tugas');

    // Riwayat nilai pada periode terkunci. Data ini disisipkan langsung
    // karena periodenya sudah ditutup sehingga tidak dapat lagi diisi
    // melalui alur pengumpulan biasa.
    const siswaXA = SEKOLAH.siswa['X A'];
    const arsip = [
      [lmTugas, 0, 88, 'Pengerjaan runtut dan rumus digunakan dengan tepat.'],
      [lmTugas, 1, 76, 'Sudah benar, namun beberapa langkah masih dipersingkat.'],
      [lmTugas, 2, 92, 'Sangat baik, seluruh nomor dikerjakan dengan lengkap.'],
      [lbTugas, 0, 85, 'Struktur teks negosiasi sudah lengkap.'],
      [lbTugas, 1, 80, 'Bagian penawaran dapat dikembangkan lagi.'],
      [lbTugas, 2, 90, 'Dialog negosiasi tersusun sangat runtut.'],
    ];
    for (const [idTugas, idx, skor, catatan] of arsip) {
      const [pg] = await conn.query(
        `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, jawaban, tgl_kumpul, terlambat)
         VALUES (?,?,?,?,0)`,
        [idTugas, siswaId[siswaXA[idx].email],
          'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.',
          hari(-165, '10:00:00')]);
      await conn.query(
        'INSERT INTO nilai (id_kumpul, id_guru, skor, catatan, tgl_penilaian) VALUES (?,?,?,?,?)',
        [pg.insertId, idTugas === lmTugas ? guruId['halifah@smakk.sch.id'] : guruId['asnin@smakk.sch.id'],
          skor, catatan, hari(-160, '09:00:00')]);
    }

    // =============================================================
    // Butir soal untuk kuis
    // =============================================================
    const [tugasRows] = await conn.query(`
      SELECT t.id, t.judul FROM tugas t
      JOIN pertemuan pt ON pt.id = t.id_pertemuan
      JOIN kelas_mapel km2 ON km2.id = pt.id_kelas_mapel
      JOIN kelas k ON k.id = km2.id_kelas
      WHERE k.id_periode = ?`, [P_GENAP]);
    const idTugas = (judul) => tugasRows.find((t) => t.judul === judul).id;

    const soalData = {
      'Kuis Persamaan dan Pertidaksamaan Linear': [
        ['pilihan_ganda', 'Nilai x yang memenuhi persamaan 2x + 6 = 14 adalah ...', '2', '4', '6', '8', 'B', 20, 1],
        ['pilihan_ganda', 'Himpunan penyelesaian dari 3x - 9 = 0 adalah ...', '{2}', '{3}', '{4}', '{9}', 'B', 20, 2],
        ['pilihan_ganda', 'Bentuk umum persamaan linear satu variabel adalah ...',
          'ax + b = 0', 'ax2 + bx + c = 0', 'ax + by = c', 'a/x = b', 'A', 20, 3],
        ['pilihan_ganda', 'Penyelesaian pertidaksamaan 2x - 4 > 6 adalah ...',
          'x > 3', 'x > 5', 'x < 5', 'x < 3', 'B', 20, 4],
        ['pilihan_ganda', 'Jika 5x = 3x + 12, maka nilai x adalah ...', '3', '4', '6', '12', 'C', 20, 5],
      ],
      'Kuis Teks Deskripsi': [
        ['pilihan_ganda', 'Teks yang menggambarkan suatu objek secara rinci disebut teks ...',
          'Narasi', 'Deskripsi', 'Eksposisi', 'Persuasi', 'B', 25, 1],
        ['pilihan_ganda', 'Struktur teks deskripsi yang benar adalah ...',
          'Identifikasi - Deskripsi bagian - Penutup', 'Orientasi - Komplikasi - Resolusi',
          'Tesis - Argumen - Penegasan ulang', 'Pembuka - Isi - Salam penutup', 'A', 25, 2],
        ['pilihan_ganda', 'Kalimat berikut yang menggunakan kata konkret khas teks deskripsi adalah ...',
          'Sekolah itu bagus sekali.', 'Halaman sekolahku dipenuhi rumput hijau yang basah oleh embun pagi.',
          'Menurut saya sekolah perlu diperbaiki.', 'Pertama, kita bahas struktur teks.', 'B', 20, 3],
        ['esai', 'Buatlah satu paragraf teks deskripsi singkat tentang lingkungan sekolahmu, minimal tiga kalimat!',
          null, null, null, null, null, 30, 4],
      ],
      'Kuis Descriptive Text': [
        ['pilihan_ganda', 'The social function of a descriptive text is to ...',
          'entertain the readers with a story', 'describe a particular person, place, or thing',
          'persuade the readers to do something', 'explain how to make something', 'B', 25, 1],
        ['pilihan_ganda', 'The generic structure of a descriptive text consists of ...',
          'Orientation and Events', 'Identification and Description',
          'Thesis and Arguments', 'Goal and Steps', 'B', 25, 2],
        ['pilihan_ganda', 'Descriptive text mostly uses ... tense.',
          'simple present', 'simple past', 'present perfect', 'future', 'A', 25, 3],
        ['esai', 'Write a short descriptive paragraph about your classroom (at least three sentences).',
          null, null, null, null, null, 25, 4],
      ],
    };
    let totalSoal = 0;
    for (const [judul, butir] of Object.entries(soalData)) {
      for (const [tipe, q, a, b, c, d, benar, bobot, urut] of butir) {
        await conn.query(
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d,
                             jawaban_benar, bobot, urutan)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [idTugas(judul), q, tipe, a, b, c, d, benar, bobot, urut]);
        totalSoal += 1;
      }
    }

    // =============================================================
    // Ringkasan
    // =============================================================
    const hitung = async (t) => (await conn.query(`SELECT COUNT(*) n FROM ${t}`))[0][0].n;
    console.log('[OK] Data SMA Negeri 1 Karau Kuala berhasil dimuat.');
    console.log(`     sumber tugas mengajar : ${SEKOLAH.sumber.pembagian_tugas}`);
    console.log(`     sumber wali kelas     : ${SEKOLAH.sumber.wali_kelas}`);
    console.log(`     periode               : 2026/1 (terkunci) & 2026/2 (aktif)`);
    console.log(`     guru                  : ${SEKOLAH.guru.length}`);
    console.log(`     mata pelajaran        : ${SEKOLAH.mata_pelajaran.length}`);
    console.log(`     kelas                 : ${SEKOLAH.kelas.length} per periode (wali kelas terisi semua)`);
    console.log(`     siswa                 : ${jumlahSiswa}`);
    console.log(`     penugasan mengajar    : ${jumlahAjar} per periode`);
    console.log(`     pertemuan / materi    : ${await hitung('pertemuan')} / ${await hitung('materi')}`);
    console.log(`     tugas / butir soal    : ${await hitung('tugas')} / ${totalSoal}`);
    console.log('\nAkun untuk login:');
    console.log('  Admin : admin@smakk.sch.id / admin123');
    console.log(`  Guru  : ${SEKOLAH.guru.slice(0, 4).map((g) => g.email).join(', ')} / guru123`);
    console.log(`  Siswa : ${SEKOLAH.siswa['X A'].slice(0, 3).map((s) => s.email).join(', ')} / siswa123`);
    console.log('\nLangkah berikutnya: node scripts/blackbox.js  -> mengisi pengumpulan & nilai');
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Gagal seed:', err.message);
  process.exit(1);
});
