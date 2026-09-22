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
-- (dasar penyusunan tabel "Daftar Tabel pada Basis Data Sistem E-Learning")
-- ---------------------------------------------------------------------------
SELECT 'users'             AS nama_tabel, COUNT(*) AS jumlah_data FROM users
UNION ALL SELECT 'kelas',             COUNT(*) FROM kelas
UNION ALL SELECT 'guru',              COUNT(*) FROM guru
UNION ALL SELECT 'siswa',             COUNT(*) FROM siswa
UNION ALL SELECT 'mata_pelajaran',    COUNT(*) FROM mata_pelajaran
UNION ALL SELECT 'materi',            COUNT(*) FROM materi
UNION ALL SELECT 'tugas',             COUNT(*) FROM tugas
UNION ALL SELECT 'soal',              COUNT(*) FROM soal
UNION ALL SELECT 'pengumpulan_tugas', COUNT(*) FROM pengumpulan_tugas
UNION ALL SELECT 'jawaban_siswa',     COUNT(*) FROM jawaban_siswa
UNION ALL SELECT 'nilai',             COUNT(*) FROM nilai
UNION ALL SELECT 'forum_diskusi',     COUNT(*) FROM forum_diskusi;


-- ---------------------------------------------------------------------------
-- QUERY 2
-- Struktur kolom sebuah tabel
-- (dasar penyusunan tabel "Struktur Tabel ...", ganti nama tabelnya)
-- ---------------------------------------------------------------------------
SHOW FULL COLUMNS FROM `users`;


-- ---------------------------------------------------------------------------
-- QUERY 3
-- Data guru beserta mata pelajaran yang diampu
-- ---------------------------------------------------------------------------
SELECT g.id       AS id_guru,
       u.nama     AS nama_guru,
       g.nip      AS nip,
       u.email    AS email,
       g.mapel    AS mata_pelajaran,
       CASE WHEN u.aktif = 1 THEN 'Aktif' ELSE 'Nonaktif' END AS status
FROM guru g
JOIN users u ON u.id = g.id_user
ORDER BY u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 4
-- Data siswa beserta kelasnya
-- ---------------------------------------------------------------------------
SELECT s.id        AS id_siswa,
       u.nama      AS nama_siswa,
       s.nis       AS nis,
       u.email     AS email,
       k.nama_kelas AS kelas,
       k.tahun_ajaran
FROM siswa s
JOIN users u ON u.id = s.id_user
LEFT JOIN kelas k ON k.id = s.id_kelas
ORDER BY k.nama_kelas, u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 5
-- Data kelas beserta jumlah siswanya
-- ---------------------------------------------------------------------------
SELECT k.nama_kelas, k.tingkat, k.tahun_ajaran,
       COUNT(s.id) AS jumlah_siswa
FROM kelas k
LEFT JOIN siswa s ON s.id_kelas = k.id
GROUP BY k.id
ORDER BY k.tingkat, k.nama_kelas;


-- ---------------------------------------------------------------------------
-- QUERY 6
-- Data mata pelajaran beserta guru pengampu dan jumlah materi/tugasnya
-- ---------------------------------------------------------------------------
SELECT mp.nama  AS mata_pelajaran,
       mp.kode  AS kode,
       u.nama   AS guru_pengampu,
       (SELECT COUNT(*) FROM materi m WHERE m.id_mapel = mp.id) AS jumlah_materi,
       (SELECT COUNT(*) FROM tugas t WHERE t.id_mapel = mp.id)  AS jumlah_tugas
FROM mata_pelajaran mp
LEFT JOIN guru g  ON g.id = mp.id_guru
LEFT JOIN users u ON u.id = g.id_user
ORDER BY mp.nama;


-- ---------------------------------------------------------------------------
-- QUERY 7
-- Data materi pembelajaran
-- ---------------------------------------------------------------------------
SELECT m.judul       AS judul_materi,
       mp.nama       AS mata_pelajaran,
       u.nama        AS guru_pengampu,
       IFNULL(m.file, '-') AS file_lampiran,
       DATE(m.tgl_upload)  AS tanggal_unggah
FROM materi m
JOIN mata_pelajaran mp ON mp.id = m.id_mapel
LEFT JOIN guru g  ON g.id = mp.id_guru
LEFT JOIN users u ON u.id = g.id_user
ORDER BY mp.nama, m.id;


-- ---------------------------------------------------------------------------
-- QUERY 8
-- Data tugas dan kuis beserta jumlah soal dan jumlah pengumpulannya
-- ---------------------------------------------------------------------------
SELECT t.judul   AS judul_tugas,
       mp.nama   AS mata_pelajaran,
       t.tipe    AS tipe,
       t.deadline,
       (SELECT COUNT(*) FROM soal s WHERE s.id_tugas = t.id) AS jumlah_soal,
       (SELECT COUNT(*) FROM pengumpulan_tugas p WHERE p.id_tugas = t.id) AS jumlah_kumpul
FROM tugas t
JOIN mata_pelajaran mp ON mp.id = t.id_mapel
ORDER BY mp.nama, t.judul;


-- ---------------------------------------------------------------------------
-- QUERY 9
-- Butir soal beserta kunci jawaban dan bobotnya
-- ---------------------------------------------------------------------------
SELECT t.judul        AS kuis,
       s.urutan       AS no_soal,
       s.tipe         AS tipe_soal,
       s.pertanyaan,
       IFNULL(s.jawaban_benar, '-') AS kunci_jawaban,
       s.bobot
FROM soal s
JOIN tugas t ON t.id = s.id_tugas
ORDER BY t.judul, s.urutan;


-- ---------------------------------------------------------------------------
-- QUERY 10
-- Rekapitulasi pengerjaan tugas dan kuis
-- (dasar penyusunan tabel "Rekapitulasi Pengerjaan Tugas dan Kuis")
-- ---------------------------------------------------------------------------
SELECT t.judul   AS tugas_kuis,
       mp.nama   AS mata_pelajaran,
       t.tipe,
       COUNT(p.id) AS terkumpul,
       SUM(CASE WHEN n.skor IS NOT NULL THEN 1 ELSE 0 END) AS sudah_dinilai,
       ROUND(AVG(n.skor), 2) AS rata_rata,
       MIN(n.skor) AS nilai_terendah,
       MAX(n.skor) AS nilai_tertinggi
FROM tugas t
JOIN mata_pelajaran mp ON mp.id = t.id_mapel
LEFT JOIN pengumpulan_tugas p ON p.id_tugas = t.id
LEFT JOIN nilai n ON n.id_kumpul = p.id
GROUP BY t.id
ORDER BY mp.nama, t.judul;


-- ---------------------------------------------------------------------------
-- QUERY 11
-- Rincian nilai setiap siswa
-- (dasar penyusunan tabel "Rincian Nilai Siswa")
-- ---------------------------------------------------------------------------
SELECT u.nama       AS nama_siswa,
       k.nama_kelas AS kelas,
       t.judul      AS tugas_kuis,
       mp.nama      AS mata_pelajaran,
       t.tipe,
       IFNULL(CAST(n.skor AS CHAR), 'Belum dinilai') AS nilai,
       CASE WHEN p.terlambat = 1 THEN 'Terlambat' ELSE 'Tepat waktu' END AS keterangan,
       IFNULL(n.catatan, '-') AS catatan_guru
FROM pengumpulan_tugas p
JOIN siswa s  ON s.id = p.id_siswa
JOIN users u  ON u.id = s.id_user
LEFT JOIN kelas k ON k.id = s.id_kelas
JOIN tugas t  ON t.id = p.id_tugas
JOIN mata_pelajaran mp ON mp.id = t.id_mapel
LEFT JOIN nilai n ON n.id_kumpul = p.id
ORDER BY u.nama, t.judul;


-- ---------------------------------------------------------------------------
-- QUERY 12
-- Bukti koreksi otomatis kuis pilihan ganda oleh sistem
-- (memperlihatkan jawaban siswa, kunci jawaban, dan skor tiap butir soal)
-- ---------------------------------------------------------------------------
SELECT u.nama          AS nama_siswa,
       t.judul         AS kuis,
       so.urutan       AS no_soal,
       so.tipe         AS tipe_soal,
       IFNULL(j.pilihan, '-')       AS jawaban_siswa,
       IFNULL(so.jawaban_benar, '-') AS kunci_jawaban,
       CASE WHEN so.tipe = 'esai' THEN 'Dinilai guru'
            WHEN j.benar = 1 THEN 'Benar' ELSE 'Salah' END AS hasil_koreksi,
       j.skor          AS skor_butir,
       so.bobot        AS bobot_butir
FROM jawaban_siswa j
JOIN pengumpulan_tugas p ON p.id = j.id_pengumpulan
JOIN siswa s  ON s.id = p.id_siswa
JOIN users u  ON u.id = s.id_user
JOIN soal so  ON so.id = j.id_soal
JOIN tugas t  ON t.id = so.id_tugas
WHERE t.judul = 'Kuis Persamaan dan Pertidaksamaan Linear'
ORDER BY u.nama, so.urutan;


-- ---------------------------------------------------------------------------
-- QUERY 13
-- Pembuktian perhitungan nilai akhir kuis (normalisasi total bobot ke 100)
-- ---------------------------------------------------------------------------
SELECT u.nama         AS nama_siswa,
       t.judul        AS kuis,
       SUM(j.skor)    AS total_skor_diperoleh,
       SUM(so.bobot)  AS total_bobot_soal,
       ROUND(SUM(j.skor) / SUM(so.bobot) * 100, 2) AS nilai_akhir_hitung,
       n.skor         AS nilai_akhir_sistem
FROM jawaban_siswa j
JOIN pengumpulan_tugas p ON p.id = j.id_pengumpulan
JOIN siswa s  ON s.id = p.id_siswa
JOIN users u  ON u.id = s.id_user
JOIN soal so  ON so.id = j.id_soal
JOIN tugas t  ON t.id = so.id_tugas
LEFT JOIN nilai n ON n.id_kumpul = p.id
GROUP BY p.id
HAVING nilai_akhir_sistem IS NOT NULL
ORDER BY t.judul, u.nama;


-- ---------------------------------------------------------------------------
-- QUERY 14
-- Data forum diskusi beserta jumlah balasan tiap topik
-- ---------------------------------------------------------------------------
SELECT mp.nama    AS mata_pelajaran,
       f.judul    AS judul_topik,
       u.nama     AS penulis,
       u.role     AS peran,
       (SELECT COUNT(*) FROM forum_diskusi b WHERE b.id_parent = f.id) AS jumlah_balasan,
       f.tgl_post AS waktu_kirim
FROM forum_diskusi f
JOIN users u ON u.id = f.id_user
JOIN mata_pelajaran mp ON mp.id = f.id_mapel
WHERE f.id_parent IS NULL
ORDER BY mp.nama, f.tgl_post;


-- ---------------------------------------------------------------------------
-- QUERY 15
-- Statistik dashboard administrator
-- ---------------------------------------------------------------------------
SELECT (SELECT COUNT(*) FROM users WHERE role = 'guru')  AS total_guru,
       (SELECT COUNT(*) FROM users WHERE role = 'siswa') AS total_siswa,
       (SELECT COUNT(*) FROM kelas)                      AS total_kelas,
       (SELECT COUNT(*) FROM mata_pelajaran)             AS total_mata_pelajaran,
       (SELECT COUNT(*) FROM materi)                     AS total_materi,
       (SELECT COUNT(*) FROM tugas)                      AS total_tugas;
