# Sistem E-Learning SMA Negeri 1 Karau Kuala

Aplikasi e-learning berbasis web sesuai proposal skripsi (metode **Waterfall**).
Terdiri dari **backend** (Node.js + Express + MySQL) dan **frontend** (React TypeScript + Vite).

## Konsep Utama

Pembelajaran pada sistem ini disusun berjenjang mengikuti alur nyata di sekolah:

```
Periode Pembelajaran (2026/1)
  └── Kelas (X MIPA 1)
        └── Pengampuan / Kelas Mata Pelajaran (Matematika Wajib — Budi Santoso, S.Pd)
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
- **Satu mata pelajaran dapat diampu guru berbeda** pada kelas/tingkat yang berbeda,
  karena penugasan guru berada pada tabel pengampuan (`kelas_mapel`), bukan pada
  katalog mata pelajaran.
- **Pengguna tidak dihapus permanen**, melainkan dinonaktifkan, agar relasi materi,
  tugas, dan nilai tetap utuh.

## Fitur

| Role | Fitur |
|------|-------|
| **Administrator** | Login, kelola periode pembelajaran (aktifkan/kunci/buka kunci), kelola data guru & siswa (aktif/nonaktif), kelola kelas beserta anggotanya, katalog mata pelajaran, pengampuan kelas, pantau statistik sistem |
| **Guru** | Login, kelola kelas mata pelajaran yang diampu, susun pertemuan, unggah materi (teks/berkas/video/tautan YouTube), buat tugas & kuis beserta butir soal, periksa pengumpulan (termasuk siswa yang belum mengumpulkan), beri nilai, buka forum diskusi |
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

## Akun Demo (setelah `db:seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smakk.sch.id | admin123 |
| Guru | budi@smakk.sch.id (juga siti, rahmat, dina, hendra, lestari) | guru123 |
| Siswa | ahmad@siswa.smakk.sch.id (dan 14 siswa lainnya) | siswa123 |

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
| `scripts/blackbox.js` | Menjalankan 95 skenario pengujian Black Box terhadap REST API sekaligus mengisi data pengumpulan tugas & nilai |
| `scripts/screenshots.py` | Mengambil 41 tangkapan layar seluruh halaman sistem secara otomatis (Playwright) |
| `scripts/data-bab4.js` | Mengambil struktur tabel basis data dan statistik data dari MySQL |
| `scripts/buat-dokumen-bab4.py` | Menyusun `docs-bab4/Lampiran-BAB-IV-Sistem-E-Learning.docx` |

Petunjuk lengkap: lihat `docs-bab4/README.md`.

## Teknologi
- Backend: Express, mysql2, JWT (autentikasi), bcryptjs (hash password), multer (unggah berkas)
- Frontend: React 18, TypeScript, React Router, Axios
