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
    page.wait_for_timeout(450)

    if modal:
        # Perbesar tinggi viewport agar seluruh isi dialog terlihat utuh
        page.evaluate("() => { document.querySelectorAll('.modal')"
                      ".forEach((m) => { m.style.maxHeight = 'none'; }); }")
        page.wait_for_timeout(200)
        tinggi = page.evaluate(
            "() => { const s = document.querySelectorAll('.modal');"
            " const m = s[s.length - 1];"
            " return m ? Math.ceil(m.getBoundingClientRect().height) : 0; }")
        page.set_viewport_size({"width": W, "height": max(H, min(tinggi + 90, 4000))})
        page.wait_for_timeout(350)
        page.screenshot(path=os.path.join(OUT, berkas))
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
    page.wait_for_timeout(800)


def buka(page, path):
    page.goto(f"{BASE}{path}", wait_until="networkidle")
    page.wait_for_timeout(900)


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
               "Tampilan pesan kesalahan ketika pengguna memasukkan email atau password yang "
               "tidak sesuai, sehingga sistem menolak proses login.")

        # =============================================================
        # 2. ADMINISTRATOR
        # =============================================================
        login(page, "admin@smakk.sch.id", "admin123")
        simpan(page, "admin-dashboard", "Halaman Dashboard Administrator",
               "Dashboard administrator dibatasi pada data yang memang dikelola administrator, "
               "yaitu jumlah guru, siswa, kelas, dan mata pelajaran pada periode pembelajaran "
               "yang sedang berjalan. Jumlah pertemuan, materi, dan tugas tidak ditampilkan di "
               "sini karena merupakan ranah guru.")

        buka(page, "/admin/periode")
        simpan(page, "admin-periode", "Halaman Periode Pembelajaran",
               "Halaman pengelolaan periode pembelajaran. Setiap periode menggabungkan tahun "
               "ajaran dan semester dengan kode seperti 2026/1. Terlihat periode 2026/1 "
               "berstatus aktif dan periode 2025/2 telah dikunci administrator beserta "
               "keterangan siapa yang mengunci dan kapan penguncian dilakukan.", full=True)

        page.click('button:has-text("+ Tambah Periode")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "2026/2027")
        page.select_option('.modal select', "2")
        simpan(page, "admin-form-periode", "Form Tambah Periode Pembelajaran",
               "Form penambahan periode pembelajaran yang memuat isian tahun ajaran, semester, "
               "serta tanggal mulai dan selesai. Kode periode dibentuk otomatis oleh sistem dan "
               "periode baru berstatus draft sampai diaktifkan administrator.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/admin/guru")
        simpan(page, "admin-data-guru", "Halaman Data Guru",
               "Halaman pengelolaan data guru. Guru yang sudah mengampu kelas tidak dapat "
               "dihapus permanen karena akan memutus relasi data pembelajaran, sehingga sistem "
               "menyediakan tombol Nonaktifkan sebagai gantinya.", full=True)

        page.click('button:has-text("+ Tambah Guru")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Yuni Kartika, S.Pd")
        page.fill('.modal input[type="email"]', "yuni@smakk.sch.id")
        page.fill('.modal input >> nth=3', "199506152019032007")
        simpan(page, "admin-form-guru", "Form Tambah Data Guru",
               "Form penambahan data guru yang memuat isian nama, email, password, dan NIP. "
               "Mata pelajaran yang diajar guru ditentukan melalui menu Data Kelas.",
               modal=True)
        page.click('.modal button:has-text("Batal")')

        page.locator('tr:has-text("Budi Santoso") button:has-text("Jadwal")').first.click()
        page.wait_for_selector('.modal:has-text("Jadwal Mengajar")')
        simpan(page, "admin-jadwal-guru", "Rincian Jadwal Mengajar Seorang Guru",
               "Rincian jadwal mengajar yang menjawab pertanyaan guru ini mengajar apa dan di kelas "
               "mana. Informasi ditampilkan sebagai rincian tersendiri, tidak ditumpuk pada tabel "
               "daftar guru.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        buka(page, "/admin/siswa")
        simpan(page, "admin-data-siswa", "Halaman Data Siswa",
               "Halaman pengelolaan data siswa beserta kelasnya pada periode aktif. Siswa yang "
               "sudah lulus atau pindah cukup dinonaktifkan agar riwayat nilainya tetap "
               "tersimpan di dalam sistem.", full=True)

        page.click('button:has-text("+ Tambah Siswa")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Rahma Yuliana")
        page.fill('.modal input[type="email"]', "rahma@siswa.smakk.sch.id")
        page.fill('.modal input >> nth=3', "0012345700")
        simpan(page, "admin-form-siswa", "Form Tambah Data Siswa",
               "Form penambahan data siswa yang memuat isian nama, email, password, NIS, dan "
               "penempatan kelas pada periode pembelajaran yang sedang aktif.", modal=True)
        page.click('.modal button:has-text("Batal")')

        buka(page, "/admin/kelas")
        simpan(page, "admin-data-kelas", "Halaman Data Kelas",
               "Data kelas disajikan sebagai kartu agar mudah dibaca. Setiap kartu menampilkan "
               "tingkat, wali kelas, jumlah siswa, dan jumlah mata pelajaran, serta dapat dibuka "
               "untuk mengatur isinya.", full=True)

        page.locator('.kartu-ringkas:has-text("X MIPA 1")').first.click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(1200)
        simpan(page, "admin-kelas-mapel-guru", "Pengaturan Mata Pelajaran dan Guru Pengajar Kelas",
               "Penentuan guru dilakukan langsung di dalam kelas yang bersangkutan: setiap mata "
               "pelajaran pada kelas tersebut dipasangkan dengan guru yang mengajarnya. Dengan cara "
               "ini satu mata pelajaran dapat diajar guru yang berbeda pada kelas yang berbeda.",
               modal=True)

        page.locator('.modal .tab-bar button:has-text("Siswa")').click()
        page.wait_for_timeout(800)
        simpan(page, "admin-kelas-siswa", "Pengaturan Siswa Anggota Kelas",
               "Tab Siswa pada rincian kelas digunakan administrator untuk menambahkan atau "
               "mengeluarkan siswa dari kelas tersebut pada periode berjalan.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        buka(page, "/admin/mapel")
        simpan(page, "admin-data-mapel", "Halaman Katalog Mata Pelajaran",
               "Katalog mata pelajaran sekolah yang dikelompokkan menjadi kelompok wajib, "
               "peminatan MIPA, peminatan IPS, peminatan bahasa, dan muatan lokal. Kolom "
               "Diajarkan di Kelas menunjukkan pada tingkat kelas mana mata pelajaran tersebut "
               "diajarkan. Daftar yang panjang dibagi menjadi beberapa halaman.", full=True)

        page.click('button:has-text("+ Tambah Mapel")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Bahasa Jerman")
        page.fill('.modal input >> nth=1', "BJER")
        page.select_option('.modal select', "Peminatan Bahasa")
        simpan(page, "admin-form-mapel", "Form Tambah Mata Pelajaran",
               "Form penambahan mata pelajaran ke dalam katalog sekolah yang memuat isian nama, "
               "kode, kelompok mata pelajaran, dan deskripsi.", modal=True)
        page.click('.modal button:has-text("Batal")')

        page.locator('tr:has-text("Bahasa Indonesia") button:has-text("Lihat Kelas")').first.click()
        page.wait_for_selector('.modal:has-text("Diajarkan di Kelas")')
        simpan(page, "admin-mapel-detail", "Rincian Mata Pelajaran: Diajarkan di Kelas Mana",
               "Rincian sebuah mata pelajaran yang memperlihatkan kelas mana saja yang "
               "mempelajarinya beserta guru yang mengajar di tiap kelas. Terlihat Bahasa Indonesia "
               "diajar guru yang berbeda antara tingkat X dan tingkat XI.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        # =============================================================
        # 3. GURU
        # =============================================================
        login(page, "budi@smakk.sch.id", "guru123")
        simpan(page, "guru-dashboard", "Halaman Dashboard Guru",
               "Dashboard guru menampilkan jumlah kelas mata pelajaran yang diampu, jumlah siswa, "
               "pertemuan, materi, tugas, serta pekerjaan siswa yang masih perlu dinilai pada "
               "periode berjalan.")

        buka(page, "/guru/kelas")
        simpan(page, "guru-kelas-saya", "Halaman Kelas Saya (Guru)",
               "Halaman Kelas Saya menampilkan kartu setiap kelas mata pelajaran yang diampu guru "
               "beserta jumlah siswa, pertemuan, materi, dan tugasnya. Guru dapat memilih periode "
               "pembelajaran untuk menelusuri kelas pada periode terdahulu.", full=True)

        # Masuk ke kelas mata pelajaran Matematika Wajib X MIPA 1
        page.locator('.kartu-mapel:has-text("Matematika Wajib"):has-text("X MIPA 1")').first.click()
        page.wait_for_url("**/guru/kelas/**", timeout=10000)
        page.wait_for_timeout(1200)
        simpan(page, "guru-daftar-pertemuan", "Daftar Pertemuan pada Kelas Mata Pelajaran",
               "Daftar pertemuan pembelajaran yang disusun guru secara berurutan. Setiap pertemuan "
               "menampilkan jumlah materi, tugas, dan diskusi di dalamnya sehingga alur "
               "pembelajaran tersusun runut dari pertemuan pertama hingga terakhir.", full=True)

        page.click('button:has-text("+ Tambah Pertemuan")')
        page.wait_for_selector(".modal")
        page.fill('.modal input >> nth=0', "Nilai Mutlak Persamaan Linear")
        page.fill('.modal textarea',
                  "Konsep nilai mutlak dan penyelesaian persamaan nilai mutlak linear satu variabel.")
        simpan(page, "guru-form-pertemuan", "Form Tambah Pertemuan",
               "Form penambahan pertemuan yang memuat judul, deskripsi capaian pembelajaran, dan "
               "tanggal pertemuan. Nomor pertemuan diberikan otomatis melanjutkan urutan "
               "pertemuan sebelumnya.", modal=True)
        page.click('.modal button:has-text("Batal")')

        page.locator('a:has-text("Kelola Isi")').first.click()
        page.wait_for_url("**/guru/pertemuan/**", timeout=10000)
        page.wait_for_timeout(1200)
        simpan(page, "guru-isi-pertemuan", "Halaman Kelola Isi Pertemuan (Guru)",
               "Halaman pengelolaan isi satu pertemuan yang tersusun berurutan: materi "
               "pembelajaran, tugas dan kuis, kemudian forum diskusi. Materi dapat berupa uraian "
               "teks, berkas yang diunduh, video, maupun tautan YouTube yang langsung "
               "ditampilkan pada halaman.", full=True)

        page.click('button:has-text("+ Tambah Materi")')
        page.wait_for_selector(".modal")
        page.select_option('.modal select', "link")
        page.wait_for_timeout(300)
        page.fill('.modal input >> nth=0', "Video Pembahasan Persamaan Linear")
        page.fill('.modal textarea',
                  "Video penjelasan langkah penyelesaian persamaan linear satu variabel.")
        page.fill('.modal input >> nth=1', "https://www.youtube.com/watch?v=kYB8IZa5AuE")
        simpan(page, "guru-form-materi", "Form Tambah Materi Pembelajaran",
               "Form penambahan materi dengan pilihan jenis materi: uraian teks, berkas dokumen, "
               "unggahan video, atau tautan video YouTube. Sistem juga menampilkan batasan format "
               "dan ukuran berkas yang diizinkan.", modal=True)
        page.click('.modal button:has-text("Batal")')

        page.click('button:has-text("+ Buat Tugas/Kuis")')
        page.wait_for_selector(".modal")
        page.select_option('.modal select', "kuis")
        page.fill('.modal input >> nth=0', "Kuis Sistem Persamaan Linear Dua Variabel")
        page.fill('.modal textarea',
                  "Kuis pilihan ganda mengenai penyelesaian SPLDV dengan metode eliminasi "
                  "dan substitusi. Dinilai otomatis oleh sistem.")
        page.fill('.modal input[type="datetime-local"]', "2026-12-20T23:59")
        simpan(page, "guru-form-tugas", "Form Buat Tugas dan Kuis",
               "Form pembuatan tugas atau kuis pada sebuah pertemuan yang memuat tipe, judul, "
               "instruksi pengerjaan, dan batas waktu pengumpulan. Sistem menghitung sisa hari "
               "menuju batas waktu dan menampilkannya kepada siswa.", modal=True)
        page.click('.modal button:has-text("Batal")')

        # Kelola butir soal pada kuis
        buka(page, "/guru/kelas")
        page.locator('.kartu-mapel:has-text("Matematika Wajib"):has-text("X MIPA 1")').first.click()
        page.wait_for_url("**/guru/kelas/**", timeout=10000)
        page.wait_for_timeout(1000)
        page.locator('.pertemuan-item:has-text("Pertidaksamaan") a:has-text("Kelola Isi")').first.click()
        page.wait_for_url("**/guru/pertemuan/**", timeout=10000)
        page.wait_for_timeout(1200)
        page.locator('button:has-text("Soal")').first.click()
        page.wait_for_selector('.modal:has-text("Kelola Soal")')
        simpan(page, "guru-kelola-soal", "Halaman Kelola Butir Soal Kuis",
               "Halaman pengelolaan butir soal kuis yang menampilkan pertanyaan, pilihan jawaban, "
               "kunci jawaban yang ditandai, serta bobot setiap butir soal beserta total bobotnya.",
               modal=True)
        page.click('.modal button:has-text("Tutup")')

        buka(page, "/guru/penilaian")
        simpan(page, "guru-penilaian", "Halaman Penilaian (Guru)",
               "Penilaian dikelompokkan per mata pelajaran, tidak dicampur menjadi satu daftar "
               "panjang. Setiap kartu menampilkan jumlah tugas, pekerjaan yang terkumpul, dan "
               "jumlah siswa pada kelas tersebut.", full=True)

        page.locator('.kartu-ringkas:has-text("Matematika Wajib"):has-text("X MIPA 1")').first.click()
        page.wait_for_timeout(1000)
        simpan(page, "guru-penilaian-mapel", "Daftar Tugas pada Satu Mata Pelajaran",
               "Setelah mata pelajaran dipilih, tugas dan kuisnya ditampilkan berurutan menurut "
               "pertemuan beserta jumlah pekerjaan yang sudah terkumpul.", full=True)

        page.locator('.kartu-tugas:has-text("Latihan Persamaan Linear") button:has-text("Periksa & Nilai")').first.click()
        page.wait_for_selector('.modal:has-text("Pengumpulan:")')
        simpan(page, "guru-daftar-pengumpulan", "Daftar Pengumpulan Tugas Siswa",
               "Daftar pengumpulan menampilkan seluruh siswa kelas, termasuk siswa yang belum "
               "mengumpulkan, sehingga tugas yang tidak dikumpulkan ikut terpantau guru.",
               modal=True)

        page.locator('.modal button:has-text("Nilai")').first.click()
        page.wait_for_selector('.modal >> nth=1')
        page.wait_for_timeout(600)
        page.fill('.modal >> nth=-1 >> input[type="number"]', "90")
        page.fill('.modal >> nth=-1 >> textarea',
                  "Langkah pengerjaan sudah runtut dan benar. Pertahankan.")
        simpan(page, "guru-form-nilai", "Form Penilaian Tugas oleh Guru",
               "Form penilaian menampilkan jawaban siswa beserta berkas lampirannya, kolom nilai "
               "0 sampai 100, dan kolom catatan umpan balik untuk siswa.", modal=True)
        page.click('.modal >> nth=-1 >> button:has-text("Batal")')
        page.wait_for_timeout(400)
        page.click('.modal button:has-text("Tutup")')

        # Penilaian esai pada kuis (guru Bahasa Indonesia)
        login(page, "siti@smakk.sch.id", "guru123")
        buka(page, "/guru/penilaian")
        page.locator('.kartu-ringkas:has-text("Bahasa Indonesia"):has-text("X MIPA 1")').first.click()
        page.wait_for_timeout(1000)
        page.locator('.kartu-tugas:has-text("Kuis Teks Deskripsi") button:has-text("Periksa & Nilai")').first.click()
        page.wait_for_selector('.modal:has-text("Pengumpulan:")')
        simpan(page, "guru-pengumpulan-kuis", "Daftar Pengumpulan Kuis Siswa",
               "Daftar pengumpulan kuis beserta status penilaian tiap siswa, yaitu sudah dinilai, "
               "masih memerlukan penilaian jawaban esai, atau belum mengumpulkan sama sekali.",
               modal=True)

        page.locator('.modal button:has-text("Periksa")').first.click()
        page.wait_for_selector('.modal >> nth=1')
        page.wait_for_timeout(800)
        page.fill('.modal >> nth=-1 >> input[type="number"] >> nth=0', "27")
        page.fill('.modal >> nth=-1 >> textarea',
                  "Struktur teks deskripsi sudah tepat, kembangkan lagi bagian deskripsi bagiannya.")
        simpan(page, "guru-penilaian-esai", "Halaman Pemeriksaan dan Penilaian Jawaban Kuis",
               "Halaman pemeriksaan jawaban kuis siswa. Jawaban pilihan ganda telah dikoreksi "
               "otomatis oleh sistem beserta perolehan skornya, sedangkan jawaban esai dinilai "
               "manual oleh guru dengan mengisi skor dan catatan.", modal=True)
        page.click('.modal >> nth=-1 >> button:has-text("Batal")')
        page.wait_for_timeout(400)
        page.click('.modal button:has-text("Tutup")')

        # =============================================================
        # 4. SISWA
        # =============================================================
        login(page, "ahmad@siswa.smakk.sch.id", "siswa123")
        simpan(page, "siswa-dashboard", "Halaman Dashboard Siswa",
               "Dashboard siswa menampilkan kelas yang diikuti pada periode berjalan, ringkasan "
               "tugas, serta daftar tugas yang batas waktunya tinggal tiga hari atau kurang "
               "beserta penanda warna kemendesakannya.", full=True)

        buka(page, "/siswa/kelas")
        simpan(page, "siswa-kelas-saya", "Halaman Kelas Saya (Siswa)",
               "Halaman Kelas Saya menampilkan kartu setiap mata pelajaran di kelas siswa beserta "
               "guru pengampu, jumlah pertemuan, materi, tugas, dan sisa waktu tugas terdekat. "
               "Dengan tampilan ini materi tidak lagi bertumpuk menjadi satu daftar panjang.",
               full=True)

        page.locator('.kartu-mapel:has-text("Matematika Wajib")').first.click()
        page.wait_for_url("**/siswa/kelas/**", timeout=10000)
        page.wait_for_timeout(1200)
        simpan(page, "siswa-daftar-pertemuan", "Daftar Pertemuan Mata Pelajaran (Siswa)",
               "Daftar pertemuan pada sebuah mata pelajaran yang tersusun berurutan mulai dari "
               "pertemuan pertama, sehingga siswa dapat mengikuti alur pembelajaran secara runut.",
               full=True)

        page.locator('.pertemuan-item').first.click()
        page.wait_for_url("**/siswa/pertemuan/**", timeout=10000)
        page.wait_for_timeout(1500)
        simpan(page, "siswa-isi-pertemuan", "Halaman Isi Pertemuan (Siswa)",
               "Tampilan satu pertemuan bagi siswa yang memuat materi berupa uraian teks, berkas "
               "yang dapat diunduh, dan video pembelajaran yang dapat langsung ditonton, "
               "dilanjutkan dengan tugas beserta sisa waktunya, kemudian forum diskusi "
               "pertemuan tersebut.", full=True)

        buka(page, "/siswa/tugas")
        simpan(page, "siswa-tugas", "Halaman Tugas dan Kuis (Siswa)",
               "Tugas disajikan sebagai kartu, bukan tabel, sehingga lebih mudah dibaca sekilas. "
               "Setiap kartu hanya memuat mata pelajaran, judul, batas waktu, dan sisa hari "
               "beserta penanda warna kemendesakannya; keterangan lain disembunyikan pada bagian "
               "rincian. Status pengerjaan dipisahkan melalui tab tersendiri.", full=True)

        page.locator('.kartu-tugas').first.locator('.tombol-rincian').click()
        page.wait_for_timeout(600)
        simpan(page, "siswa-tugas-rincian", "Rincian Tugas yang Disembunyikan",
               "Keterangan tambahan seperti guru pengajar, pertemuan asal, kelas, waktu "
               "pengumpulan, dan catatan guru hanya ditampilkan ketika rincian dibuka, agar "
               "tampilan utama tetap ringkas.", full=True)

        page.locator('.tab-bar button:has-text("Sudah Dinilai")').click()
        page.wait_for_timeout(800)
        page.locator('.kartu-tugas:has-text("Kuis Persamaan dan Pertidaksamaan Linear") button:has-text("Lihat Hasil")').first.click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(1200)
        simpan(page, "siswa-hasil-kuis", "Halaman Hasil Pengerjaan Kuis Siswa",
               "Tampilan hasil pengerjaan kuis yang telah dinilai. Sistem menampilkan nilai akhir, "
               "jawaban yang dipilih siswa, keterangan benar atau salah, serta kunci jawaban "
               "setiap butir soal.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        buka(page, "/siswa/nilai")
        simpan(page, "siswa-nilai", "Halaman Rekap Nilai Siswa",
               "Rekap nilai siswa yang dikelompokkan per mata pelajaran beserta rata-rata masing "
               "masing, bukan digabung menjadi satu daftar. Siswa juga dapat memilih periode "
               "pembelajaran untuk menelusuri riwayat nilainya pada semester dan kelas "
               "sebelumnya, serta melihat tugas yang tidak dikumpulkan.", full=True)

        # Riwayat periode terdahulu ditampilkan oleh siswa kelas XI yang
        # sebelumnya berada di kelas X pada periode yang sudah dikunci.
        login(page, "maya@siswa.smakk.sch.id", "siswa123")
        buka(page, "/siswa/nilai")
        page.select_option('.pilih-periode select', index=1)
        page.wait_for_timeout(1500)
        simpan(page, "siswa-nilai-arsip", "Riwayat Nilai pada Periode Sebelumnya",
               "Riwayat nilai siswa pada periode pembelajaran terdahulu yang telah dikunci "
               "administrator. Nilai pada periode tersebut bersifat final dan hanya dapat dilihat "
               "sebagai arsip riwayat belajar siswa.", full=True)

        # Pengerjaan kuis oleh siswa yang belum mengerjakan
        login(page, "rian@siswa.smakk.sch.id", "siswa123")
        buka(page, "/siswa/tugas")
        page.locator('tr:has-text("Kuis Teks Deskripsi") button:has-text("Kerjakan")').first.click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(1200)
        radios = page.locator('.modal input[type="radio"]')
        if radios.count() >= 9:
            radios.nth(1).check(); radios.nth(4).check(); radios.nth(9).check()
        page.fill('.modal textarea >> nth=0',
                  "Sekolahku berada di tepi jalan utama Kecamatan Karau Kuala. Halaman depannya "
                  "luas dengan rumput hijau yang terpangkas rapi. Di sisi kiri berjajar pohon "
                  "ketapang yang rindang sehingga suasananya terasa sejuk pada pagi hari.")
        simpan(page, "siswa-kerjakan-kuis", "Halaman Pengerjaan Kuis oleh Siswa",
               "Halaman pengerjaan kuis yang menampilkan butir soal pilihan ganda beserta pilihan "
               "jawabannya dan soal esai yang dijawab pada kolom teks. Kunci jawaban belum "
               "ditampilkan selama kuis belum dinilai.", modal=True)
        page.click('.modal button:has-text("Tutup")')

        page.locator('tr:has-text("Tugas Proyek SPLDV") button:has-text("Kerjakan")').first.click()
        page.wait_for_selector(".modal")
        page.wait_for_timeout(900)
        page.fill('.modal textarea',
                  "Soal cerita: Harga 2 buku dan 3 pensil adalah Rp21.000, sedangkan 1 buku dan "
                  "2 pensil adalah Rp12.000.\nDengan metode eliminasi diperoleh harga sebuah buku "
                  "Rp6.000 dan sebuah pensil Rp3.000.")
        simpan(page, "siswa-kerjakan-tugas", "Halaman Pengerjaan dan Pengumpulan Tugas",
               "Halaman pengerjaan tugas yang memuat instruksi, batas waktu, kolom jawaban teks, "
               "serta pilihan mengunggah berkas lampiran jawaban beserta batasan formatnya.",
               modal=True)
        page.click('.modal button:has-text("Tutup")')

        # =============================================================
        # 5. PERIODE TERKUNCI
        # =============================================================
        login(page, "budi@smakk.sch.id", "guru123")
        buka(page, "/guru/kelas")
        page.select_option('.pilih-periode select', index=1)
        page.wait_for_timeout(1400)
        simpan(page, "periode-terkunci-guru", "Tampilan Periode yang Telah Dikunci",
               "Tampilan kelas pada periode pembelajaran yang telah dikunci administrator. Sistem "
               "memberi pemberitahuan bahwa seluruh data periode tersebut bersifat hanya-baca, "
               "dan kartu mata pelajaran ditandai sebagai arsip.", full=True)

        page.locator('.kartu-mapel').first.click()
        page.wait_for_url("**/guru/kelas/**", timeout=10000)
        page.wait_for_timeout(1200)
        page.locator('a:has-text("Kelola Isi")').first.click()
        page.wait_for_url("**/guru/pertemuan/**", timeout=10000)
        page.wait_for_timeout(1400)
        simpan(page, "periode-terkunci-pertemuan", "Isi Pertemuan pada Periode Terkunci",
               "Isi pertemuan pada periode yang telah dikunci. Seluruh materi dan tugas tetap "
               "dapat dibaca sebagai arsip, namun tombol untuk menambah, mengubah, maupun "
               "menghapus data dinonaktifkan sehingga data tidak dapat diubah lagi.", full=True)

        # =============================================================
        # 6. TAMPILAN MOBILE
        # =============================================================
        ctx2 = browser.new_context(viewport={"width": 412, "height": 915},
                                   device_scale_factor=2, locale="id-ID",
                                   is_mobile=True, has_touch=True)
        page2 = ctx2.new_page()
        page2.goto(f"{BASE}/login", wait_until="networkidle")
        page2.fill('input[type="email"]', "ahmad@siswa.smakk.sch.id")
        page2.fill('input[type="password"]', "siswa123")
        page2.click('button:has-text("Masuk")')
        page2.wait_for_url(lambda u: "/login" not in u, timeout=15000)
        page2.goto(f"{BASE}/siswa/kelas", wait_until="networkidle")
        page2.wait_for_timeout(1500)

        global urut
        urut += 1
        berkas = f"{urut:02d}-tampilan-mobile.png"
        page2.screenshot(path=os.path.join(OUT, berkas))
        daftar.append({
            "no": urut, "berkas": berkas,
            "judul": "Tampilan Sistem pada Perangkat Mobile",
            "keterangan": "Tampilan sistem e-learning ketika diakses melalui browser pada "
                          "perangkat smartphone. Antarmuka menyesuaikan lebar layar sesuai "
                          "kebutuhan non-fungsional ketersediaan sistem.",
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
