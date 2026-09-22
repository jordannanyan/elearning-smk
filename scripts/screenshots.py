# =====================================================================
# Pengambilan tangkapan layar (screenshot) Sistem E-Learning
# SMA Negeri 1 Karau Kuala -- untuk keperluan BAB IV Hasil dan Pembahasan
# ---------------------------------------------------------------------
# Prasyarat : backend berjalan di http://localhost:4000
#             frontend berjalan di http://localhost:5173
#             database sudah di-seed dan scripts/blackbox.js sudah dijalankan
# Jalankan  : python scripts/screenshots.py
# Keluaran  : docs-bab4/screenshots/*.png  dan  docs-bab4/data/daftar-gambar.json
# =====================================================================
import json
import os
import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs-bab4", "screenshots")
DATA = os.path.join(ROOT, "docs-bab4", "data")
os.makedirs(OUT, exist_ok=True)
os.makedirs(DATA, exist_ok=True)

W, H = 1440, 900
daftar = []
urut = 0


def simpan(page, nama, judul, keterangan, modal=False, full=False):
    """Menyimpan tangkapan layar sekaligus mencatat keterangan gambarnya."""
    global urut
    urut += 1
    berkas = f"{urut:02d}-{nama}.png"
    page.wait_for_timeout(400)

    if modal:
        # Perbesar tinggi viewport agar seluruh isi dialog terlihat utuh
        page.evaluate("() => { document.querySelectorAll('.modal')"
                      ".forEach((m) => { m.style.maxHeight = 'none'; }); }")
        page.wait_for_timeout(200)
        tinggi = page.evaluate(
            "() => { const s = document.querySelectorAll('.modal');"
            " const m = s[s.length - 1];"
            " return m ? Math.ceil(m.getBoundingClientRect().height) : 0; }"
        )
        page.set_viewport_size({"width": W, "height": max(H, min(tinggi + 90, 4000))})
        page.wait_for_timeout(350)
        page.screenshot(path=os.path.join(OUT, berkas))
        # Kembalikan gaya dialog agar interaksi berikutnya tetap dapat dilakukan
        page.evaluate("() => { document.querySelectorAll('.modal')"
                      ".forEach((m) => { m.style.maxHeight = ''; }); }")
        page.set_viewport_size({"width": W, "height": H})
        page.wait_for_timeout(250)
    else:
        page.screenshot(path=os.path.join(OUT, berkas), full_page=full)

    daftar.append({"no": urut, "berkas": berkas, "judul": judul, "keterangan": keterangan})
    print(f"[{urut:02d}] {berkas}  -- {judul}")


def login(page, email, sandi):
    page.goto(f"{BASE}/login", wait_until="networkidle")
    page.evaluate("() => { localStorage.clear(); }")
    page.goto(f"{BASE}/login", wait_until="networkidle")
    page.fill('input[type="email"]', email)
    page.fill('input[type="password"]', sandi)
    page.click('button:has-text("Masuk")')
    page.wait_for_url(lambda u: "/login" not in u, timeout=15000)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(600)


def buka(page, path):
    page.goto(f"{BASE}{path}", wait_until="networkidle")
    page.wait_for_timeout(700)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": W, "height": H},
                                  device_scale_factor=2, locale="id-ID")
        page = ctx.new_page()

        # =============================================================
        # 1. HALAMAN LOGIN
        # =============================================================
        page.goto(f"{BASE}/login", wait_until="networkidle")
        page.evaluate("() => { localStorage.clear(); }")
        page.goto(f"{BASE}/login", wait_until="networkidle")
        simpan(page, "halaman-login", "Halaman Login",
               "Halaman login sistem e-learning yang digunakan oleh administrator, guru, "
               "dan siswa untuk masuk ke dalam sistem sesuai hak aksesnya.")

        page.fill('input[type="email"]', "ahmad@siswa.smakk.sch.id")
        page.fill('input[type="password"]', "salah123")
        page.click('button:has-text("Masuk")')
        page.wait_for_selector(".error-box", timeout=10000)
        simpan(page, "login-gagal", "Pesan Kesalahan Login",
               "Tampilan pesan kesalahan ketika pengguna memasukkan email atau password "
               "yang tidak sesuai, sehingga sistem menolak proses login.")

        # =============================================================
        # 2. HALAMAN ADMINISTRATOR
        # =============================================================
        login(page, "admin@smakk.sch.id", "admin123")
        simpan(page, "admin-dashboard", "Halaman Dashboard Administrator",
               "Dashboard administrator menampilkan rekapitulasi jumlah guru, siswa, kelas, "
               "mata pelajaran, materi, dan tugas yang terdapat di dalam sistem.")

        buka(page, "/admin/guru")
        simpan(page, "admin-data-guru", "Halaman Data Guru",
               "Halaman pengelolaan data guru yang menampilkan nama, NIP, email, dan mata "
               "pelajaran yang diampu, beserta tombol untuk menambah, mengubah, dan menghapus data.",
               full=True)

        page.click('button:has-text("+ Tambah Guru")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Hendra Wijaya, S.Pd")
        page.fill('.modal input[type="email"]', "hendra@smakk.sch.id")
        page.fill('.modal input >> nth=3', "199304182018011005")
        page.fill('.modal input >> nth=4', "Kimia")
        simpan(page, "admin-form-guru", "Form Tambah Data Guru",
               "Form penambahan data guru yang memuat isian nama, email, password, NIP, "
               "dan mata pelajaran yang diampu.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/admin/siswa")
        simpan(page, "admin-data-siswa", "Halaman Data Siswa",
               "Halaman pengelolaan data siswa yang menampilkan nama, NIS, email, dan kelas "
               "siswa beserta tombol pengelolaan data.", full=True)

        page.click('button:has-text("+ Tambah Siswa")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Wulan Safitri")
        page.fill('.modal input[type="email"]', "wulan.s@siswa.smakk.sch.id")
        page.fill('.modal input >> nth=3', "0012345691")
        page.select_option('.modal select', index=1)
        simpan(page, "admin-form-siswa", "Form Tambah Data Siswa",
               "Form penambahan data siswa yang memuat isian nama, email, password, NIS, "
               "dan pilihan kelas tempat siswa ditempatkan.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/admin/kelas")
        simpan(page, "admin-data-kelas", "Halaman Data Kelas",
               "Halaman pengelolaan data kelas yang menampilkan nama kelas, tingkat, "
               "tahun ajaran, dan jumlah siswa pada setiap kelas.", full=True)

        page.click('button:has-text("+ Tambah Kelas")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "XII IPA 1")
        page.select_option('.modal select', "XII")
        page.fill('.modal input >> nth=1', "2025/2026")
        simpan(page, "admin-form-kelas", "Form Tambah Data Kelas",
               "Form penambahan data kelas yang memuat isian nama kelas, tingkat, "
               "dan tahun ajaran.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/admin/mapel")
        simpan(page, "admin-data-mapel", "Halaman Data Mata Pelajaran",
               "Halaman pengelolaan data mata pelajaran yang menampilkan nama, kode, "
               "guru pengampu, dan deskripsi setiap mata pelajaran.", full=True)

        page.click('button:has-text("+ Tambah Mapel")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Sejarah Indonesia")
        page.fill('.modal input >> nth=1', "SEJ-X")
        page.select_option('.modal select', index=1)
        page.fill('.modal textarea', "Mata pelajaran Sejarah Indonesia untuk kelas X semester ganjil.")
        simpan(page, "admin-form-mapel", "Form Tambah Mata Pelajaran",
               "Form penambahan mata pelajaran yang memuat isian nama, kode, guru pengampu, "
               "dan deskripsi mata pelajaran.", modal=True)
        page.click('.modal button:has-text("Batal")')

        # =============================================================
        # 3. HALAMAN GURU
        # =============================================================
        login(page, "budi@smakk.sch.id", "guru123")
        simpan(page, "guru-dashboard", "Halaman Dashboard Guru",
               "Dashboard guru menampilkan jumlah mata pelajaran yang diampu, materi, tugas, "
               "serta jumlah pekerjaan siswa yang masih perlu dinilai.")

        buka(page, "/guru/materi")
        simpan(page, "guru-materi", "Halaman Kelola Materi Pembelajaran (Guru)",
               "Halaman pengelolaan materi pembelajaran oleh guru yang menampilkan judul materi, "
               "mata pelajaran, file lampiran, dan tanggal unggah.", full=True)

        page.click('button:has-text("+ Tambah Materi")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Sistem Persamaan Linear Tiga Variabel")
        page.fill('.modal textarea',
                  "Materi pengantar sistem persamaan linear tiga variabel beserta metode "
                  "penyelesaian dengan eliminasi dan substitusi.")
        simpan(page, "guru-form-materi", "Form Tambah Materi Pembelajaran",
               "Form penambahan materi pembelajaran yang memuat pilihan mata pelajaran, judul, "
               "konten materi, serta unggahan file pendukung.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/guru/tugas")
        simpan(page, "guru-tugas", "Halaman Kelola Tugas dan Kuis (Guru)",
               "Halaman pengelolaan tugas dan kuis oleh guru yang menampilkan judul, tipe, "
               "jumlah soal, batas waktu, dan jumlah pekerjaan yang telah terkumpul.", full=True)

        page.click('button:has-text("+ Buat Tugas/Kuis")')
        page.wait_for_selector(".modal")
        page.select_option('.modal select >> nth=1', "kuis")
        page.fill('.modal input >> nth=0', "Kuis Sistem Persamaan Linear Dua Variabel")
        page.fill('.modal textarea',
                  "Kuis pilihan ganda mengenai penyelesaian SPLDV dengan metode eliminasi "
                  "dan substitusi. Dinilai otomatis oleh sistem.")
        page.fill('.modal input[type="datetime-local"]', "2026-12-20T23:59")
        simpan(page, "guru-form-tugas", "Form Buat Tugas dan Kuis",
               "Form pembuatan tugas atau kuis yang memuat pilihan mata pelajaran, tipe "
               "(tugas atau kuis), judul, instruksi pengerjaan, dan batas waktu pengumpulan.",
               modal=True)
        page.click('.modal button:has-text("Batal")')

        # Kelola soal pada kuis matematika
        baris_kuis = page.locator('tr', has_text="Kuis Persamaan dan Pertidaksamaan Linear")
        baris_kuis.locator('button:has-text("Soal")').click()
        page.wait_for_selector('.modal:has-text("Kelola Soal")')
        simpan(page, "guru-kelola-soal", "Halaman Kelola Butir Soal Kuis",
               "Halaman pengelolaan butir soal kuis yang menampilkan pertanyaan, pilihan jawaban, "
               "kunci jawaban yang ditandai, serta bobot setiap butir soal.", modal=True)

        page.click('.modal button:has-text("+ Tambah Soal")')
        page.wait_for_selector('.modal >> nth=1')
        page.wait_for_timeout(400)
        page.fill('.modal >> nth=1 >> textarea',
                  "Nilai x yang memenuhi persamaan 4x - 8 = 2x + 6 adalah ...")
        for i, isi in enumerate(["5", "6", "7", "8"]):
            page.fill(f'.modal >> nth=1 >> input >> nth={i}', isi)
        page.select_option('.modal >> nth=1 >> select >> nth=1', "C")
        simpan(page, "guru-form-soal", "Form Tambah Butir Soal",
               "Form penambahan butir soal yang memuat tipe soal (pilihan ganda atau esai), "
               "pertanyaan, pilihan jawaban, kunci jawaban, dan bobot nilai.", modal=True)
        page.click('.modal >> nth=1 >> button:has-text("Batal")')
        page.wait_for_timeout(400)
        page.click('.modal button:has-text("Tutup")')
        page.wait_for_timeout(600)

        # Daftar pengumpulan tugas
        baris_tugas = page.locator('tr', has_text="Latihan Persamaan Linear")
        baris_tugas.locator('button:has-text("Pengumpulan")').click()
        page.wait_for_selector('.modal:has-text("Pengumpulan:")')
        simpan(page, "guru-daftar-pengumpulan", "Daftar Pengumpulan Tugas Siswa",
               "Daftar siswa yang telah mengumpulkan tugas beserta waktu pengumpulan, file "
               "jawaban, nilai yang telah diberikan, dan tombol untuk melakukan penilaian.",
               modal=True)
        page.click('.modal button:has-text("Tutup")')

        # Penilaian esai (guru Bahasa Indonesia)
        login(page, "siti@smakk.sch.id", "guru123")
        buka(page, "/guru/tugas")
        baris_kuis_bind = page.locator('tr', has_text="Kuis Teks Deskripsi")
        baris_kuis_bind.locator('button:has-text("Pengumpulan")').click()
        page.wait_for_selector('.modal:has-text("Pengumpulan:")')
        simpan(page, "guru-pengumpulan-kuis", "Daftar Pengumpulan Kuis Siswa",
               "Daftar pengumpulan kuis yang menampilkan status penilaian setiap siswa, yaitu "
               "sudah selesai dinilai atau masih memerlukan penilaian pada jawaban esai.",
               modal=True)

        page.locator('.modal button:has-text("Periksa & Nilai")').first.click()
        page.wait_for_selector('.modal >> nth=1')
        page.fill('.modal >> nth=-1 >> input[type="number"] >> nth=0', "27")
        page.fill('.modal >> nth=-1 >> textarea',
                  "Struktur teks deskripsi sudah tepat, kembangkan lagi bagian deskripsi bagiannya.")
        simpan(page, "guru-penilaian-esai", "Halaman Pemeriksaan dan Penilaian Jawaban Kuis",
               "Halaman pemeriksaan jawaban kuis siswa. Jawaban pilihan ganda telah dikoreksi "
               "otomatis oleh sistem, sedangkan jawaban esai dinilai secara manual oleh guru "
               "dengan mengisi skor dan catatan.", modal=True)
        page.click('.modal >> nth=-1 >> button:has-text("Batal")')
        page.wait_for_timeout(400)
        page.click('.modal button:has-text("Tutup")')

        login(page, "budi@smakk.sch.id", "guru123")
        buka(page, "/guru/forum")
        simpan(page, "guru-forum", "Halaman Forum Diskusi (Guru)",
               "Halaman forum diskusi pada sisi guru yang menampilkan topik diskusi beserta "
               "balasan dari siswa, serta form untuk memulai topik baru.", full=True)

        # =============================================================
        # 4. HALAMAN SISWA
        # =============================================================
        login(page, "ahmad@siswa.smakk.sch.id", "siswa123")
        simpan(page, "siswa-dashboard", "Halaman Dashboard Siswa",
               "Dashboard siswa menampilkan jumlah mata pelajaran, total tugas, tugas yang "
               "sudah dikumpulkan, tugas yang belum dikumpulkan, dan tugas yang sudah dinilai.")

        buka(page, "/siswa/materi")
        simpan(page, "siswa-materi", "Halaman Materi Pembelajaran (Siswa)",
               "Halaman materi pembelajaran pada sisi siswa yang menampilkan judul materi, "
               "mata pelajaran, guru pengampu, uraian materi, dan tombol unduh file materi.",
               full=True)

        page.select_option("select", label="Matematika Wajib")
        page.wait_for_timeout(900)
        simpan(page, "siswa-materi-filter", "Penyaringan Materi Berdasarkan Mata Pelajaran",
               "Hasil penyaringan materi pembelajaran berdasarkan mata pelajaran yang dipilih "
               "siswa, sehingga hanya materi mata pelajaran tersebut yang ditampilkan.",
               full=True)

        buka(page, "/siswa/tugas")
        simpan(page, "siswa-tugas", "Halaman Tugas dan Kuis (Siswa)",
               "Halaman tugas dan kuis pada sisi siswa yang menampilkan judul, mata pelajaran, "
               "guru pengampu, batas waktu, serta status pengerjaan setiap tugas.", full=True)

        baris_hasil = page.locator('tr', has_text="Kuis Persamaan dan Pertidaksamaan Linear")
        baris_hasil.locator('button:has-text("Lihat Hasil")').click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(900)
        simpan(page, "siswa-hasil-kuis", "Halaman Hasil Pengerjaan Kuis Siswa",
               "Tampilan hasil pengerjaan kuis yang telah dinilai. Sistem menampilkan nilai "
               "akhir, jawaban yang dipilih siswa, keterangan benar atau salah, serta kunci "
               "jawaban setiap butir soal.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        buka(page, "/siswa/nilai")
        simpan(page, "siswa-nilai", "Halaman Rekap Nilai Siswa",
               "Halaman rekap nilai siswa yang menampilkan jumlah tugas yang dikumpulkan, "
               "jumlah yang sudah dinilai, rata-rata nilai, serta rincian nilai dan catatan "
               "dari guru untuk setiap tugas maupun kuis.", full=True)

        buka(page, "/siswa/forum")
        simpan(page, "siswa-forum", "Halaman Forum Diskusi (Siswa)",
               "Halaman forum diskusi pada sisi siswa yang menampilkan topik diskusi, balasan "
               "dari guru dan siswa lain, serta form untuk memulai topik baru.", full=True)

        page.locator('button:has-text("+ Balas")').first.click()
        page.wait_for_timeout(300)
        page.fill('.card textarea >> nth=1',
                  "Terima kasih atas penjelasannya, Bu. Saya akan mencoba menggunakan kata "
                  "konkret dan rincian objek pada tugas menulis teks deskripsi.")
        simpan(page, "siswa-forum-balas", "Form Balasan Forum Diskusi",
               "Form balasan pada forum diskusi yang digunakan siswa untuk menanggapi topik "
               "diskusi yang dibuat oleh guru maupun siswa lain.", full=True)

        # Pengerjaan kuis oleh siswa yang belum mengerjakan
        login(page, "rizky@siswa.smakk.sch.id", "siswa123")
        buka(page, "/siswa/tugas")
        baris_kerjakan = page.locator('tr', has_text="Kuis Teks Deskripsi")
        baris_kerjakan.locator('button:has-text("Kerjakan")').click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(900)
        radios = page.locator('.modal input[type="radio"]')
        if radios.count() >= 5:
            radios.nth(1).check()
            radios.nth(4).check()
            radios.nth(9).check()
        page.fill('.modal textarea >> nth=0',
                  "Sekolahku berada di tepi jalan utama Kecamatan Karau Kuala. Halaman depannya "
                  "luas dengan rumput hijau yang terpangkas rapi. Di sisi kiri berjajar pohon "
                  "ketapang yang rindang sehingga suasananya terasa sejuk pada pagi hari.")
        simpan(page, "siswa-kerjakan-kuis", "Halaman Pengerjaan Kuis oleh Siswa",
               "Halaman pengerjaan kuis oleh siswa yang menampilkan butir soal pilihan ganda "
               "beserta pilihan jawabannya dan soal esai yang dijawab pada kolom teks.",
               modal=True)
        page.click('.modal button:has-text("Tutup")')

        # Pengerjaan tugas biasa (unggah file)
        login(page, "salsa@siswa.smakk.sch.id", "siswa123")
        buka(page, "/siswa/tugas")
        baris_tugas_biasa = page.locator('tr', has_text="Latihan Persamaan Linear")
        baris_tugas_biasa.locator('button:has-text("Kerjakan")').click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(700)
        page.fill('.modal textarea',
                  "Nomor 1: 2x + 6 = 14 sehingga 2x = 8 dan x = 4.\n"
                  "Nomor 2: 3x - 9 = 0 sehingga 3x = 9 dan x = 3.\n"
                  "Nomor 3: 5x = 3x + 12 sehingga 2x = 12 dan x = 6.\n"
                  "Langkah penyelesaian nomor 4 sampai 10 saya lampirkan pada file.")
        simpan(page, "siswa-kerjakan-tugas", "Halaman Pengerjaan dan Pengumpulan Tugas",
               "Halaman pengerjaan tugas oleh siswa yang memuat instruksi tugas, batas waktu, "
               "kolom jawaban teks, serta pilihan untuk mengunggah file lampiran jawaban.",
               modal=True)
        page.click('.modal button:has-text("Tutup")')

        # Tampilan responsif pada perangkat mobile
        ctx2 = browser.new_context(viewport={"width": 412, "height": 915},
                                   device_scale_factor=2, locale="id-ID",
                                   is_mobile=True, has_touch=True)
        page2 = ctx2.new_page()
        page2.goto(f"{BASE}/login", wait_until="networkidle")
        page2.fill('input[type="email"]', "ahmad@siswa.smakk.sch.id")
        page2.fill('input[type="password"]', "siswa123")
        page2.click('button:has-text("Masuk")')
        page2.wait_for_url(lambda u: "/login" not in u, timeout=15000)
        page2.wait_for_timeout(1200)
        global urut
        urut += 1
        berkas = f"{urut:02d}-tampilan-mobile.png"
        page2.screenshot(path=os.path.join(OUT, berkas))
        daftar.append({
            "no": urut, "berkas": berkas,
            "judul": "Tampilan Sistem pada Perangkat Mobile",
            "keterangan": "Tampilan sistem e-learning ketika diakses melalui browser pada "
                          "perangkat smartphone, membuktikan bahwa antarmuka sistem bersifat "
                          "responsif sesuai kebutuhan non-fungsional ketersediaan.",
        })
        print(f"[{urut:02d}] {berkas}  -- Tampilan Sistem pada Perangkat Mobile")

        ctx2.close()
        ctx.close()
        browser.close()

    with open(os.path.join(DATA, "daftar-gambar.json"), "w", encoding="utf8") as f:
        json.dump(daftar, f, indent=2, ensure_ascii=False)
    print(f"\nTotal {len(daftar)} tangkapan layar disimpan di {OUT}")


if __name__ == "__main__":
    main()
