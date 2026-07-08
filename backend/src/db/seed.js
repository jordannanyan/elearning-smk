// Mengisi data contoh: 1 admin, 2 guru, 3 siswa, kelas, mapel, materi, tugas.
// Jalankan setelah db:init  ->  npm run db:seed
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Menghapus data lama & mengisi data contoh ...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['nilai', 'pengumpulan_tugas', 'forum_diskusi', 'tugas', 'materi',
      'mata_pelajaran', 'siswa', 'guru', 'kelas', 'users']) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    const hash = (p) => bcrypt.hashSync(p, 10);

    // --- Admin ---
    const [admin] = await conn.query(
      "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'admin')",
      ['Administrator', 'admin@smakk.sch.id', hash('admin123')]
    );

    // --- Guru ---
    const guruData = [
      ['Budi Santoso, S.Pd', 'budi@smakk.sch.id', '198501012010011001', 'Matematika'],
      ['Siti Aminah, S.Pd', 'siti@smakk.sch.id', '198703152011012002', 'Bahasa Indonesia'],
    ];
    const guruIds = [];
    for (const [nama, email, nip, mapel] of guruData) {
      const [u] = await conn.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'guru')",
        [nama, email, hash('guru123')]
      );
      const [g] = await conn.query(
        'INSERT INTO guru (id_user, nip, mapel) VALUES (?,?,?)',
        [u.insertId, nip, mapel]
      );
      guruIds.push(g.insertId);
    }

    // --- Kelas ---
    const [kelasRes] = await conn.query(
      "INSERT INTO kelas (nama_kelas, tingkat, tahun_ajaran) VALUES ('X IPA 1','X','2025/2026')"
    );
    const kelasId = kelasRes.insertId;

    // --- Siswa ---
    const siswaData = [
      ['Ahmad Fauzi', 'ahmad@siswa.smakk.sch.id', '0012345678'],
      ['Dewi Lestari', 'dewi@siswa.smakk.sch.id', '0012345679'],
      ['Rian Pratama', 'rian@siswa.smakk.sch.id', '0012345680'],
    ];
    for (const [nama, email, nis] of siswaData) {
      const [u] = await conn.query(
        "INSERT INTO users (nama, email, password, role) VALUES (?,?,?,'siswa')",
        [nama, email, hash('siswa123')]
      );
      await conn.query(
        'INSERT INTO siswa (id_user, id_kelas, nis) VALUES (?,?,?)',
        [u.insertId, kelasId, nis]
      );
    }

    // --- Mata Pelajaran ---
    const [mtk] = await conn.query(
      'INSERT INTO mata_pelajaran (id_guru, nama, kode, deskripsi) VALUES (?,?,?,?)',
      [guruIds[0], 'Matematika Wajib', 'MTK-X', 'Mata pelajaran Matematika kelas X']
    );
    const [bind] = await conn.query(
      'INSERT INTO mata_pelajaran (id_guru, nama, kode, deskripsi) VALUES (?,?,?,?)',
      [guruIds[1], 'Bahasa Indonesia', 'BIND-X', 'Mata pelajaran Bahasa Indonesia kelas X']
    );

    // --- Materi & Tugas contoh ---
    await conn.query(
      'INSERT INTO materi (id_mapel, judul, konten) VALUES (?,?,?)',
      [mtk.insertId, 'Persamaan Linear Satu Variabel',
        'Materi pengantar mengenai persamaan linear satu variabel beserta contoh soal.']
    );
    await conn.query(
      "INSERT INTO tugas (id_mapel, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?, 'tugas')",
      [mtk.insertId, 'Latihan Persamaan Linear',
        'Kerjakan soal nomor 1-10 pada buku paket halaman 25.',
        '2026-12-31 23:59:00']
    );
    const [kuis] = await conn.query(
      "INSERT INTO tugas (id_mapel, judul, deskripsi, deadline, tipe) VALUES (?,?,?,?, 'kuis')",
      [bind.insertId, 'Kuis Teks Deskripsi',
        'Kuis singkat mengenai struktur teks deskripsi. Terdiri dari pilihan ganda dan esai.',
        '2026-12-31 23:59:00']
    );

    // --- Contoh butir soal untuk kuis (2 pilihan ganda + 1 esai) ---
    const soal = [
      ['pilihan_ganda', 'Teks yang menggambarkan suatu objek secara rinci disebut teks...',
        'Narasi', 'Deskripsi', 'Eksposisi', 'Persuasi', 'B', 30, 1],
      ['pilihan_ganda', 'Struktur teks deskripsi yang benar adalah...',
        'Identifikasi - Deskripsi bagian - Penutup', 'Orientasi - Komplikasi - Resolusi',
        'Tesis - Argumen - Penegasan', 'Pembuka - Isi - Salam', 'A', 30, 2],
      ['esai', 'Buatlah satu paragraf teks deskripsi singkat tentang sekolahmu!',
        null, null, null, null, null, 40, 3],
    ];
    for (const [tipe, q, a, b, c, d, benar, bobot, urut] of soal) {
      await conn.query(
        `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, bobot, urutan)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [kuis.insertId, q, tipe, a, b, c, d, benar, bobot, urut]
      );
    }

    console.log('[OK] Data contoh berhasil dibuat.');
    console.log('\nAkun untuk login:');
    console.log('  Admin : admin@smakk.sch.id / admin123');
    console.log('  Guru  : budi@smakk.sch.id  / guru123');
    console.log('  Siswa : ahmad@siswa.smakk.sch.id / siswa123');
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Gagal seed:', err.message);
  process.exit(1);
});
