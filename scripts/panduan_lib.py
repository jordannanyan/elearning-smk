# -*- coding: utf-8 -*-
"""Pembangun PDF panduan penggunaan Sistem E-Learning SMA Negeri 1 Karau Kuala.

Isi panduan dinyatakan sebagai data (lihat panduan_isi.py); berkas ini hanya
mengurus penataan halaman: kulit muka, daftar isi, kepala dan kaki halaman,
serta pemuatan tangkapan layar.
"""
import math
import os

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.fonts import addMapping
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, Image, KeepTogether,
                                ListFlowable, ListItem, PageBreak,
                                PageTemplate, Paragraph, Spacer, Table,
                                TableStyle)

# --------------------------------------------------------------------------
# Warna mengikuti warna khas aplikasi agar panduan terasa satu kesatuan
# dengan sistemnya (lihat frontend/src/index.css).
# --------------------------------------------------------------------------
BIRU = colors.HexColor('#2563eb')
BIRU_TUA = colors.HexColor('#1e40af')
BIRU_MUDA = colors.HexColor('#e8f0fe')
KUNING = colors.HexColor('#f0a91b')
ABU = colors.HexColor('#64748b')
ABU_MUDA = colors.HexColor('#f1f5f9')
GARIS = colors.HexColor('#cbd5e1')
TEKS = colors.HexColor('#0f172a')

MARGIN = 2.0 * cm
LEBAR_ISI = A4[0] - 2 * MARGIN           # sekitar 515 titik
LEBAR_GAMBAR = LEBAR_ISI - 1.4 * cm      # gambar diberi lekuk agar ada bingkai
TINGGI_GAMBAR_MAKS = 560                 # titik; di atas ini gambar dipecah
NISBAH_MAKS = TINGGI_GAMBAR_MAKS / LEBAR_GAMBAR

# Panji biru pada halaman muka. Tingginya dipakai bersama oleh penggambar
# kanvas dan oleh penyusun isi kulit, agar keduanya tidak pernah berselisih.
TINGGI_PANJI = 13.4 * cm
TEBAL_GARIS_PANJI = 0.35 * cm
LEKUK_PANJI = 1.2 * cm
LEBAR_SEL_PANJI = A4[0] - 2 * LEKUK_PANJI


def daftarkan_font():
    """Memakai Segoe UI agar tampilannya setara dengan tampilan sistem."""
    d = os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts')
    pasangan = [('SegoeUI', 'segoeui.ttf'), ('SegoeUI-Bold', 'segoeuib.ttf'),
                ('SegoeUI-Italic', 'segoeuii.ttf'),
                ('SegoeUI-BoldItalic', 'segoeuiz.ttf')]
    for nama, berkas in pasangan:
        pdfmetrics.registerFont(TTFont(nama, os.path.join(d, berkas)))
    pdfmetrics.registerFontFamily('SegoeUI', normal='SegoeUI',
                                  bold='SegoeUI-Bold',
                                  italic='SegoeUI-Italic',
                                  boldItalic='SegoeUI-BoldItalic')
    for tebal, miring, nama in [(0, 0, 'SegoeUI'), (1, 0, 'SegoeUI-Bold'),
                                (0, 1, 'SegoeUI-Italic'),
                                (1, 1, 'SegoeUI-BoldItalic')]:
        addMapping('SegoeUI', tebal, miring, nama)


def gaya():
    g = {}
    g['badan'] = ParagraphStyle('badan', fontName='SegoeUI', fontSize=10.2,
                                leading=15.4, textColor=TEKS,
                                alignment=TA_JUSTIFY, spaceAfter=7)
    g['bab'] = ParagraphStyle('bab', fontName='SegoeUI-Bold', fontSize=17,
                              leading=22, textColor=BIRU_TUA, spaceBefore=4,
                              spaceAfter=3)
    g['sub'] = ParagraphStyle('sub', fontName='SegoeUI-Bold', fontSize=12.2,
                              leading=17, textColor=BIRU_TUA, spaceBefore=12,
                              spaceAfter=4)
    g['langkah'] = ParagraphStyle('langkah', fontName='SegoeUI', fontSize=10.2,
                                  leading=15.2, textColor=TEKS,
                                  alignment=TA_JUSTIFY, spaceAfter=4)
    g['keterangan'] = ParagraphStyle('keterangan', fontName='SegoeUI',
                                     fontSize=8.8, leading=12.4,
                                     textColor=ABU, alignment=TA_CENTER,
                                     spaceBefore=5, spaceAfter=2)
    g['catatan'] = ParagraphStyle('catatan', fontName='SegoeUI', fontSize=9.6,
                                  leading=14.2, textColor=TEKS,
                                  alignment=TA_JUSTIFY)
    g['kulit_judul'] = ParagraphStyle('kulit_judul', fontName='SegoeUI-Bold',
                                      fontSize=26, leading=32,
                                      textColor=colors.white,
                                      alignment=TA_CENTER)
    g['kulit_ringkas'] = ParagraphStyle('kulit_ringkas', fontName='SegoeUI',
                                        fontSize=10.8, leading=16.5,
                                        textColor=colors.HexColor('#dbe4fb'),
                                        alignment=TA_CENTER)
    g['kulit_sub'] = ParagraphStyle('kulit_sub', fontName='SegoeUI',
                                    fontSize=13.5, leading=20,
                                    textColor=colors.white,
                                    alignment=TA_CENTER)
    g['kulit_peran'] = ParagraphStyle('kulit_peran', fontName='SegoeUI-Bold',
                                      fontSize=19, leading=25,
                                      textColor=KUNING, alignment=TA_CENTER)
    g['kulit_kaki'] = ParagraphStyle('kulit_kaki', fontName='SegoeUI',
                                     fontSize=10.5, leading=16,
                                     textColor=TEKS, alignment=TA_CENTER)
    g['isi_judul'] = ParagraphStyle('isi_judul', fontName='SegoeUI-Bold',
                                    fontSize=15, leading=20,
                                    textColor=BIRU_TUA, spaceAfter=10)
    g['tabel'] = ParagraphStyle('tabel', fontName='SegoeUI', fontSize=9.3,
                                leading=13.2, textColor=TEKS)
    g['tabel_kepala'] = ParagraphStyle('tabel_kepala', fontName='SegoeUI-Bold',
                                       fontSize=9.3, leading=13.2,
                                       textColor=colors.white)
    g['toc1'] = ParagraphStyle('toc1', fontName='SegoeUI-Bold', fontSize=10.6,
                               leading=17, textColor=TEKS, spaceBefore=5)
    g['toc2'] = ParagraphStyle('toc2', fontName='SegoeUI', fontSize=10,
                               leading=15, textColor=ABU, leftIndent=18)
    return g


# --------------------------------------------------------------------------
# Tangkapan layar
# --------------------------------------------------------------------------
class PenyiapGambar:
    """Memperkecil tangkapan layar dan memecah yang terlalu jenjang.

    Tangkapan layar diambil pada kerapatan dua kali, sehingga lebarnya 2880
    piksel. Untuk dicetak pada A4 ukuran itu jauh berlebih, maka diperkecil
    lalu disimpan sebagai JPEG. Tangkapan halaman penuh yang sangat tinggi
    dipecah menjadi beberapa bagian bertumpuk supaya tulisannya tetap
    terbaca, bukan diperkecil sampai tidak terbaca.
    """

    def __init__(self, dir_sumber, dir_singgah, lebar_px=1240, mutu=84):
        self.dir_sumber = dir_sumber
        self.dir_singgah = dir_singgah
        self.lebar_px = lebar_px
        self.mutu = mutu
        os.makedirs(dir_singgah, exist_ok=True)

    def ambil(self, berkas):
        """Mengembalikan daftar (jalur, lebar_titik, tinggi_titik)."""
        sumber = os.path.join(self.dir_sumber, berkas)
        im = PILImage.open(sumber).convert('RGB')
        w, h = im.size
        nisbah = h / w

        # Tangkapan layar ponsel jauh lebih sempit: disesuaikan menurut
        # tinggi dan diletakkan di tengah, bukan dilebarkan sampai memenuhi.
        if w < 1500:
            tinggi_pt = 455.0
            lebar_pt = tinggi_pt / nisbah
            jalur = self._simpan(im, berkas, 0, int(lebar_pt / 72 * 190))
            return [(jalur, lebar_pt, tinggi_pt)]

        bagian = 1 if nisbah <= NISBAH_MAKS else math.ceil(nisbah / NISBAH_MAKS)
        if bagian == 1:
            jalur = self._simpan(im, berkas, 0, self.lebar_px)
            return [(jalur, LEBAR_GAMBAR, LEBAR_GAMBAR * nisbah)]

        # Pemecahan dengan tumpang dua persen supaya tidak ada baris yang
        # terpotong tepat di batas dan pembaca dapat menyambung antarbagian.
        tumpang = int(h * 0.02 / bagian)
        tinggi_potong = math.ceil((h + tumpang * (bagian - 1)) / bagian)
        hasil = []
        for i in range(bagian):
            atas = max(0, i * (tinggi_potong - tumpang))
            bawah = min(h, atas + tinggi_potong)
            if bawah - atas < 40:
                continue
            potong = im.crop((0, atas, w, bawah))
            jalur = self._simpan(potong, berkas, i + 1, self.lebar_px)
            n = (bawah - atas) / w
            hasil.append((jalur, LEBAR_GAMBAR, LEBAR_GAMBAR * n))
        return hasil

    def _simpan(self, im, berkas, indeks, lebar_px):
        nama = f"{os.path.splitext(berkas)[0]}-{indeks}.jpg"
        jalur = os.path.join(self.dir_singgah, nama)
        if not os.path.exists(jalur):
            w, h = im.size
            if w > lebar_px:
                im = im.resize((lebar_px, max(1, round(h * lebar_px / w))),
                               PILImage.LANCZOS)
            im.save(jalur, 'JPEG', quality=self.mutu, optimize=True,
                    subsampling=0)
        return jalur


# --------------------------------------------------------------------------
# Kerangka dokumen
# --------------------------------------------------------------------------
class Dokumen(BaseDocTemplate):
    """Dua tata halaman: 'kulit' untuk muka, 'isi' untuk sisanya.

    Nomor halaman sengaja dihitung mundur satu dari nomor halaman PDF,
    sehingga kulit muka tidak ikut bernomor dan halaman daftar isi menjadi
    halaman satu.
    """

    def __init__(self, jalur, judul_kepala, **kw):
        BaseDocTemplate.__init__(self, jalur, pagesize=A4,
                                 leftMargin=MARGIN, rightMargin=MARGIN,
                                 topMargin=MARGIN, bottomMargin=MARGIN, **kw)
        self.judul_kepala = judul_kepala
        self._urut = 0
        bingkai_penuh = Frame(0, 0, A4[0], A4[1], id='kulit',
                              leftPadding=0, rightPadding=0,
                              topPadding=0, bottomPadding=0)
        bingkai_isi = Frame(MARGIN, MARGIN + 16, LEBAR_ISI,
                            A4[1] - 2 * MARGIN - 34, id='isi',
                            leftPadding=0, rightPadding=0,
                            topPadding=0, bottomPadding=0)
        self.addPageTemplates([
            PageTemplate(id='kulit', frames=[bingkai_penuh], onPage=self._kulit),
            PageTemplate(id='isi', frames=[bingkai_isi], onPage=self._isi),
        ])

    def beforeDocument(self):
        """Menyetel ulang pencacah penanda pada setiap pass penyusunan.

        Daftar isi disusun dalam beberapa pass. Bila pencacah tidak disetel
        ulang, kunci penanda setiap bab berbeda pada tiap pass, sehingga
        reportlab menganggap daftar isi belum pernah tetap dan penyusunan
        gagal setelah sepuluh pass.
        """
        self._urut = 0

    def _kulit(self, canv, doc):
        canv.saveState()
        canv.setFillColor(BIRU_TUA)
        canv.rect(0, A4[1] - TINGGI_PANJI, A4[0], TINGGI_PANJI,
                  stroke=0, fill=1)
        canv.setFillColor(KUNING)
        canv.rect(0, A4[1] - TINGGI_PANJI - TEBAL_GARIS_PANJI, A4[0],
                  TEBAL_GARIS_PANJI, stroke=0, fill=1)
        canv.restoreState()

    def _isi(self, canv, doc):
        canv.saveState()
        canv.setFont('SegoeUI', 8.2)
        canv.setFillColor(ABU)
        canv.drawString(MARGIN, A4[1] - MARGIN + 10, self.judul_kepala)
        canv.drawRightString(A4[0] - MARGIN, A4[1] - MARGIN + 10,
                             'SMA Negeri 1 Karau Kuala')
        canv.setStrokeColor(GARIS)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, A4[1] - MARGIN + 5, A4[0] - MARGIN, A4[1] - MARGIN + 5)
        canv.line(MARGIN, MARGIN + 24, A4[0] - MARGIN, MARGIN + 24)
        canv.setFont('SegoeUI', 8.2)
        canv.drawString(MARGIN, MARGIN + 12,
                        'Sistem E-Learning \u2014 smakaraukuala.online')
        canv.setFont('SegoeUI-Bold', 8.6)
        canv.setFillColor(BIRU_TUA)
        canv.drawRightString(A4[0] - MARGIN, MARGIN + 12,
                             f'Halaman {doc.page - 1}')
        canv.restoreState()

    def afterFlowable(self, flowable):
        """Mendaftarkan judul bab ke daftar isi dan ke penanda PDF."""
        if not isinstance(flowable, Paragraph):
            return
        nama = flowable.style.name
        if nama not in ('bab', 'sub'):
            return
        aras = 0 if nama == 'bab' else 1
        teks = flowable.getPlainText()
        self._urut += 1
        kunci = f'bab{self._urut}'
        self.canv.bookmarkPage(kunci)
        self.canv.addOutlineEntry(teks, kunci, level=aras, closed=(aras == 0))
        # Hanya judul bab yang masuk daftar isi. Subbab sengaja tidak
        # didaftarkan: jumlahnya membuat daftar isi berpindah halaman pada
        # setiap pass penyusunan, sehingga nomor halamannya tidak pernah
        # tetap. Subbab tetap dapat dijangkau melalui penanda PDF.
        if aras == 0:
            self.notify('TOCEntry', (aras, teks, self.page - 1, kunci))


# --------------------------------------------------------------------------
# Potongan tata letak yang dipakai berulang
# --------------------------------------------------------------------------
def kotak_catatan(teks, g, warna_latar=BIRU_MUDA, warna_tepi=BIRU,
                  label='Catatan'):
    isi = Paragraph(f'<b>{label}.</b> {teks}', g['catatan'])
    t = Table([[isi]], colWidths=[LEBAR_ISI])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), warna_latar),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEBEFORE', (0, 0), (0, -1), 2.6, warna_tepi),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


def tabel_isi(kepala, baris, g, lebar_kolom=None):
    data = [[Paragraph(str(c), g['tabel_kepala']) for c in kepala]]
    for b in baris:
        data.append([Paragraph(str(c), g['tabel']) for c in b])
    t = Table(data, colWidths=lebar_kolom, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BIRU_TUA),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, ABU_MUDA]),
        ('GRID', (0, 0), (-1, -1), 0.4, GARIS),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return t


class Perakit:
    """Mengubah data isi panduan menjadi aliran flowable reportlab."""

    def __init__(self, penyiap, g, daftar_gambar):
        self.p = penyiap
        self.g = g
        self.judul_gambar = {x['berkas']: x['judul'] for x in daftar_gambar}
        self.nomor = 0

    def gambar(self, berkas, keterangan=None):
        bagian = self.p.ambil(berkas)
        self.nomor += 1
        judul = keterangan or self.judul_gambar.get(berkas, '')
        keluar = []
        for i, (jalur, w, h) in enumerate(bagian):
            im = Image(jalur, width=w, height=h)
            im.hAlign = 'CENTER'
            if len(bagian) == 1:
                tulisan = f'<b>Gambar {self.nomor}.</b> {judul}'
            else:
                tulisan = (f'<b>Gambar {self.nomor}.</b> {judul} '
                           f'(bagian {i + 1} dari {len(bagian)})')
            keluar.append(KeepTogether(
                [im, Paragraph(tulisan, self.g['keterangan']), Spacer(1, 8)]))
        return keluar

    def rakit(self, bab_list):
        aliran = []
        for i, bab in enumerate(bab_list):
            aliran.append(Paragraph(f"{i + 1}. {bab['judul']}",
                                    self.g['bab']))
            garis = Table([['']], colWidths=[LEBAR_ISI], rowHeights=[2.4])
            garis.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), KUNING)]))
            aliran += [garis, Spacer(1, 9)]
            if bab.get('intro'):
                aliran.append(Paragraph(bab['intro'], self.g['badan']))
            for blok in bab.get('blok', []):
                aliran += self._blok(blok)
            if i < len(bab_list) - 1:
                aliran.append(PageBreak())
        return aliran

    def _blok(self, b):
        t = b['t']
        if t == 'para':
            return [Paragraph(b['isi'], self.g['badan'])]
        if t == 'sub':
            return [Paragraph(b['isi'], self.g['sub'])]
        if t == 'langkah':
            butir = [ListItem(Paragraph(x, self.g['langkah']), leftIndent=20,
                              value=i + 1) for i, x in enumerate(b['isi'])]
            return [ListFlowable(butir, bulletType='1',
                                 bulletFontName='SegoeUI-Bold',
                                 bulletFontSize=10.2, leftIndent=20,
                                 bulletColor=BIRU_TUA), Spacer(1, 7)]
        if t == 'poin':
            butir = [ListItem(Paragraph(x, self.g['langkah']), leftIndent=18)
                     for x in b['isi']]
            return [ListFlowable(butir, bulletType='bullet',
                                 bulletChar='\u2022', bulletFontSize=10.2,
                                 leftIndent=18, bulletColor=BIRU),
                    Spacer(1, 7)]
        if t == 'gambar':
            return self.gambar(b['berkas'], b.get('judul'))
        if t == 'catatan':
            return [Spacer(1, 2), kotak_catatan(b['isi'], self.g), Spacer(1, 9)]
        if t == 'awas':
            return [Spacer(1, 2),
                    kotak_catatan(b['isi'], self.g,
                                  colors.HexColor('#fef3c7'), KUNING,
                                  b.get('label', 'Perhatikan')),
                    Spacer(1, 9)]
        if t == 'tabel':
            return [Spacer(1, 2),
                    tabel_isi(b['kepala'], b['baris'], self.g, b.get('lebar')),
                    Spacer(1, 11)]
        raise ValueError(f'blok tidak dikenal: {t}')
