-- ===========================================================================
-- BASIS DATA SISTEM E-LEARNING SMA NEGERI 1 KARAU KUALA
-- Rancang Bangun Sistem E-Learning Berbasis Web di SMA Negeri 1 Karau Kuala
-- ===========================================================================
--
-- Berkas ini berisi struktur tabel beserta seluruh data yang digunakan pada
-- BAB IV Hasil dan Pembahasan, yaitu data yang tampil pada seluruh tangkapan
-- layar sistem dan data hasil pengujian Black Box Testing (63 skenario).
--
-- Data pengumpulan tugas, jawaban kuis, dan nilai pada berkas ini dihasilkan
-- melalui alur nyata sistem (REST API), sehingga skor pilihan ganda merupakan
-- hasil koreksi otomatis sistem dan skor esai merupakan hasil penilaian guru.
--
-- DBMS       : MySQL / MariaDB
-- Nama basis data : elearning_smakk
-- Karakter set    : utf8mb4 / utf8mb4_unicode_ci
-- Jumlah tabel    : 12
--
-- Cara import melalui phpMyAdmin:
--   1. Buka phpMyAdmin, pilih menu Import.
--   2. Pilih berkas elearning_smakk_bab4.sql, lalu klik Go / Kirim.
--
-- Cara import melalui terminal:
--   mysql -u root < elearning_smakk_bab4.sql
--
-- Akun untuk pengujian (kata sandi disimpan terenkripsi bcrypt):
--   Administrator : admin@smakk.sch.id            / admin123
--   Guru          : budi@smakk.sch.id             / guru123
--                   siti@smakk.sch.id             / guru123
--                   rahmat@smakk.sch.id           / guru123
--                   dina@smakk.sch.id             / guru123
--   Siswa         : ahmad@siswa.smakk.sch.id      / siswa123
--                   dewi@siswa.smakk.sch.id       / siswa123
--                   (seluruh akun siswa lain juga menggunakan kata sandi siswa123)
--
-- ===========================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- ===========================================================================
-- Pembuatan basis data
-- ===========================================================================

DROP DATABASE IF EXISTS `elearning_smakk`;
CREATE DATABASE `elearning_smakk` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `elearning_smakk`;


-- ===========================================================================
-- 1. Tabel `users`
--    Akun seluruh pengguna sistem (administrator, guru, dan siswa)
--    Jumlah data: 18 baris
-- ===========================================================================

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','guru','siswa') NOT NULL DEFAULT 'siswa',
  `foto` varchar(255) DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (1,'Administrator','admin@smakk.sch.id','$2a$10$afuhIemtRueGR/eHgD7hSuWbeoLKfsAMT3V1kT7dnmAmT0SUsTacO','admin',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (2,'Budi Santoso, S.Pd','budi@smakk.sch.id','$2a$10$/481SM5XOYyXl5NkvpSEdOothFF0shnzCMDB1T5tr.wHRi4gu.aoO','guru',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (3,'Siti Aminah, S.Pd','siti@smakk.sch.id','$2a$10$SGSs7tvQBVWXXo42PtKbW./4o60hf1CrjhlfEH38cHG0lWNpfbUyW','guru',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (4,'Rahmat Hidayat, S.Pd','rahmat@smakk.sch.id','$2a$10$ctyHffEmvAYgt1aYouCYfOSPhOBj3zRKWKPeLhjPzhj5D2g4FPaRy','guru',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (5,'Dina Marlina, S.Pd','dina@smakk.sch.id','$2a$10$guNhLkgno4F9skkKq9wNMuZDP.LLdVjXN/wH3EllA2Pri1.F.lhbu','guru',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (6,'Ahmad Fauzi','ahmad@siswa.smakk.sch.id','$2a$10$fvoZlVf/SlSLzcnfslv6ROCMLNL2xKqf9LQ7nPmVjdFBKuDSuJ.la','siswa',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (7,'Dewi Lestari','dewi@siswa.smakk.sch.id','$2a$10$/aivSYv.Vxb6gp4zsBScO.3hYnUzvK90SeyxjXwHoQbJSlDbQEjwa','siswa',NULL,1,'2026-09-03 01:25:52');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (8,'Rian Pratama','rian@siswa.smakk.sch.id','$2a$10$t3UGyGt5zTY7CNS4CctlMuhwvsN7nt2Y91W4PZQf.qaDgX4Dn7Ik6','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (9,'Nur Aisyah','aisyah@siswa.smakk.sch.id','$2a$10$9LqYKKs5.Tvbo6e2Vnhc7OzNRkf1YEcMZC0eJq4byU4ZAxq79qZna','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (10,'Bayu Saputra','bayu@siswa.smakk.sch.id','$2a$10$td/kKPZagx4rBWkN4D8.Z.mlZTU8/D4./B2HZOLz4jG6pNQJyYPtq','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (11,'Putri Rahmawati','putri@siswa.smakk.sch.id','$2a$10$gpmCXzdWy6ZRKa9xes7qZ.44W1FupFB7jrvJz9cGGZyTspiMtmSRK','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (12,'Fajar Ramadhan','fajar@siswa.smakk.sch.id','$2a$10$zbJQjEv/ErSTE4a0lhp.zuzgiPd.HPoO5BPK35ttlOt0E5uccdW7m','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (13,'Salsabila Azzahra','salsa@siswa.smakk.sch.id','$2a$10$dMQKG4SEx2WGLn5fZPv9Qui0vAP7bn28H5Jc4maP5scchPMXAezWS','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (14,'Andi Setiawan','andi@siswa.smakk.sch.id','$2a$10$THYlOIsLFz6341shto/FkONtVs/b/.ni5pb5bP8DA3n8VE039vyGe','siswa',NULL,1,'2026-09-03 01:25:53');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (15,'Maya Anggraini','maya@siswa.smakk.sch.id','$2a$10$nGuLd/bzB4d223cAEek0Y.BD5UE0a5qhpSgTFqrnbriLOLlR/aaCK','siswa',NULL,1,'2026-09-03 01:25:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (16,'Rizky Alamsyah','rizky@siswa.smakk.sch.id','$2a$10$rg5gNIF2tK5gmeg65L8AmO6i/yLL4TMNYUJm0.aaH96Bdd03YRX2K','siswa',NULL,1,'2026-09-03 01:25:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (17,'Intan Permata','intan@siswa.smakk.sch.id','$2a$10$036XiN7D4uVWkIjIC.fmqe6ymCtStpZ1oWT8RT63BorHDSxAe8L6S','siswa',NULL,1,'2026-09-03 01:25:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (19,'Wulan Safitri','wulan@siswa.smakk.sch.id','$2a$10$JsDOHiF5uGlaeiGQxcQe9uByxlkLmyqiQmtoDqmvY6C1Jyg8/JoQe','siswa',NULL,1,'2026-09-03 01:26:02');


-- ===========================================================================
-- 2. Tabel `kelas`
--    Data rombongan belajar (kelas)
--    Jumlah data: 3 baris
-- ===========================================================================

DROP TABLE IF EXISTS `kelas`;
CREATE TABLE `kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kelas` varchar(50) NOT NULL,
  `tingkat` varchar(10) NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kelas` (`id`, `nama_kelas`, `tingkat`, `tahun_ajaran`) VALUES (1,'X IPA 1','X','2025/2026');
INSERT INTO `kelas` (`id`, `nama_kelas`, `tingkat`, `tahun_ajaran`) VALUES (2,'X IPA 2','X','2025/2026');
INSERT INTO `kelas` (`id`, `nama_kelas`, `tingkat`, `tahun_ajaran`) VALUES (3,'XI IPS 1','XI','2025/2026');


-- ===========================================================================
-- 3. Tabel `guru`
--    Profil guru, berelasi satu-satu dengan tabel users
--    Jumlah data: 4 baris
-- ===========================================================================

DROP TABLE IF EXISTS `guru`;
CREATE TABLE `guru` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `mapel` varchar(100) DEFAULT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_guru_user` (`id_user`),
  CONSTRAINT `fk_guru_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `guru` (`id`, `id_user`, `nip`, `mapel`, `tgl_lahir`, `alamat`) VALUES (1,2,'198501012010011001','Matematika','1985-01-01','Jl. Pahlawan No. 12, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `mapel`, `tgl_lahir`, `alamat`) VALUES (2,3,'198703152011012002','Bahasa Indonesia','1987-03-15','Jl. Merdeka No. 5, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `mapel`, `tgl_lahir`, `alamat`) VALUES (3,4,'199002202015031003','Fisika','1990-02-20','Jl. Bhayangkara No. 8, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `mapel`, `tgl_lahir`, `alamat`) VALUES (4,5,'199105102016042004','Bahasa Inggris','1991-05-10','Jl. Sudirman No. 21, Bangkuang');


-- ===========================================================================
-- 4. Tabel `siswa`
--    Profil siswa beserta kelasnya
--    Jumlah data: 13 baris
-- ===========================================================================

DROP TABLE IF EXISTS `siswa`;
CREATE TABLE `siswa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `nis` varchar(30) DEFAULT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_siswa_user` (`id_user`),
  KEY `fk_siswa_kelas` (`id_kelas`),
  CONSTRAINT `fk_siswa_kelas` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_siswa_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (1,6,1,'0012345678','2009-04-11','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (2,7,1,'0012345679','2009-06-23','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (3,8,1,'0012345680','2009-02-14','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (4,9,1,'0012345681','2009-09-30','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (5,10,1,'0012345682','2009-11-02','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (6,11,2,'0012345683','2009-01-19','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (7,12,2,'0012345684','2009-03-27','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (8,13,2,'0012345685','2009-07-08','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (9,14,2,'0012345686','2009-10-16','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (10,15,3,'0012345687','2008-05-05','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (11,16,3,'0012345688','2008-08-21','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (12,17,3,'0012345689','2008-12-12','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `id_kelas`, `nis`, `tgl_lahir`, `alamat`) VALUES (13,19,NULL,NULL,NULL,NULL);


-- ===========================================================================
-- 5. Tabel `mata_pelajaran`
--    Mata pelajaran beserta guru pengampunya
--    Jumlah data: 5 baris
-- ===========================================================================

DROP TABLE IF EXISTS `mata_pelajaran`;
CREATE TABLE `mata_pelajaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_guru` int(11) DEFAULT NULL,
  `nama` varchar(120) NOT NULL,
  `kode` varchar(30) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mapel_guru` (`id_guru`),
  CONSTRAINT `fk_mapel_guru` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `mata_pelajaran` (`id`, `id_guru`, `nama`, `kode`, `deskripsi`) VALUES (1,1,'Matematika Wajib','MTK-X','Matematika wajib untuk kelas X semester ganjil');
INSERT INTO `mata_pelajaran` (`id`, `id_guru`, `nama`, `kode`, `deskripsi`) VALUES (2,2,'Bahasa Indonesia','BIND-X','Bahasa Indonesia kelas X semester ganjil');
INSERT INTO `mata_pelajaran` (`id`, `id_guru`, `nama`, `kode`, `deskripsi`) VALUES (3,3,'Fisika','FIS-X','Fisika kelas X semester ganjil');
INSERT INTO `mata_pelajaran` (`id`, `id_guru`, `nama`, `kode`, `deskripsi`) VALUES (4,4,'Bahasa Inggris','BING-X','Bahasa Inggris kelas X semester ganjil');
INSERT INTO `mata_pelajaran` (`id`, `id_guru`, `nama`, `kode`, `deskripsi`) VALUES (5,1,'Matematika Peminatan','MTKP-XI','Matematika peminatan kelas XI');


-- ===========================================================================
-- 6. Tabel `materi`
--    Materi pembelajaran yang diunggah guru
--    Jumlah data: 8 baris
-- ===========================================================================

DROP TABLE IF EXISTS `materi`;
CREATE TABLE `materi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_mapel` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `konten` text DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `tgl_upload` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_materi_mapel` (`id_mapel`),
  CONSTRAINT `fk_materi_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (1,1,'Persamaan Linear Satu Variabel','Materi pengantar mengenai persamaan linear satu variabel beserta bentuk umum dan contoh soal penyelesaiannya.','modul_persamaan_linear.pdf','2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (2,1,'Pertidaksamaan Linear Satu Variabel','Konsep pertidaksamaan linear satu variabel, sifat-sifat pertidaksamaan, serta penyajian himpunan penyelesaian pada garis bilangan.',NULL,'2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (3,1,'Sistem Persamaan Linear Dua Variabel (SPLDV)','Penyelesaian SPLDV dengan metode substitusi, eliminasi, dan campuran disertai contoh penerapan pada soal cerita.',NULL,'2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (4,2,'Struktur dan Kaidah Teks Deskripsi','Penjelasan struktur teks deskripsi (identifikasi, deskripsi bagian, penutup) beserta kaidah kebahasaan yang digunakan.','modul_teks_deskripsi.pdf','2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (5,2,'Teks Eksposisi','Materi mengenai pengertian, struktur, dan ciri kebahasaan teks eksposisi disertai contoh teks.',NULL,'2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (6,3,'Besaran dan Satuan','Materi besaran pokok, besaran turunan, satuan Sistem Internasional, serta penggunaan alat ukur dan angka penting.',NULL,'2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (7,3,'Vektor dan Resultan Gaya','Penjumlahan vektor dengan metode segitiga, jajargenjang, dan poligon, serta penguraian vektor pada sumbu x dan y.',NULL,'2026-09-03 01:25:54');
INSERT INTO `materi` (`id`, `id_mapel`, `judul`, `konten`, `file`, `tgl_upload`) VALUES (8,4,'Descriptive Text','Materi mengenai social function, generic structure, dan language features dari descriptive text beserta contoh.',NULL,'2026-09-03 01:25:54');


-- ===========================================================================
-- 7. Tabel `tugas`
--    Tugas dan kuis beserta tipe dan batas waktunya
--    Jumlah data: 6 baris
-- ===========================================================================

DROP TABLE IF EXISTS `tugas`;
CREATE TABLE `tugas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_mapel` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `tipe` enum('tugas','kuis') NOT NULL DEFAULT 'tugas',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tugas_mapel` (`id_mapel`),
  CONSTRAINT `fk_tugas_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (1,1,'Latihan Persamaan Linear','Kerjakan soal nomor 1-10 pada buku paket halaman 25. Tulis langkah penyelesaian secara lengkap, lalu unggah dalam bentuk file atau tuliskan pada kolom jawaban.','2026-09-17 23:59:00','tugas','2026-09-03 01:25:54');
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (2,1,'Kuis Persamaan dan Pertidaksamaan Linear','Kuis pilihan ganda mengenai persamaan dan pertidaksamaan linear satu variabel. Dinilai otomatis oleh sistem.','2026-09-10 23:59:00','kuis','2026-09-03 01:25:54');
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (3,2,'Tugas Menulis Teks Deskripsi','Buatlah sebuah teks deskripsi bertema \"Lingkungan Sekolahku\" minimal tiga paragraf sesuai struktur yang telah dipelajari.','2026-09-13 23:59:00','tugas','2026-09-03 01:25:54');
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (4,2,'Kuis Teks Deskripsi','Kuis singkat mengenai struktur teks deskripsi. Terdiri atas soal pilihan ganda dan satu soal esai.','2026-09-08 23:59:00','kuis','2026-09-03 01:25:54');
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (5,3,'Latihan Soal Besaran dan Satuan','Kerjakan latihan konversi satuan dan penulisan angka penting pada lembar kerja yang telah dibagikan.','2026-08-31 23:59:00','tugas','2026-09-03 01:25:54');
INSERT INTO `tugas` (`id`, `id_mapel`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (6,4,'Kuis Descriptive Text','Short quiz about the generic structure and language features of descriptive text.','2026-09-12 23:59:00','kuis','2026-09-03 01:25:54');


-- ===========================================================================
-- 8. Tabel `soal`
--    Butir soal pilihan ganda dan esai pada kuis
--    Jumlah data: 13 baris
-- ===========================================================================

DROP TABLE IF EXISTS `soal`;
CREATE TABLE `soal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tugas` int(11) NOT NULL,
  `pertanyaan` text NOT NULL,
  `tipe` enum('pilihan_ganda','esai') NOT NULL DEFAULT 'pilihan_ganda',
  `pilihan_a` varchar(500) DEFAULT NULL,
  `pilihan_b` varchar(500) DEFAULT NULL,
  `pilihan_c` varchar(500) DEFAULT NULL,
  `pilihan_d` varchar(500) DEFAULT NULL,
  `jawaban_benar` char(1) DEFAULT NULL,
  `bobot` int(11) NOT NULL DEFAULT 10,
  `urutan` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_soal_tugas` (`id_tugas`),
  CONSTRAINT `fk_soal_tugas` FOREIGN KEY (`id_tugas`) REFERENCES `tugas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (1,2,'Nilai x yang memenuhi persamaan 2x + 6 = 14 adalah ...','pilihan_ganda','2','4','6','8','B',20,1);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (2,2,'Himpunan penyelesaian dari 3x - 9 = 0 adalah ...','pilihan_ganda','{2}','{3}','{4}','{9}','B',20,2);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (3,2,'Bentuk umum persamaan linear satu variabel adalah ...','pilihan_ganda','ax + b = 0','ax2 + bx + c = 0','ax + by = c','a/x = b','A',20,3);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (4,2,'Penyelesaian pertidaksamaan 2x - 4 > 6 adalah ...','pilihan_ganda','x > 3','x > 5','x < 5','x < 3','B',20,4);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (5,2,'Jika 5x = 3x + 12, maka nilai x adalah ...','pilihan_ganda','3','4','6','12','C',20,5);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (6,4,'Teks yang menggambarkan suatu objek secara rinci disebut teks ...','pilihan_ganda','Narasi','Deskripsi','Eksposisi','Persuasi','B',25,1);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (7,4,'Struktur teks deskripsi yang benar adalah ...','pilihan_ganda','Identifikasi - Deskripsi bagian - Penutup','Orientasi - Komplikasi - Resolusi','Tesis - Argumen - Penegasan ulang','Pembuka - Isi - Salam penutup','A',25,2);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (8,4,'Kalimat berikut yang menggunakan majas atau kata konkret khas teks deskripsi adalah ...','pilihan_ganda','Sekolah itu bagus sekali.','Halaman sekolahku dipenuhi rumput hijau yang basah oleh embun pagi.','Menurut saya sekolah perlu diperbaiki.','Pertama, kita bahas struktur teks.','B',20,3);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (9,4,'Buatlah satu paragraf teks deskripsi singkat tentang lingkungan sekolahmu, minimal tiga kalimat!','esai',NULL,NULL,NULL,NULL,NULL,30,4);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (10,6,'The social function of a descriptive text is to ...','pilihan_ganda','entertain the readers with a story','describe a particular person, place, or thing','persuade the readers to do something','explain how to make something','B',25,1);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (11,6,'The generic structure of a descriptive text consists of ...','pilihan_ganda','Orientation and Events','Identification and Description','Thesis and Arguments','Goal and Steps','B',25,2);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (12,6,'Descriptive text mostly uses ... tense.','pilihan_ganda','simple present','simple past','present perfect','future','A',25,3);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (13,6,'Write a short descriptive paragraph about your classroom (at least three sentences).','esai',NULL,NULL,NULL,NULL,NULL,25,4);


-- ===========================================================================
-- 9. Tabel `pengumpulan_tugas`
--    Pengumpulan jawaban tugas/kuis oleh siswa
--    Jumlah data: 35 baris
-- ===========================================================================

DROP TABLE IF EXISTS `pengumpulan_tugas`;
CREATE TABLE `pengumpulan_tugas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tugas` int(11) NOT NULL,
  `id_siswa` int(11) NOT NULL,
  `file` varchar(255) DEFAULT NULL,
  `jawaban` text DEFAULT NULL,
  `tgl_kumpul` timestamp NOT NULL DEFAULT current_timestamp(),
  `terlambat` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tugas_siswa` (`id_tugas`,`id_siswa`),
  KEY `fk_kumpul_siswa` (`id_siswa`),
  CONSTRAINT `fk_kumpul_siswa` FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_kumpul_tugas` FOREIGN KEY (`id_tugas`) REFERENCES `tugas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (1,2,1,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (2,2,2,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (3,2,3,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (4,2,4,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (5,2,5,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (6,2,6,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (7,2,7,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (8,2,8,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (9,2,9,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (10,2,10,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (11,2,12,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (12,4,1,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (13,4,2,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (14,4,6,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (15,4,7,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (16,4,8,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (17,4,4,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (18,1,1,'1788398764440_jawaban_ahmad.txt','Nomor 1: 2x + 6 = 14 -> 2x = 8 -> x = 4.\r\nNomor 2: 3x - 9 = 0 -> 3x = 9 -> x = 3.\r\nNomor 3: 5x = 3x + 12 -> 2x = 12 -> x = 6.\r\nSeluruh langkah penyelesaian selengkapnya saya lampirkan pada file.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (19,1,2,'1788398764454_jawaban_dewi.txt','Seluruh soal nomor 1 sampai 10 telah saya kerjakan. Hasil pekerjaan saya tulis tangan lalu saya pindai dan lampirkan pada file terlampir.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (20,1,3,'1788398764465_jawaban_rian.txt','Nomor 1 sampai 8 sudah saya kerjakan, nomor 9 dan 10 masih saya ragu pada langkah pemindahan ruas. Mohon koreksinya, Pak.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (21,1,4,'1788398764475_jawaban_aisyah.txt','Jawaban lengkap nomor 1-10 terlampir pada file. Setiap nomor saya sertakan langkah pengerjaannya.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (22,1,5,'1788398764488_jawaban_bayu.txt','Nomor 1: x = 4; Nomor 2: x = 3; Nomor 3: x = 6; Nomor 4: x = 5; Nomor 5: x = 2. Sisanya menyusul.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (23,1,6,'1788398764500_jawaban_putri.txt','Semua soal telah saya kerjakan beserta langkah-langkahnya, terlampir pada file jawaban.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (24,1,9,'1788398764514_jawaban_andi.txt','Saya kerjakan nomor 1 sampai 10 dengan metode pindah ruas seperti yang dijelaskan Bapak di kelas.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (25,3,2,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala berdiri di tepi jalan utama Kecamatan Karau Kuala. Bangunannya bercat putih dengan lis biru yang tampak bersih setiap pagi.\r\n\r\nHalaman sekolah cukup luas dan ditumbuhi rumput hijau. Di tengahnya berdiri tiang bendera, sementara di sisi kiri berjajar pohon ketapang yang rindang.\r\n\r\nSuasana sekolahku sangat nyaman untuk belajar. Angin sejuk dari arah sungai membuat udara di ruang kelas tidak pernah terasa panas.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (26,3,6,NULL,'Lingkungan Sekolahku\r\n\r\nSekolahku terletak tidak jauh dari permukiman warga sehingga mudah dijangkau dengan sepeda.\r\n\r\nDi dalam kompleks sekolah terdapat dua belas ruang kelas, satu perpustakaan, dan sebuah laboratorium IPA. Lorong penghubungnya beratap seng sehingga siswa tetap terlindung ketika hujan.\r\n\r\nSetiap sudut sekolah dijaga kebersihannya oleh seluruh warga sekolah sehingga suasananya selalu asri.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (27,3,8,NULL,'Lingkungan Sekolahku\r\n\r\nGerbang sekolahku bercat hijau tua dan selalu terbuka sejak pukul enam pagi.\r\n\r\nDi sebelah kanan gerbang terdapat taman kecil dengan bunga kertas berwarna merah muda. Lapangan upacara berada tepat di tengah kompleks sekolah.\r\n\r\nAku sangat menyukai suasana sekolahku, terutama pada pagi hari ketika embun masih menempel di rumput lapangan.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (28,3,7,NULL,'Lingkungan Sekolahku\r\n\r\nSekolahku cukup luas dan memiliki banyak ruang kelas. Ada lapangan untuk upacara dan olahraga.\r\n\r\nDi belakang sekolah terdapat kebun kecil yang ditanami tanaman obat oleh siswa kelas X.\r\n\r\nSekolahku adalah tempat yang menyenangkan untuk belajar bersama teman-teman.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (29,3,9,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala memiliki halaman depan yang luas dengan pagar besi berwarna hijau.\r\n\r\nRuang kelas berjajar rapi menghadap lapangan. Setiap kelas memiliki jendela besar sehingga cahaya matahari masuk dengan leluasa.\r\n\r\nKarena lingkungannya rindang dan bersih, aku merasa betah berlama-lama di sekolah.','2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (30,5,10,NULL,'Mohon maaf Pak, saya terlambat mengumpulkan karena jaringan internet di rumah bermasalah. Latihan konversi satuan nomor 1-10 sudah saya kerjakan seluruhnya.','2026-09-03 01:26:04',1);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (31,5,11,NULL,'Latihan konversi satuan dan angka penting nomor 1 sampai 10 sudah selesai saya kerjakan.','2026-09-03 01:26:04',1);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (32,6,1,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (33,6,2,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (34,6,5,NULL,NULL,'2026-09-03 01:26:04',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (35,6,12,NULL,NULL,'2026-09-03 01:26:04',0);


-- ===========================================================================
-- 10. Tabel `jawaban_siswa`
--    Jawaban siswa pada setiap butir soal kuis
--    Jumlah data: 95 baris
-- ===========================================================================

DROP TABLE IF EXISTS `jawaban_siswa`;
CREATE TABLE `jawaban_siswa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pengumpulan` int(11) NOT NULL,
  `id_soal` int(11) NOT NULL,
  `pilihan` char(1) DEFAULT NULL,
  `jawaban_teks` text DEFAULT NULL,
  `benar` tinyint(4) DEFAULT NULL,
  `skor` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pengumpulan_soal` (`id_pengumpulan`,`id_soal`),
  KEY `fk_jwb_soal` (`id_soal`),
  CONSTRAINT `fk_jwb_pengumpulan` FOREIGN KEY (`id_pengumpulan`) REFERENCES `pengumpulan_tugas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jwb_soal` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (1,1,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (2,1,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (3,1,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (4,1,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (5,1,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (6,2,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (7,2,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (8,2,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (9,2,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (10,2,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (11,3,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (12,3,2,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (13,3,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (14,3,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (15,3,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (16,4,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (17,4,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (18,4,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (19,4,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (20,4,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (21,5,1,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (22,5,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (23,5,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (24,5,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (25,5,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (26,6,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (27,6,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (28,6,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (29,6,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (30,6,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (31,7,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (32,7,2,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (33,7,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (34,7,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (35,7,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (36,8,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (37,8,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (38,8,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (39,8,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (40,8,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (41,9,1,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (42,9,2,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (43,9,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (44,9,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (45,9,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (46,10,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (47,10,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (48,10,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (49,10,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (50,10,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (51,11,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (52,11,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (53,11,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (54,11,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (55,11,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (56,12,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (57,12,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (58,12,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (59,12,9,NULL,'Sekolahku berada di tepi jalan utama Bangkuang. Halamannya luas dengan rumput hijau yang selalu terpangkas rapi. Di depan ruang guru berdiri tiang bendera yang menjulang, dan di sampingnya berjajar pohon ketapang yang meneduhkan.',NULL,30.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (60,13,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (61,13,7,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (62,13,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (63,13,9,NULL,'SMA Negeri 1 Karau Kuala memiliki bangunan bercat putih kebiruan. Setiap pagi koridor kelas dipenuhi suara siswa yang bersiap belajar. Taman kecil di tengah sekolah ditanami bunga kertas berwarna-warni.',NULL,28.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (64,14,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (65,14,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (66,14,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (67,14,9,NULL,'Ruang kelasku cukup luas dan terang karena memiliki empat jendela besar. Di dinding depan terpasang papan tulis putih dan foto pahlawan. Udara di dalam kelas terasa sejuk saat pagi hari.',NULL,26.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (68,15,6,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (69,15,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (70,15,8,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (71,15,9,NULL,'Sekolahku bersih dan nyaman. Ada lapangan upacara di tengah.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (72,16,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (73,16,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (74,16,8,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (75,16,9,NULL,'Perpustakaan sekolahku terletak di sudut belakang gedung. Rak-rak kayunya dipenuhi buku pelajaran dan novel. Suasananya tenang sehingga nyaman digunakan untuk membaca pada jam istirahat.',NULL,29.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (76,17,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (77,17,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (78,17,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (79,17,9,NULL,'Kantin sekolah berada di samping lapangan basket. Setiap istirahat aromanya harum oleh gorengan hangat. Meja-meja panjangnya selalu penuh oleh siswa yang bercengkerama.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (80,32,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (81,32,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (82,32,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (83,32,13,NULL,'My classroom is on the second floor of the school building. It has four large windows, so the room is always bright. There are thirty-two desks and a white board in front of the class.',NULL,23.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (84,33,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (85,33,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (86,33,12,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (87,33,13,NULL,'My classroom is clean and comfortable. The walls are painted light blue and there are some pictures of Indonesian heroes on them. I like studying there with my classmates.',NULL,22.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (88,34,10,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (89,34,11,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (90,34,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (91,34,13,NULL,'My classroom is big. There is a white board and many chairs.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (92,35,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (93,35,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (94,35,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (95,35,13,NULL,'My classroom is located next to the school library. It is equipped with a projector that my teacher often uses. In the corner of the room, there is a small bookshelf full of dictionaries.',NULL,24.00);


-- ===========================================================================
-- 11. Tabel `nilai`
--    Nilai hasil penilaian guru maupun koreksi otomatis sistem
--    Jumlah data: 28 baris
-- ===========================================================================

DROP TABLE IF EXISTS `nilai`;
CREATE TABLE `nilai` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_kumpul` int(11) NOT NULL,
  `id_guru` int(11) DEFAULT NULL,
  `skor` decimal(5,2) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `tgl_penilaian` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nilai_kumpul` (`id_kumpul`),
  KEY `fk_nilai_guru` (`id_guru`),
  CONSTRAINT `fk_nilai_guru` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_nilai_kumpul` FOREIGN KEY (`id_kumpul`) REFERENCES `pengumpulan_tugas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (1,1,NULL,80.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (2,2,NULL,100.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (3,3,NULL,60.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (4,4,NULL,100.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (5,5,NULL,40.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (6,6,NULL,80.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (7,7,NULL,80.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (8,8,NULL,100.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (9,9,NULL,20.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (10,10,NULL,80.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (11,11,NULL,60.00,NULL,'2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (12,18,1,90.00,'Langkah pengerjaan sudah runtut dan benar. Pertahankan.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (13,24,1,80.00,'Sudah benar, namun beberapa langkah masih dipersingkat.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (14,19,1,85.00,'Jawaban benar, tulisan pada lampiran agar diperjelas lagi.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (15,21,1,95.00,'Sangat baik, seluruh langkah penyelesaian lengkap.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (16,23,1,88.00,'Pekerjaan rapi dan jawaban tepat.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (17,20,1,75.00,'Nomor 9 dan 10 masih keliru pada pemindahan ruas. Pelajari kembali.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (18,12,2,100.00,'Deskripsi sangat hidup dan struktur sudah tepat.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (19,13,2,73.00,'Deskripsi baik, tambahkan lagi penggunaan pancaindra.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (20,14,2,96.00,'Sudah sesuai struktur, kembangkan lagi deskripsi bagiannya.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (21,16,2,79.00,'Pemilihan kata konkret sudah sangat baik.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (22,32,4,98.00,'Good description with clear details.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (23,33,4,72.00,'Well written, add more specific adjectives.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (24,35,4,99.00,'Excellent, the details are very clear.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (25,25,2,92.00,'Struktur lengkap dan deskripsi sangat hidup.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (26,26,2,87.00,'Sudah baik, penutup dapat dipertegas lagi.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (27,27,2,90.00,'Pemilihan diksi sangat baik dan runtut.','2026-09-03 01:26:04');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (28,30,3,78.00,'Jawaban benar, namun dikumpulkan melewati batas waktu.','2026-09-03 01:26:04');


-- ===========================================================================
-- 12. Tabel `forum_diskusi`
--    Topik dan balasan pada forum diskusi
--    Jumlah data: 14 baris
-- ===========================================================================

DROP TABLE IF EXISTS `forum_diskusi`;
CREATE TABLE `forum_diskusi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_mapel` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul` varchar(200) DEFAULT NULL,
  `pesan` text NOT NULL,
  `id_parent` int(11) DEFAULT NULL,
  `tgl_post` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_forum_mapel` (`id_mapel`),
  KEY `fk_forum_user` (`id_user`),
  KEY `fk_forum_parent` (`id_parent`),
  CONSTRAINT `fk_forum_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_forum_parent` FOREIGN KEY (`id_parent`) REFERENCES `forum_diskusi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_forum_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (1,1,2,'Diskusi Materi Persamaan Linear','Selamat pagi anak-anak. Silakan tuliskan di forum ini bagian materi persamaan linear satu variabel yang masih sulit dipahami, nanti Bapak bahas ulang pada pertemuan berikutnya.',NULL,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (2,1,6,NULL,'Selamat pagi Pak. Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12. Bagaimana langkah pertamanya, Pak?',1,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (3,1,2,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',1,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (4,1,7,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya Pak.',1,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (5,1,8,'Pertanyaan tentang Tugas Latihan','Pak, untuk tugas latihan persamaan linear apakah jawaban boleh ditulis tangan lalu difoto dan diunggah dalam bentuk file?',NULL,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (6,1,2,NULL,'Boleh, Rian. Pastikan tulisan terbaca jelas dan file diunggah sebelum batas waktu pengumpulan.',5,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (7,2,3,'Tips Menulis Teks Deskripsi','Anak-anak, dalam menulis teks deskripsi gunakan pancaindra kalian: apa yang dilihat, didengar, dan dirasakan. Silakan tanyakan di sini jika ada kesulitan pada tugas menulis teks deskripsi.',NULL,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (8,2,11,NULL,'Bu, apakah teks deskripsi harus selalu menggunakan majas?',7,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (9,2,3,NULL,'Tidak harus, Putri. Yang utama adalah penggunaan kata konkret dan rincian objek yang jelas. Majas hanya membuat deskripsi menjadi lebih hidup.',7,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (10,3,4,'Pengumpulan Latihan Besaran dan Satuan','Batas waktu pengumpulan latihan soal besaran dan satuan sudah berakhir. Bagi yang belum mengumpulkan, silakan hubungi Bapak dan tetap unggah pekerjaan kalian melalui sistem.',NULL,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (11,3,15,NULL,'Baik Pak, saya sudah mengumpulkan meskipun terlambat. Mohon maaf karena kemarin jaringan internet di rumah bermasalah.',10,'2026-09-03 01:25:54');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (12,1,7,'Persiapan Ulangan Harian Persamaan Linear','Assalamualaikum Pak. Untuk ulangan harian minggu depan, apakah soal cerita juga termasuk dalam materi yang diujikan?',NULL,'2026-09-03 01:26:05');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (13,1,2,NULL,'Waalaikumsalam, Dewi. Betul, soal cerita juga diujikan. Pelajari kembali cara menyusun model matematikanya terlebih dahulu sebelum menyelesaikan persamaan.',12,'2026-09-03 01:26:05');
INSERT INTO `forum_diskusi` (`id`, `id_mapel`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (14,1,7,NULL,'Baik Pak, terima kasih atas penjelasannya. Saya akan berlatih membuat model matematikanya lebih dahulu.',12,'2026-09-03 01:26:05');


-- ===========================================================================
-- Selesai. Total 242 baris data pada 12 tabel.
-- ===========================================================================

SET FOREIGN_KEY_CHECKS = 1;
