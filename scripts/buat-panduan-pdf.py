# =====================================================================
# Penyusunan panduan penggunaan sistem dalam bentuk PDF
# Sistem E-Learning SMA Negeri 1 Karau Kuala
# ---------------------------------------------------------------------
# Membangun dua berkas panduan, satu untuk guru dan satu untuk siswa,
# lengkap dengan kulit muka, daftar isi, penanda PDF, serta tangkapan
# layar setiap langkah. Tangkapan layar yang terlalu jenjang dipecah
# menjadi beberapa bagian agar tulisannya tetap terbaca.
#
# Isi panduan berada pada scripts/panduan_isi.py, sedangkan penataan
# halamannya pada scripts/panduan_lib.py.
#
# Prasyarat : scripts/screenshots.py sudah dijalankan, sehingga
#             docs-bab4/screenshots dan docs-bab4/data/daftar-gambar.json
#             sudah mutakhir.
# Jalankan  : python scripts/buat-panduan-pdf.py
# Keluaran  : frontend/public/panduan-penggunaan-guru.pdf
#             frontend/public/panduan-penggunaan-siswa.pdf
#
# Kedua berkas keluaran ditautkan dari halaman depan (frontend/src/pages/
# Landing.tsx). Setelah panduan dibangun ulang, perbarui pula jumlah
# halaman dan ukuran berkas yang tertulis pada halaman tersebut.
# =====================================================================
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from reportlab.lib.units import cm                               # noqa: E402
from reportlab.platypus import (Image, NextPageTemplate,         # noqa: E402
                                PageBreak, Paragraph, Spacer,
                                Table, TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents   # noqa: E402

import panduan_lib as L                                          # noqa: E402
from panduan_isi import ALAMAT, PANDUAN                          # noqa: E402

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR_TANGKAPAN = os.path.join(AKAR, 'docs-bab4', 'screenshots')
DIR_DATA = os.path.join(AKAR, 'docs-bab4', 'data')
DIR_KELUAR = os.path.join(AKAR, 'frontend', 'public')
DIR_SINGGAH = os.path.join(AKAR, 'docs-bab4', '.singgah-panduan')
LOGO = os.path.join(AKAR, 'frontend', 'src', 'assets', 'logo-sekolah.jpg')

BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
         'Agustus', 'September', 'Oktober', 'November', 'Desember']


def tanggal_indonesia():
    import datetime
    h = datetime.date.today()
    return f'{h.day} {BULAN[h.month - 1]} {h.year}'


def di_tengah(flowable, bantalan_sisi=0):
    """Memusatkan sebuah flowable pada lebar panji.

    hAlign tidak berpengaruh pada flowable yang diletakkan di dalam sel
    tabel, sehingga pemusatan dikerjakan dengan tabel pembungkus selebar
    sel itu sendiri.
    """
    t = Table([[flowable]], colWidths=[L.LEBAR_SEL_PANJI])
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), bantalan_sisi),
        ('RIGHTPADDING', (0, 0), (-1, -1), bantalan_sisi),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def kulit(g, meta):
    """Halaman muka: panji biru dengan lambang sekolah dan judul.

    Seluruh isi panji dikurung dalam satu sel setinggi tetap, sepadan
    dengan tinggi panji yang digambar pada kanvas. Tanpa itu, panjang
    ringkasan yang berbeda antarpanduan akan menggeser isi berikutnya
    sehingga teks gelap dapat jatuh di atas latar biru dan tidak terbaca.
    """
    logo = Image(LOGO, width=2.5 * cm, height=2.5 * cm)
    ringkas = Paragraph(meta['ringkas'], g['kulit_ringkas'])

    isi_panji = [
        Spacer(1, 52),
        di_tengah(logo),
        Spacer(1, 20),
        Paragraph('SMA NEGERI 1 KARAU KUALA', g['kulit_sub']),
        Spacer(1, 12),
        Paragraph(meta['judul'], g['kulit_judul']),
        Spacer(1, 16),
        Paragraph(f"UNTUK {meta['peran']}", g['kulit_peran']),
        Spacer(1, 26),
        di_tengah(ringkas, bantalan_sisi=52),
    ]
    panji = Table([[isi_panji]], colWidths=[L.A4[0]],
                  rowHeights=[L.TINGGI_PANJI])
    panji.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), L.LEKUK_PANJI),
        ('RIGHTPADDING', (0, 0), (-1, -1), L.LEKUK_PANJI),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    aliran = [panji, Spacer(1, 52)]

    rinci = Table([
        ['Berlaku untuk', f'Sistem E-Learning — {ALAMAT}'],
        ['Tanggal dokumen', tanggal_indonesia()],
    ], colWidths=[3.9 * cm, 8.6 * cm])
    rinci.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), 'SegoeUI-Bold', 9.6),
        ('FONT', (1, 0), (1, -1), 'SegoeUI', 9.6),
        ('TEXTCOLOR', (0, 0), (0, -1), L.BIRU_TUA),
        ('TEXTCOLOR', (1, 0), (1, -1), L.TEKS),
        ('LINEBELOW', (0, 0), (-1, -2), 0.4, L.GARIS),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    rinci.hAlign = 'CENTER'
    aliran += [rinci, Spacer(1, 26)]

    kaki = L.ParagraphStyle('kaki_kulit', parent=g['kulit_kaki'],
                            fontSize=9.4, textColor=L.ABU)
    aliran.append(Paragraph(
        'Diterbitkan oleh SMA Negeri 1 Karau Kuala<br/>'
        'Kabupaten Barito Selatan, Kalimantan Tengah', kaki))
    return aliran


def daftar_isi(g):
    toc = TableOfContents()
    toc.levelStyles = [g['toc1'], g['toc2']]
    toc.dotsMinLevel = 0
    return [Paragraph('Daftar Isi', g['isi_judul']), Spacer(1, 4), toc]


def bangun(kunci):
    meta = PANDUAN[kunci]
    g = L.gaya()
    with open(os.path.join(DIR_DATA, 'daftar-gambar.json'),
              encoding='utf-8') as f:
        daftar_gambar = json.load(f)

    penyiap = L.PenyiapGambar(DIR_TANGKAPAN, DIR_SINGGAH)
    perakit = L.Perakit(penyiap, g, daftar_gambar)

    os.makedirs(DIR_KELUAR, exist_ok=True)
    jalur = os.path.join(DIR_KELUAR, meta['berkas'])
    doc = L.Dokumen(jalur, meta['judul_kepala'],
                    title=f"{meta['judul']} — Untuk "
                          f"{meta['peran'].capitalize()}",
                    author='SMA Negeri 1 Karau Kuala',
                    subject=meta['ringkas'])

    aliran = kulit(g, meta)
    aliran += [NextPageTemplate('isi'), PageBreak()]
    aliran += daftar_isi(g)
    aliran.append(PageBreak())
    aliran += perakit.rakit(meta['bab'])

    doc.multiBuild(aliran)
    return jalur, perakit.nomor


if __name__ == '__main__':
    L.daftarkan_font()
    print('Menyusun panduan penggunaan...')
    for kunci in ('guru', 'siswa'):
        jalur, jml = bangun(kunci)
        ukuran = os.path.getsize(jalur) / 1024 / 1024
        print(f'  {os.path.basename(jalur):36s} {ukuran:5.2f} MB  '
              f'{jml} gambar')
    print(f'Keluaran berada pada {DIR_KELUAR}')
