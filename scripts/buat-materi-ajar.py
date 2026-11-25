# =====================================================================
# Pembuatan berkas materi ajar Bahasa Indonesia kelas XI semester genap
# Sistem E-Learning SMA Negeri 1 Karau Kuala
# ---------------------------------------------------------------------
# Menghasilkan dua macam berkas dari scripts/materi-bindo-xi-genap.json:
#
#   materi-ajar/modul/*.pdf   Modul ajar untuk setiap unit pembelajaran,
#                             dilampirkan sebagai materi bertipe berkas.
#   materi-ajar/video/*.mp4   Video paparan berupa salindia bergerak,
#                             dilampirkan sebagai materi bertipe video.
#
# Video sengaja dibuat tanpa suara. Berkas ini hanya menjadi ringkasan
# visual sekaligus peragaan materi bertipe video yang diputar langsung di
# dalam sistem; penjelasan bersuara disediakan melalui materi bertipe
# tautan yang mengarah ke kanal pembelajaran di YouTube.
#
# Prasyarat : reportlab, Pillow, dan ffmpeg. Jalur ffmpeg dicari otomatis
#             dan dapat ditimpa melalui peubah lingkungan FFMPEG.
# Jalankan  : python scripts/buat-materi-ajar.py
# =====================================================================
import glob
import json
import os
import shutil
import subprocess
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (ListFlowable, ListItem, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(AKAR, 'scripts', 'materi-bindo-xi-genap.json')
KELUAR = os.path.join(AKAR, 'materi-ajar')
LOGO = os.path.join(AKAR, 'frontend', 'src', 'assets', 'logo-sekolah.jpg')

BIRU = colors.HexColor('#2563eb')
BIRU_TUA = colors.HexColor('#1e40af')
KUNING = colors.HexColor('#f0a91b')
ABU = colors.HexColor('#64748b')
GARIS = colors.HexColor('#cbd5e1')
TEKS = colors.HexColor('#0f172a')

FONT_DIR = os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts')


def daftarkan_font():
    for nama, berkas in [('SegoeUI', 'segoeui.ttf'),
                         ('SegoeUI-Bold', 'segoeuib.ttf'),
                         ('SegoeUI-Italic', 'segoeuii.ttf')]:
        pdfmetrics.registerFont(TTFont(nama, os.path.join(FONT_DIR, berkas)))
    pdfmetrics.registerFontFamily('SegoeUI', normal='SegoeUI',
                                  bold='SegoeUI-Bold', italic='SegoeUI-Italic')


def cari_ffmpeg():
    """Mencari ffmpeg. Lingkungan ini tidak memasangnya secara global,
    namun beberapa aplikasi menyertakannya."""
    if os.environ.get('FFMPEG') and os.path.exists(os.environ['FFMPEG']):
        return os.environ['FFMPEG']
    bawaan = shutil.which('ffmpeg')
    if bawaan:
        return bawaan
    pola = [
        os.path.join(os.environ.get('LOCALAPPDATA', ''), 'CapCut', 'Apps',
                     '*', 'ffmpeg.exe'),
        r'C:\Program Files\*\*\ffmpeg.exe',
        r'C:\ffmpeg\bin\ffmpeg.exe',
    ]
    for p in pola:
        hit = sorted(glob.glob(p))
        if hit:
            return hit[-1]
    return None


# ---------------------------------------------------------------------
# Modul PDF
# ---------------------------------------------------------------------
def gaya():
    g = {}
    g['judul'] = ParagraphStyle('judul', fontName='SegoeUI-Bold', fontSize=22,
                                leading=28, textColor=BIRU_TUA, spaceAfter=4)
    g['anak'] = ParagraphStyle('anak', fontName='SegoeUI', fontSize=11.5,
                               leading=17, textColor=ABU, spaceAfter=16)
    g['bagian'] = ParagraphStyle('bagian', fontName='SegoeUI-Bold',
                                 fontSize=13.5, leading=19,
                                 textColor=BIRU_TUA, spaceBefore=15,
                                 spaceAfter=6)
    g['badan'] = ParagraphStyle('badan', fontName='SegoeUI', fontSize=10.6,
                                leading=16.4, textColor=TEKS,
                                alignment=TA_JUSTIFY, spaceAfter=7)
    g['poin'] = ParagraphStyle('poin', fontName='SegoeUI', fontSize=10.6,
                               leading=16, textColor=TEKS, spaceAfter=3)
    g['kaki'] = ParagraphStyle('kaki', fontName='SegoeUI', fontSize=9,
                               leading=13.5, textColor=ABU)
    g['kepala'] = ParagraphStyle('kepala', fontName='SegoeUI', fontSize=9,
                                 leading=13, textColor=ABU,
                                 alignment=TA_CENTER)
    return g


def buat_modul(m, meta, g):
    os.makedirs(os.path.join(KELUAR, 'modul'), exist_ok=True)
    jalur = os.path.join(KELUAR, 'modul', f"{m['kode']}.pdf")
    doc = SimpleDocTemplate(
        jalur, pagesize=A4, leftMargin=2.2 * cm, rightMargin=2.2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title=f"Modul Ajar — {m['judul']}",
        author=f"{meta['guru']}, S.Pd — SMA Negeri 1 Karau Kuala",
        subject=m['ringkas'])

    aliran = [
        Paragraph('MODUL AJAR · BAHASA INDONESIA KELAS XI', g['kepala']),
        Spacer(1, 10),
        Paragraph(m['judul'], g['judul']),
        Paragraph(m['ringkas'], g['anak']),
    ]

    kepala = Table([[
        Paragraph(f"<b>Mata Pelajaran</b><br/>{meta['mapel']}", g['kaki']),
        Paragraph(f"<b>Kelas</b><br/>{meta['kelas']}", g['kaki']),
        Paragraph(f"<b>Guru Pengampu</b><br/>{meta['guru']}, S.Pd", g['kaki']),
        Paragraph(f"<b>Pertemuan</b><br/>ke-{m['pertemuan']} dan seterusnya",
                  g['kaki']),
    ]], colWidths=[4.1 * cm, 2.6 * cm, 4.6 * cm, 4.8 * cm])
    kepala.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e8f0fe')),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBEFORE', (0, 0), (0, -1), 2.6, KUNING),
    ]))
    aliran += [kepala, Spacer(1, 6)]

    for b in m['bagian']:
        aliran.append(Paragraph(b['judul'], g['bagian']))
        for p in b.get('isi', []):
            aliran.append(Paragraph(p, g['badan']))
        if b.get('poin'):
            aliran.append(ListFlowable(
                [ListItem(Paragraph(x, g['poin']), leftIndent=18)
                 for x in b['poin']],
                bulletType='bullet', bulletChar='\u2022', leftIndent=18,
                bulletColor=BIRU))
            aliran.append(Spacer(1, 6))

    aliran += [Spacer(1, 18), Paragraph('Sumber dan Rujukan', g['bagian'])]
    aliran.append(ListFlowable(
        [ListItem(Paragraph(s, g['kaki']), leftIndent=18)
         for s in meta['sumber']],
        bulletType='bullet', bulletChar='\u2022', leftIndent=18,
        bulletColor=ABU))

    def kaki_halaman(canv, _doc):
        canv.saveState()
        canv.setStrokeColor(GARIS)
        canv.setLineWidth(0.5)
        canv.line(2.2 * cm, 1.6 * cm, A4[0] - 2.2 * cm, 1.6 * cm)
        canv.setFont('SegoeUI', 8.2)
        canv.setFillColor(ABU)
        canv.drawString(2.2 * cm, 1.1 * cm,
                        'SMA Negeri 1 Karau Kuala \u2014 Modul Ajar Bahasa '
                        'Indonesia Kelas XI')
        canv.drawRightString(A4[0] - 2.2 * cm, 1.1 * cm, str(canv.getPageNumber()))
        canv.restoreState()

    doc.build(aliran, onFirstPage=kaki_halaman, onLaterPages=kaki_halaman)
    return jalur


# ---------------------------------------------------------------------
# Video paparan
# ---------------------------------------------------------------------
L, T = 1280, 720
FPS = 15
DETIK_SLIDE = 6
DETIK_SILANG = 0.6


def muat_font(ukuran, tebal=False):
    nama = 'segoeuib.ttf' if tebal else 'segoeui.ttf'
    return ImageFont.truetype(os.path.join(FONT_DIR, nama), ukuran)


def gambar_slide(baris, nomor, total):
    im = Image.new('RGB', (L, T), '#1e3a8a' if nomor == 0 else '#f8fafc')
    d = ImageDraw.Draw(im)
    utama = nomor == 0
    warna_judul = '#ffffff' if utama else '#1e40af'
    warna_isi = '#dbe4fb' if utama else '#0f172a'

    if not utama:
        d.rectangle([0, 0, L, 8], fill='#f0a91b')

    f_judul = muat_font(44 if utama else 38, tebal=True)
    f_isi = muat_font(27 if utama else 26)

    judul = baris[0]
    sisa = baris[1:]

    y = 118 if utama else 92
    for potong in textwrap.wrap(judul, width=26 if utama else 30):
        d.text((88, y), potong, font=f_judul, fill=warna_judul)
        y += (f_judul.size + 12)

    y += 28
    if not utama:
        d.line([(88, y - 14), (L - 88, y - 14)], fill='#cbd5e1', width=2)
        y += 8

    for baris_isi in sisa:
        for i, potong in enumerate(textwrap.wrap(baris_isi, width=46)):
            awal = potong if i else ('\u2022  ' + potong if not utama else potong)
            d.text((96 if not utama else 88, y), awal, font=f_isi,
                   fill=warna_isi)
            y += f_isi.size + 12
        y += 10

    # Penanda kemajuan di bagian bawah
    if total > 1:
        lebar = int(L * (nomor + 1) / total)
        d.rectangle([0, T - 7, L, T], fill='#e2e8f0' if not utama else '#1b327a')
        d.rectangle([0, T - 7, lebar, T], fill='#f0a91b')
    return im


def buat_video(v, ffmpeg):
    os.makedirs(os.path.join(KELUAR, 'video'), exist_ok=True)
    jalur = os.path.join(KELUAR, 'video', f"{v['kode']}.mp4")
    slides = [gambar_slide(s, i, len(v['slide']))
              for i, s in enumerate(v['slide'])]

    # Penyandi MediaFoundation tersedia pada Windows; bila gagal, mundur ke
    # MPEG-4 yang selalu ada pada ffmpeg mana pun.
    for penyandi, tambahan in (('h264_mf', ['-b:v', '2200k']),
                               ('mpeg4', ['-q:v', '4'])):
        perintah = [
            ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
            '-f', 'rawvideo', '-pix_fmt', 'rgb24',
            '-s', f'{L}x{T}', '-r', str(FPS), '-i', 'pipe:0',
            '-an', '-pix_fmt', 'yuv420p', '-c:v', penyandi, *tambahan, jalur,
        ]
        p = subprocess.Popen(perintah, stdin=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        try:
            n_tahan = int(FPS * DETIK_SLIDE)
            n_silang = int(FPS * DETIK_SILANG)
            for i, im in enumerate(slides):
                for _ in range(n_tahan):
                    p.stdin.write(im.tobytes())
                if i + 1 < len(slides):
                    for k in range(n_silang):
                        a = k / n_silang
                        p.stdin.write(
                            Image.blend(im, slides[i + 1], a).tobytes())
            p.stdin.close()
            galat = p.stderr.read().decode('utf-8', 'replace')
            if p.wait() == 0 and os.path.exists(jalur) \
                    and os.path.getsize(jalur) > 1024:
                return jalur, penyandi
            print(f'   penyandi {penyandi} gagal: {galat.strip()[:120]}')
        except Exception as e:                        # noqa: BLE001
            print(f'   penyandi {penyandi} gagal: {e}')
            try:
                p.kill()
            except Exception:                         # noqa: BLE001
                pass
    raise RuntimeError('Tidak ada penyandi video yang berhasil.')


# ---------------------------------------------------------------------
def main():
    with open(DATA, encoding='utf-8') as f:
        d = json.load(f)

    daftarkan_font()
    g = gaya()
    os.makedirs(KELUAR, exist_ok=True)

    print('Menyusun modul ajar...')
    modul = []
    for m in d['modul']:
        j = buat_modul(m, d, g)
        modul.append(j)
        print(f"   {os.path.basename(j):44s} "
              f"{os.path.getsize(j) / 1024:7.1f} KB")

    ffmpeg = cari_ffmpeg()
    video = []
    if not ffmpeg:
        print('\nffmpeg tidak ditemukan — video paparan dilewati.')
        print('Pasang ffmpeg lalu jalankan ulang, atau setel peubah '
              'lingkungan FFMPEG.')
    else:
        print(f'\nMenyusun video paparan (ffmpeg: {ffmpeg})...')
        for v in d['video_berkas']:
            j, penyandi = buat_video(v, ffmpeg)
            video.append(j)
            print(f"   {os.path.basename(j):44s} "
                  f"{os.path.getsize(j) / 1024 / 1024:7.2f} MB  [{penyandi}]")

    # Daftar isi folder, supaya berkasnya mudah ditelusuri tanpa membuka
    # basis data.
    baris = ['# Materi Ajar Bahasa Indonesia Kelas XI Semester Genap', '',
             f"Mata pelajaran : {d['mapel']}",
             f"Kelas          : {d['kelas']}",
             f"Periode        : {d['periode']}",
             f"Guru pengampu  : {d['guru']}, S.Pd", '',
             'Berkas pada folder ini dilampirkan ke dalam sistem e-learning '
             'sebagai materi pertemuan.', '', '## Modul ajar (PDF)', '']
    for m in d['modul']:
        baris.append(f"- `modul/{m['kode']}.pdf` — {m['judul']} "
                     f"(mulai pertemuan {m['pertemuan']})")
    baris += ['', '## Video paparan (MP4, tanpa suara)', '']
    for v in d['video_berkas']:
        baris.append(f"- `video/{v['kode']}.mp4` — {v['judul']} "
                     f"(pertemuan {v['pertemuan']})")
    baris += ['', '## Video penjelasan (tautan YouTube)', '']
    for p in d['pertemuan']:
        if p.get('video'):
            baris.append(
                f"- Pertemuan {p['nomor']} — [{p['video']['judul']}]"
                f"(https://www.youtube.com/watch?v={p['video']['id']}) "
                f"· kanal {p['video']['kanal']}")
    baris += ['', '## Sumber rujukan', '']
    baris += [f'- {s}' for s in d['sumber']]
    baris.append('')
    with open(os.path.join(KELUAR, 'README.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(baris))

    print(f'\nSelesai. Seluruh berkas berada pada:\n   {KELUAR}')
    print(f'   {len(modul)} modul PDF, {len(video)} video paparan, '
          'dan README.md')


if __name__ == '__main__':
    sys.exit(main())
