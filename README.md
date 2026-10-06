# Sistem E-Learning SMA Negeri 1 Karau Kuala

Aplikasi e-learning berbasis web sesuai proposal skripsi (metode **Waterfall**).
Terdiri dari **backend** (Node.js + Express + MySQL) dan **frontend** (React TypeScript + Vite).

## Konsep Utama

Pembelajaran pada sistem ini disusun berjenjang mengikuti alur nyata di sekolah:

```
Periode Pembelajaran (2026/2)
  └── Kelas (X A)
        └── Mata Pelajaran di kelas itu + guru pengajarnya
            (Matematika Umum — Halifah, S.P)
              └── Pertemuan 1, 2, 3, ...
                    ├── Materi   (uraian teks / berkas / video / tautan YouTube)
                    ├── Tugas & Kuis
                    └── Forum Diskusi
```

- **Periode pembelajaran** menggabungkan tahun ajaran dan semester dengan kode seperti
  `2026/1`. Hanya boleh ada satu periode aktif. Apabila periode telah selesai,
  administrator dapat **menguncinya** sehingga seluruh datanya menjadi hanya-baca
  (arsip) namun tetap dapat dilihat sebagai riwayat belajar. Penguncian ditegakkan di
  sisi server, bukan sekadar menyembunyikan tombol pada antarmuka.
- **Satu mata pelajaran dapat diajar guru berbeda** pada kelas/tingkat yang berbeda.
  Penugasan guru dilakukan di dalam **Data Kelas**: pada setiap kelas ditentukan mata
  pelajaran apa saja yang diajarkan dan siapa guru pengajarnya.
- **Wali kelas mengacu ke data guru**, bukan teks bebas. Penetapannya dilakukan pada
  menu Data Kelas dan otomatis tampil pada kolom Wali Kelas di menu Data Guru.
- **Pengguna tidak dihapus permanen**, melainkan dinonaktifkan, agar relasi materi,
  tugas, dan nilai tetap utuh.

## Fitur

| Role | Fitur |
|------|-------|
| **Administrator** | Login, kelola periode pembelajaran (aktifkan/kunci/buka kunci), kelola data guru & siswa (aktif/nonaktif), kelola kelas beserta mata pelajaran, guru pengajar, dan siswa anggotanya, kelola katalog mata pelajaran, pantau statistik sistem |
| **Guru** | Login, kelola mata pelajaran dan kelas yang diajar, susun pertemuan, unggah materi (teks/berkas/video/tautan YouTube), buat tugas & kuis beserta butir soal, periksa pengumpulan (termasuk siswa yang belum mengumpulkan), beri nilai, buka forum diskusi |
| **Siswa** | Login, lihat kartu mata pelajaran di kelasnya, ikuti pembelajaran per pertemuan, unduh berkas & tonton video, kerjakan tugas/kuis dengan penanda sisa waktu, lihat rekap nilai per mata pelajaran dan riwayat antar-periode, balas forum diskusi |

## Prasyarat
- **Node.js** v18+
- **MySQL** (disarankan lewat **XAMPP** — jalankan modul MySQL)

## Cara Menjalankan

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # sesuaikan koneksi MySQL bila perlu
npm run db:init           # membuat database & tabel
npm run db:seed           # mengisi akun & data contoh
npm start                 # server di http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # buka http://localhost:5173
```

## Data Sekolah

Basis data diisi dengan **data nyata SMA Negeri 1 Karau Kuala**, bukan data karangan:

| Data | Jumlah | Sumber |
|---|---|---|
| Guru | 28 | SK Nomor 421.3/001/14/SMAN 1 KK/I/2026 tanggal 5 Januari 2026 |
| Mata pelajaran | 27 | idem |
| Penugasan mengajar | 155 | idem |
| Kelas | 10 | idem |
| Wali kelas | 10 | SK Nomor 421.3/186/14/SMAN 1 KK/VII/2025 tanggal 9 Juli 2025 (Lampiran IV) |
| Siswa | 287 | Daftar Hadir Siswa Tahun Pelajaran 2025/2026 |

Berkas sumber dibaca oleh `python scripts/impor-data-sekolah.py` yang menghasilkan
`backend/src/db/data/sekolah.json`, lalu dimuat ke basis data oleh `npm run db:seed`.
Jalankan ulang importir tersebut apabila sekolah mengirim berkas yang diperbarui.

## Akun Demo (setelah `db:seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smakk.sch.id | admin123 |
| Guru | halifah@smakk.sch.id, asnin@smakk.sch.id, samjuhdi@smakk.sch.id, laily@smakk.sch.id, … (28 guru) | guru123 |
| Siswa | ahmad@siswa.smakk.sch.id, aminatul@siswa.smakk.sch.id, … (287 siswa) | siswa123 |

Alamat surel dibentuk otomatis dari nama masing-masing pengguna.

## Struktur Database
16 tabel: `users`, `periode`, `kelas`, `guru`, `siswa`, `siswa_kelas`, `mata_pelajaran`,
`kelas_mapel`, `pertemuan`, `materi`, `tugas`, `soal`, `pengumpulan_tugas`,
`jawaban_siswa`, `nilai`, `forum_diskusi`. Lihat `backend/src/db/schema.sql`.

## Bahan BAB IV (dokumentasi & pengujian)
Folder `docs-bab4/` berisi seluruh tangkapan layar, tabel struktur basis data,
hasil pengujian Black Box, dump SQL, dan dokumen Word siap pakai untuk BAB IV.
Skrip pembangkitnya ada di `scripts/`:

| Skrip | Kegunaan |
|---|---|
| `scripts/impor-data-sekolah.py` | Membaca berkas resmi sekolah (SK pembagian tugas, SK wali kelas, daftar hadir siswa) menjadi `sekolah.json` |
| `scripts/blackbox.js` | Menjalankan 95 skenario pengujian Black Box terhadap REST API sekaligus mengisi data pengumpulan tugas & nilai |
| `scripts/screenshots.py` | Mengambil 44 tangkapan layar seluruh halaman sistem secara otomatis (Playwright) |
| `scripts/data-bab4.js` | Mengambil struktur tabel basis data dan statistik data dari MySQL |
| `scripts/buat-dokumen-bab4.py` | Menyusun `docs-bab4/Lampiran-BAB-IV-Sistem-E-Learning.docx` |
| `scripts/buat-dump-sql.py` | Membuat dump SQL `docs-bab4/database/elearning_smakk_bab4.sql` |

Petunjuk lengkap: lihat `docs-bab4/README.md`.

## Teknologi
- Backend: Express, mysql2, JWT (autentikasi), bcryptjs (hash password), multer (unggah berkas)
- Frontend: React 18, TypeScript, React Router, Axios
