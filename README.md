# Sistem E-Learning SMA Negeri 1 Karau Kuala

Aplikasi e-learning berbasis web sesuai proposal skripsi (metode **RAD**).
Terdiri dari **backend** (Node.js + Express + MySQL) dan **frontend** (React TypeScript + Vite).

## Fitur

| Role | Fitur |
|------|-------|
| **Administrator** | Login, kelola data guru & siswa, kelola kelas, kelola mata pelajaran, pantau statistik sistem |
| **Guru** | Login, kelola materi (+ upload file), buat tugas & kuis, lihat pengumpulan, beri nilai, forum diskusi |
| **Siswa** | Login, lihat/unduh materi, kerjakan & kumpulkan tugas/kuis, lihat rekap nilai, forum diskusi |

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
| Guru | budi@smakk.sch.id | guru123 |
| Siswa | ahmad@siswa.smakk.sch.id | siswa123 |

## Struktur Database
Sesuai Class Diagram (Gambar 3.9): `users`, `kelas`, `guru`, `siswa`,
`mata_pelajaran`, `materi`, `tugas`, `pengumpulan_tugas`, `nilai`, `forum_diskusi`.
Lihat `backend/src/db/schema.sql`.

## Teknologi
- Backend: Express, mysql2, JWT (autentikasi), bcryptjs (hash password), multer (upload file)
- Frontend: React 18, TypeScript, React Router, Axios
