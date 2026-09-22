# Bahan BAB IV — Hasil dan Pembahasan

Seluruh isi folder ini dibangkitkan otomatis dari sistem e-learning yang benar-benar
berjalan (backend + frontend + MySQL), bukan mock-up. Data pengumpulan tugas, jawaban
kuis, dan nilai dibuat melalui REST API sistem sehingga hasilnya konsisten dengan
logika aplikasi yang sesungguhnya.

## Isi folder

| Berkas | Keterangan |
|---|---|
| `database/elearning_smakk_bab4.sql` | **Dump SQL** struktur + seluruh data BAB IV (242 baris pada 12 tabel), siap diimpor lewat phpMyAdmin. |
| `database/query-bab4.sql` | 15 query SQL yang dipakai menghasilkan tabel-tabel data pada BAB IV, termasuk pembuktian perhitungan nilai otomatis. |
| `Lampiran-BAB-IV-Sistem-E-Learning.docx` | **Dokumen utama.** Berisi seluruh gambar, tabel struktur basis data, tabel hasil pengujian Black Box, dan rekap nilai — siap disalin ke laporan skripsi. |
| `screenshots/` | 33 tangkapan layar beresolusi tinggi (2880 px, siap cetak). |
| `data/daftar-gambar.json` | Daftar gambar beserta judul dan kalimat penjelasnya. |
| `data/hasil-pengujian.json` | Hasil 63 skenario pengujian Black Box. |
| `data/struktur-basisdata.json` | Struktur 12 tabel basis data hasil implementasi. |
| `data/statistik-sistem.json` | Statistik data sistem dan rekapitulasi nilai siswa. |

## Daftar tangkapan layar

| No | Berkas | Judul Gambar |
|---|---|---|
| 1 | `01-halaman-login.png` | Halaman Login |
| 2 | `02-login-gagal.png` | Pesan Kesalahan Login |
| 3 | `03-admin-dashboard.png` | Halaman Dashboard Administrator |
| 4 | `04-admin-data-guru.png` | Halaman Data Guru |
| 5 | `05-admin-form-guru.png` | Form Tambah Data Guru |
| 6 | `06-admin-data-siswa.png` | Halaman Data Siswa |
| 7 | `07-admin-form-siswa.png` | Form Tambah Data Siswa |
| 8 | `08-admin-data-kelas.png` | Halaman Data Kelas |
| 9 | `09-admin-form-kelas.png` | Form Tambah Data Kelas |
| 10 | `10-admin-data-mapel.png` | Halaman Data Mata Pelajaran |
| 11 | `11-admin-form-mapel.png` | Form Tambah Mata Pelajaran |
| 12 | `12-guru-dashboard.png` | Halaman Dashboard Guru |
| 13 | `13-guru-materi.png` | Halaman Kelola Materi Pembelajaran (Guru) |
| 14 | `14-guru-form-materi.png` | Form Tambah Materi Pembelajaran |
| 15 | `15-guru-tugas.png` | Halaman Kelola Tugas dan Kuis (Guru) |
| 16 | `16-guru-form-tugas.png` | Form Buat Tugas dan Kuis |
| 17 | `17-guru-kelola-soal.png` | Halaman Kelola Butir Soal Kuis |
| 18 | `18-guru-form-soal.png` | Form Tambah Butir Soal |
| 19 | `19-guru-daftar-pengumpulan.png` | Daftar Pengumpulan Tugas Siswa |
| 20 | `20-guru-pengumpulan-kuis.png` | Daftar Pengumpulan Kuis Siswa |
| 21 | `21-guru-penilaian-esai.png` | Halaman Pemeriksaan dan Penilaian Jawaban Kuis |
| 22 | `22-guru-forum.png` | Halaman Forum Diskusi (Guru) |
| 23 | `23-siswa-dashboard.png` | Halaman Dashboard Siswa |
| 24 | `24-siswa-materi.png` | Halaman Materi Pembelajaran (Siswa) |
| 25 | `25-siswa-materi-filter.png` | Penyaringan Materi Berdasarkan Mata Pelajaran |
| 26 | `26-siswa-tugas.png` | Halaman Tugas dan Kuis (Siswa) |
| 27 | `27-siswa-hasil-kuis.png` | Halaman Hasil Pengerjaan Kuis Siswa |
| 28 | `28-siswa-nilai.png` | Halaman Rekap Nilai Siswa |
| 29 | `29-siswa-forum.png` | Halaman Forum Diskusi (Siswa) |
| 30 | `30-siswa-forum-balas.png` | Form Balasan Forum Diskusi |
| 31 | `31-siswa-kerjakan-kuis.png` | Halaman Pengerjaan Kuis oleh Siswa |
| 32 | `32-siswa-kerjakan-tugas.png` | Halaman Pengerjaan dan Pengumpulan Tugas |
| 33 | `33-tampilan-mobile.png` | Tampilan Sistem pada Perangkat Mobile |

## Ringkasan hasil pengujian Black Box

Total **63 skenario**, **63 Valid**, **0 Tidak Valid**
(**100.00%** keberhasilan).

| Modul | Skenario | Valid | Tidak Valid |
|---|---|---|---|
| Autentikasi | 10 | 10 | 0 |
| Manajemen Pengguna | 9 | 9 | 0 |
| Manajemen Kelas | 3 | 3 | 0 |
| Manajemen Mata Pelajaran | 3 | 3 | 0 |
| Materi Pembelajaran | 8 | 8 | 0 |
| Tugas dan Kuis | 6 | 6 | 0 |
| Pengerjaan Kuis | 5 | 5 | 0 |
| Pengumpulan Tugas | 2 | 2 | 0 |
| Penilaian | 6 | 6 | 0 |
| Rekap Nilai | 2 | 2 | 0 |
| Forum Diskusi | 6 | 6 | 0 |
| Dashboard | 3 | 3 | 0 |

## Tabel basis data hasil implementasi

| No | Tabel | Deskripsi | Jumlah Data |
|---|---|---|---|
| 1 | `users` | Menyimpan data akun seluruh pengguna sistem (administrator, guru, dan siswa) | 18 |
| 2 | `kelas` | Menyimpan data rombongan belajar (kelas) yang ada di sekolah | 3 |
| 3 | `guru` | Menyimpan data detail profil guru yang berelasi dengan tabel users | 4 |
| 4 | `siswa` | Menyimpan data detail profil siswa beserta kelasnya | 13 |
| 5 | `mata_pelajaran` | Menyimpan data mata pelajaran beserta guru pengampunya | 5 |
| 6 | `materi` | Menyimpan data materi pembelajaran yang diunggah oleh guru | 8 |
| 7 | `tugas` | Menyimpan data tugas dan kuis beserta tipe dan batas waktunya | 6 |
| 8 | `soal` | Menyimpan butir soal pilihan ganda maupun esai pada sebuah kuis | 13 |
| 9 | `pengumpulan_tugas` | Menyimpan data pengumpulan jawaban tugas oleh siswa | 35 |
| 10 | `jawaban_siswa` | Menyimpan jawaban siswa pada setiap butir soal kuis | 95 |
| 11 | `nilai` | Menyimpan data nilai siswa hasil penilaian guru maupun koreksi otomatis | 28 |
| 12 | `forum_diskusi` | Menyimpan data topik dan balasan pada forum diskusi | 14 |

## Memulihkan data pengujian

Untuk mengembalikan basis data ke kondisi persis seperti pada BAB IV tanpa
menjalankan ulang seluruh skrip:

```bash
mysql -u root < docs-bab4/database/elearning_smakk_bab4.sql
```

atau lewat phpMyAdmin: menu **Import** → pilih `elearning_smakk_bab4.sql` → **Go**.

## Cara membangkitkan ulang

Jalankan berurutan dari folder `elearning/`:

```bash
# 1. Siapkan basis data & data contoh
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
```

Kebutuhan tambahan untuk langkah 3 dan 5: `pip install playwright python-docx pillow`
dan `python -m playwright install chromium`.
