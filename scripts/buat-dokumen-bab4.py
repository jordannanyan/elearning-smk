# =====================================================================
# Penyusunan dokumen pendukung BAB IV (Hasil dan Pembahasan)
# Sistem E-Learning SMA Negeri 1 Karau Kuala
# ---------------------------------------------------------------------
# Menggabungkan seluruh tangkapan layar, struktur basis data, statistik
# sistem, dan hasil pengujian Black Box ke dalam satu berkas Microsoft Word
# yang siap disalin ke dalam laporan skripsi.
#
# Prasyarat : scripts/blackbox.js, scripts/screenshots.py, dan
#             scripts/data-bab4.js sudah dijalankan.
# Jalankan  : python scripts/buat-dokumen-bab4.py
# Keluaran  : docs-bab4/Lampiran-BAB-IV-Sistem-E-Learning.docx
# =====================================================================
import json
import os
from datetime import datetime

from docx import Document
from docx.enum.section import WD_ORIENT, WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs-bab4")
SHOTS = os.path.join(DOCS, "screenshots")
DATA = os.path.join(DOCS, "data")
KELUARAN = os.path.join(DOCS, "Lampiran-BAB-IV-Sistem-E-Learning.docx")

LEBAR_MAKS = 6.0   # inci, menyesuaikan margin kertas A4
TINGGI_MAKS = 7.6  # inci


def muat(nama):
    with open(os.path.join(DATA, nama), encoding="utf8") as f:
        return json.load(f)


def atur_font(dok):
    normal = dok.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(12)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    normal.paragraph_format.line_spacing = 1.5
    normal.paragraph_format.space_after = Pt(0)


def judul(dok, teks, level=1):
    p = dok.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(teks)
    r.bold = True
    r.font.size = Pt(14 if level == 1 else 12)
    r.font.name = "Times New Roman"
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p


def paragraf(dok, teks, rata=WD_ALIGN_PARAGRAPH.JUSTIFY, indent=True):
    p = dok.add_paragraph(teks)
    p.alignment = rata
    p.paragraph_format.space_after = Pt(6)
    if indent:
        p.paragraph_format.first_line_indent = Inches(0.5)
    return p


def keterangan(dok, teks, ukuran=11):
    p = dok.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.line_spacing = 1.0
    r = p.add_run(teks)
    r.font.size = Pt(ukuran)
    r.font.name = "Times New Roman"
    return p


def label_tabel(dok, teks):
    p = dok.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.0
    r = p.add_run(teks)
    r.font.size = Pt(11)
    r.font.name = "Times New Roman"
    return p


def buat_tabel(dok, header, baris, lebar=None, ukuran=9):
    t = dok.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(header):
        sel = t.rows[0].cells[i]
        sel.text = ""
        p = sel.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(str(h))
        r.bold = True
        r.font.size = Pt(ukuran)
        r.font.name = "Times New Roman"
    for data in baris:
        sel_baris = t.add_row().cells
        for i, nilai in enumerate(data):
            sel = sel_baris[i]
            sel.text = ""
            p = sel.paragraphs[0]
            p.paragraph_format.line_spacing = 1.0
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run("" if nilai is None else str(nilai))
            r.font.size = Pt(ukuran)
            r.font.name = "Times New Roman"
    if lebar:
        for i, w in enumerate(lebar):
            for row in t.rows:
                row.cells[i].width = Inches(w)
    return t


def sisip_gambar(dok, berkas):
    jalur = os.path.join(SHOTS, berkas)
    with Image.open(jalur) as im:
        w, h = im.size
    lebar = LEBAR_MAKS
    if (h / w) * lebar > TINGGI_MAKS:
        lebar = TINGGI_MAKS * (w / h)
    p = dok.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)
    p.add_run().add_picture(jalur, width=Inches(lebar))


def bagian_lanskap(dok):
    """Menambahkan bagian baru berorientasi lanskap untuk tabel yang lebar."""
    sec = dok.add_section(WD_SECTION.NEW_PAGE)
    sec.orientation = WD_ORIENT.LANDSCAPE
    sec.page_width, sec.page_height = Inches(11.69), Inches(8.27)
    sec.left_margin = Inches(0.79)
    sec.right_margin = Inches(0.79)
    sec.top_margin = Inches(0.79)
    sec.bottom_margin = Inches(0.79)
    return sec


def main():
    gambar = muat("daftar-gambar.json")
    struktur = muat("struktur-basisdata.json")
    statistik = muat("statistik-sistem.json")
    uji = muat("hasil-pengujian.json")

    dok = Document()
    for s in dok.sections:
        s.page_width, s.page_height = Inches(8.27), Inches(11.69)  # A4
        s.left_margin = Inches(1.18)
        s.right_margin = Inches(0.98)
        s.top_margin = Inches(1.18)
        s.bottom_margin = Inches(0.98)
    atur_font(dok)

    # ---------------- Halaman judul ----------------
    p = dok.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("LAMPIRAN DATA DAN DOKUMENTASI\nBAB IV HASIL DAN PEMBAHASAN")
    r.bold = True
    r.font.size = Pt(16)
    r.font.name = "Times New Roman"
    p = dok.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Rancang Bangun Sistem E-Learning Berbasis Web\n"
                  "di SMA Negeri 1 Karau Kuala")
    r.font.size = Pt(13)
    r.font.name = "Times New Roman"
    keterangan(dok, f"Dokumen dibangkitkan otomatis dari sistem yang berjalan pada "
                    f"{datetime.now().strftime('%d %B %Y')}", 10)

    # ---------------- 1. Lingkungan implementasi ----------------
    judul(dok, "1.  Spesifikasi Lingkungan Implementasi")
    paragraf(dok,
             "Implementasi sistem e-learning berbasis web di SMA Negeri 1 Karau Kuala "
             "dilakukan menggunakan perangkat keras dan perangkat lunak dengan spesifikasi "
             "sebagaimana disajikan pada tabel berikut.")
    label_tabel(dok, "Tabel 1  Spesifikasi Perangkat Keras dan Perangkat Lunak")
    buat_tabel(dok,
               ["No", "Komponen", "Spesifikasi / Versi"],
               [
                   [1, "Sistem Operasi", "Microsoft Windows 11"],
                   [2, "Web Server / Runtime", "Node.js versi 18 atau lebih baru"],
                   [3, "Basis Data", "MySQL / MariaDB (paket XAMPP)"],
                   [4, "Bahasa Pemrograman Backend", "JavaScript (Node.js) dengan framework Express.js"],
                   [5, "Bahasa Pemrograman Frontend", "TypeScript dengan library React 18"],
                   [6, "Build Tool Frontend", "Vite"],
                   [7, "Autentikasi", "JSON Web Token (JWT) dan enkripsi bcrypt"],
                   [8, "Pengunggahan Berkas", "Multer"],
                   [9, "Editor Kode", "Visual Studio Code"],
                   [10, "Peramban Pengujian", "Google Chrome / Chromium"],
                   [11, "Alamat Server Backend", "http://localhost:4000"],
                   [12, "Alamat Aplikasi Frontend", "http://localhost:5173"],
               ],
               lebar=[0.5, 2.3, 3.2], ukuran=10)

    dok.add_page_break()

    # ---------------- 2. Implementasi basis data ----------------
    judul(dok, "2.  Implementasi Basis Data")
    paragraf(dok,
             "Basis data sistem e-learning diimplementasikan menggunakan MySQL dengan nama "
             "basis data elearning_smakk. Struktur basis data disusun mengacu pada Class "
             "Diagram yang telah dirancang pada tahap perancangan sistem. Secara keseluruhan "
             f"basis data sistem terdiri atas {len(struktur)} tabel sebagaimana disajikan pada "
             "tabel berikut.")
    label_tabel(dok, "Tabel 2  Daftar Tabel pada Basis Data Sistem E-Learning")
    buat_tabel(dok,
               ["No", "Nama Tabel", "Deskripsi", "Jumlah Data"],
               [[i + 1, t["tabel"], t["deskripsi"], t["jumlah_record"]]
                for i, t in enumerate(struktur)],
               lebar=[0.4, 1.5, 3.4, 0.7], ukuran=9)
    paragraf(dok,
             "Rincian struktur setiap tabel beserta tipe data, kunci, dan keterangan "
             "masing-masing kolom disajikan pada tabel-tabel berikut ini.")

    nomor_tabel = 2
    for t in struktur:
        nomor_tabel += 1
        label_tabel(dok, f"Tabel {nomor_tabel}  Struktur Tabel {t['tabel']}")
        buat_tabel(dok,
                   ["No", "Nama Kolom", "Tipe Data", "Null", "Kunci", "Keterangan"],
                   [[i + 1, k["nama"], k["tipe"], k["null"], k["kunci"], k["keterangan"]]
                    for i, k in enumerate(t["kolom"])],
                   lebar=[0.35, 1.15, 1.15, 0.45, 0.85, 2.05], ukuran=8)

    dok.add_page_break()

    # ---------------- 3. Implementasi antarmuka ----------------
    judul(dok, "3.  Implementasi Antarmuka Sistem")
    paragraf(dok,
             "Implementasi antarmuka sistem e-learning berbasis web di SMA Negeri 1 Karau "
             "Kuala terdiri atas antarmuka untuk tiga level pengguna, yaitu administrator, "
             "guru, dan siswa. Seluruh tangkapan layar berikut diambil langsung dari sistem "
             "yang telah berjalan dengan data pembelajaran yang sesungguhnya.")

    for g in gambar:
        sisip_gambar(dok, g["berkas"])
        keterangan(dok, f"Gambar {g['no']}  {g['judul']}")
        paragraf(dok, g["keterangan"])

    bagian_lanskap(dok)

    # ---------------- 4. Pengujian black box ----------------
    judul(dok, "4.  Pengujian Sistem dengan Metode Black Box Testing")
    paragraf(dok,
             "Pengujian sistem dilakukan menggunakan metode Black Box Testing, yaitu pengujian "
             "yang berfokus pada fungsionalitas sistem tanpa memperhatikan struktur internal "
             "kode program. Pengujian dilakukan dengan memberikan sejumlah skenario masukan "
             "kepada sistem, kemudian memeriksa apakah keluaran yang dihasilkan telah sesuai "
             "dengan yang diharapkan. Skenario pengujian mencakup seluruh fitur sistem, meliputi "
             "proses autentikasi dan hak akses, pengelolaan periode pembelajaran beserta "
             "penguncian periode, pengelolaan data pengguna, kelas, katalog mata pelajaran, dan "
             "pengampuan kelas, penyusunan pertemuan beserta materinya, pembuatan tugas dan kuis, "
             "pengerjaan tugas dan kuis oleh siswa, penilaian, rekapitulasi nilai per mata "
             "pelajaran, forum diskusi, serta dashboard masing-masing pengguna.")
    paragraf(dok,
             f"Pengujian dilaksanakan terhadap {uji['total']} skenario yang mencakup pengujian "
             "kasus normal (data valid) maupun kasus tidak normal (data tidak valid dan "
             "percobaan pelanggaran hak akses). Hasil pengujian selengkapnya disajikan pada "
             "tabel berikut.")

    nomor_tabel += 1
    label_tabel(dok, f"Tabel {nomor_tabel}  Hasil Pengujian Black Box Testing")
    buat_tabel(dok,
               ["No", "Modul", "Skenario Pengujian", "Data Masukan",
                "Hasil yang Diharapkan", "Hasil Pengujian", "Ket."],
               [[k["id"], k["modul"], k["skenario"], k["input"], k["harapan"],
                 k["aktual"], k["status"]] for k in uji["kasus"]],
               lebar=[0.5, 1.05, 2.25, 1.7, 2.15, 1.9, 0.55], ukuran=8)

    paragraf(dok,
             f"Berdasarkan hasil pengujian pada tabel di atas, dari {uji['total']} skenario "
             f"pengujian yang dilakukan, sebanyak {uji['valid']} skenario memperoleh hasil "
             f"Valid dan {uji['tidak_valid']} skenario memperoleh hasil Tidak Valid, sehingga "
             f"persentase keberhasilan pengujian adalah sebesar {uji['persentase']:.2f}%. "
             "Hal ini menunjukkan bahwa seluruh fungsi yang terdapat pada sistem e-learning "
             "berbasis web yang dibangun telah berjalan sesuai dengan kebutuhan fungsional yang "
             "ditetapkan pada tahap analisis kebutuhan.")

    # Rekapitulasi jumlah pengujian per modul
    modul = {}
    for k in uji["kasus"]:
        m = modul.setdefault(k["modul"], {"total": 0, "valid": 0})
        m["total"] += 1
        if k["status"] == "Valid":
            m["valid"] += 1
    nomor_tabel += 1
    label_tabel(dok, f"Tabel {nomor_tabel}  Rekapitulasi Hasil Pengujian per Modul")
    buat_tabel(dok,
               ["No", "Modul yang Diuji", "Jumlah Skenario", "Valid", "Tidak Valid", "Persentase"],
               [[i + 1, nama, d["total"], d["valid"], d["total"] - d["valid"],
                 f"{d['valid'] / d['total'] * 100:.0f}%"]
                for i, (nama, d) in enumerate(modul.items())]
               + [["", "Total", uji["total"], uji["valid"], uji["tidak_valid"],
                   f"{uji['persentase']:.2f}%"]],
               lebar=[0.5, 3.0, 1.6, 1.1, 1.4, 1.4], ukuran=10)

    dok.add_page_break()
    # ---------------- 5. Data hasil penggunaan sistem ----------------
    judul(dok, "5.  Data Hasil Penggunaan Sistem")
    paragraf(dok,
             "Selain pengujian fungsional, sistem juga diuji coba dengan data pembelajaran "
             "yang menyerupai kondisi nyata di sekolah. Data tersebut meliputi data pengguna, "
             "mata pelajaran, materi, tugas dan kuis, pengumpulan tugas oleh siswa, serta "
             "penilaian oleh guru. Rekapitulasi hasil pengerjaan tugas dan kuis oleh siswa "
             "disajikan pada tabel berikut.")

    nomor_tabel += 1
    label_tabel(dok, f"Tabel {nomor_tabel}  Periode Pembelajaran pada Sistem")
    buat_tabel(dok,
               ["No", "Kode", "Tahun Ajaran", "Semester", "Mulai", "Selesai",
                "Kelas", "Status", "Dikunci Oleh"],
               [[i + 1, r["kode"], r["tahun_ajaran"],
                 "Ganjil" if r["semester"] == 1 else "Genap",
                 r["tgl_mulai"] or "-", r["tgl_selesai"] or "-", r["jumlah_kelas"],
                 r["status"].capitalize(),
                 f'{r["dikunci_oleh"]} ({r["tgl_dikunci"]})' if r["dikunci_oleh"] else "-"]
                for i, r in enumerate(statistik["periode"])],
               lebar=[0.45, 0.9, 1.3, 1.0, 1.2, 1.2, 0.7, 1.0, 2.35], ukuran=9)

    paragraf(dok,
             "Periode 2025/2 pada tabel di atas telah dikunci oleh administrator sehingga seluruh "
             "data pembelajaran pada periode tersebut bersifat hanya-baca. Guru tidak dapat lagi "
             "mengubah materi, tugas, maupun nilai, dan siswa tidak dapat mengumpulkan tugas, "
             "namun seluruh data tetap dapat dilihat sebagai arsip riwayat belajar.")

    nomor_tabel += 1
    label_tabel(dok, f"Tabel {nomor_tabel}  Rekapitulasi Pengerjaan Tugas dan Kuis")
    buat_tabel(dok,
               ["No", "Periode", "Mata Pelajaran", "Kelas", "Pert.", "Tugas / Kuis", "Tipe",
                "Terkumpul", "Dinilai", "Rata-rata", "Terendah", "Tertinggi"],
               [[i + 1, r["periode"], r["mapel"], r["kelas"], r["pertemuan"], r["tugas"], r["tipe"],
                 r["jumlah_kumpul"], r["sudah_dinilai"],
                 r["rata_rata"] if r["rata_rata"] is not None else "-",
                 r["nilai_terendah"] if r["nilai_terendah"] is not None else "-",
                 r["nilai_tertinggi"] if r["nilai_tertinggi"] is not None else "-"]
                for i, r in enumerate(statistik["ringkasan_tugas"])],
               lebar=[0.4, 0.75, 1.5, 0.9, 0.5, 2.0, 0.6, 0.85, 0.7, 0.85, 0.85, 0.85], ukuran=8)

    paragraf(dok,
             "Rincian nilai yang diperoleh setiap siswa pada masing-masing tugas dan kuis "
             "disajikan pada tabel berikut. Nilai pada kuis pilihan ganda dihasilkan secara "
             "otomatis oleh sistem melalui proses koreksi jawaban, sedangkan nilai pada tugas "
             "dan soal esai diberikan oleh guru melalui menu penilaian.")

    nomor_tabel += 1
    label_tabel(dok, f"Tabel {nomor_tabel}  Rincian Nilai Siswa")
    buat_tabel(dok,
               ["No", "Periode", "Nama Siswa", "Kelas", "Mata Pelajaran", "Pert.",
                "Tugas / Kuis", "Tipe", "Nilai", "Keterangan"],
               [[i + 1, r["periode"], r["siswa"], r["kelas"], r["mapel"], r["pertemuan"],
                 r["tugas"], r["tipe"],
                 r["skor"] if r["skor"] is not None else "Belum dinilai",
                 "Terlambat" if r["terlambat"] else "Tepat waktu"]
                for i, r in enumerate(statistik["rekap_nilai"])],
               lebar=[0.4, 0.75, 1.5, 0.85, 1.4, 0.5, 1.85, 0.6, 0.85, 1.0], ukuran=8)

    dok.save(KELUARAN)
    print(f"[OK] Dokumen tersimpan: {KELUARAN}")
    print(f"     {len(gambar)} gambar, {len(struktur)} tabel struktur, "
          f"{uji['total']} skenario pengujian, {len(statistik['rekap_nilai'])} baris nilai")


if __name__ == "__main__":
    main()
