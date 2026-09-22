# Bahan BAB IV — Hasil dan Pembahasan

Seluruh isi folder ini dibangkitkan otomatis dari sistem e-learning yang benar-benar
berjalan (backend + frontend + MySQL), bukan mock-up. Data pengumpulan tugas, jawaban
kuis, dan nilai dibuat melalui REST API sistem sehingga hasilnya konsisten dengan
logika aplikasi yang sesungguhnya.

## Isi folder

| Berkas | Keterangan |
|---|---|
| `Lampiran-BAB-IV-Sistem-E-Learning.docx` | **Dokumen utama.** Berisi seluruh gambar, tabel struktur basis data, tabel hasil pengujian Black Box, dan rekap nilai — siap disalin ke laporan skripsi. |
| `screenshots/` | 41 tangkapan layar beresolusi tinggi (2880 px, siap cetak). |
| `database/elearning_smakk_bab4.sql` | Dump SQL struktur + seluruh data BAB IV, siap diimpor lewat phpMyAdmin. |
| `database/query-bab4.sql` | 16 query SQL yang dipakai menghasilkan tabel-tabel data pada BAB IV. |
| `data/daftar-gambar.json` | Daftar gambar beserta judul dan kalimat penjelasnya. |
| `data/hasil-pengujian.json` | Hasil 95 skenario pengujian Black Box. |
| `data/struktur-basisdata.json` | Struktur 16 tabel basis data hasil implementasi. |
| `data/statistik-sistem.json` | Statistik data sistem dan rekapitulasi nilai siswa. |

## Periode pembelajaran pada data uji

| Kode | Tahun Ajaran | Semester | Status | Dikunci oleh |
|---|---|---|---|---|
| `2026/1` | 2025/2026 | Ganjil | **aktif** | - |
| `2025/2` | 2024/2025 | Genap | **terkunci** | Administrator |

Periode `2025/2` sengaja dibiarkan dalam keadaan terkunci agar dapat memperlihatkan
mekanisme penguncian periode: seluruh datanya tetap dapat dilihat sebagai arsip, namun
guru tidak dapat mengubah materi/tugas/nilai dan siswa tidak dapat mengumpulkan tugas.

## Daftar tangkapan layar

| No | Berkas | Judul Gambar |
|---|---|---|
| 1 | `01-halaman-login.png` | Halaman Login |
| 2 | `02-login-gagal.png` | Pesan Kesalahan Login |
| 3 | `03-admin-dashboard.png` | Halaman Dashboard Administrator |
| 4 | `04-admin-periode.png` | Halaman Periode Pembelajaran |
| 5 | `05-admin-form-periode.png` | Form Tambah Periode Pembelajaran |
| 6 | `06-admin-data-guru.png` | Halaman Data Guru |
| 7 | `07-admin-form-guru.png` | Form Tambah Data Guru |
| 8 | `08-admin-data-siswa.png` | Halaman Data Siswa |
| 9 | `09-admin-form-siswa.png` | Form Tambah Data Siswa |
| 10 | `10-admin-data-kelas.png` | Halaman Data Kelas |
| 11 | `11-admin-anggota-kelas.png` | Pengelolaan Anggota Kelas |
| 12 | `12-admin-data-mapel.png` | Halaman Katalog Mata Pelajaran |
| 13 | `13-admin-form-mapel.png` | Form Tambah Mata Pelajaran |
| 14 | `14-admin-pengampuan.png` | Halaman Pengampuan Kelas |
| 15 | `15-admin-form-pengampuan.png` | Form Tambah Pengampuan Kelas |
| 16 | `16-guru-dashboard.png` | Halaman Dashboard Guru |
| 17 | `17-guru-kelas-saya.png` | Halaman Kelas Saya (Guru) |
| 18 | `18-guru-daftar-pertemuan.png` | Daftar Pertemuan pada Kelas Mata Pelajaran |
| 19 | `19-guru-form-pertemuan.png` | Form Tambah Pertemuan |
| 20 | `20-guru-isi-pertemuan.png` | Halaman Kelola Isi Pertemuan (Guru) |
| 21 | `21-guru-form-materi.png` | Form Tambah Materi Pembelajaran |
| 22 | `22-guru-form-tugas.png` | Form Buat Tugas dan Kuis |
| 23 | `23-guru-kelola-soal.png` | Halaman Kelola Butir Soal Kuis |
| 24 | `24-guru-penilaian.png` | Halaman Penilaian (Guru) |
| 25 | `25-guru-daftar-pengumpulan.png` | Daftar Pengumpulan Tugas Siswa |
| 26 | `26-guru-form-nilai.png` | Form Penilaian Tugas oleh Guru |
| 27 | `27-guru-pengumpulan-kuis.png` | Daftar Pengumpulan Kuis Siswa |
| 28 | `28-guru-penilaian-esai.png` | Halaman Pemeriksaan dan Penilaian Jawaban Kuis |
| 29 | `29-siswa-dashboard.png` | Halaman Dashboard Siswa |
| 30 | `30-siswa-kelas-saya.png` | Halaman Kelas Saya (Siswa) |
| 31 | `31-siswa-daftar-pertemuan.png` | Daftar Pertemuan Mata Pelajaran (Siswa) |
| 32 | `32-siswa-isi-pertemuan.png` | Halaman Isi Pertemuan (Siswa) |
| 33 | `33-siswa-tugas.png` | Halaman Tugas dan Kuis (Siswa) |
| 34 | `34-siswa-hasil-kuis.png` | Halaman Hasil Pengerjaan Kuis Siswa |
| 35 | `35-siswa-nilai.png` | Halaman Rekap Nilai Siswa |
| 36 | `36-siswa-nilai-arsip.png` | Riwayat Nilai pada Periode Sebelumnya |
| 37 | `37-siswa-kerjakan-kuis.png` | Halaman Pengerjaan Kuis oleh Siswa |
| 38 | `38-siswa-kerjakan-tugas.png` | Halaman Pengerjaan dan Pengumpulan Tugas |
| 39 | `39-periode-terkunci-guru.png` | Tampilan Periode yang Telah Dikunci |
| 40 | `40-periode-terkunci-pertemuan.png` | Isi Pertemuan pada Periode Terkunci |
| 41 | `41-tampilan-mobile.png` | Tampilan Sistem pada Perangkat Mobile |

## Ringkasan hasil pengujian Black Box

Total **95 skenario**, **95 Valid**, **0 Tidak Valid**
(**100.00%** keberhasilan).

| Modul | Skenario | Valid | Tidak Valid |
|---|---|---|---|
| Autentikasi | 9 | 9 | 0 |
| Periode Pembelajaran | 8 | 8 | 0 |
| Penguncian Periode | 5 | 5 | 0 |
| Manajemen Pengguna | 11 | 11 | 0 |
| Manajemen Kelas | 3 | 3 | 0 |
| Mata Pelajaran | 5 | 5 | 0 |
| Pengampuan Kelas | 1 | 1 | 0 |
| Kelas Mata Pelajaran | 1 | 1 | 0 |
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

## Tabel basis data hasil implementasi

| No | Tabel | Deskripsi | Jumlah Data |
|---|---|---|---|
| 1 | `users` | Menyimpan data akun seluruh pengguna sistem (administrator, guru, dan siswa) | 23 |
| 2 | `periode` | Menyimpan periode pembelajaran (tahun ajaran dan semester) beserta status penguncian | 2 |
| 3 | `kelas` | Menyimpan data rombongan belajar pada sebuah periode pembelajaran | 7 |
| 4 | `guru` | Menyimpan data detail profil guru yang berelasi dengan tabel users | 6 |
| 5 | `siswa` | Menyimpan data detail profil siswa yang berelasi dengan tabel users | 16 |
| 6 | `siswa_kelas` | Menyimpan keanggotaan siswa pada sebuah kelas di setiap periode | 19 |
| 7 | `mata_pelajaran` | Menyimpan katalog mata pelajaran sekolah | 27 |
| 8 | `kelas_mapel` | Menyimpan pengampuan, yaitu mata pelajaran pada sebuah kelas beserta guru pengampunya | 17 |
| 9 | `pertemuan` | Menyimpan urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran | 15 |
| 10 | `materi` | Menyimpan materi pembelajaran (teks, berkas, video, atau tautan) pada sebuah pertemuan | 21 |
| 11 | `tugas` | Menyimpan data tugas dan kuis beserta tipe dan batas waktunya | 11 |
| 12 | `soal` | Menyimpan butir soal pilihan ganda maupun esai pada sebuah kuis | 13 |
| 13 | `pengumpulan_tugas` | Menyimpan data pengumpulan jawaban tugas oleh siswa | 32 |
| 14 | `jawaban_siswa` | Menyimpan jawaban siswa pada setiap butir soal kuis | 62 |
| 15 | `nilai` | Menyimpan data nilai siswa hasil penilaian guru maupun koreksi otomatis | 26 |
| 16 | `forum_diskusi` | Menyimpan topik dan balasan forum diskusi pada sebuah pertemuan | 8 |

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

Urutan langkah 1 → 2 → 3 wajib diikuti: skrip screenshot membutuhkan data pengumpulan
dan nilai yang dibuat oleh `blackbox.js`.

Kebutuhan tambahan untuk langkah 3 dan 5: `pip install playwright python-docx pillow`
dan `python -m playwright install chromium`.

## Memulihkan data pengujian

Untuk mengembalikan basis data ke kondisi persis seperti pada BAB IV tanpa
menjalankan ulang seluruh skrip:

```bash
mysql -u root < docs-bab4/database/elearning_smakk_bab4.sql
```

atau lewat phpMyAdmin: menu **Import** → pilih `elearning_smakk_bab4.sql` → **Go**.
