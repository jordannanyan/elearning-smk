-- ===========================================================================
-- QUERY PENDUKUNG BAB IV HASIL DAN PEMBAHASAN
-- Sistem E-Learning SMA Negeri 1 Karau Kuala
-- ===========================================================================
--
-- Berkas ini berisi perintah SQL yang digunakan untuk menghasilkan tabel-tabel
-- data pada BAB IV. Jalankan setelah mengimpor elearning_smakk_bab4.sql.
--
-- ===========================================================================

USE `elearning_smakk`;

-- ---------------------------------------------------------------------------
-- QUERY 1
-- Daftar tabel basis data beserta jumlah datanya
-- ---------------------------------------------------------------------------
SELECT 'users'             AS nama_tabel, COUNT(*) AS jumlah_data FROM users
UNION ALL SELECT 'periode',           COUNT(*) FROM periode
UNION ALL SELECT 'kelas',             COUNT(*) FROM kelas
UNION ALL SELECT 'guru',              COUNT(*) FROM guru
UNION ALL SELECT 'siswa',             COUNT(*) FROM siswa
UNION ALL SELECT 'siswa_kelas',       COUNT(*) FROM siswa_kelas
UNION ALL SELECT 'mata_pelajaran',    COUNT(*) FROM mata_pelajaran
UNION ALL SELECT 'kelas_mapel',       COUNT(*) FROM kelas_mapel
UNION ALL SELECT 'pertemuan',         COUNT(*) FROM pertemuan
UNION ALL SELECT 'materi',            COUNT(*) FROM materi
UNION ALL SELECT 'tugas',             COUNT(*) FROM tugas
UNION ALL SELECT 'soal',              COUNT(*) FROM soal
UNION ALL SELECT 'pengumpulan_tugas', COUNT(*) FROM pengumpulan_tugas
UNION ALL SELECT 'jawaban_siswa',     COUNT(*) FROM jawaban_siswa
UNION ALL SELECT 'nilai',             COUNT(*) FROM nilai
UNION ALL SELECT 'forum_diskusi',     COUNT(*) FROM forum_diskusi;


-- ---------------------------------------------------------------------------
-- QUERY 2
-- Struktur kolom sebuah tabel (ganti nama tabelnya sesuai kebutuhan)
-- ---------------------------------------------------------------------------
SHOW FULL COLUMNS FROM `periode`;


-- ---------------------------------------------------------------------------
-- QUERY 3
-- Periode pembelajaran beserta status penguncian
-- ---------------------------------------------------------------------------
SELECT p.kode, p.tahun_ajaran,
       CASE p.semester WHEN 1 THEN 'Ganjil' ELSE 'Genap' END AS semester,
       p.tgl_mulai, p.tgl_selesai, p.status,
       IFNULL(u.nama, '-')                     AS dikunci_oleh,
       IFNULL(CAST(p.tgl_dikunci AS CHAR), '-') AS waktu_dikunci,
       (SELECT COUNT(*) FROM kelas k WHERE k.id_periode = p.id) AS jumlah_kelas
FROM periode p
LEFT JOIN users u ON u.id = p.dikunci_oleh
ORDER BY p.kode DESC;


-- ---------------------------------------------------------------------------
-- QUERY 4
-- Data guru beserta jumlah kelas mata pelajaran yang diampu
-- ---------------------------------------------------------------------------
SELECT g.id AS id_guru, u.nama AS nama_guru, g.nip, u.email,
       CASE WHEN u.aktif = 1 THEN 'Aktif' ELSE 'Nonaktif' END AS status_akun,
       (SELECT COUNT(*) FROM kelas_mapel km WHERE km.id_guru = g.id) AS jumlah_pengampuan
FROM guru g JOIN users u ON u.id = g.id_user
ORDER BY u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 5
-- Data siswa beserta kelasnya pada periode aktif
-- ---------------------------------------------------------------------------
SELECT s.id AS id_siswa, u.nama AS nama_siswa, s.nis, u.email,
       IFNULL(k.nama_kelas, 'Belum ditempatkan') AS kelas,
       IFNULL(p.kode, '-') AS periode,
       CASE WHEN u.aktif = 1 THEN 'Aktif' ELSE 'Nonaktif' END AS status_akun
FROM siswa s
JOIN users u ON u.id = s.id_user
LEFT JOIN siswa_kelas sk ON sk.id_siswa = s.id
LEFT JOIN kelas k  ON k.id = sk.id_kelas
LEFT JOIN periode p ON p.id = k.id_periode AND p.status = 'aktif'
WHERE p.id IS NOT NULL OR sk.id IS NULL
ORDER BY k.nama_kelas, u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 6
-- Riwayat kelas siswa lintas periode pembelajaran
-- ---------------------------------------------------------------------------
SELECT u.nama AS nama_siswa, p.kode AS periode, p.tahun_ajaran,
       CASE p.semester WHEN 1 THEN 'Ganjil' ELSE 'Genap' END AS semester,
       k.nama_kelas, k.tingkat, p.status AS status_periode
FROM siswa_kelas sk
JOIN siswa s ON s.id = sk.id_siswa
JOIN users u ON u.id = s.id_user
JOIN kelas k ON k.id = sk.id_kelas
JOIN periode p ON p.id = k.id_periode
ORDER BY u.nama, p.kode;


-- ---------------------------------------------------------------------------
-- QUERY 7
-- Katalog mata pelajaran beserta jumlah kelas dan guru yang mengampunya
-- ---------------------------------------------------------------------------
SELECT mp.nama AS mata_pelajaran, mp.kode, mp.kelompok,
       (SELECT COUNT(*) FROM kelas_mapel km WHERE km.id_mapel = mp.id) AS diampu_di_kelas,
       (SELECT COUNT(DISTINCT km.id_guru) FROM kelas_mapel km WHERE km.id_mapel = mp.id) AS jumlah_guru,
       CASE WHEN mp.aktif = 1 THEN 'Aktif' ELSE 'Nonaktif' END AS status
FROM mata_pelajaran mp
ORDER BY mp.kelompok, mp.nama;


-- ---------------------------------------------------------------------------
-- QUERY 8
-- Pembuktian satu mata pelajaran diampu guru berbeda pada kelas berbeda
-- ---------------------------------------------------------------------------
SELECT mp.nama AS mata_pelajaran, k.tingkat, k.nama_kelas,
       IFNULL(u.nama, 'Belum ditentukan') AS guru_pengampu, p.kode AS periode
FROM kelas_mapel km
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
JOIN kelas k  ON k.id = km.id_kelas
JOIN periode p ON p.id = k.id_periode
LEFT JOIN guru g  ON g.id = km.id_guru
LEFT JOIN users u ON u.id = g.id_user
WHERE mp.kode = 'BIND'
ORDER BY p.kode DESC, k.tingkat, k.nama_kelas;


-- ---------------------------------------------------------------------------
-- QUERY 9
-- Susunan pertemuan beserta isinya pada setiap kelas mata pelajaran
-- ---------------------------------------------------------------------------
SELECT p.kode AS periode, mp.nama AS mata_pelajaran, k.nama_kelas,
       IFNULL(u.nama, '-') AS guru_pengampu,
       pt.nomor AS pertemuan, pt.judul AS judul_pertemuan, pt.tanggal,
       (SELECT COUNT(*) FROM materi m WHERE m.id_pertemuan = pt.id)        AS jumlah_materi,
       (SELECT COUNT(*) FROM tugas t WHERE t.id_pertemuan = pt.id)         AS jumlah_tugas,
       (SELECT COUNT(*) FROM forum_diskusi f WHERE f.id_pertemuan = pt.id) AS jumlah_diskusi
FROM pertemuan pt
JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
JOIN kelas k  ON k.id = km.id_kelas
JOIN periode p ON p.id = k.id_periode
LEFT JOIN guru g  ON g.id = km.id_guru
LEFT JOIN users u ON u.id = g.id_user
ORDER BY p.kode DESC, mp.nama, k.nama_kelas, pt.nomor;


-- ---------------------------------------------------------------------------
-- QUERY 10
-- Jenis materi pembelajaran yang digunakan (teks, berkas, video, tautan)
-- ---------------------------------------------------------------------------
SELECT m.tipe AS jenis_materi, COUNT(*) AS jumlah,
       GROUP_CONCAT(DISTINCT mp.nama ORDER BY mp.nama SEPARATOR ', ') AS pada_mata_pelajaran
FROM materi m
JOIN pertemuan pt ON pt.id = m.id_pertemuan
JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
GROUP BY m.tipe;


-- ---------------------------------------------------------------------------
-- QUERY 11
-- Rekapitulasi pengerjaan tugas dan kuis
-- ---------------------------------------------------------------------------
SELECT per.kode AS periode, mp.nama AS mata_pelajaran, k.nama_kelas,
       pt.nomor AS pertemuan, t.judul AS tugas_kuis, t.tipe,
       COUNT(pg.id) AS terkumpul,
       SUM(CASE WHEN n.skor IS NOT NULL THEN 1 ELSE 0 END) AS sudah_dinilai,
       ROUND(AVG(n.skor), 2) AS rata_rata,
       MIN(n.skor) AS nilai_terendah, MAX(n.skor) AS nilai_tertinggi
FROM tugas t
JOIN pertemuan pt ON pt.id = t.id_pertemuan
JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
JOIN kelas k  ON k.id = km.id_kelas
JOIN periode per ON per.id = k.id_periode
LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id
LEFT JOIN nilai n ON n.id_kumpul = pg.id
GROUP BY t.id
ORDER BY per.kode DESC, mp.nama, pt.nomor;


-- ---------------------------------------------------------------------------
-- QUERY 12
-- Rekap nilai siswa per mata pelajaran pada satu periode
-- ---------------------------------------------------------------------------
SELECT u.nama AS nama_siswa, per.kode AS periode, k.nama_kelas,
       mp.nama AS mata_pelajaran,
       COUNT(t.id) AS jumlah_tugas,
       SUM(CASE WHEN n.skor IS NOT NULL THEN 1 ELSE 0 END) AS sudah_dinilai,
       SUM(CASE WHEN pg.id IS NULL AND t.deadline < NOW() THEN 1 ELSE 0 END) AS tidak_dikumpulkan,
       ROUND(AVG(n.skor), 2) AS rata_rata_mapel
FROM siswa_kelas sk
JOIN siswa s ON s.id = sk.id_siswa
JOIN users u ON u.id = s.id_user
JOIN kelas k  ON k.id = sk.id_kelas
JOIN periode per ON per.id = k.id_periode
JOIN kelas_mapel km ON km.id_kelas = k.id
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
JOIN pertemuan pt ON pt.id_kelas_mapel = km.id
JOIN tugas t ON t.id_pertemuan = pt.id
LEFT JOIN pengumpulan_tugas pg ON pg.id_tugas = t.id AND pg.id_siswa = s.id
LEFT JOIN nilai n ON n.id_kumpul = pg.id
GROUP BY s.id, km.id
ORDER BY u.nama, mp.nama;


-- ---------------------------------------------------------------------------
-- QUERY 13
-- Bukti koreksi otomatis kuis pilihan ganda oleh sistem
-- ---------------------------------------------------------------------------
SELECT u.nama AS nama_siswa, t.judul AS kuis, so.urutan AS no_soal, so.tipe AS tipe_soal,
       IFNULL(j.pilihan, '-')        AS jawaban_siswa,
       IFNULL(so.jawaban_benar, '-') AS kunci_jawaban,
       CASE WHEN so.tipe = 'esai' THEN 'Dinilai guru'
            WHEN j.benar = 1 THEN 'Benar' ELSE 'Salah' END AS hasil_koreksi,
       j.skor AS skor_butir, so.bobot AS bobot_butir
FROM jawaban_siswa j
JOIN pengumpulan_tugas pg ON pg.id = j.id_pengumpulan
JOIN siswa s ON s.id = pg.id_siswa
JOIN users u ON u.id = s.id_user
JOIN soal so ON so.id = j.id_soal
JOIN tugas t ON t.id = so.id_tugas
WHERE t.judul = 'Kuis Persamaan dan Pertidaksamaan Linear'
ORDER BY u.nama, so.urutan;


-- ---------------------------------------------------------------------------
-- QUERY 14
-- Pembuktian perhitungan nilai akhir kuis (normalisasi total bobot ke 100)
-- ---------------------------------------------------------------------------
SELECT u.nama AS nama_siswa, t.judul AS kuis,
       SUM(j.skor)   AS total_skor_diperoleh,
       SUM(so.bobot) AS total_bobot_soal,
       ROUND(SUM(j.skor) / SUM(so.bobot) * 100, 2) AS nilai_akhir_hitung,
       n.skor AS nilai_akhir_sistem
FROM jawaban_siswa j
JOIN pengumpulan_tugas pg ON pg.id = j.id_pengumpulan
JOIN siswa s ON s.id = pg.id_siswa
JOIN users u ON u.id = s.id_user
JOIN soal so ON so.id = j.id_soal
JOIN tugas t ON t.id = so.id_tugas
LEFT JOIN nilai n ON n.id_kumpul = pg.id
GROUP BY pg.id
HAVING nilai_akhir_sistem IS NOT NULL
ORDER BY t.judul, u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 15
-- Forum diskusi yang menyatu di dalam pertemuan pembelajaran
-- ---------------------------------------------------------------------------
SELECT mp.nama AS mata_pelajaran, k.nama_kelas, pt.nomor AS pertemuan,
       f.judul AS judul_topik, u.nama AS pembuka_topik, u.role AS peran,
       (SELECT COUNT(*) FROM forum_diskusi b WHERE b.id_parent = f.id) AS jumlah_balasan,
       f.tgl_post
FROM forum_diskusi f
JOIN users u ON u.id = f.id_user
JOIN pertemuan pt ON pt.id = f.id_pertemuan
JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
JOIN mata_pelajaran mp ON mp.id = km.id_mapel
JOIN kelas k ON k.id = km.id_kelas
WHERE f.id_parent IS NULL
ORDER BY mp.nama, pt.nomor;


-- ---------------------------------------------------------------------------
-- QUERY 16
-- Statistik dashboard administrator pada periode aktif
-- ---------------------------------------------------------------------------
SELECT
  (SELECT kode FROM periode WHERE status = 'aktif')                      AS periode_aktif,
  (SELECT COUNT(*) FROM users WHERE role = 'guru'  AND aktif = 1)        AS guru_aktif,
  (SELECT COUNT(*) FROM users WHERE role = 'siswa' AND aktif = 1)        AS siswa_aktif,
  (SELECT COUNT(*) FROM kelas k JOIN periode p ON p.id = k.id_periode
     WHERE p.status = 'aktif')                                           AS kelas,
  (SELECT COUNT(*) FROM mata_pelajaran WHERE aktif = 1)                  AS mata_pelajaran,
  (SELECT COUNT(*) FROM kelas_mapel km JOIN kelas k ON k.id = km.id_kelas
     JOIN periode p ON p.id = k.id_periode WHERE p.status = 'aktif')     AS pengampuan,
  (SELECT COUNT(*) FROM pertemuan pt JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
     JOIN kelas k ON k.id = km.id_kelas JOIN periode p ON p.id = k.id_periode
     WHERE p.status = 'aktif')                                           AS pertemuan,
  (SELECT COUNT(*) FROM materi m JOIN pertemuan pt ON pt.id = m.id_pertemuan
     JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel JOIN kelas k ON k.id = km.id_kelas
     JOIN periode p ON p.id = k.id_periode WHERE p.status = 'aktif')     AS materi,
  (SELECT COUNT(*) FROM tugas t JOIN pertemuan pt ON pt.id = t.id_pertemuan
     JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel JOIN kelas k ON k.id = km.id_kelas
     JOIN periode p ON p.id = k.id_periode WHERE p.status = 'aktif')     AS tugas;
