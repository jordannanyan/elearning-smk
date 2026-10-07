# =====================================================================
# Penyegaran docs-bab4/README.md
# ---------------------------------------------------------------------
# Daftar tangkapan layar, ringkasan hasil pengujian Black Box, dan
# jumlah baris tiap tabel basis data ditulis ulang dari berkas hasil
# yang baru saja dibangkitkan, sehingga angka pada README tidak pernah
# tertinggal dari isi folder docs-bab4.
#
# Jalankan: python scripts/segarkan-readme.py
# =====================================================================
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "docs-bab4", "data")
README = os.path.join(ROOT, "docs-bab4", "README.md")
MYSQL = r"C:\xampp\mysql\bin\mysql.exe"
DB = "elearning_smakk"
SATUKAN = chr(10)

TABEL = ["users", "periode", "kelas", "guru", "siswa", "siswa_kelas", "mata_pelajaran",
         "kelas_mapel", "pertemuan", "materi", "tugas", "soal", "pengumpulan_tugas",
         "jawaban_siswa", "nilai", "forum_diskusi",
         "jam_pelajaran", "jadwal", "presensi", "presensi_siswa"]


def muat(nama):
    with open(os.path.join(DATA, nama), encoding="utf8") as f:
        return json.load(f)


def jumlah_baris():
    q = " UNION ALL ".join(f"SELECT '{t}', COUNT(*) FROM `{t}`" for t in TABEL)
    p = subprocess.run([MYSQL, "-u", "root", "-N", "-B", "-D", DB, "-e", q],
                       capture_output=True)
    return dict(l.split("\t") for l in p.stdout.decode().strip().splitlines())


def ganti_bagian(teks, judul, isi_baru):
    """Mengganti isi sebuah bagian (dari judul ## sampai judul ## berikutnya)."""
    pola = re.compile(rf"(^## {re.escape(judul)}\n)(.*?)(?=^## )", re.S | re.M)
    if not pola.search(teks):
        raise SystemExit(f"Bagian '{judul}' tidak ditemukan pada README")
    return pola.sub(lambda m: m.group(1) + isi_baru, teks)


def main():
    gambar = muat("daftar-gambar.json")
    uji = muat("hasil-pengujian.json")

    # ---- Daftar tangkapan layar ----
    baris = ["", "| No | Berkas | Judul Gambar |", "|---|---|---|"]
    baris += [f"| {g['no']} | `{g['berkas']}` | {g['judul']} |" for g in gambar]
    daftar_gambar = "\n".join(baris) + "\n\n"

    # ---- Ringkasan pengujian Black Box ----
    modul = {}
    for k in uji["kasus"]:
        m = modul.setdefault(k["modul"], {"total": 0, "valid": 0})
        m["total"] += 1
        if k["status"] == "Valid":
            m["valid"] += 1
    baris = ["",
             f"Total **{uji['total']} skenario**, **{uji['valid']} Valid**, "
             f"**{uji['tidak_valid']} Tidak Valid**",
             f"(**{uji['persentase']:.2f}%** keberhasilan).",
             "",
             "| Modul | Skenario | Valid | Tidak Valid |",
             "|---|---|---|---|"]
    baris += [f"| {nama} | {d['total']} | {d['valid']} | {d['total'] - d['valid']} |"
              for nama, d in modul.items()]
    ringkasan = "\n".join(baris) + "\n\n"

    # ---- Tabel basis data beserta jumlah datanya ----
    teks = open(README, encoding="utf8").read()
    n = jumlah_baris()
    struktur = muat("struktur-basisdata.json")
    baris = ["", "| No | Tabel | Deskripsi | Jumlah Data |", "|---|---|---|---|"]
    for i, t in enumerate(struktur, start=1):
        baris.append(f"| {i} | `{t['tabel']}` | {t['deskripsi']} | "
                     f"{n.get(t['tabel'], t.get('jumlah_record', 0))} |")
    tabel_basisdata = SATUKAN.join(baris) + SATUKAN * 2

    teks = ganti_bagian(teks, "Daftar tangkapan layar", daftar_gambar)
    teks = ganti_bagian(teks, "Ringkasan hasil pengujian Black Box", ringkasan)
    teks = ganti_bagian(teks, "Tabel basis data hasil implementasi", tabel_basisdata)
    teks = teks.replace(f"| `screenshots/` | 44 tangkapan layar",
                        f"| `screenshots/` | {len(gambar)} tangkapan layar")
    teks = re.sub(r"\| `screenshots/` \| \d+ tangkapan layar",
                  f"| `screenshots/` | {len(gambar)} tangkapan layar", teks)
    teks = re.sub(r"Hasil \d+ skenario pengujian Black Box",
                  f"Hasil {uji['total']} skenario pengujian Black Box", teks)

    with open(README, "w", encoding="utf8", newline="\n") as f:
        f.write(teks)
    print(f"[OK] docs-bab4/README.md disegarkan "
          f"({len(gambar)} gambar, {uji['total']} skenario, {len(struktur)} tabel)")


if __name__ == "__main__":
    main()
