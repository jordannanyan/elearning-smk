// =====================================================================
// Seed data contoh Sistem E-Learning SMA Negeri 1 Karau Kuala
// ---------------------------------------------------------------------
// Mengisi dua periode pembelajaran:
//   2026/1 (Tahun Ajaran 2025/2026 Ganjil) -> status AKTIF
//   2025/2 (Tahun Ajaran 2024/2025 Genap)  -> status TERKUNCI (arsip)
// beserta katalog 27 mata pelajaran SMA, kelas, pengampuan, pertemuan,
// materi (teks/file/video/link), tugas, dan kuis.
//
// Data pengumpulan tugas, jawaban kuis, dan nilai TIDAK diisi di sini —
// data tersebut dibuat lewat REST API oleh scripts/blackbox.js agar
// melewati alur nyata sistem.
// =====================================================================
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Membuat file PDF sederhana (valid) sebagai contoh lampiran materi
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
  objek.forEach((o, i) => {
    offset.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const startxref = pdf.length;
  pdf += `xref\n0 ${objek.length + 1}\n0000000000 65535 f \n`;
  offset.forEach((o) => { pdf += `${String(o).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objek.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
  fs.writeFileSync(path.join(uploadDir, namaFile), pdf, 'latin1');
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
    console.log('Menghapus data lama & mengisi data contoh ...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['jawaban_siswa', 'soal', 'nilai', 'pengumpulan_tugas', 'forum_diskusi',
      'tugas', 'materi', 'pertemuan', 'kelas_mapel', 'siswa_kelas', 'mata_pelajaran',
      'siswa', 'guru', 'kelas', 'periode', 'users']) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    const hash = (p) => bcrypt.hashSync(p, 10);

    // =============================================================
    // Admin
    // =============================================================
    const [admin] = await conn.query(
      "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'admin')",
      ['Administrator', 'admin@smakk.sch.id', hash('admin123')]
    );

    // =============================================================
    // Periode pembelajaran
    // =============================================================
    const [periodeLama] = await conn.query(`
      INSERT INTO periode (kode, tahun_ajaran, semester, tgl_mulai, tgl_selesai, status, dikunci_oleh, tgl_dikunci)
      VALUES ('2025/2','2024/2025',2,'2025-01-06','2025-06-20','terkunci', ?, '2025-06-25 10:00:00')`,
      [admin.insertId]);
    const [periodeAktif] = await conn.query(`
      INSERT INTO periode (kode, tahun_ajaran, semester, tgl_mulai, tgl_selesai, status)
      VALUES ('2026/1','2025/2026',1,'2025-07-14','2025-12-19','aktif')`);
    const P_LAMA = periodeLama.insertId;
    const P_AKTIF = periodeAktif.insertId;

    // =============================================================
    // Guru
    // =============================================================
    const guruData = [
      ['Budi Santoso, S.Pd', 'budi@smakk.sch.id', '198501012010011001', '1985-01-01', 'Jl. Pahlawan No. 12, Bangkuang'],
      ['Siti Aminah, S.Pd', 'siti@smakk.sch.id', '198703152011012002', '1987-03-15', 'Jl. Merdeka No. 5, Bangkuang'],
      ['Rahmat Hidayat, S.Pd', 'rahmat@smakk.sch.id', '199002202015031003', '1990-02-20', 'Jl. Bhayangkara No. 8, Bangkuang'],
      ['Dina Marlina, S.Pd', 'dina@smakk.sch.id', '199105102016042004', '1991-05-10', 'Jl. Sudirman No. 21, Bangkuang'],
      ['Hendra Wijaya, S.Pd', 'hendra@smakk.sch.id', '199304182018011005', '1993-04-18', 'Jl. Diponegoro No. 3, Bangkuang'],
      ['Lestari Ningsih, S.Pd', 'lestari@smakk.sch.id', '199208232017042006', '1992-08-23', 'Jl. Kartini No. 17, Bangkuang'],
    ];
    const guruIds = [];
    for (const [nama, email, nip, tgl, alamat] of guruData) {
      const [u] = await conn.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'guru')",
        [nama, email, hash('guru123')]);
      const [g] = await conn.query(
        'INSERT INTO guru (id_user, nip, tgl_lahir, alamat) VALUES (?,?,?,?)',
        [u.insertId, nip, tgl, alamat]);
      guruIds.push(g.insertId);
    }
    const [G_BUDI, G_SITI, G_RAHMAT, G_DINA, G_HENDRA, G_LESTARI] = guruIds;

    // =============================================================
    // Katalog 27 mata pelajaran SMA
    // =============================================================
    const mapelData = [
      ['Pendidikan Agama dan Budi Pekerti', 'PABP', 'Wajib'],
      ['Pendidikan Pancasila dan Kewarganegaraan', 'PPKN', 'Wajib'],
      ['Bahasa Indonesia', 'BIND', 'Wajib'],
      ['Matematika Wajib', 'MTK-W', 'Wajib'],
      ['Sejarah Indonesia', 'SEJ-IND', 'Wajib'],
      ['Bahasa Inggris', 'BING', 'Wajib'],
      ['Seni Budaya', 'SENBUD', 'Wajib'],
      ['Pendidikan Jasmani, Olahraga, dan Kesehatan', 'PJOK', 'Wajib'],
      ['Prakarya dan Kewirausahaan', 'PKWU', 'Wajib'],
      ['Informatika', 'INFO', 'Wajib'],
      ['Matematika Peminatan', 'MTK-P', 'Peminatan MIPA'],
      ['Fisika', 'FIS', 'Peminatan MIPA'],
      ['Kimia', 'KIM', 'Peminatan MIPA'],
      ['Biologi', 'BIO', 'Peminatan MIPA'],
      ['Geografi', 'GEO', 'Peminatan IPS'],
      ['Sejarah Peminatan', 'SEJ-P', 'Peminatan IPS'],
      ['Sosiologi', 'SOS', 'Peminatan IPS'],
      ['Ekonomi', 'EKO', 'Peminatan IPS'],
      ['Antropologi', 'ANT', 'Peminatan IPS'],
      ['Bahasa dan Sastra Indonesia', 'BSI', 'Peminatan Bahasa'],
      ['Bahasa dan Sastra Inggris', 'BSING', 'Peminatan Bahasa'],
      ['Bahasa Arab', 'BARAB', 'Peminatan Bahasa'],
      ['Bahasa Mandarin', 'BMAND', 'Peminatan Bahasa'],
      ['Bahasa Jepang', 'BJEP', 'Peminatan Bahasa'],
      ['Bahasa Dayak Ngaju', 'BDN', 'Muatan Lokal'],
      ['Pendidikan Lingkungan Hidup', 'PLH', 'Muatan Lokal'],
      ['Bimbingan dan Konseling', 'BK', 'Muatan Lokal'],
    ];
    const mapel = {};
    for (const [nama, kode, kelompok] of mapelData) {
      const [m] = await conn.query(
        'INSERT INTO mata_pelajaran (nama, kode, kelompok, deskripsi) VALUES (?,?,?,?)',
        [nama, kode, kelompok, `Mata pelajaran ${nama} pada kurikulum SMA`]);
      mapel[kode] = m.insertId;
    }

    // =============================================================
    // Kelas pada tiap periode
    // =============================================================
    async function buatKelas(idPeriode, daftar) {
      const hasil = {};
      for (const [nama, tingkat, wali] of daftar) {
        const [k] = await conn.query(
          'INSERT INTO kelas (id_periode, nama_kelas, tingkat, wali_kelas) VALUES (?,?,?,?)',
          [idPeriode, nama, tingkat, wali]);
        hasil[nama] = k.insertId;
      }
      return hasil;
    }
    const kelasAktif = await buatKelas(P_AKTIF, [
      ['X MIPA 1', 'X', 'Budi Santoso, S.Pd'],
      ['X MIPA 2', 'X', 'Siti Aminah, S.Pd'],
      ['XI MIPA 1', 'XI', 'Rahmat Hidayat, S.Pd'],
      ['XI IPS 1', 'XI', 'Dina Marlina, S.Pd'],
      ['XII MIPA 1', 'XII', 'Hendra Wijaya, S.Pd'],
    ]);
    const kelasLama = await buatKelas(P_LAMA, [
      ['X MIPA 1', 'X', 'Budi Santoso, S.Pd'],
      ['XI MIPA 1', 'XI', 'Rahmat Hidayat, S.Pd'],
    ]);

    // =============================================================
    // Siswa
    // =============================================================
    const siswaData = [
      ['Ahmad Fauzi', 'ahmad', '0012345678', 'X MIPA 1', '2009-04-11'],
      ['Dewi Lestari', 'dewi', '0012345679', 'X MIPA 1', '2009-06-23'],
      ['Rian Pratama', 'rian', '0012345680', 'X MIPA 1', '2009-02-14'],
      ['Nur Aisyah', 'aisyah', '0012345681', 'X MIPA 1', '2009-09-30'],
      ['Bayu Saputra', 'bayu', '0012345682', 'X MIPA 1', '2009-11-02'],
      ['Putri Rahmawati', 'putri', '0012345683', 'X MIPA 1', '2009-01-19'],
      ['Fajar Ramadhan', 'fajar', '0012345684', 'X MIPA 2', '2009-03-27'],
      ['Salsabila Azzahra', 'salsa', '0012345685', 'X MIPA 2', '2009-07-08'],
      ['Andi Setiawan', 'andi', '0012345686', 'X MIPA 2', '2009-10-16'],
      ['Maya Anggraini', 'maya', '0012345687', 'XI MIPA 1', '2008-05-05'],
      ['Rizky Alamsyah', 'rizky', '0012345688', 'XI MIPA 1', '2008-08-21'],
      ['Intan Permata', 'intan', '0012345689', 'XI MIPA 1', '2008-12-12'],
      ['Galih Nugroho', 'galih', '0012345690', 'XI IPS 1', '2008-06-09'],
      ['Winda Oktaviani', 'winda', '0012345691', 'XI IPS 1', '2008-10-25'],
      ['Teguh Prasetyo', 'teguh', '0012345692', 'XII MIPA 1', '2007-07-17'],
    ];
    const siswaIds = {};
    for (const [nama, akun, nis, kls, tgl] of siswaData) {
      const [u] = await conn.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'siswa')",
        [nama, `${akun}@siswa.smakk.sch.id`, hash('siswa123')]);
      const [s] = await conn.query(
        'INSERT INTO siswa (id_user, nis, tgl_lahir, alamat) VALUES (?,?,?,?)',
        [u.insertId, nis, tgl, 'Kecamatan Karau Kuala, Barito Selatan']);
      siswaIds[akun] = s.insertId;
      await conn.query('INSERT INTO siswa_kelas (id_siswa, id_kelas) VALUES (?,?)',
        [s.insertId, kelasAktif[kls]]);
    }

    // Riwayat periode lalu: siswa kelas XI sekarang dulunya kelas X
    for (const akun of ['maya', 'rizky', 'intan']) {
      await conn.query('INSERT INTO siswa_kelas (id_siswa, id_kelas) VALUES (?,?)',
        [siswaIds[akun], kelasLama['X MIPA 1']]);
    }

    // =============================================================
    // Pengampuan (kelas_mapel)
    //   Perhatikan Bahasa Indonesia diampu Siti di kelas X dan
    //   Lestari di kelas XI -> satu mapel, guru berbeda per tingkat.
    // =============================================================
    const km = {};
    async function ampu(namaKunci, kelasId, kodeMapel, guruId) {
      const [r] = await conn.query(
        'INSERT INTO kelas_mapel (id_kelas, id_mapel, id_guru) VALUES (?,?,?)',
        [kelasId, mapel[kodeMapel], guruId]);
      km[namaKunci] = r.insertId;
      return r.insertId;
    }

    // Periode aktif
    await ampu('X1_MTK', kelasAktif['X MIPA 1'], 'MTK-W', G_BUDI);
    await ampu('X1_BIND', kelasAktif['X MIPA 1'], 'BIND', G_SITI);
    await ampu('X1_FIS', kelasAktif['X MIPA 1'], 'FIS', G_RAHMAT);
    await ampu('X1_BING', kelasAktif['X MIPA 1'], 'BING', G_DINA);
    await ampu('X1_KIM', kelasAktif['X MIPA 1'], 'KIM', G_HENDRA);
    await ampu('X1_INFO', kelasAktif['X MIPA 1'], 'INFO', G_HENDRA);

    await ampu('X2_MTK', kelasAktif['X MIPA 2'], 'MTK-W', G_BUDI);
    await ampu('X2_BIND', kelasAktif['X MIPA 2'], 'BIND', G_SITI);
    await ampu('X2_FIS', kelasAktif['X MIPA 2'], 'FIS', G_RAHMAT);

    await ampu('XI1_MTKP', kelasAktif['XI MIPA 1'], 'MTK-P', G_BUDI);
    await ampu('XI1_BIND', kelasAktif['XI MIPA 1'], 'BIND', G_LESTARI); // guru berbeda
    await ampu('XI1_BIO', kelasAktif['XI MIPA 1'], 'BIO', G_RAHMAT);

    await ampu('XIIPS_EKO', kelasAktif['XI IPS 1'], 'EKO', G_LESTARI);
    await ampu('XIIPS_BIND', kelasAktif['XI IPS 1'], 'BIND', G_LESTARI);

    await ampu('XII1_MTK', kelasAktif['XII MIPA 1'], 'MTK-W', G_BUDI);

    // Periode terkunci (arsip)
    await ampu('LAMA_X1_MTK', kelasLama['X MIPA 1'], 'MTK-W', G_BUDI);
    await ampu('LAMA_X1_BIND', kelasLama['X MIPA 1'], 'BIND', G_SITI);

    // =============================================================
    // Pertemuan + materi + tugas
    // =============================================================
    const fileMtk = buatPdfContoh('modul_persamaan_linear.pdf', [
      'SMA NEGERI 1 KARAU KUALA', 'Modul Matematika Wajib Kelas X',
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

    const pertemuanIds = {};
    async function buatPertemuan(kunci, idKm, nomor, judul, deskripsi, geser) {
      const [r] = await conn.query(
        'INSERT INTO pertemuan (id_kelas_mapel, nomor, judul, deskripsi, tanggal) VALUES (?,?,?,?,?)',
        [idKm, nomor, judul, deskripsi, tanggal(geser)]);
      pertemuanIds[kunci] = r.insertId;
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
    async function buatTopik(idPertemuan, idUser, judul, pesan) {
      const [r] = await conn.query(
        'INSERT INTO forum_diskusi (id_pertemuan, id_user, judul, pesan) VALUES (?,?,?,?)',
        [idPertemuan, idUser, judul, pesan]);
      return r.insertId;
    }
    const [userGuru] = await conn.query("SELECT id, nama FROM users WHERE role='guru'");
    const idUserGuru = (nama) => userGuru.find((u) => u.nama.startsWith(nama)).id;

    // ---------- Matematika Wajib X MIPA 1 ----------
    const p1 = await buatPertemuan('MTK_P1', km.X1_MTK, 1,
      'Konsep Persamaan Linear Satu Variabel',
      'Pengenalan bentuk umum persamaan linear satu variabel serta cara menentukan penyelesaiannya.', -21);
    await buatMateri(p1, 'Pengantar Persamaan Linear Satu Variabel',
      'Persamaan linear satu variabel adalah persamaan yang memuat tepat satu variabel berpangkat satu. '
      + 'Bentuk umumnya ax + b = 0 dengan a tidak sama dengan nol.', 'teks');
    await buatMateri(p1, 'Modul Persamaan Linear Satu Variabel (PDF)',
      'Modul lengkap beserta contoh soal dan pembahasan.', 'file', fileMtk);
    await buatMateri(p1, 'Video Pembahasan Persamaan Linear',
      'Video penjelasan langkah penyelesaian persamaan linear satu variabel.',
      'link', null, 'https://www.youtube.com/watch?v=aQ0hzJfy5hI');
    await buatTugas(p1, 'Latihan Persamaan Linear',
      'Kerjakan soal nomor 1-10 pada buku paket halaman 25. Tulis langkah penyelesaian secara lengkap, '
      + 'lalu unggah dalam bentuk file atau tuliskan pada kolom jawaban.', hari(9), 'tugas');
    await buatTopik(p1, idUserGuru('Budi'), 'Diskusi Pertemuan 1: Persamaan Linear',
      'Selamat pagi anak-anak. Silakan tuliskan di forum ini bagian materi persamaan linear satu variabel '
      + 'yang masih sulit dipahami, nanti Bapak bahas ulang pada pertemuan berikutnya.');

    const p2 = await buatPertemuan('MTK_P2', km.X1_MTK, 2,
      'Pertidaksamaan Linear Satu Variabel',
      'Sifat-sifat pertidaksamaan linear dan penyajian himpunan penyelesaian pada garis bilangan.', -14);
    await buatMateri(p2, 'Sifat-Sifat Pertidaksamaan Linear',
      'Apabila kedua ruas dikalikan atau dibagi bilangan negatif, maka tanda pertidaksamaan berbalik arah.', 'teks');
    await buatTugas(p2, 'Kuis Persamaan dan Pertidaksamaan Linear',
      'Kuis pilihan ganda mengenai persamaan dan pertidaksamaan linear satu variabel. '
      + 'Dinilai otomatis oleh sistem.', hari(5), 'kuis');
    await buatTopik(p2, idUserGuru('Budi'), 'Tanya Jawab Pertidaksamaan Linear',
      'Bagian mana dari sifat pertidaksamaan yang paling sering membuat kalian keliru? Silakan tanyakan di sini.');

    const p3 = await buatPertemuan('MTK_P3', km.X1_MTK, 3,
      'Sistem Persamaan Linear Dua Variabel',
      'Penyelesaian SPLDV dengan metode substitusi, eliminasi, dan campuran.', -7);
    await buatMateri(p3, 'Metode Penyelesaian SPLDV',
      'SPLDV dapat diselesaikan dengan metode substitusi, eliminasi, campuran, maupun grafik. '
      + 'Pemilihan metode disesuaikan dengan bentuk persamaannya.', 'teks');
    await buatMateri(p3, 'Video Metode Eliminasi dan Substitusi',
      'Tautan video pembelajaran mengenai metode eliminasi dan substitusi pada SPLDV.',
      'link', null, 'https://www.youtube.com/watch?v=3fRiC5tAcdU');
    await buatTugas(p3, 'Tugas Proyek SPLDV',
      'Susunlah satu soal cerita yang dapat diselesaikan dengan SPLDV beserta penyelesaiannya, '
      + 'kemudian unggah dalam bentuk dokumen.', hari(2), 'tugas');

    // ---------- Bahasa Indonesia X MIPA 1 ----------
    const b1 = await buatPertemuan('BIND_P1', km.X1_BIND, 1,
      'Struktur dan Kaidah Teks Deskripsi',
      'Mengenal struktur teks deskripsi serta kaidah kebahasaan yang digunakan.', -20);
    await buatMateri(b1, 'Pengertian dan Struktur Teks Deskripsi',
      'Teks deskripsi menggambarkan objek secara rinci sehingga pembaca seolah-olah melihat sendiri objek '
      + 'yang digambarkan. Strukturnya terdiri atas identifikasi, deskripsi bagian, dan penutup.', 'teks');
    await buatMateri(b1, 'Modul Teks Deskripsi (PDF)',
      'Modul lengkap teks deskripsi beserta contoh.', 'file', fileBind);
    await buatTugas(b1, 'Tugas Menulis Teks Deskripsi',
      'Buatlah sebuah teks deskripsi bertema "Lingkungan Sekolahku" minimal tiga paragraf '
      + 'sesuai struktur yang telah dipelajari.', hari(7), 'tugas');
    await buatTopik(b1, idUserGuru('Siti'), 'Tips Menulis Teks Deskripsi',
      'Anak-anak, dalam menulis teks deskripsi gunakan pancaindra kalian: apa yang dilihat, didengar, '
      + 'dan dirasakan. Silakan tanyakan di sini jika ada kesulitan pada tugas menulis teks deskripsi.');

    const b2 = await buatPertemuan('BIND_P2', km.X1_BIND, 2,
      'Menelaah Teks Deskripsi',
      'Menelaah penggunaan kata konkret dan majas dalam teks deskripsi.', -13);
    await buatMateri(b2, 'Kata Konkret dan Majas dalam Teks Deskripsi',
      'Kata konkret membuat deskripsi terasa nyata, sedangkan majas membuat deskripsi menjadi lebih hidup.', 'teks');
    await buatTugas(b2, 'Kuis Teks Deskripsi',
      'Kuis singkat mengenai struktur teks deskripsi. Terdiri atas soal pilihan ganda dan satu soal esai.',
      hari(4), 'kuis');

    const b3 = await buatPertemuan('BIND_P3', km.X1_BIND, 3,
      'Teks Eksposisi', 'Pengertian, struktur, dan ciri kebahasaan teks eksposisi.', -6);
    await buatMateri(b3, 'Struktur Teks Eksposisi',
      'Teks eksposisi tersusun atas tesis, rangkaian argumen, dan penegasan ulang.', 'teks');

    // ---------- Fisika X MIPA 1 ----------
    const f1 = await buatPertemuan('FIS_P1', km.X1_FIS, 1,
      'Besaran dan Satuan', 'Besaran pokok, besaran turunan, dan satuan Sistem Internasional.', -19);
    await buatMateri(f1, 'Besaran Pokok dan Besaran Turunan',
      'Terdapat tujuh besaran pokok dalam Sistem Internasional. Besaran turunan diperoleh dari '
      + 'kombinasi besaran-besaran pokok tersebut.', 'teks');
    await buatMateri(f1, 'Modul Besaran dan Satuan (PDF)',
      'Modul besaran, satuan, dan angka penting.', 'file', fileFis);
    await buatTugas(f1, 'Latihan Soal Besaran dan Satuan',
      'Kerjakan latihan konversi satuan dan penulisan angka penting pada lembar kerja yang telah dibagikan.',
      hari(-3), 'tugas');
    await buatTopik(f1, idUserGuru('Rahmat'), 'Pengumpulan Latihan Besaran dan Satuan',
      'Batas waktu pengumpulan latihan soal besaran dan satuan sudah berakhir. Bagi yang belum '
      + 'mengumpulkan, silakan hubungi Bapak dan tetap unggah pekerjaan kalian melalui sistem.');

    const f2 = await buatPertemuan('FIS_P2', km.X1_FIS, 2,
      'Vektor dan Resultan Gaya', 'Penjumlahan vektor dan penguraian vektor pada sumbu x dan y.', -12);
    await buatMateri(f2, 'Penjumlahan Vektor',
      'Vektor dapat dijumlahkan dengan metode segitiga, jajargenjang, maupun poligon.', 'teks');
    await buatMateri(f2, 'Video Penguraian Vektor',
      'Video penjelasan penguraian vektor pada sumbu x dan y.',
      'link', null, 'https://www.youtube.com/watch?v=4xPqWPtHnMo');

    // ---------- Bahasa Inggris X MIPA 1 ----------
    const e1 = await buatPertemuan('BING_P1', km.X1_BING, 1,
      'Descriptive Text', 'Social function, generic structure, and language features.', -18);
    await buatMateri(e1, 'Generic Structure of Descriptive Text',
      'A descriptive text consists of identification and description. It commonly uses simple present tense.', 'teks');
    await buatTugas(e1, 'Kuis Descriptive Text',
      'Short quiz about the generic structure and language features of descriptive text.', hari(6), 'kuis');

    // ---------- Kimia & Informatika (materi saja) ----------
    const k1 = await buatPertemuan('KIM_P1', km.X1_KIM, 1,
      'Struktur Atom', 'Perkembangan model atom dan konfigurasi elektron.', -17);
    await buatMateri(k1, 'Perkembangan Model Atom',
      'Model atom berkembang mulai dari Dalton, Thomson, Rutherford, Bohr, hingga model mekanika kuantum.', 'teks');

    const i1 = await buatPertemuan('INFO_P1', km.X1_INFO, 1,
      'Berpikir Komputasional', 'Dekomposisi, pengenalan pola, abstraksi, dan algoritma.', -16);
    await buatMateri(i1, 'Empat Fondasi Berpikir Komputasional',
      'Berpikir komputasional mencakup dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma.', 'teks');

    // ---------- Kelas lain (agar data tidak hanya pada satu kelas) ----------
    const x2m = await buatPertemuan('X2_MTK_P1', km.X2_MTK, 1,
      'Konsep Persamaan Linear Satu Variabel',
      'Pengenalan persamaan linear satu variabel untuk kelas X MIPA 2.', -21);
    await buatMateri(x2m, 'Pengantar Persamaan Linear',
      'Materi pengantar persamaan linear satu variabel beserta contohnya.', 'teks');
    await buatTugas(x2m, 'Latihan Persamaan Linear (X MIPA 2)',
      'Kerjakan soal nomor 1-10 pada buku paket halaman 25.', hari(9), 'tugas');

    const xi1 = await buatPertemuan('XI1_BIND_P1', km.XI1_BIND, 1,
      'Teks Prosedur Kompleks',
      'Struktur dan kaidah kebahasaan teks prosedur kompleks.', -15);
    await buatMateri(xi1, 'Struktur Teks Prosedur Kompleks',
      'Teks prosedur kompleks memuat tujuan, langkah-langkah, dan penegasan hasil.', 'teks');
    await buatTugas(xi1, 'Tugas Menyusun Teks Prosedur',
      'Susunlah teks prosedur kompleks mengenai kegiatan sehari-hari di sekitar kalian.', hari(8), 'tugas');

    // ---------- Periode terkunci (arsip) ----------
    const lm1 = await buatPertemuan('LAMA_MTK_P1', km.LAMA_X1_MTK, 1,
      'Barisan dan Deret Aritmetika',
      'Materi barisan dan deret aritmetika pada semester genap tahun ajaran 2024/2025.', -240);
    await buatMateri(lm1, 'Rumus Suku ke-n Barisan Aritmetika',
      'Suku ke-n barisan aritmetika dirumuskan Un = a + (n-1)b.', 'teks');
    await buatTugas(lm1, 'Latihan Barisan Aritmetika',
      'Kerjakan soal barisan dan deret aritmetika nomor 1 sampai 10.', hari(-200), 'tugas');

    const lb1 = await buatPertemuan('LAMA_BIND_P1', km.LAMA_X1_BIND, 1,
      'Teks Negosiasi', 'Struktur dan kaidah teks negosiasi.', -238);
    await buatMateri(lb1, 'Struktur Teks Negosiasi',
      'Teks negosiasi terdiri atas orientasi, pengajuan, penawaran, dan persetujuan.', 'teks');

    // =============================================================
    // Butir soal untuk kuis
    // =============================================================
    const [tugasRows] = await conn.query('SELECT id, judul FROM tugas');
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
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot, urutan)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [idTugas(judul), q, tipe, a, b, c, d, benar, bobot, urut]);
        totalSoal += 1;
      }
    }

    // =============================================================
    const hitung = async (t) => (await conn.query(`SELECT COUNT(*) n FROM ${t}`))[0][0].n;
    console.log('[OK] Data contoh berhasil dibuat.');
    console.log(`     periode         : ${await hitung('periode')} (2026/1 aktif, 2025/2 terkunci)`);
    console.log(`     mata pelajaran  : ${await hitung('mata_pelajaran')}`);
    console.log(`     guru / siswa    : ${guruIds.length} / ${siswaData.length}`);
    console.log(`     kelas           : ${await hitung('kelas')}`);
    console.log(`     pengampuan      : ${await hitung('kelas_mapel')}`);
    console.log(`     pertemuan       : ${await hitung('pertemuan')}`);
    console.log(`     materi / tugas  : ${await hitung('materi')} / ${await hitung('tugas')}`);
    console.log(`     butir soal      : ${totalSoal}`);
    console.log('\nAkun untuk login:');
    console.log('  Admin : admin@smakk.sch.id / admin123');
    console.log('  Guru  : budi@smakk.sch.id  / guru123  (siti, rahmat, dina, hendra, lestari)');
    console.log('  Siswa : ahmad@siswa.smakk.sch.id / siswa123  (dan 14 siswa lainnya)');
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
