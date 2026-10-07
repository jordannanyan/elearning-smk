# Bahan BAB IV — Hasil dan Pembahasan

Seluruh isi folder ini dibangkitkan otomatis dari sistem e-learning yang benar-benar
berjalan (backend + frontend + MySQL), bukan mock-up, dan memakai **data nyata
SMA Negeri 1 Karau Kuala** (28 guru, 27 mata pelajaran, 10 kelas, 287 siswa) yang diambil
dari SK pembagian tugas mengajar, SK pembagian tugas wali kelas, dan daftar hadir siswa
tahun ajaran 2025/2026. Data pengumpulan tugas, jawaban
kuis, dan nilai dibuat melalui REST API sistem sehingga hasilnya konsisten dengan
logika aplikasi yang sesungguhnya.

## Isi folder

| Berkas | Keterangan |
|---|---|
| `Lampiran-BAB-IV-Sistem-E-Learning.docx` | **Dokumen utama.** Berisi seluruh gambar, tabel struktur basis data, tabel hasil pengujian Black Box, dan rekap nilai — siap disalin ke laporan skripsi. |
| `screenshots/` | 50 tangkapan layar beresolusi tinggi (2880 px, siap cetak). |
| `database/elearning_smakk_bab4.sql` | Dump SQL struktur + seluruh data BAB IV, siap diimpor lewat phpMyAdmin. |
| `database/query-bab4.sql` | 16 query SQL yang dipakai menghasilkan tabel-tabel data pada BAB IV. |
| `data/daftar-gambar.json` | Daftar gambar beserta judul dan kalimat penjelasnya. |
| `data/hasil-pengujian.json` | Hasil 101 skenario pengujian Black Box. |
| `data/struktur-basisdata.json` | Struktur 16 tabel basis data hasil implementasi. |
| `data/statistik-sistem.json` | Statistik data sistem dan rekapitulasi nilai siswa. |

## Periode pembelajaran pada data uji

| Kode | Tahun Ajaran | Semester | Status | Dikunci oleh |
|---|---|---|---|---|
| `2026/1` | 2025/2026 | Ganjil | **aktif** | - |
| `2025/2` | 2024/2025 | Genap | **terkunci** | Administrator |

Periode `2025/2` sengaja dibiarkan terkunci agar dapat memperlihatkan mekanisme penguncian
periode: seluruh datanya tetap dapat dilihat sebagai arsip, namun guru tidak dapat mengubah
materi/tugas/nilai dan siswa tidak dapat mengumpulkan tugas.

## Daftar tangkapan layar

| No | Berkas | Judul Gambar |
|---|---|---|
| 1 | `01-halaman-depan.png` | Halaman Depan Sekolah |
| 2 | `02-halaman-login.png` | Halaman Login |
| 3 | `03-login-gagal.png` | Pesan Kesalahan Login |
| 4 | `04-admin-dashboard.png` | Halaman Dashboard Administrator |
| 5 | `05-admin-periode.png` | Halaman Periode Pembelajaran |
| 6 | `06-admin-form-periode.png` | Form Tambah Periode Pembelajaran |
| 7 | `07-admin-data-guru.png` | Halaman Data Guru |
| 8 | `08-admin-cari-guru.png` | Pencarian Data Guru |
| 9 | `09-admin-form-guru.png` | Form Tambah Data Guru |
| 10 | `10-admin-jadwal-guru.png` | Rincian Jadwal Mengajar Seorang Guru |
| 11 | `11-admin-data-siswa.png` | Halaman Data Siswa |
| 12 | `12-admin-siswa-paginasi.png` | Paginasi pada Halaman Data Siswa |
| 13 | `13-admin-form-siswa.png` | Form Tambah Data Siswa |
| 14 | `14-admin-data-kelas.png` | Halaman Data Kelas |
| 15 | `15-admin-kelas-mapel-guru.png` | Pengaturan Mata Pelajaran dan Guru Pengajar Kelas |
| 16 | `16-admin-kelas-siswa.png` | Pengaturan Siswa Anggota Kelas |
| 17 | `17-admin-data-mapel.png` | Halaman Katalog Mata Pelajaran |
| 18 | `18-admin-form-mapel.png` | Form Tambah Mata Pelajaran |
| 19 | `19-admin-mapel-detail.png` | Rincian Mata Pelajaran: Diajarkan di Kelas Mana |
| 20 | `20-guru-dashboard.png` | Halaman Dashboard Guru |
| 21 | `21-guru-kelas-saya.png` | Halaman Kelas Saya (Guru) |
| 22 | `22-guru-daftar-pertemuan.png` | Daftar Pertemuan pada Kelas Mata Pelajaran |
| 23 | `23-guru-form-pertemuan.png` | Form Tambah Pertemuan |
| 24 | `24-guru-isi-pertemuan.png` | Halaman Kelola Isi Pertemuan (Guru) |
| 25 | `25-guru-form-materi.png` | Form Tambah Materi Pembelajaran |
| 26 | `26-guru-form-tugas.png` | Form Buat Tugas dan Kuis |
| 27 | `27-guru-kelola-soal.png` | Halaman Kelola Butir Soal Kuis |
| 28 | `28-guru-penilaian.png` | Halaman Penilaian (Guru) |
| 29 | `29-guru-penilaian-mapel.png` | Daftar Tugas pada Satu Mata Pelajaran |
| 30 | `30-guru-daftar-pengumpulan.png` | Daftar Pengumpulan Tugas Siswa |
| 31 | `31-guru-form-nilai.png` | Form Penilaian Tugas oleh Guru |
| 32 | `32-guru-pengumpulan-kuis.png` | Daftar Pengumpulan Kuis Siswa |
| 33 | `33-guru-penilaian-esai.png` | Halaman Pemeriksaan dan Penilaian Jawaban Kuis |
| 34 | `34-guru-raport-daftar.png` | Daftar Kelas pada Menu Raport Sementara |
| 35 | `35-guru-raport-kelas.png` | Raport Sementara Satu Kelas (Guru) |
| 36 | `36-siswa-dashboard.png` | Halaman Dashboard Siswa |
| 37 | `37-siswa-kelas-saya.png` | Halaman Kelas Saya (Siswa) |
| 38 | `38-siswa-daftar-pertemuan.png` | Daftar Pertemuan Mata Pelajaran (Siswa) |
| 39 | `39-siswa-isi-pertemuan.png` | Halaman Isi Pertemuan (Siswa) |
| 40 | `40-siswa-tugas.png` | Halaman Tugas dan Kuis (Siswa) |
| 41 | `41-siswa-tugas-rincian.png` | Rincian Tugas yang Disembunyikan |
| 42 | `42-siswa-hasil-kuis.png` | Halaman Hasil Pengerjaan Kuis Siswa |
| 43 | `43-siswa-nilai.png` | Halaman Rekap Nilai Siswa |
| 44 | `44-siswa-nilai-arsip.png` | Riwayat Nilai pada Periode Sebelumnya |
| 45 | `45-siswa-raport.png` | Halaman Raport Sementara Siswa |
| 46 | `46-siswa-kerjakan-kuis.png` | Halaman Pengerjaan Kuis oleh Siswa |
| 47 | `47-siswa-kerjakan-tugas.png` | Halaman Pengerjaan dan Pengumpulan Tugas |
| 48 | `48-periode-terkunci-guru.png` | Tampilan Periode yang Telah Dikunci |
| 49 | `49-periode-terkunci-pertemuan.png` | Isi Pertemuan pada Periode Terkunci |
| 50 | `50-tampilan-mobile.png` | Tampilan Sistem pada Perangkat Mobile |

## Ringkasan hasil pengujian Black Box

Total **101 skenario**, **101 Valid**, **0 Tidak Valid**
(**100.00%** keberhasilan).

| Modul | Skenario | Valid | Tidak Valid |
|---|---|---|---|
| Autentikasi | 9 | 9 | 0 |
| Periode Pembelajaran | 8 | 8 | 0 |
| Penguncian Periode | 5 | 5 | 0 |
| Manajemen Pengguna | 11 | 11 | 0 |
| Manajemen Kelas | 3 | 3 | 0 |
| Mata Pelajaran | 5 | 5 | 0 |
| Mata Pelajaran Kelas | 1 | 1 | 0 |
| Kelas yang Diajar | 1 | 1 | 0 |
| Pertemuan | 4 | 4 | 0 |
| Materi Pembelajaran | 9 | 9 | 0 |
| Alur Pembelajaran Siswa | 4 | 4 | 0 |
| Tugas dan Batas Waktu | 2 | 2 | 0 |
| Tugas dan Kuis | 5 | 5 | 0 |
| Pengerjaan Kuis | 4 | 4 | 0 |
| Pengumpulan Tugas | 2 | 2 | 0 |
| Penilaian | 7 | 7 | 0 |
| Rekap Nilai | 5 | 5 | 0 |
| Forum Diskusi | 7 | 7 | 0 |
| Dashboard | 3 | 3 | 0 |
| Halaman Depan | 1 | 1 | 0 |
| Raport Sementara | 5 | 5 | 0 |

## Tabel basis data hasil implementasi

| No | Tabel | Deskripsi | Jumlah Data |
|---|---|---|---|
| 1 | `users` | Menyimpan data akun seluruh pengguna sistem (administrator, guru, dan siswa) | 316 |
| 2 | `periode` | Menyimpan periode pembelajaran (tahun ajaran dan semester) beserta status penguncian | 2 |
| 3 | `kelas` | Menyimpan data rombongan belajar pada sebuah periode pembelajaran | 20 |
| 4 | `guru` | Menyimpan data detail profil guru yang berelasi dengan tabel users | 28 |
| 5 | `siswa` | Menyimpan data detail profil siswa yang berelasi dengan tabel users | 287 |
| 6 | `siswa_kelas` | Menyimpan keanggotaan siswa pada sebuah kelas di setiap periode | 574 |
| 7 | `mata_pelajaran` | Menyimpan katalog mata pelajaran sekolah | 27 |
| 8 | `kelas_mapel` | Menyimpan pengampuan, yaitu mata pelajaran pada sebuah kelas beserta guru pengampunya | 310 |
| 9 | `pertemuan` | Menyimpan urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran | 10 |
| 10 | `materi` | Menyimpan materi pembelajaran (teks, berkas, video, atau tautan) pada sebuah pertemuan | 16 |
| 11 | `tugas` | Menyimpan data tugas dan kuis beserta tipe dan batas waktunya | 9 |
| 12 | `soal` | Menyimpan butir soal pilihan ganda maupun esai pada sebuah kuis | 13 |
| 13 | `pengumpulan_tugas` | Menyimpan data pengumpulan jawaban tugas oleh siswa | 32 |
| 14 | `jawaban_siswa` | Menyimpan jawaban siswa pada setiap butir soal kuis | 62 |
| 15 | `nilai` | Menyimpan data nilai siswa hasil penilaian guru maupun koreksi otomatis | 26 |
| 16 | `forum_diskusi` | Menyimpan topik dan balasan forum diskusi pada sebuah pertemuan | 20 |

## Cara membangkitkan ulang

Jalankan berurutan dari folder `elearning/`:

```bash
# 0. (bila berkas sekolah diperbarui) impor ulang data resmi sekolah
python scripts/impor-data-sekolah.py

# 1. Siapkan basis data & data sekolah
cd backend && npm run db:init && npm run db:seed && npm start   # biarkan berjalan
cd ../frontend && npm run dev                                    # biarkan berjalan

# 2. Jalankan pengujian Black Box (sekaligus mengisi pengumpulan & nilai)
node scripts/blackbox.js

# 3. Ambil seluruh tangkapan layar
python scripts/screenshots.py

# 4. Ambil struktur basis data & statistik
node scripts/data-bab4.js

# 5. Susun dokumen Word lampiran BAB IV
python scripts/buat-dokumen-bab4.py

# 6. Buat dump SQL basis data
python scripts/buat-dump-sql.py
```

Urutan langkah 1 → 2 → 3 wajib diikuti: skrip screenshot membutuhkan data pengumpulan
dan nilai yang dibuat oleh `blackbox.js`.

Kebutuhan tambahan untuk langkah 3 dan 5: `pip install playwright python-docx pillow`
dan `python -m playwright install chromium`.

## Memulihkan data pengujian

```bash
mysql -u root < docs-bab4/database/elearning_smakk_bab4.sql
```

atau lewat phpMyAdmin: menu **Import** → pilih `elearning_smakk_bab4.sql` → **Go**.
