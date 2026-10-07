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
BERKAS_JADWAL = os.path.join(SUMBER, "JADWAL PEL  SEMTR 1I TA 2526.xlsx")

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



# ---------------------------------------------------------------------
# Jadwal mata pelajaran
# ---------------------------------------------------------------------
# Dibaca dari lembar "jadwal 45 menit" pada berkas jadwal sekolah, yaitu
# jadwal Semester II Tahun Ajaran 2025/2026 yang susunan kelasnya sama
# dengan data siswa. Lembar tersebut memuat lima blok hari yang masing
# masing berupa tabel JAM KE- (baris) terhadap kelas (kolom), dengan isi
# sel berupa kode gabungan huruf mata pelajaran dan nomor guru, misalnya
# "E16" berarti MATEMATIKA [U] yang diajar guru bernomor 16.
# ---------------------------------------------------------------------
LEMBAR_JADWAL = "jadwal 45 menit"

# (nama hari, kolom JAM KE-, baris awal, baris akhir, baris kepala kelas,
#  kolom kelas pertama, kolom kelas terakhir)
BLOK_HARI = [
    ("SENIN",  4,  9, 22,  8,  5, 16),
    ("SELASA", 20, 9, 22,  8, 21, 32),
    ("RABU",   36, 9, 22,  8, 37, 48),
    ("KAMIS",  4, 27, 40, 26,  5, 16),
    ("JUM'AT", 20, 27, 35, 26, 21, 32),
]

# Jam pelajaran hari biasa, disalin dari tabel WAKTU SEKOLAH pada lembar
# yang sama. Baris istirahat ikut disimpan agar tampilan di sistem sama
# persis dengan tabel pada SK.
JAM_UMUM = [
    ("pelajaran", 1, "07.00", "07.45"), ("pelajaran", 2, "07.45", "08.30"),
    ("pelajaran", 3, "08.30", "09.15"), ("pelajaran", 4, "09.15", "10.00"),
    ("istirahat", None, "10.00", "10.15"),
    ("pelajaran", 5, "10.15", "11.00"), ("pelajaran", 6, "11.00", "11.45"),
    ("istirahat", None, "11.45", "12.15"),
    ("pelajaran", 7, "12.15", "13.00"), ("pelajaran", 8, "13.00", "13.45"),
    ("istirahat", None, "13.45", "14.00"),
    ("pelajaran", 9, "14.00", "14.45"), ("pelajaran", 10, "14.45", "15.30"),
    ("pelajaran", 11, "15.30", "16.15"),
]

# Catatan *) pada lembar yang sama: khusus jadwal PBM hari Jumat
JAM_JUMAT = [
    ("pelajaran", 1, "06.30", "07.15"), ("pelajaran", 2, "07.15", "08.00"),
    ("pelajaran", 3, "08.00", "08.45"),
    ("istirahat", None, "08.45", "09.00"),
    ("pelajaran", 4, "09.00", "09.45"), ("pelajaran", 5, "09.45", "10.30"),
    ("jumatan", None, "10.30", "12.30"),
    ("pelajaran", 6, "12.30", "13.15"), ("pelajaran", 7, "13.15", "14.00"),
]


def peta_gabungan(ws):
    """Nilai sel gabungan (merge) hanya tersimpan pada sel kiri-atasnya.
    Fungsi ini menyalin nilai tersebut ke seluruh sel anggotanya supaya
    keterangan seperti UPACARA BENDERA terbaca pada semua kolom kelas."""
    peta = {}
    for rng in ws.merged_cells.ranges:
        nilai = ws.cell(rng.min_row, rng.min_col).value
        if nilai is None:
            continue
        for r in range(rng.min_row, rng.max_row + 1):
            for c in range(rng.min_col, rng.max_col + 1):
                peta[(r, c)] = nilai
    return peta


def nama_kelas_baku(teks):
    """XA -> X A, XIA -> XI A, XIIB -> XII B."""
    rapat = re.sub(r'\s+', '', str(teks)).upper()
    for k in KELAS:
        if re.sub(r'\s+', '', k) == rapat:
            return k
    return None


def baca_jadwal():
    wb = openpyxl.load_workbook(BERKAS_JADWAL, data_only=True)
    ws = wb[LEMBAR_JADWAL]
    gabung = peta_gabungan(ws)

    def sel(r, c):
        v = ws.cell(r, c).value
        return v if v is not None else gabung.get((r, c))

    # --- Legenda kode guru (nomor 1..28) ---
    kode_guru = []
    for r in range(45, 56):
        for c in (4, 10, 17):
            no, nama = ws.cell(r, c).value, ws.cell(r, c + 1).value
            if isinstance(no, (int, float)) and nama:
                kode_guru.append({"nomor": int(no), "nama": rapikan(nama)})
    kode_guru.sort(key=lambda x: x["nomor"])

    # --- Legenda kode mata pelajaran (huruf A..Z) ---
    kode_mapel = {}
    for r in range(26, 41):
        for c in (36, 42):
            kode, nama = ws.cell(r, c).value, ws.cell(r, c + 1).value
            if kode and nama and re.fullmatch(r'[A-Z]', str(kode).strip()):
                kode_mapel[str(kode).strip()] = rapikan(nama)

    # --- Isi tabel tiap hari ---
    slot, lewat = [], []
    for hari, kol_jam, r1, r2, r_kepala, c1, c2 in BLOK_HARI:
        kelas_kolom = {}
        for c in range(c1, c2 + 1):
            k = nama_kelas_baku(ws.cell(r_kepala, c).value or '')
            if k:
                kelas_kolom[c] = k

        for r in range(r1, r2 + 1):
            jam = ws.cell(r, kol_jam).value
            if not isinstance(jam, (int, float)):
                continue
            for c, kelas in kelas_kolom.items():
                isi = sel(r, c)
                if isi is None or str(isi).strip() in ('', '-'):
                    continue
                teks = rapikan(isi)
                baris = {"hari": hari, "jam_ke": int(jam), "kelas": kelas,
                         "kode": None, "mapel": None, "guru": None, "kegiatan": None}

                cocok = re.fullmatch(r'([A-Z])\s*(\d{1,2})', teks)
                if cocok:
                    huruf, nomor = cocok.group(1), int(cocok.group(2))
                    baris["kode"] = f"{huruf}{nomor}"
                    baris["mapel"] = kode_mapel.get(huruf)
                    baris["guru"] = nomor
                    if not baris["mapel"]:
                        lewat.append(f'{hari} jam {jam} {kelas}: huruf "{huruf}" tanpa keterangan')
                elif re.fullmatch(r'\d{1,2}', teks):
                    # Hanya nomor guru: jam Projek Penguatan Profil Pelajar
                    # Pancasila (P5) sebagaimana ditandai pada lembar jadwal.
                    baris["guru"] = int(teks)
                    baris["kegiatan"] = "P5"
                else:
                    baris["kegiatan"] = teks.upper()
                slot.append(baris)

    for p in lewat[:5]:
        print(f"  [!] {p}")

    return {
        "lembar": LEMBAR_JADWAL,
        "judul": rapikan(ws.cell(1, 2).value),
        "sekolah": rapikan(ws.cell(2, 2).value),
        "tahun_ajaran": rapikan(ws.cell(3, 20).value).replace("TAHUN AJARAN :", "").strip(),
        "kode_guru": kode_guru,
        "kode_mapel": [{"kode": k, "nama": v} for k, v in sorted(kode_mapel.items())],
        "jam": [{"jenis": j, "jam_ke": n, "mulai": m, "selesai": s} for j, n, m, s in JAM_UMUM],
        "jam_jumat": [{"jenis": j, "jam_ke": n, "mulai": m, "selesai": s}
                      for j, n, m, s in JAM_JUMAT],
        "slot": slot,
    }



# Nama guru pada lembar jadwal ditulis lebih singkat daripada pada SK
# pembagian tugas, sehingga sebagian perlu dipadankan secara eksplisit.
ALIAS_GURU_JADWAL = {
    "M. RAHMADANI": "Muhammad Rahmadani",
}


def kunci_nama(nama):
    inti = unicodedata.normalize('NFKD', nama.split(',')[0])
    inti = inti.encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z ]', ' ', inti.lower()).split()


def cocokkan_guru_jadwal(jadwal, guru):
    """Melengkapi tiap kode guru pada jadwal dengan surel guru yang
    bersangkutan, agar jadwal dapat ditautkan ke akun guru di sistem."""
    indeks = {" ".join(kunci_nama(g["nama"])): g for g in guru}
    tak_cocok = []
    for kg in jadwal["kode_guru"]:
        nama = ALIAS_GURU_JADWAL.get(kg["nama"].split(',')[0].strip(), kg["nama"])
        kata = kunci_nama(nama)
        cocok = indeks.get(" ".join(kata))
        if not cocok:
            kandidat = [g for k, g in indeks.items() if kata and kata[0] in k.split()]
            if len(kandidat) != 1:
                kandidat = [g for k, g in indeks.items()
                            if all(w in k.split() for w in kata)]
            cocok = kandidat[0] if len(kandidat) == 1 else None
        kg["email"] = cocok["email"] if cocok else None
        if not cocok:
            tak_cocok.append(f'{kg["nomor"]} {kg["nama"]}')
    for t in tak_cocok:
        print(f"  [!] kode guru jadwal tidak cocok dengan daftar guru: {t}")
    return sum(1 for kg in jadwal["kode_guru"] if kg["email"])


def main():
    guru_mentah = baca_siswa  # penanda agar urutan pemanggilan jelas
    guru_mentah = baca_guru()
    siswa_kelas = baca_siswa()
    jadwal = baca_jadwal()

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

    cocok_jadwal = cocokkan_guru_jadwal(jadwal, guru)

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
            "jadwal": "Jadwal Mata Pelajaran Semester II Tahun Ajaran 2025/2026 "
                      "SMA Negeri 1 Karau Kuala",
        },
        "kelas": [{"nama": k, "tingkat": k.split()[0], "wali": wali.get(k)} for k in KELAS],
        "mata_pelajaran": mapel,
        "guru": guru,
        "siswa": siswa,
        "jadwal": jadwal,
    }

    os.makedirs(os.path.dirname(KELUARAN), exist_ok=True)
    with open(KELUARAN, "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print(f"[OK] {KELUARAN}")
    print(f"     {len(guru)} guru · {len(mapel)} mata pelajaran · {len(KELAS)} kelas")
    print(f"     {sum(len(v) for v in siswa.values())} siswa · "
          f"{sum(len(g['ajar']) for g in guru)} penugasan mengajar")
    print(f"     wali kelas tercatat: {sum(1 for v in wali.values() if v)}/{len(KELAS)}")
    print(f"     jadwal: {len(jadwal['slot'])} jam pelajaran · "
          f"{len(jadwal['kode_guru'])} kode guru · {len(jadwal['kode_mapel'])} kode mapel")
    print(f"     kode guru jadwal tertaut ke akun: {cocok_jadwal}/{len(jadwal['kode_guru'])}")


if __name__ == "__main__":
    main()
