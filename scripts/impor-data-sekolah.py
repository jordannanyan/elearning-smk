# =====================================================================
# Importir data nyata SMA Negeri 1 Karau Kuala
# ---------------------------------------------------------------------
# Membaca berkas resmi sekolah lalu menghasilkan satu berkas JSON yang
# dipakai oleh `npm run db:seed`:
#
#   1. LAMP I SK PBM  TA 2526 SMTR II.xlsx
#      -> daftar guru, mata pelajaran, dan pembagian tugas mengajar
#         (guru mengajar mata pelajaran apa pada kelas mana)
#   2. SK Pembagian Tugas Mengajar dan Tambahan 2025.pdf (Lampiran IV)
#      -> pembagian tugas wali kelas (dibaca manual dari hasil pindaian,
#         disalin ke dalam konstanta WALI_KELAS di bawah)
#   3. Absensi - SMA NEGERI 1 KARAU KUALA 2025 - 2026 EDIT.xlsx
#      -> daftar siswa per kelas beserta NISN dan NIS
#
# Jalankan : python scripts/impor-data-sekolah.py
# Keluaran : backend/src/db/data/sekolah.json
# =====================================================================
import json
import os
import re
import unicodedata

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUMBER = os.path.dirname(ROOT)  # folder "Skripsi Kumala"
KELUARAN = os.path.join(ROOT, "backend", "src", "db", "data", "sekolah.json")

BERKAS_TUGAS = os.path.join(SUMBER, "LAMP I SK PBM  TA 2526 SMTR II.xlsx")
BERKAS_ABSEN = os.path.join(
    SUMBER, "Absensi  - SMA NEGERI 1 KARAU KUALA 2025 - 2026 EDIT.xlsx")

KELAS = ['X A', 'X B', 'X C', 'XI A', 'XI B', 'XI C', 'XI D', 'XII A', 'XII B', 'XII C']

# Lampiran IV SK Nomor 421.3/186/14/SMAN 1 KK/VII/2025 tanggal 9 Juli 2025
# tentang Pembagian Tugas Wali Kelas. Berkas aslinya berupa hasil pindaian
# sehingga datanya disalin manual ke sini.
WALI_KELAS = {
    'X A':   'HALIFAH',
    'X B':   'ASNIN WARIANTO',
    'X C':   'NURLAILA',
    'XI A':  'AKHMAD RIKO',
    'XI B':  'MARTANIAH',
    'XI C':  'NESVI LIANTI',
    'XI D':  'DEWI SARTIKA',
    'XII A': 'LAILY MUSTIKA',
    'XII B': 'JANATIN',
    'XII C': 'WIDAYANI',
}

# Pengelompokan mata pelajaran mengikuti Kurikulum Merdeka
KELOMPOK = {
    'PAI dan Budi Pekerti': 'Wajib', 'PEND. AGAMA KRISTEN': 'Wajib',
    'Pend. PANCASILA': 'Wajib', 'BAHASA INDONESIA': 'Wajib',
    'MATEMATIKA UMUM': 'Wajib', 'BAHASA INGGRIS': 'Wajib', 'SEJARAH': 'Wajib',
    'SENI BUDAYA': 'Wajib', 'PJOK': 'Wajib', 'PKWU': 'Wajib',
    'INFORMATIKA': 'Wajib', 'FISIKA': 'Wajib', 'KIMIA': 'Wajib',
    'BIOLOGI': 'Wajib', 'EKONOMI': 'Wajib', 'SOSIOLOGI': 'Wajib',
    'GEOGRAFI': 'Wajib',
    'MATEMATIKA TK LANJUT': 'Peminatan', 'BAHASA INGGRIS TK LANJT': 'Peminatan',
    'FISIKA PEMINATAN': 'Peminatan', 'KIMIA PEMINATAN': 'Peminatan',
    'BIOLOGI PEMINATAN': 'Peminatan', 'INFORMATIKA PEMINATAN': 'Peminatan',
    'EKONOMI PEMINATAN': 'Peminatan', 'SOSIOLOGI PEMINATAN': 'Peminatan',
    'SEJARAH PEMINATAN': 'Peminatan',
    'MULOK': 'Muatan Lokal',
}

KODE = {
    'PAI dan Budi Pekerti': 'PAIBP', 'PEND. AGAMA KRISTEN': 'PAK',
    'Pend. PANCASILA': 'PPKN', 'BAHASA INDONESIA': 'BIND',
    'MATEMATIKA UMUM': 'MTK-U', 'BAHASA INGGRIS': 'BING', 'SEJARAH': 'SEJ',
    'SENI BUDAYA': 'SENBUD', 'PJOK': 'PJOK', 'PKWU': 'PKWU',
    'INFORMATIKA': 'INFO', 'FISIKA': 'FIS', 'KIMIA': 'KIM', 'BIOLOGI': 'BIO',
    'EKONOMI': 'EKO', 'SOSIOLOGI': 'SOS', 'GEOGRAFI': 'GEO',
    'MATEMATIKA TK LANJUT': 'MTK-L', 'BAHASA INGGRIS TK LANJT': 'BING-L',
    'FISIKA PEMINATAN': 'FIS-P', 'KIMIA PEMINATAN': 'KIM-P',
    'BIOLOGI PEMINATAN': 'BIO-P', 'INFORMATIKA PEMINATAN': 'INFO-P',
    'EKONOMI PEMINATAN': 'EKO-P', 'SOSIOLOGI PEMINATAN': 'SOS-P',
    'SEJARAH PEMINATAN': 'SEJ-P', 'MULOK': 'MULOK',
}


def rapikan(teks):
    return re.sub(r'\s+', ' ', str(teks).strip())


def judul_kasus(nama):
    """MARTANIAH, S.Pd -> Martaniah, S.Pd (gelar dibiarkan apa adanya)."""
    bagian = nama.split(',')
    inti = ' '.join(w.capitalize() for w in bagian[0].split())
    gelar = ','.join(bagian[1:]).strip()
    return f"{inti}, {gelar}" if gelar else inti


def slug_email(nama, dipakai):
    """Membentuk alamat surel dari nama depan, dijaga agar tidak kembar."""
    inti = nama.split(',')[0]
    inti = unicodedata.normalize('NFKD', inti).encode('ascii', 'ignore').decode()
    kata = [w for w in re.sub(r'[^A-Za-z ]', '', inti).split() if w]
    dasar = kata[0].lower() if kata else 'pengguna'
    calon, n = dasar, 1
    while calon in dipakai:
        n += 1
        calon = f"{dasar}{n}" if n > 1 and len(kata) < 2 else f"{dasar}.{kata[1].lower()}"
        if calon in dipakai:
            calon = f"{dasar}{n}"
    dipakai.add(calon)
    return calon


def baca_guru():
    wb = openpyxl.load_workbook(BERKAS_TUGAS, data_only=True)
    ws = wb['lamp 1 sk pbm smtr 1 202526']
    guru, cur = [], None
    for r in range(11, 68):
        no = ws.cell(r, 4).value
        nama = ws.cell(r, 5).value
        jab = ws.cell(r, 6).value
        mapel = ws.cell(r, 7).value
        nama = rapikan(nama) if nama else None

        if isinstance(no, (int, float)) and nama:
            cur = {"no": int(no), "nama": nama, "jabatan": rapikan(jab) if jab else "",
                   "nip": "", "tugas_tambahan": "", "ajar": []}
            guru.append(cur)
        elif nama and cur and re.fullmatch(r'[\d ]+', nama):
            cur["nip"] = nama
            if jab:
                cur["tugas_tambahan"] = rapikan(jab)
        elif jab and cur and not cur["tugas_tambahan"]:
            cur["tugas_tambahan"] = rapikan(jab)

        if mapel and cur:
            m = rapikan(mapel)
            for i, k in enumerate(KELAS):
                v = ws.cell(r, 8 + i).value
                if isinstance(v, (int, float)) and v > 0:
                    cur["ajar"].append({"mapel": m, "kelas": k, "jam": int(v)})
    return guru


def baca_siswa():
    wb = openpyxl.load_workbook(BERKAS_ABSEN, data_only=True)
    hasil = {}
    for ws in wb.worksheets:
        daftar = []
        for r in range(10, ws.max_row + 1):
            no = ws.cell(r, 1).value
            ident = ws.cell(r, 2).value
            nama = ws.cell(r, 3).value
            jk = ws.cell(r, 4).value
            if not isinstance(no, (int, float)) or not nama:
                continue
            nama = rapikan(nama)
            if not nama or nama.upper() == 'NAMA SISWA':
                continue
            nisn, nis = '', ''
            if ident:
                bagian = str(ident).split('/')
                nisn = bagian[0].strip()
                nis = bagian[1].strip() if len(bagian) > 1 else ''
            daftar.append({"nama": nama, "nisn": nisn, "nis": nis,
                           "jk": (str(jk).strip().upper() if jk else '')})
        hasil[rapikan(ws.title)] = daftar
    return hasil


def main():
    guru_mentah = baca_siswa  # penanda agar urutan pemanggilan jelas
    guru_mentah = baca_guru()
    siswa_kelas = baca_siswa()

    dipakai = {'admin'}
    guru = []
    for g in guru_mentah:
        nama = judul_kasus(g["nama"])
        email = f"{slug_email(g['nama'], dipakai)}@smakk.sch.id"
        guru.append({
            "nama": nama, "nip": g["nip"], "email": email,
            "jabatan": g["jabatan"], "tugas_tambahan": g["tugas_tambahan"],
            "ajar": g["ajar"],
        })

    # Pencocokan wali kelas berdasarkan kata kunci nama pada Lampiran IV
    wali = {}
    for kelas, kunci in WALI_KELAS.items():
        cocok = [g for g in guru if kunci.lower().split()[0] in g["nama"].lower()]
        if len(cocok) > 1:
            cocok = [g for g in cocok
                     if all(k.lower() in g["nama"].lower() for k in kunci.split())]
        wali[kelas] = cocok[0]["email"] if cocok else None
        if not cocok:
            print(f"  [!] wali kelas {kelas} ({kunci}) tidak ditemukan pada daftar guru")

    mapel_dipakai = sorted({a["mapel"] for g in guru for a in g["ajar"]})
    mapel = [{"nama": m, "kode": KODE.get(m, m[:8].upper()),
              "kelompok": KELOMPOK.get(m, 'Wajib')} for m in mapel_dipakai]

    dipakai_siswa = set()
    siswa = {}
    for kelas, daftar in siswa_kelas.items():
        siswa[kelas] = [{
            "nama": judul_kasus(s["nama"]), "nisn": s["nisn"], "nis": s["nis"],
            "jk": s["jk"],
            "email": f"{slug_email(s['nama'], dipakai_siswa)}@siswa.smakk.sch.id",
        } for s in daftar]

    data = {
        "sekolah": {
            "nama": "SMA Negeri 1 Karau Kuala",
            "npsn": "30200792", "nss": "302140209006",
            "alamat": "Jalan Barito Raya No. 077 RT.24 RW 08 Kelurahan Bangkuang",
            "kabupaten": "Barito Selatan", "provinsi": "Kalimantan Tengah",
            "kepala_sekolah": "Yunita Pebrianti, S.Pd",
        },
        "sumber": {
            "pembagian_tugas": "SK Nomor 421.3/001/14/SMAN 1 KK/I/2026 tanggal 5 Januari 2026",
            "wali_kelas": "SK Nomor 421.3/186/14/SMAN 1 KK/VII/2025 tanggal 9 Juli 2025 (Lampiran IV)",
            "daftar_siswa": "Daftar Hadir Siswa Tahun Pelajaran 2025/2026",
        },
        "kelas": [{"nama": k, "tingkat": k.split()[0], "wali": wali.get(k)} for k in KELAS],
        "mata_pelajaran": mapel,
        "guru": guru,
        "siswa": siswa,
    }

    os.makedirs(os.path.dirname(KELUARAN), exist_ok=True)
    with open(KELUARAN, "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print(f"[OK] {KELUARAN}")
    print(f"     {len(guru)} guru · {len(mapel)} mata pelajaran · {len(KELAS)} kelas")
    print(f"     {sum(len(v) for v in siswa.values())} siswa · "
          f"{sum(len(g['ajar']) for g in guru)} penugasan mengajar")
    print(f"     wali kelas tercatat: {sum(1 for v in wali.values() if v)}/{len(KELAS)}")


if __name__ == "__main__":
    main()
