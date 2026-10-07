-- ===========================================================================
-- BASIS DATA SISTEM E-LEARNING SMA NEGERI 1 KARAU KUALA
-- Rancang Bangun Sistem E-Learning Berbasis Web di SMA Negeri 1 Karau Kuala
-- ===========================================================================
--
-- Berkas ini berisi struktur tabel beserta seluruh data yang digunakan pada
-- BAB IV Hasil dan Pembahasan, yaitu data yang tampil pada seluruh tangkapan
-- layar sistem dan data hasil pengujian Black Box Testing (95 skenario).
--
-- Data guru, mata pelajaran, pembagian tugas mengajar, wali kelas, kelas, dan
-- siswa merupakan data nyata SMA Negeri 1 Karau Kuala Tahun Ajaran 2025/2026.
--
-- Basis data memuat dua periode pembelajaran:
--   2026/2 (Tahun Ajaran 2025/2026 Genap)  berstatus AKTIF
--   2026/1 (Tahun Ajaran 2025/2026 Ganjil) berstatus TERKUNCI sebagai arsip
--
-- DBMS            : MySQL / MariaDB
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
-- Kata sandi seluruh akun disimpan dalam bentuk terenkripsi (bcrypt).
-- Kata sandi bawaan: administrator "admin123", guru "guru123",
-- dan siswa "siswa123". Alamat surel tiap pengguna dapat dilihat pada
-- tabel users setelah berkas ini diimpor.
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
--    Jumlah data: 316 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (1,'Administrator','admin@smakk.sch.id','$2a$10$vlVJJkF5FhRuG8Itz53Qnurv2ACiC.7UCRCrQrGDkiuBuq9Scex.C','admin',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (2,'Yunita Pebrianti, S.Pd','yunita@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (3,'Hermilawaty, S.Ag','hermilawaty@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (4,'Mahlian, S.Pd','mahlian@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (5,'Nurlaila, S.Pd','nurlaila@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (6,'Halifah, S.P','halifah@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (7,'Samjuhdi, S.P','samjuhdi@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (8,'Martaniah, S.Pd','martaniah@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (9,'Ramayadi Jaya, S.Pd','ramayadi@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (10,'Edy Priyono, S.E','edy@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (11,'Sugianoor, S.Sos','sugianoor@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (12,'Muhammad Rahmadani, S.Pd','muhammad@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (13,'Widayani, S.Pd','widayani@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (14,'Herman Katoppo, S.Pd','herman@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (15,'Siti Kamariah, S. Pd','siti@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (16,'Bardin, S.Pd','bardin@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (17,'Robet Januar Simanjuntak, S.Pd','robet@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (18,'Mariani, S.Th','mariani@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (19,'Wahono Isnandar, S.Pd','wahono@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (20,'Eka Susilawati, , S.Pd.I','eka@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (21,'Dewi Sartika, S.Pd','dewi@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (22,'Andi Ilhami, S.Kom','andi@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (23,'Akhmad Riko, S.Pd.i','akhmad@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (24,'Janatin, S.Pd.I','janatin@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (25,'Nesvi Lianti Ml, S.Pd','nesvi@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (26,'Kenny Yohanes Tiago, S.Pd','kenny@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (27,'Laily Mustika, S.Pd.I','laily@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (28,'Asnin Warianto, S.Pd.I','asnin@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (29,'Rita Feronika, S.Pd','rita@smakk.sch.id','$2a$10$Wjh1T.R/Nvi0.9QCVtUequndEGC0QbrBjC.oUFD.blf0ovwfwv0De','guru',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (30,'Ahmad Hanapi','ahmad@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (31,'Ahmad Raviza','ahmad.raviza@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (32,'Aminatul Najua','aminatul@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (33,'Audiyah','audiyah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (34,'Bunga Citra','bunga@siswa.smakk.sch.id','$2a$10$jspwL43wEmyjJgIi6vDiOOJtVs4tf4tlTDe0vu.7r8Twm376giVxy','siswa',NULL,1,'2026-10-05 12:14:54');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (35,'Dhika Wahyu Ramadhan','dhika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (36,'Dira Permata Sari','dira@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (37,'Eka Purnama Sari','eka@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (38,'Fajrianor','fajrianor@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (39,'Fatimah Azahra','fatimah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (40,'Fuza Nabila Syabaniah','fuza@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (41,'Hidayatul Firdaus','hidayatul@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (42,'Ihwan','ihwan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (43,'Irpan','irpan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (44,'Jannatul Fatwa','jannatul@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (45,'M. Hafi Ramadhani','m@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (46,'Mega','mega@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (47,'Muhamad Al Fiqih','muhamad@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (48,'Muhammad Rafli Bahtiar','muhammad@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (49,'Nor Djahra','nor@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (50,'Nurjannah','nurjannah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (51,'Putri','putri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (52,'Rahmad Andika','rahmad@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (53,'Ramadani','ramadani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (54,'Riszayanti','riszayanti@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (55,'Salsa Billa','salsa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (56,'Wenisa','wenisa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (57,'Yuanita Septia Putri','yuanita@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (58,'Adya Syakira','adya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (59,'Ahmat Baihaqi','ahmat@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (60,'Alif Permana Wiguna','alif@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (61,'Amira Febriana','amira@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (62,'Andini','andini@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (63,'Anggi Gladis Prasetyo','anggi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (64,'Ariska','ariska@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (65,'Citra Lestari','citra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (66,'Fitreal Ramadhan','fitreal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (67,'Gina Patimah','gina@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (68,'Haidir','haidir@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (69,'Herni','herni@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (70,'Ipnu Malik','ipnu@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (71,'Irma Hidayanti','irma@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (72,'Lestari','lestari@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (73,'Muhamad Akbar','muhamad.akbar@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (74,'Muhammad Rehan Fadillah','muhammad.rehan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (75,'Muhammad Zainal Arsyad','muhammad.zainal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (76,'Mutiara Ramadhani','mutiara@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (77,'Nadia Vega','nadia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (78,'Norviona','norviona@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (79,'Putri Adinda','putri.adinda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (80,'Ridho','ridho@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (81,'Rivana','rivana@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (82,'Safari','safari@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (83,'Sarah','sarah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (84,'Selpia','selpia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (85,'Agus Rahmadan','agus@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (86,'Ahmad Salihin','ahmad.salihin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (87,'Andini Raniah','andini.raniah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (88,'Anggi Ameliya','anggi.ameliya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (89,'An-nissa Oktavia','annissa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (90,'Diky','diky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (91,'Hafizah','hafizah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (92,'Jhamal Muqthi','jhamal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (93,'Laura','laura@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (94,'M. Dziqri Yewosa Aulia','m.dziqri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (95,'Mellani Assyifa Zahra','mellani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (96,'Muhamad Afif Ramadan','muhamad.afif@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (97,'Muhammad Patjri','muhammad.patjri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (98,'Muhammad Zailani','muhammad.zailani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (99,'Murlan','murlan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (100,'Naila Sabrina','naila@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (101,'Putri','putri2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (102,'Repal Aditya','repal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (103,'Rifky','rifky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (104,'Riska Alfia','riska@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (105,'Risky Adithia','risky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (106,'Rizka Angriani','rizka@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (107,'Sri Andini','sri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (108,'Sri Diana Wulan Dari','sri.diana@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (109,'Syahrini','syahrini@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (110,'Widya Hargianti','widya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (111,'Yunita Fitri','yunita@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (112,'Zahra As-syifa Muslimah Zatiah','zahra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (113,'Ahmad Fadilah','ahmad.fadilah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (114,'Ahmad Rizal','ahmad.rizal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (115,'Ahmad Said','ahmad.said@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (116,'Ahmat Tri Wahyudi','ahmat.tri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (117,'Alina Az-zahra','alina@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (118,'Angga Wardana','angga@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (119,'Anggi Novita Sari','anggi.novita@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (120,'Assyifa','assyifa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (121,'Aulia Rahmah','aulia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (122,'Dila Oktavia','dila@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (123,'Dimas Saputra','dimas@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (124,'Evellin Oktavirena','evellin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (125,'Khelda','khelda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (126,'Marvel','marvel@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (127,'Maulidin','maulidin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (128,'Muhammad Al Imbran','muhammad.al@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (129,'Muhammad Husiin','muhammad.husiin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (130,'Muhammad Rehan','muhammad2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (131,'Muhammad Saman Husein','muhammad.saman@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (132,'Muhammad Yusril Reza Banjaran','muhammad.yusril@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (133,'Muttia Indriani Meiysa','muttia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (134,'Nor Aini','nor.aini@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (135,'Putri Aliya','putri.aliya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (136,'Ratih Rahmah','ratih@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (137,'Raudatul Jannah','raudatul@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (138,'Refandry','refandry@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (139,'Rehan','rehan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (140,'Risma Diyanti','risma@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (141,'Sri Windawati Angraini','sri.windawati@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (142,'Andhika','andhika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:55');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (143,'Arisma','arisma@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (144,'Chelsea','chelsea@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (145,'Dede Aditya','dede@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (146,'Divo Yulianto','divo@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (147,'Geby Yemima Dotia','geby@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (148,'Imelda','imelda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (149,'Jauhari Afdan','jauhari@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (150,'M. Dimastian','m.dimastian@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (151,'M. Lutvino Mardian','m.lutvino@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (152,'M. Sahril Ramadan','m.sahril@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (153,'M.junaidi','mjunaidi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (154,'Maemunah','maemunah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (155,'Melda','melda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (156,'Muhamad Zailafif','muhamad.zailafif@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (157,'Muhammad Patdli Yanor','muhammad.patdli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (158,'Muhammad Rafli','muhammad.rafli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (159,'Muhammad Ramadhani Satya','muhammad.ramadhani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (160,'Noor Patimah','noor@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (161,'Nur Putria Wati','nur@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (162,'Nurmala','nurmala@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (163,'Rahmadani','rahmadani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (164,'Riskia Aditia Rahman','riskia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (165,'Rohin','rohin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (166,'Sayang','sayang@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (167,'Siti Rahmah','siti@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (168,'Sulis','sulis@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (169,'Winda','winda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (170,'Zilva Natasya Putri','zilva@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (171,'Akhmad Rusyadi','akhmad@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (172,'Annisa Ramadani','annisa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (173,'Dhea Syafira','dhea@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (174,'Gogi Gustaman','gogi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (175,'Gujali Rahman','gujali@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (176,'Haili','haili@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (177,'Hilda Putri Norcahyani','hilda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (178,'Jailani','jailani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (179,'Kamariyah','kamariyah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (180,'Karmilo Darprianto','karmilo@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (181,'Ledianto','ledianto@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (182,'M. Risky Aditya','m.risky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (183,'Mahdiah','mahdiah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (184,'Maripatu Shaleha','maripatu@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (185,'Muhamad Muzakir','muhamad.muzakir@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (186,'Muhamad Yoga','muhamad.yoga@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (187,'Muhammad Khairani','muhammad.khairani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (188,'Muhammad Rifky','muhammad.rifky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (189,'Muhammad Risky Gazali','muhammad.risky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (190,'Mujainah','mujainah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (191,'Nadia','nadia2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (192,'Najirah','najirah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (193,'Raihannah','raihannah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (194,'Ratna Safa','ratna@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (195,'Resto Achmad Fauzi','resto@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (196,'Sait','sait@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (197,'Stef Pany Debora','stef@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (198,'Wahyu Ramadhani','wahyu@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (199,'Ahmad Naz\'ril Affan Isbiantoro','ahmad.nazril@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (200,'Ahmad Ramadan','ahmad.ramadan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (201,'Alan','alan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (202,'Andre','andre@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (203,'Bela','bela@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (204,'Denis Hertanto','denis@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (205,'Dini Pertiwi','dini@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (206,'Efrida','efrida@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (207,'Erni Elisa','erni@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (208,'Herno Mey Lino','herno@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (209,'Irpan','irpan2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (210,'Jailani','jailani2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (211,'Kasih','kasih@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (212,'Lestary','lestary@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (213,'Muhammad Ridwan Rifai','muhammad.ridwan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (214,'Muhammad Rizki','muhammad.rizki@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (215,'Mu\'min','mumin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (216,'Nabila','nabila@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (217,'Rahmah Liana','rahmah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (218,'Ramadan','ramadan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (219,'Resky Pratama','resky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (220,'Reyndra Ahmad','reyndra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (221,'Rima Aulia','rima@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (222,'Risma Putri','risma.putri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (223,'Rolan','rolan@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (224,'Sabda','sabda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (225,'Sipha','sipha@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (226,'Siska','siska@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (227,'Afdillah','afdillah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (228,'Ahmad Hariyanto','ahmad.hariyanto@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (229,'Ahmad Indra Zulpani','ahmad.indra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (230,'Ahmad Rafli Susanto','ahmad.rafli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (231,'Alwi','alwi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (232,'Anugerah Shania','anugerah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (233,'Azfa Intan Putri Afin','azfa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (234,'Azzahra','azzahra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (235,'Denis Prayoga','denis.prayoga@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (236,'Isranudin','isranudin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (237,'Jefri Insani','jefri@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (238,'Ledy Saputra','ledy@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (239,'M. Habibi Faith Islamuzzaid','m.habibi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (240,'Muhammad Pajli','muhammad.pajli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (241,'Muhammad Ramadhani','muhammad3@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (242,'Muhammad Sabirin','muhammad.sabirin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (243,'Najmi Afifah Khairani','najmi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (244,'Nina','nina@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (245,'Noor Hidayanti','noor.hidayanti@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (246,'Nor Aena','nor.aena@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (247,'Qa\'id Adly Setya','qaid@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (248,'Radit','radit@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (249,'Rafi Hidayat','rafi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (250,'Raka Dewangga','raka@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (251,'Rassya','rassya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (252,'Rasti','rasti@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (253,'Sarif Hidayat','sarif@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (254,'Shintia Halwa Nurinayaty','shintia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (255,'Sri Dewi Meranti','sri.dewi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (256,'Vitha Tussittah','vitha@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (257,'Zaid As Shiddiq','zaid@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (258,'Adrian Noval','adrian@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (259,'Aulia Ulfah','aulia.ulfah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (260,'Aurel Cintami Putri','aurel@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (261,'Bintang Surya','bintang@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (262,'Cindy Oktarissa','cindy@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (263,'Desi Ratna Sari','desi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (264,'Dinda','dinda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:56');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (265,'Fatmah A\'zahra','fatmah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (266,'Hanny Rukmana','hanny@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (267,'Helda Putri','helda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (268,'Indra Gunawan','indra@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (269,'Jesti Mutiara','jesti@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (270,'Kamelia','kamelia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (271,'Lisa Marsela','lisa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (272,'Milla Elka Normasari','milla@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (273,'Monika','monika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (274,'Muhamad Amin Badali','muhamad.amin@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (275,'Muhamadi Saputra','muhamadi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (276,'Muhammad Rizky Hidayat','muhammad.rizky@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (277,'Muhammad Subli','muhammad.subli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (278,'Norhadijah','norhadijah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (279,'Ongki Saputra','ongki@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (280,'Prinda Agata','prinda@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (281,'Putri Aprilia','putri.aprilia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (282,'Rahmi Yatika','rahmi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (283,'Rico Valentino','rico@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (284,'Riki Delta','riki@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (285,'Sera Nabila','sera@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (286,'Siti Cahaya Murni','siti.cahaya@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (287,'Zahratunnissa','zahratunnissa@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (288,'Zulkifli','zulkifli@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (289,'Ahmad Dika','ahmad.dika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (290,'Ahmad Firdaus','ahmad.firdaus@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (291,'Ahmad Wahyu Deriyanto','ahmad.wahyu@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (292,'Cinta Lestari','cinta@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (293,'Denis Permana Putra','denis.permana@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (294,'Fajrianor','fajrianor2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (295,'Hepni','hepni@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (296,'Husnul Khatimah','husnul@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (297,'Imam','imam@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (298,'Indra','indra2@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (299,'Iqbal','iqbal@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (300,'Levi Yanor','levi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (301,'M Rah Ar Am Yewosa Aulia','m.rah@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (302,'Melati Annailla Dewi','melati@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (303,'Muhammad Dani','muhammad.dani@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (304,'Muhammad Dika','muhammad.dika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (305,'Muhammad Ridali','muhammad.ridali@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (306,'Nero','nero@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (307,'Nor Reka Sari','nor.reka@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (308,'Norlika','norlika@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (309,'Nurimbi','nurimbi@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (310,'Oktavia Rahmadani','oktavia@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (311,'Riska Wulandari','riska.wulandari@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (312,'Safira Mehra','safira@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (313,'Salfaniy','salfaniy@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (314,'Sandy','sandy@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (315,'Satrio Wijaksono','satrio@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `aktif`, `created_at`) VALUES (316,'Verlita Valentina','verlita@siswa.smakk.sch.id','$2a$10$0xrCp77199qbqjJnXwD0Y.AXBA2pUBxq7Op5eWCn0cY0.Yc4wSQkG','siswa',NULL,1,'2026-10-05 12:14:57');


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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `periode` (`id`, `kode`, `tahun_ajaran`, `semester`, `tgl_mulai`, `tgl_selesai`, `status`, `dikunci_oleh`, `tgl_dikunci`, `created_at`) VALUES (1,'2026/1','2025/2026',1,'2025-07-14','2025-12-19','terkunci',1,'2025-12-22 10:00:00','2026-10-05 12:14:54');
INSERT INTO `periode` (`id`, `kode`, `tahun_ajaran`, `semester`, `tgl_mulai`, `tgl_selesai`, `status`, `dikunci_oleh`, `tgl_dikunci`, `created_at`) VALUES (2,'2026/2','2025/2026',2,'2026-01-05','2026-06-19','aktif',NULL,NULL,'2026-10-05 12:14:54');


-- ===========================================================================
-- 3. Tabel `guru`
--    Profil guru, berelasi satu-satu dengan tabel users
--    Jumlah data: 28 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (1,2,'19920222 201503 0 002',NULL,'KEPALA SEKOLAH');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (2,3,'19741215 200701 2 011',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (3,4,'19670209 199403 1 014',NULL,'GURU TETAP · KEPALA PERPUST');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (4,5,'19770203 200701 2 009',NULL,'GURU TETAP · wali Kls, ekstrakul');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (5,6,'19780227 200701 2 009',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (6,7,'19720616 200501 1 017',NULL,'GURU TETAP · WAKA KURIKLM');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (7,8,'19780426 200604 2 028',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (8,9,'19750320 200604 1 025',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (9,10,'19751125 2006041 021',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (10,11,'19780416 200904 1 001',NULL,'GURU TETAP · WAKA SARPRAS');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (11,12,'19780829 200904 1 001',NULL,'GURU TETAP · KOOR.P5 X A,B,C');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (12,13,'19851216 200904 2 001',NULL,'GURU TETAP · wali, eks, pikt');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (13,14,'19810704 201001 1 007',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (14,15,'19840622 201001 2 012',NULL,'GURU TETAP · KEPALA LABORATM');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (15,16,'19740602 200701 1 012',NULL,'GURU TETAP');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (16,17,'19880109 202012 1 011',NULL,'GURU TETAP · OPERATOR');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (17,18,'19871026 202221 2 004',NULL,'PPPK');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (18,19,'19951116 202221 1 005',NULL,'PPPK · WAKA HUMAS');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (19,20,'19901106 202421 2 004',NULL,'PPPK');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (20,21,'19910515 202421 2 001',NULL,'PPPK');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (21,22,'19981104 202421 1 001',NULL,'PPPK · KOOR. P5 X1 C,D');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (22,23,'19911011 202521 1 005',NULL,'PPPK · WAKA KESISWAAN');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (23,24,'19870919 202421 2 003',NULL,'PPPK');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (24,25,'19950716 202421 2 007',NULL,'PPPK · KOOR. P5 XII A,B,C');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (25,26,'19980811 202421 1 007',NULL,'PPPK');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (26,27,NULL,NULL,'GTT PROVINSI · KOOR. P5 XI A,B');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (27,28,NULL,NULL,'GTT PROVINSI');
INSERT INTO `guru` (`id`, `id_user`, `nip`, `tgl_lahir`, `alamat`) VALUES (28,29,NULL,NULL,'GTT PROVINSI');


-- ===========================================================================
-- 4. Tabel `siswa`
--    Profil siswa, berelasi satu-satu dengan tabel users
--    Jumlah data: 287 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (1,30,'3001',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (2,31,'3002',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (3,32,'3005',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (4,33,'3013',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (5,34,'3014',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (6,35,'3016',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (7,36,'3018',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (8,37,'3019',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (9,38,'3021',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (10,39,'3022',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (11,40,'3024',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (12,41,'3029',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (13,42,'3030',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (14,43,'3033',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (15,44,'3034',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (16,45,'3038',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (17,46,'3039',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (18,47,'3043',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (19,48,'3045',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (20,49,'3053',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (21,50,'3055',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (22,51,'3056',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (23,52,'3059',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (24,53,'3060',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (25,54,'3066',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (26,55,'3070',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (27,56,'3076',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (28,57,'3078',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (29,58,'2999',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (30,59,NULL,NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (31,60,'3004',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (32,61,'3006',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (33,62,'3008',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (34,63,'3011',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (35,64,'3012',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (36,65,'3015',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (37,66,'3023',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (38,67,'3025',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (39,68,'3027',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (40,69,'3028',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (41,70,'3031',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (42,71,'3032',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (43,72,'3036',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (44,73,'3042',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (45,74,'3046',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (46,75,'3048',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (47,76,'3050',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (48,77,'3051',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (49,78,'3054',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (50,79,'3058',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (51,80,'3062',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (52,81,'3067',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (53,82,'3069',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (54,83,'3071',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (55,84,'3072',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (56,85,'3000',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (57,86,'3003',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (58,87,'3009',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (59,88,'3010',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (60,89,'3007',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (61,90,'3017',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (62,91,'3026',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (63,92,NULL,NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (64,93,'3035',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (65,94,'3037',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (66,95,'3040',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (67,96,'3041',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (68,97,'3044',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (69,98,'3047',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (70,99,'3049',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (71,100,'3052',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (72,101,'3057',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (73,102,'3061',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (74,103,'3063',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (75,104,'3064',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (76,105,'3065',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (77,106,'3068',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (78,107,'3073',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (79,108,'3074',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (80,109,'3075',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (81,110,'3077',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (82,111,'3079',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (83,112,'3080',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (84,113,'2910',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (85,114,'2940',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (86,115,'2912',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (87,116,'2913',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (88,117,'2943',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (89,118,'2915',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (90,119,'2882',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (91,120,'2945',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (92,121,'2883',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (93,122,'2918',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (94,123,'2948',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (95,124,'3020',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (96,125,'2957',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (97,126,'2926',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (98,127,'2927',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (99,128,'2894',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (100,129,'2928',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (101,130,'2896',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (102,131,'2897',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (103,132,'2898',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (104,133,'2900',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (105,134,'2978',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (106,135,'2901',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (107,136,'2982',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (108,137,'2984',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (109,138,'2985',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (110,139,'2904',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (111,140,'2905',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (112,141,'2994',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (113,142,'2881',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (114,143,'2944',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (115,144,'2947',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (116,145,'2884',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (117,146,'2887',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (118,147,'2888',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (119,148,'2951',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (120,149,'2955',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (121,150,'2959',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (122,151,'2925',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (123,152,'2960',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (124,153,'2961',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (125,154,'2962',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (126,155,'2966',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (127,156,'2893',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (128,157,'2970',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (129,158,'2971',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (130,159,'2895',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (131,160,'2977',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (132,161,'2979',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (133,162,'2932',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (134,163,'2980',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (135,164,'2988',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (136,165,'2906',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (137,166,'2991',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (138,167,'2993',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (139,168,'2995',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (140,169,'2997',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (141,170,'2938',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (142,171,'2941',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (143,172,'2916',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (144,173,'2885',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (145,174,'2949',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (146,175,'2921',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (147,176,'2950',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (148,177,'2889',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (149,178,'2954',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (150,179,'2890',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (151,180,'2956',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (152,181,'2958',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (153,182,'2891',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (154,183,'2963',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (155,184,'2964',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (156,185,'2967',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (157,186,'2968',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (158,187,'2969',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (159,188,'2973',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (160,189,'2974',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (161,190,'2899',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (162,191,'2976',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (163,192,'2930',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (164,193,'2902',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (165,194,'2983',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (166,195,'2934',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (167,196,'2990',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (168,197,'2909',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (169,198,'2996',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (170,199,'2911',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (171,200,'2939',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (172,201,'2942',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (173,202,'2914',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (174,203,'2946',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (175,204,'2917',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (176,205,'2886',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (177,206,'2919',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (178,207,'2920',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (179,208,'2922',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (180,209,'2952',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (181,210,'2953',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (182,211,'2923',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (183,212,'2924',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (184,213,'2972',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (185,214,'2975',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (186,215,'2892',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (187,216,'2929',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (188,217,'2981',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (189,218,'2903',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (190,219,'2933',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (191,220,'2935',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (192,221,'2987',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (193,222,'2936',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (194,223,'2907',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (195,224,'2989',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (196,225,'2908',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (197,226,'2992',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (198,227,'0082874740',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (199,228,'0086192178',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (200,229,'0071626491',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (201,230,'0088982399',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (202,231,'0077147371',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (203,232,'0086436186',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (204,233,'0084179723',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (205,234,'0089659447',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (206,235,'0088503473',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (207,236,'0081267949',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (208,237,'0075728988',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (209,238,'0088896586',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (210,239,'0083832015',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (211,240,'0079901796',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (212,241,'0069592394',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (213,242,'0076846901',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (214,243,'0074539178',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (215,244,'0081037149',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (216,245,'0085438024',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (217,246,'0087085500',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (218,247,'0092211868',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (219,248,'3082664756',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (220,249,'0086108565',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (221,250,'0069103944',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (222,251,'0082565780',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (223,252,NULL,NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (224,253,'0083401529',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (225,254,'0084171155',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (226,255,'0081687020',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (227,256,'0088883296',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (228,257,'0075594400',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (229,258,'0089837336',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (230,259,'0085966400',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (231,260,'0082836788',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (232,261,'0071106726',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (233,262,'0095201686',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (234,263,'0073902825',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (235,264,'0084553651',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (236,265,'0087677465',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (237,266,'0088088598',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (238,267,'0087121632',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (239,268,'0079159367',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (240,269,'0087680959',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (241,270,'0078266189',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (242,271,'0073107142',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (243,272,'0083730850',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (244,273,'0088989849',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (245,274,'0081836083',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (246,275,'0076982143',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (247,276,'0088449166',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (248,277,'0078120227',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (249,278,'0082559518',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (250,279,'0077957625',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (251,280,'0088850795',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (252,281,'0086846126',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (253,282,'0089464608',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (254,283,'0083501440',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (255,284,'0088632731',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (256,285,'0088329569',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (257,286,'0082509053',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (258,287,'3083690484',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (259,288,'0089034388',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (260,289,'0081664438',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (261,290,'0081574780',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (262,291,'0089426327',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (263,292,'0086665552',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (264,293,'0088822696',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (265,294,'0075584827',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (266,295,'0085714768',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (267,296,'0084850945',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (268,297,'0078748047',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (269,298,'0087659214',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (270,299,'0073893045',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (271,300,'0083656540',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (272,301,'3089168369',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (273,302,'0089635062',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (274,303,'0075489107',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (275,304,'0086172095',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (276,305,'0088181226',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (277,306,'0063010440',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (278,307,'0073441107',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (279,308,'3081701168',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (280,309,'0082105960',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (281,310,'0072195721',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (282,311,'0082023616',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (283,312,'0082435727',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (284,313,'3080055945',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (285,314,'0088732825',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (286,315,'0086420925',NULL,'Kecamatan Karau Kuala, Barito Selatan');
INSERT INTO `siswa` (`id`, `id_user`, `nis`, `tgl_lahir`, `alamat`) VALUES (287,316,'0082583551',NULL,'Kecamatan Karau Kuala, Barito Selatan');


-- ===========================================================================
-- 5. Tabel `kelas`
--    Rombongan belajar pada sebuah periode beserta wali kelasnya
--    Jumlah data: 20 baris
-- ===========================================================================

DROP TABLE IF EXISTS `kelas`;
CREATE TABLE `kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_periode` int(11) NOT NULL,
  `nama_kelas` varchar(50) NOT NULL,
  `tingkat` varchar(10) NOT NULL,
  `id_wali` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kelas_periode` (`id_periode`,`nama_kelas`),
  KEY `fk_kelas_wali` (`id_wali`),
  CONSTRAINT `fk_kelas_periode` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_kelas_wali` FOREIGN KEY (`id_wali`) REFERENCES `guru` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (1,1,'X A','X',5);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (2,1,'X B','X',27);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (3,1,'X C','X',4);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (4,1,'XI A','XI',22);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (5,1,'XI B','XI',7);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (6,1,'XI C','XI',24);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (7,1,'XI D','XI',20);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (8,1,'XII A','XII',26);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (9,1,'XII B','XII',23);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (10,1,'XII C','XII',12);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (11,2,'X A','X',5);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (12,2,'X B','X',27);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (13,2,'X C','X',4);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (14,2,'XI A','XI',22);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (15,2,'XI B','XI',7);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (16,2,'XI C','XI',24);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (17,2,'XI D','XI',20);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (18,2,'XII A','XII',26);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (19,2,'XII B','XII',23);
INSERT INTO `kelas` (`id`, `id_periode`, `nama_kelas`, `tingkat`, `id_wali`) VALUES (20,2,'XII C','XII',12);


-- ===========================================================================
-- 6. Tabel `siswa_kelas`
--    Keanggotaan siswa pada sebuah kelas di setiap periode
--    Jumlah data: 574 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (1,1,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (2,1,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (3,2,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (4,2,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (5,3,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (6,3,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (7,4,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (8,4,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (9,5,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (10,5,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (11,6,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (12,6,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (13,7,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (14,7,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (15,8,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (16,8,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (17,9,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (18,9,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (19,10,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (20,10,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (21,11,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (22,11,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (23,12,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (24,12,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (25,13,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (26,13,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (27,14,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (28,14,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (29,15,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (30,15,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (31,16,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (32,16,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (33,17,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (34,17,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (35,18,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (36,18,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (37,19,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (38,19,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (39,20,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (40,20,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (41,21,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (42,21,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (43,22,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (44,22,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (45,23,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (46,23,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (47,24,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (48,24,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (49,25,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (50,25,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (51,26,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (52,26,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (53,27,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (54,27,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (55,28,1);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (56,28,11);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (57,29,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (58,29,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (59,30,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (60,30,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (61,31,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (62,31,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (63,32,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (64,32,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (65,33,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (66,33,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (67,34,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (68,34,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (69,35,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (70,35,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (71,36,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (72,36,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (73,37,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (74,37,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (75,38,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (76,38,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (77,39,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (78,39,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (79,40,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (80,40,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (81,41,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (82,41,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (83,42,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (84,42,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (85,43,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (86,43,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (87,44,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (88,44,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (89,45,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (90,45,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (91,46,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (92,46,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (93,47,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (94,47,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (95,48,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (96,48,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (97,49,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (98,49,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (99,50,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (100,50,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (101,51,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (102,51,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (103,52,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (104,52,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (105,53,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (106,53,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (107,54,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (108,54,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (109,55,2);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (110,55,12);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (111,56,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (112,56,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (113,57,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (114,57,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (115,58,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (116,58,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (117,59,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (118,59,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (119,60,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (120,60,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (121,61,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (122,61,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (123,62,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (124,62,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (125,63,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (126,63,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (127,64,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (128,64,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (129,65,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (130,65,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (131,66,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (132,66,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (133,67,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (134,67,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (135,68,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (136,68,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (137,69,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (138,69,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (139,70,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (140,70,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (141,71,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (142,71,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (143,72,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (144,72,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (145,73,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (146,73,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (147,74,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (148,74,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (149,75,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (150,75,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (151,76,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (152,76,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (153,77,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (154,77,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (155,78,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (156,78,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (157,79,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (158,79,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (159,80,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (160,80,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (161,81,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (162,81,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (163,82,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (164,82,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (165,83,3);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (166,83,13);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (167,84,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (168,84,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (169,85,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (170,85,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (171,86,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (172,86,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (173,87,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (174,87,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (175,88,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (176,88,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (177,89,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (178,89,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (179,90,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (180,90,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (181,91,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (182,91,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (183,92,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (184,92,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (185,93,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (186,93,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (187,94,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (188,94,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (189,95,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (190,95,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (191,96,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (192,96,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (193,97,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (194,97,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (195,98,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (196,98,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (197,99,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (198,99,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (199,100,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (200,100,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (201,101,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (202,101,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (203,102,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (204,102,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (205,103,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (206,103,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (207,104,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (208,104,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (209,105,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (210,105,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (211,106,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (212,106,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (213,107,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (214,107,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (215,108,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (216,108,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (217,109,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (218,109,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (219,110,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (220,110,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (221,111,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (222,111,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (223,112,4);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (224,112,14);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (225,113,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (226,113,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (227,114,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (228,114,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (229,115,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (230,115,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (231,116,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (232,116,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (233,117,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (234,117,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (235,118,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (236,118,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (237,119,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (238,119,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (239,120,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (240,120,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (241,121,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (242,121,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (243,122,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (244,122,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (245,123,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (246,123,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (247,124,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (248,124,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (249,125,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (250,125,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (251,126,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (252,126,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (253,127,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (254,127,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (255,128,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (256,128,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (257,129,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (258,129,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (259,130,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (260,130,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (261,131,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (262,131,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (263,132,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (264,132,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (265,133,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (266,133,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (267,134,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (268,134,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (269,135,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (270,135,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (271,136,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (272,136,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (273,137,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (274,137,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (275,138,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (276,138,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (277,139,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (278,139,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (279,140,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (280,140,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (281,141,5);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (282,141,15);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (283,142,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (284,142,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (285,143,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (286,143,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (287,144,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (288,144,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (289,145,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (290,145,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (291,146,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (292,146,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (293,147,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (294,147,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (295,148,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (296,148,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (297,149,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (298,149,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (299,150,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (300,150,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (301,151,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (302,151,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (303,152,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (304,152,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (305,153,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (306,153,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (307,154,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (308,154,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (309,155,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (310,155,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (311,156,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (312,156,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (313,157,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (314,157,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (315,158,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (316,158,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (317,159,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (318,159,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (319,160,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (320,160,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (321,161,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (322,161,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (323,162,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (324,162,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (325,163,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (326,163,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (327,164,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (328,164,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (329,165,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (330,165,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (331,166,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (332,166,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (333,167,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (334,167,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (335,168,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (336,168,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (337,169,6);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (338,169,16);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (339,170,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (340,170,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (341,171,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (342,171,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (343,172,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (344,172,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (345,173,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (346,173,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (347,174,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (348,174,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (349,175,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (350,175,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (351,176,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (352,176,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (353,177,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (354,177,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (355,178,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (356,178,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (357,179,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (358,179,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (359,180,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (360,180,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (361,181,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (362,181,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (363,182,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (364,182,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (365,183,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (366,183,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (367,184,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (368,184,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (369,185,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (370,185,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (371,186,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (372,186,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (373,187,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (374,187,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (375,188,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (376,188,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (377,189,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (378,189,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (379,190,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (380,190,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (381,191,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (382,191,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (383,192,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (384,192,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (385,193,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (386,193,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (387,194,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (388,194,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (389,195,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (390,195,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (391,196,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (392,196,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (393,197,7);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (394,197,17);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (395,198,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (396,198,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (397,199,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (398,199,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (399,200,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (400,200,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (401,201,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (402,201,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (403,202,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (404,202,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (405,203,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (406,203,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (407,204,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (408,204,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (409,205,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (410,205,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (411,206,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (412,206,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (413,207,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (414,207,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (415,208,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (416,208,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (417,209,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (418,209,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (419,210,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (420,210,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (421,211,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (422,211,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (423,212,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (424,212,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (425,213,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (426,213,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (427,214,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (428,214,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (429,215,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (430,215,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (431,216,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (432,216,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (433,217,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (434,217,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (435,218,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (436,218,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (437,219,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (438,219,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (439,220,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (440,220,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (441,221,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (442,221,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (443,222,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (444,222,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (445,223,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (446,223,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (447,224,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (448,224,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (449,225,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (450,225,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (451,226,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (452,226,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (453,227,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (454,227,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (455,228,8);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (456,228,18);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (457,229,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (458,229,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (459,230,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (460,230,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (461,231,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (462,231,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (463,232,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (464,232,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (465,233,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (466,233,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (467,234,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (468,234,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (469,235,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (470,235,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (471,236,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (472,236,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (473,237,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (474,237,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (475,238,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (476,238,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (477,239,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (478,239,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (479,240,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (480,240,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (481,241,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (482,241,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (483,242,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (484,242,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (485,243,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (486,243,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (487,244,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (488,244,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (489,245,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (490,245,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (491,246,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (492,246,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (493,247,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (494,247,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (495,248,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (496,248,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (497,249,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (498,249,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (499,250,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (500,250,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (501,251,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (502,251,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (503,252,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (504,252,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (505,253,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (506,253,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (507,254,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (508,254,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (509,255,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (510,255,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (511,256,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (512,256,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (513,257,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (514,257,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (515,258,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (516,258,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (517,259,9);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (518,259,19);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (519,260,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (520,260,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (521,261,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (522,261,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (523,262,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (524,262,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (525,263,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (526,263,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (527,264,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (528,264,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (529,265,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (530,265,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (531,266,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (532,266,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (533,267,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (534,267,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (535,268,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (536,268,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (537,269,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (538,269,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (539,270,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (540,270,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (541,271,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (542,271,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (543,272,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (544,272,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (545,273,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (546,273,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (547,274,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (548,274,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (549,275,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (550,275,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (551,276,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (552,276,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (553,277,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (554,277,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (555,278,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (556,278,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (557,279,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (558,279,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (559,280,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (560,280,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (561,281,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (562,281,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (563,282,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (564,282,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (565,283,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (566,283,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (567,284,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (568,284,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (569,285,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (570,285,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (571,286,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (572,286,20);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (573,287,10);
INSERT INTO `siswa_kelas` (`id`, `id_siswa`, `id_kelas`) VALUES (574,287,20);


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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (1,'BAHASA INDONESIA','BIND','Wajib','Mata pelajaran BAHASA INDONESIA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (2,'BAHASA INGGRIS','BING','Wajib','Mata pelajaran BAHASA INGGRIS kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (3,'BAHASA INGGRIS TK LANJT','BING-L','Peminatan','Mata pelajaran BAHASA INGGRIS TK LANJT kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (4,'BIOLOGI','BIO','Wajib','Mata pelajaran BIOLOGI kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (5,'BIOLOGI PEMINATAN','BIO-P','Peminatan','Mata pelajaran BIOLOGI PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (6,'EKONOMI','EKO','Wajib','Mata pelajaran EKONOMI kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (7,'EKONOMI PEMINATAN','EKO-P','Peminatan','Mata pelajaran EKONOMI PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (8,'FISIKA','FIS','Wajib','Mata pelajaran FISIKA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (9,'FISIKA PEMINATAN','FIS-P','Peminatan','Mata pelajaran FISIKA PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (10,'GEOGRAFI','GEO','Wajib','Mata pelajaran GEOGRAFI kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (11,'INFORMATIKA','INFO','Wajib','Mata pelajaran INFORMATIKA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (12,'INFORMATIKA PEMINATAN','INFO-P','Peminatan','Mata pelajaran INFORMATIKA PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (13,'KIMIA','KIM','Wajib','Mata pelajaran KIMIA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (14,'KIMIA PEMINATAN','KIM-P','Peminatan','Mata pelajaran KIMIA PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (15,'MATEMATIKA TK LANJUT','MTK-L','Peminatan','Mata pelajaran MATEMATIKA TK LANJUT kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (16,'MATEMATIKA UMUM','MTK-U','Wajib','Mata pelajaran MATEMATIKA UMUM kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (17,'MULOK','MULOK','Muatan Lokal','Mata pelajaran MULOK kelompok Muatan Lokal pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (18,'PAI dan Budi Pekerti','PAIBP','Wajib','Mata pelajaran PAI dan Budi Pekerti kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (19,'PEND. AGAMA KRISTEN','PAK','Wajib','Mata pelajaran PEND. AGAMA KRISTEN kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (20,'PJOK','PJOK','Wajib','Mata pelajaran PJOK kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (21,'PKWU','PKWU','Wajib','Mata pelajaran PKWU kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (22,'Pend. PANCASILA','PPKN','Wajib','Mata pelajaran Pend. PANCASILA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (23,'SEJARAH','SEJ','Wajib','Mata pelajaran SEJARAH kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (24,'SEJARAH PEMINATAN','SEJ-P','Peminatan','Mata pelajaran SEJARAH PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (25,'SENI BUDAYA','SENBUD','Wajib','Mata pelajaran SENI BUDAYA kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (26,'SOSIOLOGI','SOS','Wajib','Mata pelajaran SOSIOLOGI kelompok Wajib pada SMA Negeri 1 Karau Kuala',1);
INSERT INTO `mata_pelajaran` (`id`, `nama`, `kode`, `kelompok`, `deskripsi`, `aktif`) VALUES (27,'SOSIOLOGI PEMINATAN','SOS-P','Peminatan','Mata pelajaran SOSIOLOGI PEMINATAN kelompok Peminatan pada SMA Negeri 1 Karau Kuala',1);


-- ===========================================================================
-- 8. Tabel `kelas_mapel`
--    Mata pelajaran pada sebuah kelas beserta guru pengajarnya
--    Jumlah data: 310 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (1,1,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (2,11,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (3,2,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (4,12,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (5,3,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (6,13,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (7,4,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (8,14,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (9,5,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (10,15,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (11,6,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (12,16,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (13,7,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (14,17,18,2);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (15,2,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (16,12,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (17,3,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (18,13,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (19,4,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (20,14,16,3);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (21,1,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (22,11,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (23,2,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (24,12,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (25,3,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (26,13,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (27,4,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (28,14,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (29,5,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (30,15,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (31,6,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (32,16,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (33,7,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (34,17,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (35,8,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (36,18,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (37,9,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (38,19,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (39,10,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (40,20,22,4);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (41,5,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (42,15,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (43,8,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (44,18,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (45,9,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (46,19,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (47,10,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (48,20,15,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (49,1,16,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (50,11,16,5);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (51,1,8,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (52,11,8,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (53,4,9,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (54,14,9,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (55,5,9,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (56,15,9,6);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (57,4,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (58,14,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (59,5,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (60,15,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (61,6,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (62,16,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (63,8,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (64,18,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (65,9,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (66,19,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (67,10,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (68,20,1,7);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (69,3,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (70,13,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (71,4,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (72,14,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (73,5,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (74,15,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (75,6,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (76,16,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (77,7,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (78,17,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (79,8,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (80,18,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (81,9,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (82,19,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (83,10,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (84,20,2,8);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (85,5,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (86,15,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (87,6,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (88,16,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (89,10,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (90,20,7,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (91,1,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (92,11,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (93,2,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (94,12,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (95,3,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (96,13,6,9);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (97,1,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (98,11,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (99,2,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (100,12,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (101,3,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (102,13,26,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (103,7,27,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (104,17,27,10);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (105,1,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (106,11,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (107,2,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (108,12,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (109,3,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (110,13,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (111,6,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (112,16,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (113,7,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (114,17,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (115,8,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (116,18,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (117,9,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (118,19,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (119,10,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (120,20,23,11);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (121,4,23,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (122,14,23,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (123,5,23,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (124,15,23,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (125,8,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (126,18,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (127,9,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (128,19,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (129,10,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (130,20,24,12);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (131,6,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (132,16,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (133,7,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (134,17,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (135,8,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (136,18,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (137,9,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (138,19,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (139,10,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (140,20,3,13);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (141,8,9,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (142,18,9,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (143,9,9,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (144,19,9,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (145,3,8,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (146,13,8,14);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (147,1,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (148,11,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (149,2,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (150,12,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (151,3,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (152,13,4,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (153,4,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (154,14,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (155,5,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (156,15,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (157,9,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (158,19,5,15);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (159,5,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (160,15,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (161,6,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (162,16,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (163,7,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (164,17,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (165,8,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (166,18,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (167,9,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (168,19,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (169,10,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (170,20,16,16);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (171,1,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (172,11,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (173,2,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (174,12,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (175,4,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (176,14,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (177,5,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (178,15,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (179,6,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (180,16,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (181,7,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (182,17,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (183,8,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (184,18,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (185,9,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (186,19,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (187,10,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (188,20,19,17);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (189,1,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (190,11,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (191,2,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (192,12,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (193,3,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (194,13,21,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (195,2,8,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (196,12,8,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (197,6,9,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (198,16,9,18);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (199,1,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (200,11,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (201,2,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (202,12,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (203,3,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (204,13,13,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (205,7,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (206,17,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (207,8,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (208,18,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (209,10,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (210,20,14,20);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (211,1,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (212,11,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (213,2,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (214,12,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (215,3,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (216,13,11,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (217,4,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (218,14,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (219,6,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (220,16,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (221,7,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (222,17,12,21);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (223,4,3,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (224,14,3,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (225,5,3,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (226,15,3,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (227,2,2,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (228,12,2,22);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (229,8,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (230,18,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (231,9,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (232,19,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (233,10,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (234,20,18,23);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (235,4,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (236,14,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (237,6,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (238,16,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (239,7,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (240,17,15,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (241,8,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (242,18,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (243,9,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (244,19,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (245,10,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (246,20,17,24);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (247,4,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (248,14,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (249,5,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (250,15,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (251,6,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (252,16,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (253,7,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (254,17,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (255,8,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (256,18,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (257,9,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (258,19,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (259,10,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (260,20,25,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (261,1,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (262,11,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (263,2,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (264,12,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (265,3,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (266,13,20,25);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (267,1,2,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (268,11,2,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (269,3,1,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (270,13,1,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (271,7,1,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (272,17,1,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (273,1,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (274,11,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (275,2,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (276,12,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (277,3,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (278,13,10,26);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (279,1,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (280,11,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (281,2,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (282,12,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (283,3,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (284,13,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (285,4,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (286,14,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (287,5,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (288,15,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (289,6,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (290,16,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (291,7,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (292,17,17,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (293,1,1,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (294,11,1,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (295,2,1,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (296,12,1,27);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (297,4,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (298,14,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (299,5,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (300,15,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (301,6,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (302,16,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (303,7,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (304,17,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (305,8,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (306,18,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (307,9,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (308,19,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (309,10,20,28);
INSERT INTO `kelas_mapel` (`id`, `id_kelas`, `id_mapel`, `id_guru`) VALUES (310,20,20,28);


-- ===========================================================================
-- 9. Tabel `pertemuan`
--    Urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran
--    Jumlah data: 10 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (1,50,1,'Konsep Persamaan Linear Satu Variabel','Pengenalan bentuk umum persamaan linear satu variabel serta cara menentukan penyelesaiannya.','2026-09-14','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (2,50,2,'Pertidaksamaan Linear Satu Variabel','Sifat-sifat pertidaksamaan linear dan penyajian himpunan penyelesaian pada garis bilangan.','2026-09-21','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (3,50,3,'Sistem Persamaan Linear Dua Variabel','Penyelesaian SPLDV dengan metode substitusi, eliminasi, dan campuran.','2026-09-28','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (4,294,1,'Struktur dan Kaidah Teks Deskripsi','Mengenal struktur teks deskripsi serta kaidah kebahasaan yang digunakan.','2026-09-15','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (5,294,2,'Menelaah Teks Deskripsi','Menelaah penggunaan kata konkret dan majas dalam teks deskripsi.','2026-09-22','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (6,52,1,'Besaran dan Satuan','Besaran pokok, besaran turunan, dan satuan Sistem Internasional.','2026-09-16','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (7,52,2,'Vektor dan Resultan Gaya','Penjumlahan vektor dan penguraian vektor pada sumbu x dan y.','2026-09-23','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (8,268,1,'Descriptive Text','Social function, generic structure, and language features.','2026-09-17','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (9,49,1,'Barisan dan Deret Aritmetika','Materi barisan dan deret aritmetika pada semester ganjil tahun ajaran 2025/2026.','2026-04-08','2026-10-05 12:14:58');
INSERT INTO `pertemuan` (`id`, `id_kelas_mapel`, `nomor`, `judul`, `deskripsi`, `tanggal`, `created_at`) VALUES (10,293,1,'Teks Negosiasi','Struktur dan kaidah teks negosiasi.','2026-04-10','2026-10-05 12:14:58');


-- ===========================================================================
-- 10. Tabel `materi`
--    Materi pembelajaran (teks, berkas, video, tautan) pada sebuah pertemuan
--    Jumlah data: 16 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (1,1,'Pengantar Persamaan Linear Satu Variabel','Persamaan linear satu variabel adalah persamaan yang memuat tepat satu variabel berpangkat satu. Bentuk umumnya ax + b = 0 dengan a tidak sama dengan nol.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (2,1,'Modul Persamaan Linear Satu Variabel (PDF)','Modul lengkap beserta contoh soal dan pembahasan.','file','modul_persamaan_linear.pdf',NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (3,1,'Video Pembelajaran Persamaan Linear Satu Variabel','Rekaman penjelasan langkah penyelesaian persamaan linear satu variabel beserta contohnya.','video','video_persamaan_linear.webm',NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (4,2,'Sifat-Sifat Pertidaksamaan Linear','Apabila kedua ruas dikalikan atau dibagi bilangan negatif, maka tanda pertidaksamaan berbalik arah.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (5,3,'Metode Penyelesaian SPLDV','SPLDV dapat diselesaikan dengan metode substitusi, eliminasi, campuran, maupun grafik.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (6,3,'Video Pengayaan: Transformasi Linear dan Matriks','Tautan video pengayaan mengenai hubungan sistem persamaan linear dengan matriks.','link',NULL,'https://www.youtube.com/watch?v=kYB8IZa5AuE','2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (7,4,'Pengertian dan Struktur Teks Deskripsi','Teks deskripsi menggambarkan objek secara rinci sehingga pembaca seolah-olah melihat sendiri objek yang digambarkan. Strukturnya terdiri atas identifikasi, deskripsi bagian, dan penutup.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (8,4,'Modul Teks Deskripsi (PDF)','Modul lengkap teks deskripsi beserta contoh.','file','modul_teks_deskripsi.pdf',NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (9,5,'Kata Konkret dan Majas dalam Teks Deskripsi','Kata konkret membuat deskripsi terasa nyata, sedangkan majas membuat deskripsi menjadi lebih hidup.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (10,6,'Besaran Pokok dan Besaran Turunan','Terdapat tujuh besaran pokok dalam Sistem Internasional. Besaran turunan diperoleh dari kombinasi besaran-besaran pokok tersebut.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (11,6,'Modul Besaran dan Satuan (PDF)','Modul besaran, satuan, dan angka penting.','file','modul_besaran_satuan.pdf',NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (12,7,'Penjumlahan Vektor','Vektor dapat dijumlahkan dengan metode segitiga, jajargenjang, maupun poligon.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (13,7,'Video Pengayaan: Konsep Vektor','Tautan video pengayaan mengenai konsep vektor dan penguraiannya.','link',NULL,'https://www.youtube.com/watch?v=fNk_zzaMoSs','2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (14,8,'Generic Structure of Descriptive Text','A descriptive text consists of identification and description. It commonly uses simple present tense.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (15,9,'Rumus Suku ke-n Barisan Aritmetika','Suku ke-n barisan aritmetika dirumuskan Un = a + (n-1)b.','teks',NULL,NULL,'2026-10-05 12:14:58');
INSERT INTO `materi` (`id`, `id_pertemuan`, `judul`, `konten`, `tipe`, `file`, `url`, `tgl_upload`) VALUES (16,10,'Struktur Teks Negosiasi','Teks negosiasi terdiri atas orientasi, pengajuan, penawaran, dan persetujuan.','teks',NULL,NULL,'2026-10-05 12:14:58');


-- ===========================================================================
-- 11. Tabel `tugas`
--    Tugas dan kuis beserta tipe dan batas waktunya
--    Jumlah data: 9 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (1,1,'Latihan Persamaan Linear','Kerjakan soal nomor 1-10 pada buku paket halaman 25. Tulis langkah penyelesaian secara lengkap, lalu unggah dalam bentuk berkas atau tuliskan pada kolom jawaban.','2026-10-14 23:59:00','tugas','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (2,2,'Kuis Persamaan dan Pertidaksamaan Linear','Kuis pilihan ganda mengenai persamaan dan pertidaksamaan linear satu variabel. Dinilai otomatis oleh sistem.','2026-10-10 23:59:00','kuis','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (3,3,'Tugas Proyek SPLDV','Susunlah satu soal cerita yang dapat diselesaikan dengan SPLDV beserta penyelesaiannya, kemudian unggah dalam bentuk dokumen.','2026-10-07 23:59:00','tugas','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (4,4,'Tugas Menulis Teks Deskripsi','Buatlah sebuah teks deskripsi bertema \"Lingkungan Sekolahku\" minimal tiga paragraf sesuai struktur yang telah dipelajari.','2026-10-12 23:59:00','tugas','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (5,5,'Kuis Teks Deskripsi','Kuis singkat mengenai struktur teks deskripsi. Terdiri atas soal pilihan ganda dan satu soal esai.','2026-10-09 23:59:00','kuis','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (6,6,'Latihan Soal Besaran dan Satuan','Kerjakan latihan konversi satuan dan penulisan angka penting pada lembar kerja yang telah dibagikan.','2026-10-02 23:59:00','tugas','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (7,8,'Kuis Descriptive Text','Short quiz about the generic structure and language features of descriptive text.','2026-10-11 23:59:00','kuis','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (8,9,'Latihan Barisan Aritmetika','Kerjakan soal barisan dan deret aritmetika nomor 1 sampai 10.','2026-04-28 23:59:00','tugas','2026-10-05 12:14:58');
INSERT INTO `tugas` (`id`, `id_pertemuan`, `judul`, `deskripsi`, `deadline`, `tipe`, `created_at`) VALUES (9,10,'Tugas Menyusun Teks Negosiasi','Susunlah sebuah teks negosiasi jual beli sesuai struktur yang telah dipelajari.','2026-04-30 23:59:00','tugas','2026-10-05 12:14:58');


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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (1,8,1,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (2,8,2,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (3,8,3,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (4,9,1,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (5,9,2,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (6,9,3,NULL,'Pekerjaan dikumpulkan pada semester ganjil tahun ajaran 2025/2026.','2026-04-23 03:00:00',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (7,2,1,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (8,2,2,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (9,2,3,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (10,2,4,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (11,2,5,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (12,2,6,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (13,5,1,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (14,5,2,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (15,5,5,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (16,5,4,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (17,5,6,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (18,1,1,'1791382634784_jawaban_ahmad.txt','Nomor 1: 2x + 6 = 14 -> 2x = 8 -> x = 4.\r\nNomor 2: 3x - 9 = 0 -> 3x = 9 -> x = 3.\r\nNomor 3: 5x = 3x + 12 -> 2x = 12 -> x = 6.\r\nLangkah selengkapnya saya lampirkan pada berkas.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (19,1,2,'1791382634793_jawaban_ahmad_raviza.txt','Seluruh soal nomor 1 sampai 10 telah saya kerjakan. Hasil pekerjaan saya tulis tangan lalu saya pindai dan lampirkan pada berkas terlampir.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (20,1,3,'1791382634800_jawaban_aminatul.txt','Nomor 1 sampai 8 sudah saya kerjakan, nomor 9 dan 10 masih saya ragu pada langkah pemindahan ruas. Mohon koreksinya, Pak.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (21,1,4,'1791382634808_jawaban_audiyah.txt','Jawaban lengkap nomor 1-10 terlampir pada berkas. Setiap nomor saya sertakan langkah pengerjaannya.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (22,1,5,'1791382634815_jawaban_bunga.txt','Semua soal telah saya kerjakan beserta langkah-langkahnya, terlampir pada berkas jawaban.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (23,4,2,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala berdiri di tepi jalan utama Kecamatan Karau Kuala. Bangunannya bercat putih dengan lis biru yang tampak bersih setiap pagi.\r\n\r\nHalaman sekolah cukup luas dan ditumbuhi rumput hijau. Di tengahnya berdiri tiang bendera, sementara di sisi kiri berjajar pohon ketapang yang rindang.\r\n\r\nSuasana sekolahku sangat nyaman untuk belajar. Angin sejuk dari arah sungai membuat udara di ruang kelas tidak pernah terasa panas.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (24,4,5,NULL,'Lingkungan Sekolahku\r\n\r\nSekolahku terletak tidak jauh dari permukiman warga sehingga mudah dijangkau dengan sepeda.\r\n\r\nDi dalam kompleks sekolah terdapat dua belas ruang kelas, satu perpustakaan, dan sebuah laboratorium IPA. Lorong penghubungnya beratap seng sehingga siswa tetap terlindung ketika hujan.\r\n\r\nSetiap sudut sekolah dijaga kebersihannya oleh seluruh warga sekolah sehingga suasananya selalu asri.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (25,4,4,NULL,'Lingkungan Sekolahku\r\n\r\nGerbang sekolahku bercat hijau tua dan selalu terbuka sejak pukul enam pagi.\r\n\r\nDi sebelah kanan gerbang terdapat taman kecil dengan bunga kertas berwarna merah muda. Lapangan upacara berada tepat di tengah kompleks sekolah.\r\n\r\nAku sangat menyukai suasana sekolahku, terutama pada pagi hari ketika embun masih menempel di rumput lapangan.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (26,4,1,NULL,'Lingkungan Sekolahku\r\n\r\nSMA Negeri 1 Karau Kuala memiliki halaman depan yang luas dengan pagar besi berwarna hijau.\r\n\r\nRuang kelas berjajar rapi menghadap lapangan. Setiap kelas memiliki jendela besar sehingga cahaya matahari masuk dengan leluasa.\r\n\r\nKarena lingkungannya rindang dan bersih, aku merasa betah berlama-lama di sekolah.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (27,3,2,NULL,'Soal cerita: Harga 2 buku dan 3 pensil Rp 21.000, sedangkan 1 buku dan 2 pensil Rp 12.000. Dengan metode eliminasi diperoleh harga buku Rp 6.000 dan pensil Rp 3.000.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (28,3,4,NULL,'Soal cerita: Harga 2 buku dan 3 pensil Rp 21.000, sedangkan 1 buku dan 2 pensil Rp 12.000. Dengan metode eliminasi diperoleh harga buku Rp 6.000 dan pensil Rp 3.000.','2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (29,6,6,NULL,'Mohon maaf Pak, saya terlambat mengumpulkan karena jaringan internet di rumah bermasalah. Latihan konversi satuan nomor 1-10 sudah saya kerjakan seluruhnya.','2026-10-07 14:17:14',1);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (30,7,1,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (31,7,2,NULL,NULL,'2026-10-07 14:17:14',0);
INSERT INTO `pengumpulan_tugas` (`id`, `id_tugas`, `id_siswa`, `file`, `jawaban`, `tgl_kumpul`, `terlambat`) VALUES (32,7,3,NULL,NULL,'2026-10-07 14:17:14',0);


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
) ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (187,7,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (188,7,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (189,7,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (190,7,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (191,7,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (192,8,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (193,8,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (194,8,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (195,8,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (196,8,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (197,9,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (198,9,2,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (199,9,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (200,9,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (201,9,5,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (202,10,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (203,10,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (204,10,3,'A',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (205,10,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (206,10,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (207,11,1,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (208,11,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (209,11,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (210,11,4,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (211,11,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (212,12,1,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (213,12,2,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (214,12,3,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (215,12,4,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (216,12,5,'C',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (217,13,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (218,13,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (219,13,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (220,13,9,NULL,'Sekolahku berada di tepi jalan utama Bangkuang. Halamannya luas dengan rumput hijau yang selalu terpangkas rapi. Di depan ruang guru berdiri tiang bendera yang menjulang, dan di sampingnya berjajar pohon ketapang yang meneduhkan.',NULL,30.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (221,14,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (222,14,7,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (223,14,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (224,14,9,NULL,'SMA Negeri 1 Karau Kuala memiliki bangunan bercat putih kebiruan. Setiap pagi koridor kelas dipenuhi suara siswa yang bersiap belajar. Taman kecil di tengah sekolah ditanami bunga kertas berwarna-warni.',NULL,28.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (225,15,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (226,15,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (227,15,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (228,15,9,NULL,'Ruang kelasku cukup luas dan terang karena memiliki empat jendela besar. Di dinding depan terpasang papan tulis putih dan foto pahlawan. Udara di dalam kelas terasa sejuk saat pagi hari.',NULL,26.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (229,16,6,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (230,16,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (231,16,8,'B',NULL,1,20.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (232,16,9,NULL,'Kantin sekolah berada di samping lapangan basket. Setiap istirahat aromanya harum oleh gorengan hangat. Meja-meja panjangnya selalu penuh oleh siswa yang bercengkerama.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (233,17,6,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (234,17,7,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (235,17,8,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (236,17,9,NULL,'Sekolahku bersih dan nyaman. Ada lapangan upacara di tengah.',NULL,NULL);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (237,30,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (238,30,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (239,30,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (240,30,13,NULL,'My classroom is on the second floor of the school building. It has four large windows, so the room is always bright. There are thirty-two desks and a white board in front of the class.',NULL,23.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (241,31,10,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (242,31,11,'B',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (243,31,12,'B',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (244,31,13,NULL,'My classroom is clean and comfortable. The walls are painted light blue and there are some pictures of Indonesian heroes on them. I like studying there with my classmates.',NULL,22.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (245,32,10,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (246,32,11,'A',NULL,0,0.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (247,32,12,'A',NULL,1,25.00);
INSERT INTO `jawaban_siswa` (`id`, `id_pengumpulan`, `id_soal`, `pilihan`, `jawaban_teks`, `benar`, `skor`) VALUES (248,32,13,NULL,'My classroom is big. There is a white board and many chairs.',NULL,NULL);


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
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (1,1,5,88.00,'Pengerjaan runtut dan rumus digunakan dengan tepat.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (2,2,5,76.00,'Sudah benar, namun beberapa langkah masih dipersingkat.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (3,3,5,92.00,'Sangat baik, seluruh nomor dikerjakan dengan lengkap.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (4,4,27,85.00,'Struktur teks negosiasi sudah lengkap.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (5,5,27,80.00,'Bagian penawaran dapat dikembangkan lagi.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (6,6,27,90.00,'Dialog negosiasi tersusun sangat runtut.','2026-04-28 02:00:00');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (7,7,NULL,80.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (8,8,NULL,100.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (9,9,NULL,60.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (10,10,NULL,100.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (11,11,NULL,40.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (12,12,NULL,80.00,NULL,'2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (13,18,5,90.00,'Langkah pengerjaan sudah runtut dan benar. Pertahankan.','2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (14,19,5,85.00,'Jawaban benar, tulisan pada lampiran agar diperjelas lagi.','2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (15,20,5,75.00,'Nomor 9 dan 10 masih keliru pada pemindahan ruas. Pelajari kembali.','2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (16,21,5,95.00,'Sangat baik, seluruh langkah penyelesaian lengkap.','2026-10-07 14:17:14');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (17,22,5,88.00,'Pekerjaan rapi dan jawaban tepat.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (23,23,27,92.00,'Struktur lengkap dan deskripsi sangat hidup.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (24,25,27,90.00,'Pemilihan diksi sangat baik dan runtut.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (25,24,27,87.00,'Sudah baik, penutup dapat dipertegas lagi.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (26,29,6,78.00,'Jawaban benar, namun dikumpulkan melewati batas waktu.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (78,13,27,100.00,'Deskripsi sangat hidup dan struktur sudah tepat.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (79,14,27,73.00,'Deskripsi baik, tambahkan lagi penggunaan pancaindra.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (80,15,27,96.00,'Sudah sesuai struktur, kembangkan lagi deskripsi bagiannya.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (81,30,26,98.00,'Good description with clear details.','2026-10-07 14:17:15');
INSERT INTO `nilai` (`id`, `id_kumpul`, `id_guru`, `skor`, `catatan`, `tgl_penilaian`) VALUES (82,31,26,72.00,'Good description with clear details.','2026-10-07 14:17:15');


-- ===========================================================================
-- 16. Tabel `forum_diskusi`
--    Topik dan balasan forum diskusi pada sebuah pertemuan
--    Jumlah data: 20 baris
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (1,1,6,'Diskusi Pertemuan 1: Persamaan Linear','Selamat pagi anak-anak. Silakan tuliskan di forum ini bagian materi persamaan linear satu variabel yang masih sulit dipahami, nanti Ibu bahas ulang pada pertemuan berikutnya.',NULL,'2026-10-05 12:14:58');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (2,2,6,'Tanya Jawab Pertidaksamaan Linear','Bagian mana dari sifat pertidaksamaan yang paling sering membuat kalian keliru? Silakan tanyakan di sini.',NULL,'2026-10-05 12:14:58');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (3,4,28,'Tips Menulis Teks Deskripsi','Anak-anak, dalam menulis teks deskripsi gunakan pancaindra kalian: apa yang dilihat, didengar, dan dirasakan. Silakan tanyakan di sini jika ada kesulitan.',NULL,'2026-10-05 12:14:58');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (4,6,7,'Pengumpulan Latihan Besaran dan Satuan','Batas waktu pengumpulan latihan soal besaran dan satuan sudah berakhir. Bagi yang belum mengumpulkan, silakan hubungi Bapak dan tetap unggah pekerjaan kalian melalui sistem.',NULL,'2026-10-05 12:14:58');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (5,1,6,'Kesulitan pada Latihan Persamaan Linear','Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',NULL,'2026-10-05 12:15:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (6,1,30,NULL,'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',5,'2026-10-05 12:15:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (7,1,6,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',5,'2026-10-05 12:15:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (8,1,31,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',5,'2026-10-05 12:15:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (10,1,6,'Kesulitan pada Latihan Persamaan Linear','Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',NULL,'2026-10-07 14:16:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (11,1,30,NULL,'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',10,'2026-10-07 14:16:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (12,1,6,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',10,'2026-10-07 14:16:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (13,1,31,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',10,'2026-10-07 14:16:03');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (15,1,6,'Kesulitan pada Latihan Persamaan Linear','Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',NULL,'2026-10-07 14:17:00');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (16,1,30,NULL,'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',15,'2026-10-07 14:17:00');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (17,1,6,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',15,'2026-10-07 14:17:00');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (18,1,31,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',15,'2026-10-07 14:17:00');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (20,1,6,'Kesulitan pada Latihan Persamaan Linear','Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',NULL,'2026-10-07 14:17:15');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (21,1,30,NULL,'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',20,'2026-10-07 14:17:15');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (22,1,6,NULL,'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',20,'2026-10-07 14:17:15');
INSERT INTO `forum_diskusi` (`id`, `id_pertemuan`, `id_user`, `judul`, `pesan`, `id_parent`, `tgl_post`) VALUES (23,1,31,NULL,'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',20,'2026-10-07 14:17:15');


-- ===========================================================================
-- Selesai. Total 1752 baris data pada 16 tabel.
-- ===========================================================================

SET FOREIGN_KEY_CHECKS = 1;
