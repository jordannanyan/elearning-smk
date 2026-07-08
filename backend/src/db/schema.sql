-- =====================================================================
-- Skema Database Sistem E-Learning SMA Negeri 1 Karau Kuala
-- Sesuai Class Diagram (Gambar 3.9) pada Proposal Skripsi
-- =====================================================================

CREATE DATABASE IF NOT EXISTS elearning_smakk
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elearning_smakk;

-- Urutan drop diperhatikan karena foreign key
DROP TABLE IF EXISTS jawaban_siswa;
DROP TABLE IF EXISTS soal;
DROP TABLE IF EXISTS nilai;
DROP TABLE IF EXISTS pengumpulan_tugas;
DROP TABLE IF EXISTS forum_diskusi;
DROP TABLE IF EXISTS tugas;
DROP TABLE IF EXISTS materi;
DROP TABLE IF EXISTS mata_pelajaran;
DROP TABLE IF EXISTS siswa;
DROP TABLE IF EXISTS guru;
DROP TABLE IF EXISTS kelas;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------------
-- users : tabel akun untuk semua level pengguna (admin/guru/siswa)
-- ------------------------------------------------------------------
CREATE TABLE users (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nama      VARCHAR(120) NOT NULL,
  email     VARCHAR(120) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role      ENUM('admin','guru','siswa') NOT NULL DEFAULT 'siswa',
  foto      VARCHAR(255) DEFAULT NULL,
  aktif     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- kelas : rombongan belajar
-- ------------------------------------------------------------------
CREATE TABLE kelas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nama_kelas   VARCHAR(50) NOT NULL,
  tingkat      VARCHAR(10) NOT NULL,          -- X / XI / XII
  tahun_ajaran VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- guru : data profil guru, 1-1 dengan users
-- ------------------------------------------------------------------
CREATE TABLE guru (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  id_user  INT NOT NULL,
  nip      VARCHAR(30) DEFAULT NULL,
  mapel    VARCHAR(100) DEFAULT NULL,
  tgl_lahir DATE DEFAULT NULL,
  alamat   TEXT DEFAULT NULL,
  CONSTRAINT fk_guru_user FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- siswa : data profil siswa, 1-1 dengan users, terhubung ke kelas
-- ------------------------------------------------------------------
CREATE TABLE siswa (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  id_user  INT NOT NULL,
  id_kelas INT DEFAULT NULL,
  nis      VARCHAR(30) DEFAULT NULL,
  tgl_lahir DATE DEFAULT NULL,
  alamat   TEXT DEFAULT NULL,
  CONSTRAINT fk_siswa_user  FOREIGN KEY (id_user)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_siswa_kelas FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- mata_pelajaran : diampu oleh seorang guru
-- ------------------------------------------------------------------
CREATE TABLE mata_pelajaran (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  id_guru  INT DEFAULT NULL,
  nama     VARCHAR(120) NOT NULL,
  kode     VARCHAR(30) DEFAULT NULL,
  deskripsi TEXT DEFAULT NULL,
  CONSTRAINT fk_mapel_guru FOREIGN KEY (id_guru) REFERENCES guru(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- materi : bahan ajar di bawah sebuah mata pelajaran
-- ------------------------------------------------------------------
CREATE TABLE materi (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_mapel  INT NOT NULL,
  judul     VARCHAR(200) NOT NULL,
  konten    TEXT DEFAULT NULL,
  file      VARCHAR(255) DEFAULT NULL,
  tgl_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_materi_mapel FOREIGN KEY (id_mapel) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- tugas : tugas atau kuis di bawah sebuah mata pelajaran
-- ------------------------------------------------------------------
CREATE TABLE tugas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_mapel  INT NOT NULL,
  judul     VARCHAR(200) NOT NULL,
  deskripsi TEXT DEFAULT NULL,
  deadline  DATETIME DEFAULT NULL,
  tipe      ENUM('tugas','kuis') NOT NULL DEFAULT 'tugas',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tugas_mapel FOREIGN KEY (id_mapel) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- soal : butir soal milik sebuah tugas/kuis
--   tipe 'pilihan_ganda' -> dinilai otomatis (jawaban_benar A/B/C/D)
--   tipe 'esai'          -> dinilai manual oleh guru
-- ------------------------------------------------------------------
CREATE TABLE soal (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  id_tugas      INT NOT NULL,
  pertanyaan    TEXT NOT NULL,
  tipe          ENUM('pilihan_ganda','esai') NOT NULL DEFAULT 'pilihan_ganda',
  pilihan_a     VARCHAR(500) DEFAULT NULL,
  pilihan_b     VARCHAR(500) DEFAULT NULL,
  pilihan_c     VARCHAR(500) DEFAULT NULL,
  pilihan_d     VARCHAR(500) DEFAULT NULL,
  jawaban_benar CHAR(1) DEFAULT NULL,          -- 'A'..'D' untuk pilihan ganda
  bobot         INT NOT NULL DEFAULT 10,        -- poin maksimum butir ini
  urutan        INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_soal_tugas FOREIGN KEY (id_tugas) REFERENCES tugas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- pengumpulan_tugas : jawaban siswa atas sebuah tugas
-- ------------------------------------------------------------------
CREATE TABLE pengumpulan_tugas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  id_tugas   INT NOT NULL,
  id_siswa   INT NOT NULL,
  file       VARCHAR(255) DEFAULT NULL,
  jawaban    TEXT DEFAULT NULL,
  tgl_kumpul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  terlambat  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE KEY uq_tugas_siswa (id_tugas, id_siswa),
  CONSTRAINT fk_kumpul_tugas FOREIGN KEY (id_tugas) REFERENCES tugas(id) ON DELETE CASCADE,
  CONSTRAINT fk_kumpul_siswa FOREIGN KEY (id_siswa) REFERENCES siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- nilai : penilaian guru atas pengumpulan tugas siswa
-- ------------------------------------------------------------------
CREATE TABLE nilai (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  id_kumpul    INT NOT NULL,
  id_guru      INT DEFAULT NULL,
  skor         DECIMAL(5,2) DEFAULT NULL,
  catatan      TEXT DEFAULT NULL,
  tgl_penilaian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nilai_kumpul (id_kumpul),
  CONSTRAINT fk_nilai_kumpul FOREIGN KEY (id_kumpul) REFERENCES pengumpulan_tugas(id) ON DELETE CASCADE,
  CONSTRAINT fk_nilai_guru   FOREIGN KEY (id_guru)   REFERENCES guru(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- jawaban_siswa : jawaban per butir soal dalam satu pengumpulan
--   pilihan     -> jawaban PG yang dipilih siswa (A/B/C/D)
--   jawaban_teks-> jawaban esai
--   benar       -> hasil koreksi PG (1/0), NULL untuk esai
--   skor        -> poin yang diperoleh butir ini
-- ------------------------------------------------------------------
CREATE TABLE jawaban_siswa (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  id_pengumpulan INT NOT NULL,
  id_soal        INT NOT NULL,
  pilihan        CHAR(1) DEFAULT NULL,
  jawaban_teks   TEXT DEFAULT NULL,
  benar          TINYINT DEFAULT NULL,
  skor           DECIMAL(6,2) DEFAULT NULL,
  UNIQUE KEY uq_pengumpulan_soal (id_pengumpulan, id_soal),
  CONSTRAINT fk_jwb_pengumpulan FOREIGN KEY (id_pengumpulan) REFERENCES pengumpulan_tugas(id) ON DELETE CASCADE,
  CONSTRAINT fk_jwb_soal        FOREIGN KEY (id_soal)        REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- forum_diskusi : thread & balasan (self reference lewat id_parent)
-- ------------------------------------------------------------------
CREATE TABLE forum_diskusi (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_mapel  INT NOT NULL,
  id_user   INT NOT NULL,
  judul     VARCHAR(200) DEFAULT NULL,
  pesan     TEXT NOT NULL,
  id_parent INT DEFAULT NULL,
  tgl_post  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_forum_mapel  FOREIGN KEY (id_mapel)  REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  CONSTRAINT fk_forum_user   FOREIGN KEY (id_user)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_forum_parent FOREIGN KEY (id_parent) REFERENCES forum_diskusi(id) ON DELETE CASCADE
) ENGINE=InnoDB;
