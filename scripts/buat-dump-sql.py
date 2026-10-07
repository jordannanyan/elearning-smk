# =====================================================================
# Pembuatan dump SQL basis data untuk lampiran BAB IV
# ---------------------------------------------------------------------
# Menghasilkan satu berkas SQL berisi struktur tabel beserta seluruh
# data yang dipakai pada BAB IV, tersusun menurut urutan logis tabel dan
# diberi komentar pada setiap bagian agar mudah dibaca di dalam laporan.
#
# Jalankan : python scripts/buat-dump-sql.py
# Keluaran : docs-bab4/database/elearning_smakk_bab4.sql
# =====================================================================
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XAMPP = r"C:\xampp\mysql\bin"
MYSQLDUMP = os.path.join(XAMPP, "mysqldump.exe")
MYSQL = os.path.join(XAMPP, "mysql.exe")
DB = "elearning_smakk"
KELUARAN = os.path.join(ROOT, "docs-bab4", "database", "elearning_smakk_bab4.sql")

# Urutan tabel disusun mengikuti alur data, bukan abjad, agar berkas
# ini juga berfungsi sebagai penjelasan struktur basis data.
TABEL = [
    ("users",             "Akun seluruh pengguna sistem (administrator, guru, dan siswa)"),
    ("periode",           "Periode pembelajaran (tahun ajaran + semester) beserta status penguncian"),
    ("guru",              "Profil guru, berelasi satu-satu dengan tabel users"),
    ("siswa",             "Profil siswa, berelasi satu-satu dengan tabel users"),
    ("kelas",             "Rombongan belajar pada sebuah periode beserta wali kelasnya"),
    ("siswa_kelas",       "Keanggotaan siswa pada sebuah kelas di setiap periode"),
    ("mata_pelajaran",    "Katalog mata pelajaran sekolah"),
    ("kelas_mapel",       "Mata pelajaran pada sebuah kelas beserta guru pengajarnya"),
    ("pertemuan",         "Urutan pertemuan pembelajaran pada sebuah kelas mata pelajaran"),
    ("materi",            "Materi pembelajaran (teks, berkas, video, tautan) pada sebuah pertemuan"),
    ("tugas",             "Tugas dan kuis beserta tipe dan batas waktunya"),
    ("soal",              "Butir soal pilihan ganda dan esai pada kuis"),
    ("pengumpulan_tugas", "Pengumpulan jawaban tugas/kuis oleh siswa"),
    ("jawaban_siswa",     "Jawaban siswa pada setiap butir soal kuis"),
    ("nilai",             "Nilai hasil penilaian guru maupun koreksi otomatis sistem"),
    ("forum_diskusi",     "Topik dan balasan forum diskusi pada sebuah pertemuan"),
    ("jam_pelajaran",     "Pembagian waktu jam pelajaran sekolah beserta jam istirahatnya"),
    ("jadwal",            "Jadwal mata pelajaran tiap kelas pada sebuah periode pembelajaran"),
    ("presensi",          "Daftar hadir sebuah pertemuan beserta status dibuka/ditutupnya"),
    ("presensi_siswa",    "Kehadiran tiap siswa pada sebuah presensi"),
]

GARIS = "-- " + "=" * 75


def dump(tabel):
    p = subprocess.run(
        [MYSQLDUMP, "-u", "root", "--default-character-set=utf8mb4", "--compact",
         "--add-drop-table", "--complete-insert", "--skip-extended-insert",
         "--skip-set-charset", DB, tabel],
        capture_output=True)
    if p.returncode != 0:
        raise SystemExit(f"mysqldump gagal pada tabel {tabel}:\n"
                         + p.stderr.decode("utf8", "replace"))
    baris = [l for l in p.stdout.decode("utf8").splitlines()
             if not l.startswith("/*!40101 SET") and l.strip()]
    return "\n".join(baris)


def jumlah(tabel):
    p = subprocess.run([MYSQL, "-u", "root", "-N", "-B", "-D", DB,
                        "-e", f"SELECT COUNT(*) FROM `{tabel}`"], capture_output=True)
    return int(p.stdout.decode().strip())


def main():
    bagian = [f"""{GARIS}
-- BASIS DATA SISTEM E-LEARNING SMA NEGERI 1 KARAU KUALA
-- Rancang Bangun Sistem E-Learning Berbasis Web di SMA Negeri 1 Karau Kuala
{GARIS}
--
-- Berkas ini berisi struktur tabel beserta seluruh data yang digunakan pada
-- BAB IV Hasil dan Pembahasan, yaitu data yang tampil pada seluruh tangkapan
-- layar sistem dan data hasil pengujian Black Box Testing (95 skenario).
--
-- Data guru, mata pelajaran, pembagian tugas mengajar, wali kelas, kelas,
-- siswa, dan jadwal mata pelajaran merupakan data nyata SMA Negeri 1 Karau
-- Kuala Tahun Ajaran 2025/2026.
--
-- Basis data memuat dua periode pembelajaran:
--   2026/2 (Tahun Ajaran 2025/2026 Genap)  berstatus AKTIF
--   2026/1 (Tahun Ajaran 2025/2026 Ganjil) berstatus TERKUNCI sebagai arsip
--
-- DBMS            : MySQL / MariaDB
-- Nama basis data : {DB}
-- Karakter set    : utf8mb4 / utf8mb4_unicode_ci
-- Jumlah tabel    : {len(TABEL)}
--
-- Cara import melalui phpMyAdmin:
--   1. Buka phpMyAdmin, pilih menu Import.
--   2. Pilih berkas elearning_smakk_bab4.sql, lalu klik Go / Kirim.
--
-- Cara import melalui terminal:
--   mysql -u root < elearning_smakk_bab4.sql
--
-- Kata sandi seluruh akun disimpan dalam bentuk terenkripsi (bcrypt).
-- Kata sandi bawaan: administrator "admin123", guru "guru123",
-- dan siswa "siswa123". Alamat surel tiap pengguna dapat dilihat pada
-- tabel users setelah berkas ini diimpor.
--
{GARIS}

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

{GARIS}
-- Pembuatan basis data
{GARIS}

DROP DATABASE IF EXISTS `{DB}`;
CREATE DATABASE `{DB}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `{DB}`;
"""]

    total = 0
    for i, (t, ket) in enumerate(TABEL, start=1):
        n = jumlah(t)
        total += n
        bagian.append(f"""
{GARIS}
-- {i}. Tabel `{t}`
--    {ket}
--    Jumlah data: {n} baris
{GARIS}

{dump(t)}
""")

    bagian.append(f"""
{GARIS}
-- Selesai. Total {total} baris data pada {len(TABEL)} tabel.
{GARIS}

SET FOREIGN_KEY_CHECKS = 1;
""")

    os.makedirs(os.path.dirname(KELUARAN), exist_ok=True)
    with open(KELUARAN, "w", encoding="utf8", newline="\n") as f:
        f.write("\n".join(bagian))
    print(f"[OK] {os.path.relpath(KELUARAN, ROOT)}  ({total} baris data, {len(TABEL)} tabel)")


if __name__ == "__main__":
    main()
