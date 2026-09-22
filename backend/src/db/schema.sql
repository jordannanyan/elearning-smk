-- =====================================================================
-- Skema Database Sistem E-Learning SMA Negeri 1 Karau Kuala
-- ---------------------------------------------------------------------
-- Struktur ini mengakomodasi:
--   * Periode pembelajaran (tahun ajaran + semester) yang dapat dikunci
--     oleh administrator apabila periode tersebut telah selesai.
--   * Satu mata pelajaran dapat diampu oleh lebih dari satu guru pada
--     kelas/tingkat yang berbeda melalui tabel kelas_mapel.
--   * Materi, tugas, dan forum diskusi tersusun per pertemuan.
--   * Penonaktifan akun (soft delete) agar data historis tetap utuh.
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
DROP TABLE IF EXISTS pertemuan;
DROP TABLE IF EXISTS kelas_mapel;
DROP TABLE IF EXISTS siswa_kelas;
DROP TABLE IF EXISTS mata_pelajaran;
DROP TABLE IF EXISTS siswa;
DROP TABLE IF EXISTS guru;
DROP TABLE IF EXISTS kelas;
DROP TABLE IF EXISTS periode;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------------
-- users : akun untuk semua level pengguna (admin/guru/siswa)
--   aktif = FALSE dipakai sebagai pengganti penghapusan data agar
--   seluruh riwayat pembelajaran pengguna tetap tersimpan.
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
-- periode : periode pembelajaran (tahun ajaran + semester)
--   kode    : 2026/1  -> Tahun Ajaran 2025/2026 semester ganjil
--   status  : draft   -> sedang disiapkan, belum dapat digunakan
--             aktif   -> periode berjalan (hanya boleh satu)
--             terkunci-> periode selesai, seluruh datanya menjadi
--                        hanya-baca (arsip) namun tetap dapat dilihat
-- ------------------------------------------------------------------
CREATE TABLE periode (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  kode          VARCHAR(20) NOT NULL UNIQUE,
  tahun_ajaran  VARCHAR(20) NOT NULL,
  semester      TINYINT NOT NULL,                  -- 1 = ganjil, 2 = genap
  tgl_mulai     DATE DEFAULT NULL,
  tgl_selesai   DATE DEFAULT NULL,
  status        ENUM('draft','aktif','terkunci') NOT NULL DEFAULT 'draft',
  dikunci_oleh  INT DEFAULT NULL,
  tgl_dikunci   DATETIME DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_periode_admin FOREIGN KEY (dikunci_oleh) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- kelas : rombongan belajar pada sebuah periode
--   Kelas X IPA 1 pada 2026/1 berbeda baris dengan X IPA 1 pada 2026/2,
--   sehingga riwayat tiap periode tetap terpisah.
-- ------------------------------------------------------------------
CREATE TABLE kelas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_periode  INT NOT NULL,
  nama_kelas  VARCHAR(50) NOT NULL,
  tingkat     VARCHAR(10) NOT NULL,                -- X / XI / XII
  wali_kelas  VARCHAR(120) DEFAULT NULL,
  UNIQUE KEY uq_kelas_periode (id_periode, nama_kelas),
  CONSTRAINT fk_kelas_periode FOREIGN KEY (id_periode) REFERENCES periode(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- guru : data profil guru, 1-1 dengan users
-- ------------------------------------------------------------------
CREATE TABLE guru (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_user   INT NOT NULL UNIQUE,
  nip       VARCHAR(30) DEFAULT NULL,
  tgl_lahir DATE DEFAULT NULL,
  alamat    TEXT DEFAULT NULL,
  CONSTRAINT fk_guru_user FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- siswa : data profil siswa, 1-1 dengan users
--   Penempatan kelas tidak lagi disimpan di sini melainkan pada tabel
--   siswa_kelas, sehingga riwayat kenaikan kelas dapat ditelusuri.
-- ------------------------------------------------------------------
CREATE TABLE siswa (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_user   INT NOT NULL UNIQUE,
  nis       VARCHAR(30) DEFAULT NULL,
  tgl_lahir DATE DEFAULT NULL,
  alamat    TEXT DEFAULT NULL,
  CONSTRAINT fk_siswa_user FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- siswa_kelas : keanggotaan siswa pada sebuah kelas (per periode)
-- ------------------------------------------------------------------
CREATE TABLE siswa_kelas (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  id_siswa INT NOT NULL,
  id_kelas INT NOT NULL,
  UNIQUE KEY uq_siswa_kelas (id_siswa, id_kelas),
  CONSTRAINT fk_sk_siswa FOREIGN KEY (id_siswa) REFERENCES siswa(id) ON DELETE CASCADE,
  CONSTRAINT fk_sk_kelas FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- mata_pelajaran : katalog mata pelajaran sekolah
--   Tidak terikat guru maupun periode. Penugasan guru dilakukan pada
--   tabel kelas_mapel.
-- ------------------------------------------------------------------
CREATE TABLE mata_pelajaran (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nama      VARCHAR(120) NOT NULL,
  kode      VARCHAR(30) DEFAULT NULL UNIQUE,
  kelompok  VARCHAR(60) DEFAULT NULL,             -- Wajib / Peminatan / Muatan Lokal
  deskripsi TEXT DEFAULT NULL,
  aktif     BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- kelas_mapel : pengampuan, yaitu sebuah mata pelajaran yang diajarkan
--   pada sebuah kelas oleh seorang guru dalam satu periode.
--   Inilah "kelas mata pelajaran" yang menjadi wadah pertemuan,
--   materi, tugas, dan forum diskusi.
-- ------------------------------------------------------------------
CREATE TABLE kelas_mapel (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  id_kelas  INT NOT NULL,
  id_mapel  INT NOT NULL,
  id_guru   INT DEFAULT NULL,
  UNIQUE KEY uq_kelas_mapel (id_kelas, id_mapel),
  CONSTRAINT fk_km_kelas FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE,
  CONSTRAINT fk_km_mapel FOREIGN KEY (id_mapel) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  CONSTRAINT fk_km_guru  FOREIGN KEY (id_guru)  REFERENCES guru(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- pertemuan : urutan pertemuan pembelajaran pada sebuah kelas_mapel
-- ------------------------------------------------------------------
CREATE TABLE pertemuan (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  id_kelas_mapel INT NOT NULL,
  nomor         INT NOT NULL,
  judul         VARCHAR(200) NOT NULL,
  deskripsi     TEXT DEFAULT NULL,
  tanggal       DATE DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pertemuan_nomor (id_kelas_mapel, nomor),
  CONSTRAINT fk_pertemuan_km FOREIGN KEY (id_kelas_mapel) REFERENCES kelas_mapel(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- materi : bahan ajar pada sebuah pertemuan
--   tipe file  -> berkas yang diunggah guru (PDF, dokumen, gambar)
--   tipe video -> berkas video yang diunggah guru
--   tipe link  -> tautan video YouTube atau sumber belajar lain
--   tipe teks  -> uraian materi tanpa lampiran
-- ------------------------------------------------------------------
CREATE TABLE materi (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_pertemuan INT NOT NULL,
  judul       VARCHAR(200) NOT NULL,
  konten      TEXT DEFAULT NULL,
  tipe        ENUM('teks','file','video','link') NOT NULL DEFAULT 'teks',
  file        VARCHAR(255) DEFAULT NULL,
  url         VARCHAR(500) DEFAULT NULL,
  tgl_upload  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_materi_pertemuan FOREIGN KEY (id_pertemuan) REFERENCES pertemuan(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- tugas : tugas atau kuis pada sebuah pertemuan
-- ------------------------------------------------------------------
CREATE TABLE tugas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_pertemuan INT NOT NULL,
  judul       VARCHAR(200) NOT NULL,
  deskripsi   TEXT DEFAULT NULL,
  deadline    DATETIME DEFAULT NULL,
  tipe        ENUM('tugas','kuis') NOT NULL DEFAULT 'tugas',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tugas_pertemuan FOREIGN KEY (id_pertemuan) REFERENCES pertemuan(id) ON DELETE CASCADE
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
  jawaban_benar CHAR(1) DEFAULT NULL,
  bobot         INT NOT NULL DEFAULT 10,
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
  id            INT AUTO_INCREMENT PRIMARY KEY,
  id_kumpul     INT NOT NULL,
  id_guru       INT DEFAULT NULL,
  skor          DECIMAL(5,2) DEFAULT NULL,
  catatan       TEXT DEFAULT NULL,
  tgl_penilaian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nilai_kumpul (id_kumpul),
  CONSTRAINT fk_nilai_kumpul FOREIGN KEY (id_kumpul) REFERENCES pengumpulan_tugas(id) ON DELETE CASCADE,
  CONSTRAINT fk_nilai_guru   FOREIGN KEY (id_guru)   REFERENCES guru(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------
-- jawaban_siswa : jawaban per butir soal dalam satu pengumpulan
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
-- forum_diskusi : topik diskusi pada sebuah pertemuan
--   Topik (id_parent NULL) hanya boleh dibuka oleh guru pengampu,
--   sedangkan siswa menanggapi melalui balasan (id_parent terisi).
-- ------------------------------------------------------------------
CREATE TABLE forum_diskusi (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  id_pertemuan INT NOT NULL,
  id_user      INT NOT NULL,
  judul        VARCHAR(200) DEFAULT NULL,
  pesan        TEXT NOT NULL,
  id_parent    INT DEFAULT NULL,
  tgl_post     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_forum_pertemuan FOREIGN KEY (id_pertemuan) REFERENCES pertemuan(id) ON DELETE CASCADE,
  CONSTRAINT fk_forum_user      FOREIGN KEY (id_user)      REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_forum_parent    FOREIGN KEY (id_parent)    REFERENCES forum_diskusi(id) ON DELETE CASCADE
) ENGINE=InnoDB;
