-- ===========================================================================
-- BASIS DATA SISTEM E-LEARNING SMA NEGERI 1 KARAU KUALA
-- Rancang Bangun Sistem E-Learning Berbasis Web di SMA Negeri 1 Karau Kuala
-- ===========================================================================
--
-- Berkas ini berisi struktur tabel beserta seluruh data yang digunakan pada
-- BAB IV Hasil dan Pembahasan, yaitu data yang tampil pada seluruh tangkapan
-- layar sistem dan data hasil pengujian Black Box Testing (95 skenario).
--
-- Basis data memuat dua periode pembelajaran:
--   2026/1 (Tahun Ajaran 2025/2026 Ganjil) berstatus AKTIF
--   2025/2 (Tahun Ajaran 2024/2025 Genap)  berstatus TERKUNCI sebagai arsip
--
-- Data pengumpulan tugas, jawaban kuis, dan nilai pada berkas ini dihasilkan
-- melalui alur nyata sistem (REST API), sehingga skor pilihan ganda merupakan
-- hasil koreksi otomatis sistem dan skor esai merupakan hasil penilaian guru.
--
-- DBMS       : MySQL / MariaDB
-- Nama basis data : elearning_smakk
-- Karakter set    : utf8mb4 / utf8mb4_unicode_ci
-- Jumlah tabel    : 16
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
--                   hendra@smakk.sch.id           / guru123
--                   lestari@smakk.sch.id          / guru123
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
--    Jumlah data: 23 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (1,'Administrator','admin@smakk.sch.id','$2a$10$bHTJ.lbsXtp4cKJpdj3DLueZTxd/kzIranuLs46VSoQUZxyoSW6K2','admin',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (2,'Budi Santoso, S.Pd','budi@smakk.sch.id','$2a$10$EJFSF4QX6UZOqv.rgpVKe.gHviQveQPNuLgHVjyGV.ODf44rSK9bi','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (3,'Siti Aminah, S.Pd','siti@smakk.sch.id','$2a$10$qpLCO.zDE/rGGoUUjQt5OeSP0Q2hEBfpQiLMCn6EzdgZBCmNDUxES','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (4,'Rahmat Hidayat, S.Pd','rahmat@smakk.sch.id','$2a$10$dUFmwLfI53DANdM2Eflzye5WcCn/RyDoU70xTpovVey0uIJuTsAFW','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (5,'Dina Marlina, S.Pd','dina@smakk.sch.id','$2a$10$vUGTbIztsfh5yGHeSIR2HOm3R4FZgBS1woBNuBen2lh4jEVXR..Y2','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (6,'Hendra Wijaya, S.Pd','hendra@smakk.sch.id','$2a$10$wKmn8HTvK2Z9XWmNVuyx7.b679Fqi.cmJYRW/1gj2obIDVoB.591u','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (7,'Lestari Ningsih, S.Pd','lestari@smakk.sch.id','$2a$10$dL5wllmIcFBhkllyiyWF9ukGPVVV8yK.al3BuXDvYVb.1YOQT3zje','guru',NULL,1,'2026-09-22 14:49:45');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (8,'Ahmad Fauzi','ahmad@siswa.smakk.sch.id','$2a$10$7Txsg1gx7oWOzt.g2dHAJuSNRc5seiobJT1aLZT9oIB8Q3oZql7yy','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (9,'Dewi Lestari','dewi@siswa.smakk.sch.id','$2a$10$4NSVzBzM8Ex1mx7VvHpvJeRqBw3bAJYJdnBmheZzicaTBQWnAkKEW','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (10,'Rian Pratama','rian@siswa.smakk.sch.id','$2a$10$fdc8jnszXfxUkuSu9a44iuhweBXgmLg4Cp4sCbwf23oGCHZJqFwOC','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (11,'Nur Aisyah','aisyah@siswa.smakk.sch.id','$2a$10$i6iBSz/UOlLy1IhAUj2.zusZeuQSp3f6a6OjLzYo72VmmdjF0IxGS','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (12,'Bayu Saputra','bayu@siswa.smakk.sch.id','$2a$10$U7xpyDV/cxhM4zFpTG3.UOY3i.cybr6o.5GdtUXpC7Z0sgK9gixiO','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (13,'Putri Rahmawati','putri@siswa.smakk.sch.id','$2a$10$tMmE/ZzimRTa4wGNSc2PfukNCcDTUwNs44zmEUtY5ZblflfmgKe62','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (14,'Fajar Ramadhan','fajar@siswa.smakk.sch.id','$2a$10$rD8A5nyXOcCVGNy03BamPevQqgDwlCCsy2o3yb4q1MQjYrhaIWTrK','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (15,'Salsabila Azzahra','salsa@siswa.smakk.sch.id','$2a$10$FJhqUd8KGEYI8f78DiWGReCRW/kZGP4oJNuBjKqUGeCPfoLMTstr2','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (16,'Andi Setiawan','andi@siswa.smakk.sch.id','$2a$10$GwNj3vEbQew6M0SLIasaGOPCNF3K82f3Z.nhcR2OYiwgc0Yb4Wl2u','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (17,'Maya Anggraini','maya@siswa.smakk.sch.id','$2a$10$mgy./kjcOCtOWTZZZC3mrOVljx7m4D7dNayFviFTPTjhD2cs35vTq','siswa',NULL,1,'2026-09-22 14:49:46');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (18,'Rizky Alamsyah','rizky@siswa.smakk.sch.id','$2a$10$mAYxJxwhiJm/IjuJhW.2jOuuV9iGfA4eM84JLH0uxyeBfB7qSytkS','siswa',NULL,1,'2026-09-22 14:49:47');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (19,'Intan Permata','intan@siswa.smakk.sch.id','$2a$10$Ak85kxU0LE3E2wcvA/dFXeOkok/NgSX2eeYpZWErZOi.Yy7Cwu/Om','siswa',NULL,1,'2026-09-22 14:49:47');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (20,'Galih Nugroho','galih@siswa.smakk.sch.id','$2a$10$krc7FtynrB4W8QcilxE9l.UsS/gi.ZQw5.wMTpaZjZT6d8XV1HXTW','siswa',NULL,1,'2026-09-22 14:49:47');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (21,'Winda Oktaviani','winda@siswa.smakk.sch.id','$2a$10$NhH5/wBCS96cx7IiuA.y..vYGgNRDd6zBQ8HYy6lOSbh8Uz/Yf8Pe','siswa',NULL,1,'2026-09-22 14:49:47');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (22,'Teguh Prasetyo','teguh@siswa.smakk.sch.id','$2a$10$aRaCvc1BDNT65OG7m4XJ4.ja1mtl6C9Oba6WVgNBGYo4C9Rdyo2M6','siswa',NULL,1,'2026-09-22 14:49:47');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (24,'Wulan Safitri','wulan@siswa.smakk.sch.id','$2a$10$vQ9vITXVQZsQ5I8HtPhe3OL3w5jYoS48QEqzAhMix5X99yfd.avsW','siswa',NULL,1,'2026-09-22 14:49:49');


-- ===========================================================================
-- 2. Tabel `periode`
--    Periode pembelajaran (tahun ajaran + semester) beserta status penguncian
--    Jumlah data: 2 baris
-- ===========================================================================

DROP TABLE IF EXISTS `periode`;
CREATE TABLE `periode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  `semester` tinyint(4) NOT NULL,
  `tgl_mulai` date DEFAULT NULL,
  `tgl_selesai` date DEFAULT NULL,
  `status` enum('draft','aktif','terkunci') NOT NULL DEFAULT 'draft',
  `dikunci_oleh` int(11) DEFAULT NULL,
  `tgl_dikunci` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`),
  KEY `fk_periode_admin` (`dikunci_oleh`),
  CONSTRAINT `fk_periode_admin` FOREIGN KEY (`dikunci_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `periode` (`id`, `kode`, `tahun_ajaran`, `semester`, `tgl_mulai`, `tgl_selesai`, `status`, `dikunci_oleh`, `tgl_dikunci`, `created_at`) VALUES (1,'2025/2','2024/2025',2,'2025-01-06','2025-06-20','terkunci',1,'2025-06-25 10:00:00','2026-09-22 14:49:45');
INSERT INTO `periode` (`id`, `kode`, `tahun_ajaran`, `semester`, `tgl_mulai`, `tgl_selesai`, `status`, `dikunci_oleh`, `tgl_dikunci`, `created_at`) VALUES (2,'2026/1','2025/2026',1,'2025-07-14','2025-12-19','aktif',NULL,NULL,'2026-09-22 14:49:45');


-- ===========================================================================
-- 3. Tabel `kelas`
--    Rombongan belajar pada sebuah periode pembelajaran
--    Jumlah data: 7 baris
-- ===========================================================================

DROP TABLE IF EXISTS `kelas`;
CREATE TABLE `kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_periode` int(11) NOT NULL,
  `nama_kelas` varchar(50) NOT NULL,
  `tingkat` varchar(10) NOT NULL,
  `wali_kelas` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kelas_periode` (`id_periode`,`nama_kelas`),
  CONSTRAINT `fk_kelas_periode` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (1,2,'X MIPA 1','X','Budi Santoso, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (2,2,'X MIPA 2','X','Siti Aminah, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (3,2,'XI MIPA 1','XI','Rahmat Hidayat, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (4,2,'XI IPS 1','XI','Dina Marlina, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (5,2,'XII MIPA 1','XII','Hendra Wijaya, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (6,1,'X MIPA 1','X','Budi Santoso, S.Pd');
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `wali_kelas`) VALUES (7,1,'XI MIPA 1','XI','Rahmat Hidayat, S.Pd');


-- ===========================================================================
-- 4. Tabel `guru`
--    Profil guru, berelasi satu-satu dengan tabel users
--    Jumlah data: 6 baris
-- ===========================================================================

DROP TABLE IF EXISTS `guru`;
CREATE TABLE `guru` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_user` (`id_user`),
  CONSTRAINT `fk_guru_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (1,2,'198501012010011001','1985-01-01','Jl. Pahlawan No. 12, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (2,3,'198703152011012002','1987-03-15','Jl. Merdeka No. 5, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (3,4,'199002202015031003','1990-02-20','Jl. Bhayangkara No. 8, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (4,5,'199105102016042004','1991-05-10','Jl. Sudirman No. 21, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (5,6,'199304182018011005','1993-04-18','Jl. Diponegoro No. 3, Bangkuang');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (6,7,'199208232017042006','1992-08-23','Jl. Kartini No. 17, Bangkuang');


-- ===========================================================================
-- 5. Tabel `siswa`
--    Profil siswa, berelasi satu-satu dengan tabel users
--    Jumlah data: 16 baris
-- ===========================================================================

DROP TABLE IF EXISTS `siswa`;
CREATE TABLE `siswa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `nis` varchar(30) DEFAULT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_user` (`id_user`),
  CONSTRAINT `fk_siswa_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (1,8,'0012345678','2009-04-11','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (2,9,'0012345679','2009-06-23','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (3,10,'0012345680','2009-02-14','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (4,11,'0012345681','2009-09-30','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (5,12,'0012345682','2009-11-02','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (6,13,'0012345683','2009-01-19','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (7,14,'0012345684','2009-03-27','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (8,15,'0012345685','2009-07-08','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (9,16,'0012345686','2009-10-16','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (10,17,'0012345687','2008-05-05','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (11,18,'0012345688','2008-08-21','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (12,19,'0012345689','2008-12-12','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (13,20,'0012345690','2008-06-09','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (14,21,'0012345691','2008-10-25','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (15,22,'0012345692','2007-07-17','Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (16,24,'0012345699',NULL,NULL);


-- ===========================================================================
-- 6. Tabel `siswa_kelas`
--    Keanggotaan siswa pada sebuah kelas di setiap periode
--    Jumlah data: 19 baris
-- ===========================================================================

DROP TABLE IF EXISTS `siswa_kelas`;
CREATE TABLE `siswa_kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_siswa` int(11) NOT NULL,
  `id_kelas` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_siswa_kelas` (`id_siswa`,`id_kelas`),
  KEY `fk_sk_kelas` (`id_kelas`),
  CONSTRAINT `fk_sk_kelas` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sk_siswa` FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (1,1,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (2,2,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (3,3,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (4,4,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (5,5,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (6,6,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (7,7,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (8,8,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (9,9,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (10,10,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (16,10,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (11,11,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (17,11,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (12,12,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (18,12,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (13,13,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (14,14,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (15,15,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (19,16,1);


-- ===========================================================================
-- 7. Tabel `mata_pelajaran`
--    Katalog mata pelajaran sekolah
--    Jumlah data: 27 baris
-- ===========================================================================

DROP TABLE IF EXISTS `mata_pelajaran`;
CREATE TABLE `mata_pelajaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(120) NOT NULL,
  `kode` varchar(30) DEFAULT NULL,
  `kelompok` varchar(60) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (1,'Pendidikan Agama dan Budi Pekerti','PABP','Wajib','Mata pelajaran Pendidikan Agama dan Budi Pekerti pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (2,'Pendidikan Pancasila dan Kewarganegaraan','PPKN','Wajib','Mata pelajaran Pendidikan Pancasila dan Kewarganegaraan pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (3,'Bahasa Indonesia','BIND','Wajib','Mata pelajaran Bahasa Indonesia pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (4,'Matematika Wajib','MTK-W','Wajib','Mata pelajaran Matematika Wajib pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (5,'Sejarah Indonesia','SEJ-IND','Wajib','Mata pelajaran Sejarah Indonesia pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (6,'Bahasa Inggris','BING','Wajib','Mata pelajaran Bahasa Inggris pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (7,'Seni Budaya','SENBUD','Wajib','Mata pelajaran Seni Budaya pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (8,'Pendidikan Jasmani, Olahraga, dan Kesehatan','PJOK','Wajib','Mata pelajaran Pendidikan Jasmani, Olahraga, dan Kesehatan pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (9,'Prakarya dan Kewirausahaan','PKWU','Wajib','Mata pelajaran Prakarya dan Kewirausahaan pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (10,'Informatika','INFO','Wajib','Mata pelajaran Informatika pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (11,'Matematika Peminatan','MTK-P','Peminatan MIPA','Mata pelajaran Matematika Peminatan pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (12,'Fisika','FIS','Peminatan MIPA','Mata pelajaran Fisika pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (13,'Kimia','KIM','Peminatan MIPA','Mata pelajaran Kimia pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (14,'Biologi','BIO','Peminatan MIPA','Mata pelajaran Biologi pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (15,'Geografi','GEO','Peminatan IPS','Mata pelajaran Geografi pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (16,'Sejarah Peminatan','SEJ-P','Peminatan IPS','Mata pelajaran Sejarah Peminatan pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (17,'Sosiologi','SOS','Peminatan IPS','Mata pelajaran Sosiologi pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (18,'Ekonomi','EKO','Peminatan IPS','Mata pelajaran Ekonomi pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (19,'Antropologi','ANT','Peminatan IPS','Mata pelajaran Antropologi pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (20,'Bahasa dan Sastra Indonesia','BSI','Peminatan Bahasa','Mata pelajaran Bahasa dan Sastra Indonesia pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (21,'Bahasa dan Sastra Inggris','BSING','Peminatan Bahasa','Mata pelajaran Bahasa dan Sastra Inggris pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (22,'Bahasa Arab','BARAB','Peminatan Bahasa','Mata pelajaran Bahasa Arab pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (23,'Bahasa Mandarin','BMAND','Peminatan Bahasa','Mata pelajaran Bahasa Mandarin pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (24,'Bahasa Jepang','BJEP','Peminatan Bahasa','Mata pelajaran Bahasa Jepang pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (25,'Bahasa Dayak Ngaju','BDN','Muatan Lokal','Mata pelajaran Bahasa Dayak Ngaju pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (26,'Pendidikan Lingkungan Hidup','PLH','Muatan Lokal','Mata pelajaran Pendidikan Lingkungan Hidup pada kurikulum SMA',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (27,'Bimbingan dan Konseling','BK','Muatan Lokal','Mata pelajaran Bimbingan dan Konseling pada kurikulum SMA',1);


-- ===========================================================================
-- 8. Tabel `kelas_mapel`
--    Pengampuan: mata pelajaran pada sebuah kelas beserta guru pengampunya
--    Jumlah data: 17 baris
-- ===========================================================================

DROP TABLE IF EXISTS `kelas_mapel`;
CREATE TABLE `kelas_mapel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_kelas` int(11) NOT NULL,
  `id_mapel` int(11) NOT NULL,
  `id_guru` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kelas_mapel` (`id_kelas`,`id_mapel`),
  KEY `fk_km_mapel` (`id_mapel`),
  KEY `fk_km_guru` (`id_guru`),
  CONSTRAINT `fk_km_guru` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_km_kelas` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_km_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (1,1,4,1);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (2,1,3,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (3,1,12,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (4,1,6,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (5,1,13,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (6,1,10,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (7,2,4,1);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (8,2,3,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (9,2,12,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (10,3,11,1);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (11,3,3,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (12,3,14,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (13,4,18,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (14,4,3,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (15,5,4,1);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (16,6,4,1);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (17,6,3,2);


-- ===========================================================================
-- 9. Tabel `pertemuan`
--    Urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran
--    Jumlah data: 15 baris
-- ===========================================================================

DROP TABLE IF EXISTS `pertemuan`;
CREATE TABLE `pertemuan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_kelas_mapel` int(11) NOT NULL,
  `nomor` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pertemuan_nomor` (`id_kelas_mapel`,`nomor`),
  CONSTRAINT `fk_pertemuan_km` FOREIGN KEY (`id_kelas_mapel`) REFERENCES `kelas_mapel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (1,1,1,'Konsep Persamaan Linear Satu Variabel','Pengenalan bentuk umum persamaan linear satu variabel serta cara menentukan penyelesaiannya.','2026-09-01','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (2,1,2,'Pertidaksamaan Linear Satu Variabel','Sifat-sifat pertidaksamaan linear dan penyajian himpunan penyelesaian pada garis bilangan.','2026-09-08','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (3,1,3,'Sistem Persamaan Linear Dua Variabel','Penyelesaian SPLDV dengan metode substitusi, eliminasi, dan campuran.','2026-09-15','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (4,2,1,'Struktur dan Kaidah Teks Deskripsi','Mengenal struktur teks deskripsi serta kaidah kebahasaan yang digunakan.','2026-09-02','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (5,2,2,'Menelaah Teks Deskripsi','Menelaah penggunaan kata konkret dan majas dalam teks deskripsi.','2026-09-09','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (6,2,3,'Teks Eksposisi','Pengertian, struktur, dan ciri kebahasaan teks eksposisi.','2026-09-16','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (7,3,1,'Besaran dan Satuan','Besaran pokok, besaran turunan, dan satuan Sistem Internasional.','2026-09-03','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (8,3,2,'Vektor dan Resultan Gaya','Penjumlahan vektor dan penguraian vektor pada sumbu x dan y.','2026-09-10','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (9,4,1,'Descriptive Text','Social function, generic structure, and language features.','2026-09-04','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (10,5,1,'Struktur Atom','Perkembangan model atom dan konfigurasi elektron.','2026-09-05','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (11,6,1,'Berpikir Komputasional','Dekomposisi, pengenalan pola, abstraksi, dan algoritma.','2026-09-06','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (12,7,1,'Konsep Persamaan Linear Satu Variabel','Pengenalan persamaan linear satu variabel untuk kelas X MIPA 2.','2026-09-01','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (13,11,1,'Teks Prosedur Kompleks','Struktur dan kaidah kebahasaan teks prosedur kompleks.','2026-09-07','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (14,16,1,'Barisan dan Deret Aritmetika','Materi barisan dan deret aritmetika pada semester genap tahun ajaran 2024/2025.','2026-01-25','2026-09-22 14:49:47');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (15,17,1,'Teks Negosiasi','Struktur dan kaidah teks negosiasi.','2026-01-27','2026-09-22 14:49:47');


-- ===========================================================================
-- 10. Tabel `materi`
--    Materi pembelajaran (teks, berkas, video, tautan) pada sebuah pertemuan
--    Jumlah data: 21 baris
-- ===========================================================================

DROP TABLE IF EXISTS `materi`;
CREATE TABLE `materi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pertemuan` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `konten` text DEFAULT NULL,
  `tipe` enum('teks','file','video','link') NOT NULL DEFAULT 'teks',
  `file` varchar(255) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `tgl_upload` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_materi_pertemuan` (`id_pertemuan`),
  CONSTRAINT `fk_materi_pertemuan` FOREIGN KEY (`id_pertemuan`) REFERENCES `pertemuan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (1,1,'Pengantar Persamaan Linear Satu Variabel','Persamaan linear satu variabel adalah persamaan yang memuat tepat satu variabel berpangkat satu. Bentuk umumnya ax + b = 0 dengan a tidak sama dengan nol.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (2,1,'Modul Persamaan Linear Satu Variabel (PDF)','Modul lengkap beserta contoh soal dan pembahasan.','file','modul_persamaan_linear.pdf',NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (3,1,'Video Pembahasan Persamaan Linear','Video penjelasan langkah penyelesaian persamaan linear satu variabel.','link',NULL,'https://www.youtube.com/watch?v=aQ0hzJfy5hI','2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (4,2,'Sifat-Sifat Pertidaksamaan Linear','Apabila kedua ruas dikalikan atau dibagi bilangan negatif, maka tanda pertidaksamaan berbalik arah.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (5,3,'Metode Penyelesaian SPLDV','SPLDV dapat diselesaikan dengan metode substitusi, eliminasi, campuran, maupun grafik. Pemilihan metode disesuaikan dengan bentuk persamaannya.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (6,3,'Video Metode Eliminasi dan Substitusi','Tautan video pembelajaran mengenai metode eliminasi dan substitusi pada SPLDV.','link',NULL,'https://www.youtube.com/watch?v=3fRiC5tAcdU','2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (7,4,'Pengertian dan Struktur Teks Deskripsi','Teks deskripsi menggambarkan objek secara rinci sehingga pembaca seolah-olah melihat sendiri objek yang digambarkan. Strukturnya terdiri atas identifikasi, deskripsi bagian, dan penutup.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (8,4,'Modul Teks Deskripsi (PDF)','Modul lengkap teks deskripsi beserta contoh.','file','modul_teks_deskripsi.pdf',NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (9,5,'Kata Konkret dan Majas dalam Teks Deskripsi','Kata konkret membuat deskripsi terasa nyata, sedangkan majas membuat deskripsi menjadi lebih hidup.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (10,6,'Struktur Teks Eksposisi','Teks eksposisi tersusun atas tesis, rangkaian argumen, dan penegasan ulang.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (11,7,'Besaran Pokok dan Besaran Turunan','Terdapat tujuh besaran pokok dalam Sistem Internasional. Besaran turunan diperoleh dari kombinasi besaran-besaran pokok tersebut.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (12,7,'Modul Besaran dan Satuan (PDF)','Modul besaran, satuan, dan angka penting.','file','modul_besaran_satuan.pdf',NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (13,8,'Penjumlahan Vektor','Vektor dapat dijumlahkan dengan metode segitiga, jajargenjang, maupun poligon.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (14,8,'Video Penguraian Vektor','Video penjelasan penguraian vektor pada sumbu x dan y.','link',NULL,'https://www.youtube.com/watch?v=4xPqWPtHnMo','2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (15,9,'Generic Structure of Descriptive Text','A descriptive text consists of identification and description. It commonly uses simple present tense.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (16,10,'Perkembangan Model Atom','Model atom berkembang mulai dari Dalton, Thomson, Rutherford, Bohr, hingga model mekanika kuantum.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (17,11,'Empat Fondasi Berpikir Komputasional','Berpikir komputasional mencakup dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (18,12,'Pengantar Persamaan Linear','Materi pengantar persamaan linear satu variabel beserta contohnya.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (19,13,'Struktur Teks Prosedur Kompleks','Teks prosedur kompleks memuat tujuan, langkah-langkah, dan penegasan hasil.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (20,14,'Rumus Suku ke-n Barisan Aritmetika','Suku ke-n barisan aritmetika dirumuskan Un = a + (n-1)b.','teks',NULL,NULL,'2026-09-22 14:49:47');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (21,15,'Struktur Teks Negosiasi','Teks negosiasi terdiri atas orientasi, pengajuan, penawaran, dan persetujuan.','teks',NULL,NULL,'2026-09-22 14:49:47');


-- ===========================================================================
-- 11. Tabel `tugas`
--    Tugas dan kuis beserta tipe dan batas waktunya
--    Jumlah data: 11 baris
-- ===========================================================================

DROP TABLE IF EXISTS `tugas`;
CREATE TABLE `tugas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pertemuan` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `tipe` enum('tugas','kuis') NOT NULL DEFAULT 'tugas',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tugas_pertemuan` (`id_pertemuan`),
  CONSTRAINT `fk_tugas_pertemuan` FOREIGN KEY (`id_pertemuan`) REFERENCES `pertemuan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (1,1,'Latihan Persamaan Linear','Kerjakan soal nomor 1-10 pada buku paket halaman 25. Tulis langkah penyelesaian secara lengkap, lalu unggah dalam bentuk file atau tuliskan pada kolom jawaban.','2026-10-01 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (2,2,'Kuis Persamaan dan Pertidaksamaan Linear','Kuis pilihan ganda mengenai persamaan dan pertidaksamaan linear satu variabel. Dinilai otomatis oleh sistem.','2026-09-27 23:59:00','kuis','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (3,3,'Tugas Proyek SPLDV','Susunlah satu soal cerita yang dapat diselesaikan dengan SPLDV beserta penyelesaiannya, kemudian unggah dalam bentuk dokumen.','2026-09-24 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (4,4,'Tugas Menulis Teks Deskripsi','Buatlah sebuah teks deskripsi bertema \"Lingkungan Sekolahku\" minimal tiga paragraf sesuai struktur yang telah dipelajari.','2026-09-29 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (5,5,'Kuis Teks Deskripsi','Kuis singkat mengenai struktur teks deskripsi. Terdiri atas soal pilihan ganda dan satu soal esai.','2026-09-26 23:59:00','kuis','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (6,7,'Latihan Soal Besaran dan Satuan','Kerjakan latihan konversi satuan dan penulisan angka penting pada lembar kerja yang telah dibagikan.','2026-09-19 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (7,9,'Kuis Descriptive Text','Short quiz about the generic structure and language features of descriptive text.','2026-09-28 23:59:00','kuis','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (8,12,'Latihan Persamaan Linear (X MIPA 2)','Kerjakan soal nomor 1-10 pada buku paket halaman 25.','2026-10-01 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (9,13,'Tugas Menyusun Teks Prosedur','Susunlah teks prosedur kompleks mengenai kegiatan sehari-hari di sekitar kalian.','2026-09-30 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (10,14,'Latihan Barisan Aritmetika','Kerjakan soal barisan dan deret aritmetika nomor 1 sampai 10.','2026-03-06 23:59:00','tugas','2026-09-22 14:49:47');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (11,15,'Tugas Menyusun Teks Negosiasi','Susunlah sebuah teks negosiasi jual beli sesuai struktur yang telah dipelajari.','2026-03-01 23:59:00','tugas','2026-09-22 14:49:47');


-- ===========================================================================
-- 12. Tabel `soal`
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
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (6,5,'Teks yang menggambarkan suatu objek secara rinci disebut teks ...','pilihan_ganda','Narasi','Deskripsi','Eksposisi','Persuasi','B',25,1);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (7,5,'Struktur teks deskripsi yang benar adalah ...','pilihan_ganda','Identifikasi - Deskripsi bagian - Penutup','Orientasi - Komplikasi - Resolusi','Tesis - Argumen - Penegasan ulang','Pembuka - Isi - Salam penutup','A',25,2);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (8,5,'Kalimat berikut yang menggunakan kata konkret khas teks deskripsi adalah ...','pilihan_ganda','Sekolah itu bagus sekali.','Halaman sekolahku dipenuhi rumput hijau yang basah oleh embun pagi.','Menurut saya sekolah perlu diperbaiki.','Pertama, kita bahas struktur teks.','B',20,3);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (9,5,'Buatlah satu paragraf teks deskripsi singkat tentang lingkungan sekolahmu, minimal tiga kalimat!','esai',NULL,NULL,NULL,NULL,NULL,30,4);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (10,7,'The social function of a descriptive text is to ...','pilihan_ganda','entertain the readers with a story','describe a particular person, place, or thing','persuade the readers to do something','explain how to make something','B',25,1);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (11,7,'The generic structure of a descriptive text consists of ...','pilihan_ganda','Orientation and Events','Identification and Description','Thesis and Arguments','Goal and Steps','B',25,2);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (12,7,'Descriptive text mostly uses ... tense.','pilihan_ganda','simple present','simple past','present perfect','future','A',25,3);
INSERT INTO `soal` (`id`, `id_tugas`, `pertanyaan`, `tipe`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`, `bobot`, `urutan`) VALUES (13,7,'Write a short descriptive paragraph about your classroom (at least three sentences).','esai',NULL,NULL,NULL,NULL,NULL,25,4);


-- ===========================================================================
-- 13. Tabel `pengumpulan_tugas`
--    Pengumpulan jawaban tugas/kuis oleh siswa
--    Jumlah data: 32 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (1,10,10,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-02-28 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (2,10,11,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-02-28 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (3,10,12,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-02-27 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (4,11,10,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-03-02 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (5,11,11,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-03-02 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (6,11,12,NULL,'Pekerjaan dikumpulkan pada semester genap tahun ajaran 2024/2025.','2026-03-03 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (7,2,1,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (8,2,2,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (9,2,3,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (10,2,4,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (11,2,5,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (12,2,6,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (13,5,1,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (14,5,2,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (15,5,6,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (16,5,4,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (17,5,5,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (18,1,1,'1790088591320_jawaban_ahmad.txt','Nomor 1: 2x + 6 = 14 -> 2x = 8 -> x = 4.\r\nNomor 2: 3x - 9 = 0 -> 3x = 9 -> x = 3.\r\nNomor 3: 5x = 3x + 12 -> 2x = 12 -> x = 6.\r\nLangkah selengkapnya saya lampirkan pada berkas.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (19,1,2,'1790088591332_jawaban_dewi.txt','Seluruh soal nomor 1 sampai 10 telah saya kerjakan. Hasil pekerjaan saya tulis tangan lalu saya pindai dan lampirkan pada berkas terlampir.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (20,1,3,'1790088591344_jawaban_rian.txt','Nomor 1 sampai 8 sudah saya kerjakan, nomor 9 dan 10 masih saya ragu pada langkah pemindahan ruas. Mohon koreksinya, Pak.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (21,1,4,'1790088591367_jawaban_aisyah.txt','Jawaban lengkap nomor 1-10 terlampir pada berkas. Setiap nomor saya sertakan langkah pengerjaannya.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (22,1,6,'1790088591384_jawaban_putri.txt','Semua soal telah saya kerjakan beserta langkah-langkahnya, terlampir pada berkas jawaban.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (23,4,2,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala berdiri di tepi jalan utama Kecamatan Karau Kuala. Bangunannya bercat putih dengan lis biru yang tampak bersih setiap pagi.\r\n\r\nHalaman sekolah cukup luas dan ditumbuhi rumput hijau. Di tengahnya berdiri tiang bendera, sementara di sisi kiri berjajar pohon ketapang yang rindang.\r\n\r\nSuasana sekolahku sangat nyaman untuk belajar. Angin sejuk dari arah sungai membuat udara di ruang kelas tidak pernah terasa panas.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (24,4,6,NULL,'Lingkungan Sekolahku\r\n\r\nSekolahku terletak tidak jauh dari permukiman warga sehingga mudah dijangkau dengan sepeda.\r\n\r\nDi dalam kompleks sekolah terdapat dua belas ruang kelas, satu perpustakaan, dan sebuah laboratorium IPA. Lorong penghubungnya beratap seng sehingga siswa tetap terlindung ketika hujan.\r\n\r\nSetiap sudut sekolah dijaga kebersihannya oleh seluruh warga sekolah sehingga suasananya selalu asri.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (25,4,4,NULL,'Lingkungan Sekolahku\r\n\r\nGerbang sekolahku bercat hijau tua dan selalu terbuka sejak pukul enam pagi.\r\n\r\nDi sebelah kanan gerbang terdapat taman kecil dengan bunga kertas berwarna merah muda. Lapangan upacara berada tepat di tengah kompleks sekolah.\r\n\r\nAku sangat menyukai suasana sekolahku, terutama pada pagi hari ketika embun masih menempel di rumput lapangan.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (26,4,1,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala memiliki halaman depan yang luas dengan pagar besi berwarna hijau.\r\n\r\nRuang kelas berjajar rapi menghadap lapangan. Setiap kelas memiliki jendela besar sehingga cahaya matahari masuk dengan leluasa.\r\n\r\nKarena lingkungannya rindang dan bersih, aku merasa betah berlama-lama di sekolah.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (27,3,2,NULL,'Soal cerita: Harga 2 buku dan 3 pensil Rp 21.000, sedangkan 1 buku dan 2 pensil Rp 12.000. Dengan metode eliminasi diperoleh harga buku Rp 6.000 dan pensil Rp 3.000.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (28,3,4,NULL,'Soal cerita: Harga 2 buku dan 3 pensil Rp 21.000, sedangkan 1 buku dan 2 pensil Rp 12.000. Dengan metode eliminasi diperoleh harga buku Rp 6.000 dan pensil Rp 3.000.','2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (29,6,5,NULL,'Mohon maaf Pak, saya terlambat mengumpulkan karena jaringan internet di rumah bermasalah. Latihan konversi satuan nomor 1-10 sudah saya kerjakan seluruhnya.','2026-09-22 14:49:51',1);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (30,7,1,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (31,7,2,NULL,NULL,'2026-09-22 14:49:51',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (32,7,3,NULL,NULL,'2026-09-22 14:49:51',0);


-- ===========================================================================
-- 14. Tabel `jawaban_siswa`
--    Jawaban siswa pada setiap butir soal kuis
--    Jumlah data: 62 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (1,7,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (2,7,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (3,7,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (4,7,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (5,7,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (6,8,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (7,8,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (8,8,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (9,8,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (10,8,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (11,9,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (12,9,2,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (13,9,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (14,9,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (15,9,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (16,10,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (17,10,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (18,10,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (19,10,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (20,10,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (21,11,1,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (22,11,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (23,11,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (24,11,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (25,11,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (26,12,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (27,12,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (28,12,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (29,12,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (30,12,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (31,13,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (32,13,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (33,13,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (34,13,9,NULL,'Sekolahku berada di tepi jalan utama Bangkuang. Halamannya luas dengan rumput hijau yang selalu terpangkas rapi. Di depan ruang guru berdiri tiang bendera yang menjulang, dan di sampingnya berjajar pohon ketapang yang meneduhkan.',NULL,30.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (35,14,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (36,14,7,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (37,14,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (38,14,9,NULL,'SMA Negeri 1 Karau Kuala memiliki bangunan bercat putih kebiruan. Setiap pagi koridor kelas dipenuhi suara siswa yang bersiap belajar. Taman kecil di tengah sekolah ditanami bunga kertas berwarna-warni.',NULL,28.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (39,15,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (40,15,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (41,15,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (42,15,9,NULL,'Ruang kelasku cukup luas dan terang karena memiliki empat jendela besar. Di dinding depan terpasang papan tulis putih dan foto pahlawan. Udara di dalam kelas terasa sejuk saat pagi hari.',NULL,26.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (43,16,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (44,16,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (45,16,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (46,16,9,NULL,'Kantin sekolah berada di samping lapangan basket. Setiap istirahat aromanya harum oleh gorengan hangat. Meja-meja panjangnya selalu penuh oleh siswa yang bercengkerama.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (47,17,6,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (48,17,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (49,17,8,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (50,17,9,NULL,'Sekolahku bersih dan nyaman. Ada lapangan upacara di tengah.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (51,30,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (52,30,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (53,30,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (54,30,13,NULL,'My classroom is on the second floor of the school building. It has four large windows, so the room is always bright. There are thirty-two desks and a white board in front of the class.',NULL,23.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (55,31,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (56,31,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (57,31,12,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (58,31,13,NULL,'My classroom is clean and comfortable. The walls are painted light blue and there are some pictures of Indonesian heroes on them. I like studying there with my classmates.',NULL,22.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (59,32,10,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (60,32,11,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (61,32,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (62,32,13,NULL,'My classroom is big. There is a white board and many chairs.',NULL,NULL);


-- ===========================================================================
-- 15. Tabel `nilai`
--    Nilai hasil penilaian guru maupun koreksi otomatis sistem
--    Jumlah data: 26 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (1,1,1,88.00,'Pengerjaan runtut dan rumus digunakan dengan tepat.','2026-03-03 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (2,2,1,76.00,'Sudah benar, namun beberapa langkah masih dipersingkat.','2026-03-03 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (3,3,1,92.00,'Sangat baik, seluruh nomor dikerjakan dengan lengkap.','2026-03-02 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (4,4,2,85.00,'Struktur teks negosiasi sudah lengkap.','2026-03-05 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (5,5,2,80.00,'Bagian penawaran dapat dikembangkan lagi.','2026-03-05 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (6,6,2,90.00,'Dialog negosiasi tersusun sangat runtut.','2026-03-06 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (7,7,NULL,80.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (8,8,NULL,100.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (9,9,NULL,60.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (10,10,NULL,100.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (11,11,NULL,40.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (12,12,NULL,80.00,NULL,'2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (13,18,1,90.00,'Langkah pengerjaan sudah runtut dan benar. Pertahankan.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (14,19,1,85.00,'Jawaban benar, tulisan pada lampiran agar diperjelas lagi.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (15,21,1,95.00,'Sangat baik, seluruh langkah penyelesaian lengkap.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (16,22,1,88.00,'Pekerjaan rapi dan jawaban tepat.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (17,20,1,75.00,'Nomor 9 dan 10 masih keliru pada pemindahan ruas. Pelajari kembali.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (18,13,2,100.00,'Deskripsi sangat hidup dan struktur sudah tepat.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (19,14,2,73.00,'Deskripsi baik, tambahkan lagi penggunaan pancaindra.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (20,15,2,96.00,'Sudah sesuai struktur, kembangkan lagi deskripsi bagiannya.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (21,30,4,98.00,'Good description with clear details.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (22,31,4,72.00,'Good description with clear details.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (23,23,2,92.00,'Struktur lengkap dan deskripsi sangat hidup.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (24,25,2,90.00,'Pemilihan diksi sangat baik dan runtut.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (25,24,2,87.00,'Sudah baik, penutup dapat dipertegas lagi.','2026-09-22 14:49:51');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (26,29,3,78.00,'Jawaban benar, namun dikumpulkan melewati batas waktu.','2026-09-22 14:49:51');


-- ===========================================================================
-- 16. Tabel `forum_diskusi`
--    Topik dan balasan forum diskusi pada sebuah pertemuan
--    Jumlah data: 8 baris
-- ===========================================================================

DROP TABLE IF EXISTS `forum_diskusi`;
CREATE TABLE `forum_diskusi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pertemuan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `judul` varchar(200) DEFAULT NULL,
  `pesan` text NOT NULL,
  `id_parent` int(11) DEFAULT NULL,
  `tgl_post` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_forum_pertemuan` (`id_pertemuan`),
  KEY `fk_forum_user` (`id_user`),
  KEY `fk_forum_parent` (`id_parent`),
  CONSTRAINT `fk_forum_parent` FOREIGN KEY (`id_parent`) REFERENCES `forum_diskusi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_forum_pertemuan` FOREIGN KEY (`id_pertemuan`) REFERENCES `pertemuan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_forum_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (1,1,2,'Diskusi Pertemuan 1: Persamaan Linear','Selamat pagi anak-anak. Silakan tuliskan di forum ini bagian materi persamaan linear satu variabel yang masih sulit dipahami, nanti Bapak bahas ulang pada pertemuan berikutnya.',NULL,'2026-09-22 14:49:47');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (2,2,2,'Tanya Jawab Pertidaksamaan Linear','Bagian mana dari sifat pertidaksamaan yang paling sering membuat kalian keliru? Silakan tanyakan di sini.',NULL,'2026-09-22 14:49:47');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (3,4,3,'Tips Menulis Teks Deskripsi','Anak-anak, dalam menulis teks deskripsi gunakan pancaindra kalian: apa yang dilihat, didengar, dan dirasakan. Silakan tanyakan di sini jika ada kesulitan pada tugas menulis teks deskripsi.',NULL,'2026-09-22 14:49:47');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (4,7,4,'Pengumpulan Latihan Besaran dan Satuan','Batas waktu pengumpulan latihan soal besaran dan satuan sudah berakhir. Bagi yang belum mengumpulkan, silakan hubungi Bapak dan tetap unggah pekerjaan kalian melalui sistem.',NULL,'2026-09-22 14:49:47');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (5,1,2,'Kesulitan pada Latihan Persamaan Linear','Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',NULL,'2026-09-22 14:49:51');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (6,1,8,NULL,'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',5,'2026-09-22 14:49:51');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (7,1,2,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',5,'2026-09-22 14:49:51');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (8,1,9,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',5,'2026-09-22 14:49:51');


-- ===========================================================================
-- Selesai. Total 305 baris data pada 16 tabel.
-- ===========================================================================

SET FOREIGN_KEY_CHECKS = 1;
