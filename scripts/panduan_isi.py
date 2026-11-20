# -*- coding: utf-8 -*-
"""Isi panduan penggunaan Sistem E-Learning SMA Negeri 1 Karau Kuala.

Seluruh nama menu, label tombol, batas ukuran berkas, dan ketentuan
penilaian pada berkas ini diambil dari kode sistem yang berjalan, bukan
dikarang, agar panduan tidak menyimpang dari tampilan yang dilihat
pengguna.

Catatan penulisan: isi paragraf diolah reportlab sebagai penggalan XML,
sehingga tanda '&' harus dituliskan sebagai '&amp;'.
"""

ALAMAT = 'https://smakaraukuala.online'

# --------------------------------------------------------------------------
# Potongan yang dipakai pada kedua panduan
# --------------------------------------------------------------------------
TABEL_BERKAS = {
    't': 'tabel',
    'kepala': ['Jenis', 'Format yang diterima', 'Ukuran maksimum'],
    'lebar': [92, 300, 100],
    'baris': [
        ['Dokumen', '.pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt',
         '20 MB'],
        ['Gambar', '.jpg, .jpeg, .png, .gif, .webp', '20 MB'],
        ['Video', '.mp4, .webm, .mkv, .mov', '100 MB'],
    ],
}

TABEL_PREDIKAT = {
    't': 'tabel',
    'kepala': ['Predikat', 'Rentang nilai akhir', 'Keterangan'],
    'lebar': [78, 150, 200],
    'baris': [
        ['A', '90 – 100', 'Sangat Baik'],
        ['B', '80 – 89', 'Baik'],
        ['C', '70 – 79', 'Cukup'],
        ['D', 'di bawah 70', 'Perlu Bimbingan'],
    ],
}

TABEL_STATUS_PRESENSI = {
    't': 'tabel',
    'kepala': ['Status', 'Arti', 'Siapa yang mengisi'],
    'lebar': [78, 230, 180],
    'baris': [
        ['Hadir', 'Siswa mengikuti pertemuan',
         'Siswa sendiri, lewat tombol <b>Saya Hadir</b>'],
        ['Sakit', 'Tidak hadir karena sakit', 'Guru'],
        ['Izin', 'Tidak hadir dengan izin', 'Guru'],
        ['Alpa', 'Tidak hadir tanpa keterangan',
         'Keadaan awal setiap siswa sebelum diubah'],
    ],
}

BAB_SANDI = {
    'judul': 'Akun Saya dan Mengubah Kata Sandi',
    'intro': 'Setiap pengguna dapat mengubah kata sandi akunnya sendiri '
             'melalui menu <b>Akun Saya</b>. Menu ini juga menampilkan '
             'identitas akun yang sedang digunakan, sehingga Anda dapat '
             'memastikan bahwa akun yang terbuka memang akun Anda.',
    'blok': [
        {'t': 'langkah', 'isi': [
            'Klik menu <b>Akun Saya</b> pada daftar menu di sisi kiri.',
            'Periksa panel identitas di bagian atas: nama, alamat surel, '
            'dan peran akun.',
            'Pada bagian ubah kata sandi, isi <b>kata sandi lama</b>, lalu '
            '<b>kata sandi baru</b>, lalu <b>ulangi kata sandi baru</b>.',
            'Centang <b>Tampilkan kata sandi</b> bila Anda ingin memeriksa '
            'ketikan Anda sebelum menyimpan.',
            'Klik <b>Simpan</b>. Sistem menolak penyimpanan apabila kata '
            'sandi lama salah, kata sandi baru kurang dari enam karakter, '
            'atau kedua isian kata sandi baru tidak sama.',
        ]},
        {'t': 'gambar', 'berkas': '63-akun-ubah-sandi.png'},
        {'t': 'awas', 'isi': 'Kata sandi awal yang diberikan administrator '
                             'sama untuk banyak akun. Segera ubah kata sandi '
                             'Anda setelah berhasil masuk untuk pertama kali, '
                             'dan jangan memberitahukannya kepada orang lain.'},
    ],
}


def bab_masuk(peran, berkas_dashboard, nama_dashboard):
    """Bab 'Masuk ke Sistem', isinya hampir sama untuk guru dan siswa."""
    return {
        'judul': 'Masuk ke Sistem',
        'intro': f'Sistem hanya dapat digunakan setelah Anda masuk dengan '
                 f'akun {peran}. Akun dibuatkan oleh administrator sekolah '
                 f'dan terdiri atas alamat surel beserta kata sandi.',
        'blok': [
            {'t': 'langkah', 'isi': [
                f'Buka peramban, lalu kunjungi <b>{ALAMAT}</b>.',
                'Klik tombol <b>Masuk</b> di kanan atas halaman, atau '
                '<b>Masuk ke Sistem</b> pada bagian tengah halaman.',
                'Isi <b>Email</b> dengan alamat surel akun Anda.',
                'Isi <b>Kata Sandi</b> dengan kata sandi akun Anda.',
                'Klik tombol <b>Masuk</b>.',
            ]},
            {'t': 'gambar', 'berkas': '02-halaman-login.png'},
            {'t': 'catatan', 'isi': 'Apabila Anda ragu dengan ketikan kata '
                                    'sandi, centang <b>Tampilkan kata '
                                    'sandi</b> agar hurufnya terlihat.'},
            {'t': 'para', 'isi': f'Setelah berhasil masuk, sistem langsung '
                                 f'membuka <b>{nama_dashboard}</b> dan '
                                 f'menampilkan daftar menu sesuai peran '
                                 f'{peran} di sisi kiri halaman.'},
            {'t': 'sub', 'isi': 'Bila gagal masuk'},
            {'t': 'para', 'isi': 'Sistem menampilkan pesan kesalahan apabila '
                                 'alamat surel atau kata sandi tidak cocok. '
                                 'Periksa kembali ketikan Anda, terutama '
                                 'huruf besar dan kecil pada kata sandi.'},
            {'t': 'gambar', 'berkas': '03-login-gagal.png'},
            {'t': 'poin', 'isi': [
                'Pastikan tidak ada spasi tambahan di awal atau akhir alamat '
                'surel.',
                'Pastikan tombol Caps Lock pada papan tuts tidak sedang aktif.',
                'Apabila kata sandi Anda benar-benar terlupa, hubungi '
                'administrator sekolah untuk disetel ulang. Kata sandi yang '
                'terlupa tidak dapat dipulihkan sendiri dari halaman login.',
            ]},
        ],
    }


def bab_kenal(peran, untuk):
    return {
        'judul': 'Mengenal Sistem E-Learning',
        'intro': 'Sistem E-Learning SMA Negeri 1 Karau Kuala adalah sistem '
                 'pembelajaran berbasis web yang menyatukan materi, tugas, '
                 'kuis, presensi kehadiran, dan penilaian dalam satu tempat. '
                 'Sistem dibuka melalui peramban, tanpa perlu memasang '
                 'aplikasi apa pun, baik dari komputer maupun dari telepon '
                 'genggam.',
        'blok': [
            {'t': 'sub', 'isi': 'Alamat dan kebutuhan'},
            {'t': 'poin', 'isi': [
                f'Alamat sistem: <b>{ALAMAT}</b>',
                'Peramban yang disarankan: Google Chrome, Microsoft Edge, '
                'atau Mozilla Firefox versi terbaru.',
                'Dibutuhkan sambungan internet. Sistem dapat dibuka dari '
                'komputer, laptop, maupun telepon genggam.',
                'Dibutuhkan akun yang dibuatkan oleh administrator sekolah.',
            ]},
            {'t': 'sub', 'isi': 'Halaman depan'},
            {'t': 'para', 'isi': 'Halaman depan dapat dibuka siapa saja tanpa '
                                 'masuk terlebih dahulu. Halaman ini memuat '
                                 'profil sekolah, rekapitulasi jumlah guru, '
                                 'siswa, rombongan belajar, dan mata '
                                 'pelajaran pada periode yang sedang '
                                 'berjalan, serta tautan untuk mengunduh '
                                 'panduan penggunaan. Tidak ada data pribadi '
                                 'guru maupun siswa yang ditampilkan di '
                                 'halaman ini.'},
            {'t': 'gambar', 'berkas': '01-halaman-depan.png'},
            {'t': 'sub', 'isi': 'Tiga peran pengguna'},
            {'t': 'para', 'isi': 'Setiap pengguna masuk dengan akunnya '
                                 'sendiri dan memperoleh menu yang berbeda '
                                 'sesuai perannya.'},
            {'t': 'tabel',
             'kepala': ['Peran', 'Yang dapat dilakukan'],
             'lebar': [110, 378],
             'baris': [
                 ['Administrator', 'Mengelola periode pembelajaran, data '
                                   'guru dan siswa, kelas, mata pelajaran, '
                                   'serta jadwal pelajaran.'],
                 ['Guru', 'Menyusun pertemuan, mengunggah materi, membuat '
                          'tugas dan kuis, mengelola presensi, menilai '
                          'pekerjaan siswa, dan melihat rekap nilai.'],
                 ['Siswa', 'Mengikuti pertemuan, mengunduh materi, mengisi '
                           'presensi, mengerjakan tugas dan kuis, serta '
                           'melihat nilai dan raport sementara.'],
             ]},
            {'t': 'catatan', 'isi': f'Panduan ini ditujukan untuk '
                                    f'<b>{untuk}</b>. Bagian yang hanya dapat '
                                    f'diakses peran lain tidak dibahas di '
                                    f'sini.'},
        ],
    }


# ==========================================================================
# PANDUAN GURU
# ==========================================================================
BAB_GURU = [
    bab_kenal('guru', 'guru'),
    bab_masuk('guru', '23-guru-dashboard.png', 'Dashboard Guru'),
    {
        'judul': 'Mengenal Halaman Dashboard',
        'intro': 'Dashboard adalah halaman pertama yang terbuka setelah Anda '
                 'masuk. Halaman ini merangkum keadaan mengajar Anda pada '
                 'periode yang sedang berjalan, sehingga Anda tidak perlu '
                 'membuka setiap kelas satu per satu hanya untuk mengetahui '
                 'apa yang perlu dikerjakan.',
        'blok': [
            {'t': 'gambar', 'berkas': '23-guru-dashboard.png'},
            {'t': 'para', 'isi': 'Bagian yang perlu Anda perhatikan:'},
            {'t': 'poin', 'isi': [
                'Kartu rekapitulasi di bagian atas: jumlah kelas mata '
                'pelajaran yang Anda ajar, jumlah siswa, dan jumlah '
                'pekerjaan siswa yang masih menunggu penilaian.',
                '<b>Jadwal mengajar hari ini</b>, lengkap dengan jam '
                'pelajaran, mata pelajaran, dan kelasnya.',
                'Daftar pekerjaan siswa yang baru terkumpul dan belum Anda '
                'nilai.',
                'Daftar menu di sisi kiri: Dashboard, Kelas yang Diajar, '
                'Jadwal Pelajaran, Presensi, Penilaian, Rekap Nilai, dan '
                'Akun Saya.',
            ]},
            {'t': 'catatan', 'isi': 'Pada layar telepon genggam, daftar menu '
                                    'tidak ditampilkan terus-menerus. '
                                    'Ketuk tombol menu di kiri atas untuk '
                                    'membukanya.'},
        ],
    },
    {
        'judul': 'Kelas yang Diajar',
        'intro': 'Menu <b>Kelas yang Diajar</b> memuat seluruh kelas mata '
                 'pelajaran yang ditugaskan kepada Anda pada periode '
                 'berjalan. Satu baris mewakili satu mata pelajaran pada satu '
                 'kelas, misalnya Matematika Umum di kelas X A.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Klik menu <b>Kelas yang Diajar</b>.',
                'Cari kelas mata pelajaran yang ingin Anda kerjakan.',
                'Klik kelas tersebut untuk membuka daftar pertemuannya.',
            ]},
            {'t': 'gambar', 'berkas': '24-guru-kelas-saya.png'},
            {'t': 'catatan', 'isi': 'Penugasan mengajar diatur oleh '
                                    'administrator. Apabila ada kelas yang '
                                    'seharusnya Anda ajar tetapi tidak '
                                    'muncul di sini, hubungi administrator '
                                    'sekolah.'},
        ],
    },
    {
        'judul': 'Pertemuan Pembelajaran',
        'intro': 'Seluruh kegiatan pembelajaran pada sistem ini bertumpu pada '
                 '<b>pertemuan</b>. Materi, tugas, kuis, forum diskusi, dan '
                 'presensi semuanya dilekatkan pada sebuah pertemuan, '
                 'sehingga susunannya mengikuti urutan pembelajaran yang '
                 'sudah berjalan di kelas.',
        'blok': [
            {'t': 'sub', 'isi': 'Melihat daftar pertemuan'},
            {'t': 'para', 'isi': 'Setelah Anda memilih sebuah kelas mata '
                                 'pelajaran, sistem menampilkan daftar '
                                 'pertemuannya secara berurutan beserta '
                                 'tanggal dan ringkasan isinya.'},
            {'t': 'gambar', 'berkas': '25-guru-daftar-pertemuan.png'},
            {'t': 'sub', 'isi': 'Menambah pertemuan baru'},
            {'t': 'langkah', 'isi': [
                'Pada halaman daftar pertemuan, klik tombol tambah '
                'pertemuan.',
                'Isi <b>Judul Pertemuan</b>, misalnya "Sistem Persamaan '
                'Linear Dua Variabel".',
                'Isi <b>Tanggal Pertemuan</b> sesuai tanggal pelaksanaan.',
                'Isi <b>Keterangan pertemuan</b> bila diperlukan, misalnya '
                'capaian pembelajaran yang dituju.',
                'Klik <b>Simpan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '26-guru-form-pertemuan.png'},
            {'t': 'catatan', 'isi': 'Nomor pertemuan diberikan sistem secara '
                                    'berurutan menurut tanggalnya, sehingga '
                                    'Anda tidak perlu mengisinya sendiri.'},
        ],
    },
    {
        'judul': 'Mengisi Materi Pembelajaran',
        'intro': 'Setiap pertemuan diisi melalui halaman <b>Kelola Isi</b>. '
                 'Dari halaman inilah Anda menambahkan materi, membuat tugas '
                 'dan kuis, membuka presensi, serta membuka forum diskusi.',
        'blok': [
            {'t': 'sub', 'isi': 'Membuka halaman Kelola Isi'},
            {'t': 'langkah', 'isi': [
                'Buka menu <b>Kelas yang Diajar</b>, lalu pilih kelas mata '
                'pelajarannya.',
                'Pada pertemuan yang ingin diisi, klik tombol '
                '<b>Kelola Isi</b>.',
            ]},
            {'t': 'gambar', 'berkas': '28-guru-isi-pertemuan.png'},
            {'t': 'sub', 'isi': 'Menambah materi'},
            {'t': 'langkah', 'isi': [
                'Pada bagian <b>Materi</b>, klik tombol tambah materi.',
                'Isi <b>Judul Materi</b>.',
                'Pilih <b>Jenis Materi</b>: uraian teks, berkas unggahan, '
                'video, atau tautan.',
                'Isi bagian isinya sesuai jenis yang dipilih. Untuk jenis '
                'berkas, klik pemilih berkas lalu pilih berkas dari '
                'perangkat Anda. Untuk jenis tautan atau video, tempelkan '
                'alamat tautannya.',
                'Klik <b>Simpan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '29-guru-form-materi.png'},
            {'t': 'sub', 'isi': 'Jenis dan ukuran berkas yang diterima'},
            TABEL_BERKAS,
            {'t': 'awas', 'isi': 'Berkas yang jenisnya tidak terdaftar atau '
                                 'ukurannya melebihi batas akan ditolak '
                                 'sistem, dan sistem menyebutkan alasan '
                                 'penolakannya. Untuk video berukuran besar, '
                                 'pertimbangkan mengunggahnya ke layanan '
                                 'video lalu memasang tautannya sebagai '
                                 'materi jenis tautan.'},
        ],
    },
    {
        'judul': 'Membuat Tugas, Kuis, UTS, dan UAS',
        'intro': 'Semua bentuk penilaian dibuat dari halaman <b>Kelola '
                 'Isi</b> sebuah pertemuan. Sistem membedakan empat tipe '
                 'penilaian, dan setiap penilaian memiliki <b>bobot</b> yang '
                 'menentukan seberapa besar pengaruhnya terhadap nilai '
                 'akhir.',
        'blok': [
            {'t': 'sub', 'isi': 'Membuat penilaian'},
            {'t': 'langkah', 'isi': [
                'Pada halaman <b>Kelola Isi</b>, buka bagian '
                '<b>Penilaian</b>, lalu klik tombol tambah penilaian.',
                'Isi <b>Judul</b> penilaian.',
                'Pilih <b>Tipe</b>: Tugas, Kuis, Ujian Tengah Semester, atau '
                'Ujian Akhir Semester.',
                'Isi <b>Batas Waktu Pengumpulan</b>. Boleh dikosongkan '
                'apabila penilaian tidak dibatasi waktu.',
                'Isi <b>Bobot</b> dalam persen.',
                'Isi deskripsi atau petunjuk pengerjaan untuk siswa.',
                'Klik <b>Simpan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '30-guru-form-tugas.png'},
            {'t': 'tabel',
             'kepala': ['Tipe', 'Cara pengerjaan', 'Cara penilaian'],
             'lebar': [120, 190, 178],
             'baris': [
                 ['Tugas', 'Siswa mengirim jawaban teks dan/atau '
                           'mengunggah berkas', 'Dinilai guru'],
                 ['Kuis', 'Siswa menjawab butir-butir soal di dalam sistem',
                  'Pilihan ganda otomatis, esai dinilai guru'],
                 ['Ujian Tengah Semester', 'Sama seperti kuis atau tugas, '
                                           'bergantung butir soalnya',
                  'Sesuai tipe soalnya'],
                 ['Ujian Akhir Semester', 'Sama seperti kuis atau tugas, '
                                          'bergantung butir soalnya',
                  'Sesuai tipe soalnya'],
             ]},
            {'t': 'awas', 'isi': 'Jumlah bobot seluruh penilaian pada satu '
                                 'mata pelajaran sebaiknya tepat '
                                 '<b>100%</b>. Halaman Rekap Nilai '
                                 'menampilkan peringatan selama jumlahnya '
                                 'masih kurang dari 100%, karena nilai akhir '
                                 'siswa belum dapat terhitung utuh.'},
            {'t': 'sub', 'isi': 'Menyusun butir soal kuis'},
            {'t': 'langkah', 'isi': [
                'Pada daftar penilaian, klik tombol <b>Soal</b> pada '
                'penilaian yang ingin disusun soalnya.',
                'Klik <b>Tambah Soal</b>.',
                'Pilih <b>Tipe Soal</b>: <b>Pilihan Ganda (otomatis)</b> '
                'atau <b>Esai (dinilai guru)</b>.',
                'Isi <b>Pertanyaan</b>.',
                'Untuk pilihan ganda, isi pilihan A sampai D lalu tentukan '
                '<b>Kunci Jawaban</b>.',
                'Isi <b>Bobot (poin)</b> butir soal tersebut.',
                'Klik <b>Simpan</b>, lalu ulangi untuk butir soal '
                'berikutnya.',
            ]},
            {'t': 'gambar', 'berkas': '31-guru-kelola-soal.png'},
            {'t': 'catatan', 'isi': 'Soal bertipe <b>Pilihan Ganda</b> '
                                    'dinilai sistem secara otomatis begitu '
                                    'siswa mengumpulkan. Soal bertipe '
                                    '<b>Esai</b> menunggu pemeriksaan Anda.'},
            {'t': 'sub', 'isi': 'Soal yang disertai gambar atau PDF'},
            {'t': 'para', 'isi': 'Sebagian soal tidak dapat dituliskan '
                                 'seluruhnya sebagai teks, misalnya soal '
                                 'yang memuat grafik fungsi, struktur kimia, '
                                 'atau potongan bacaan hasil pindaian. Untuk '
                                 'keperluan itu, pertanyaan maupun setiap '
                                 'pilihan jawaban dapat disertai berkas '
                                 'gambar atau PDF.'},
            {'t': 'langkah', 'isi': [
                'Pada formulir penyusunan soal, perhatikan isian lampiran di '
                'bawah kolom <b>Pertanyaan</b>.',
                'Klik pemilih berkas, lalu pilih gambar atau PDF soalnya.',
                'Untuk pilihan ganda bergambar, gunakan isian lampiran yang '
                'tersedia pada masing-masing pilihan A sampai D.',
                'Klik <b>Simpan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '33-guru-form-soal-lampiran.png'},
            {'t': 'para', 'isi': 'Gambar yang dilampirkan ditampilkan '
                                 'langsung di bawah pertanyaan, baik pada '
                                 'tampilan guru maupun pada tampilan siswa '
                                 'yang mengerjakan.'},
            {'t': 'gambar', 'berkas': '32-guru-soal-berlampiran.png'},
            {'t': 'catatan', 'isi': 'Teks pertanyaan boleh dikosongkan '
                                    'apabila soalnya seluruhnya berupa '
                                    'gambar. Begitu pula pilihan jawaban: '
                                    'sebuah pilihan dianggap terisi apabila '
                                    'memiliki lampiran, walaupun teksnya '
                                    'kosong. Untuk mengganti lampiran, '
                                    'unggah berkas baru; untuk '
                                    'menghilangkannya, gunakan <b>Hapus '
                                    'lampiran</b>.'},
        ],
    },
    {
        'judul': 'Presensi Kehadiran',
        'intro': 'Presensi pada sistem ini dirancang agar kehadiran diisi '
                 'sendiri oleh siswa, sedangkan guru yang membuka presensi '
                 'dan mencatat siswa yang tidak hadir. Dengan begitu, '
                 'kehadiran tercatat atas nama akun siswa yang bersangkutan.',
        'blok': [
            {'t': 'sub', 'isi': 'Membuka presensi sebuah pertemuan'},
            {'t': 'langkah', 'isi': [
                'Buka pertemuan yang bersangkutan melalui menu <b>Kelas yang '
                'Diajar</b>, atau melalui menu <b>Presensi</b>.',
                'Klik <b>Buka Presensi</b>. Setelah presensi dibuka, siswa '
                'dapat menekan tombol <b>Saya Hadir</b> dari akunnya '
                'masing-masing.',
                'Selama pembelajaran berlangsung, pantau daftar siswa yang '
                'sudah menandai kehadirannya.',
                'Ubah status siswa yang tidak hadir menjadi <b>Sakit</b>, '
                '<b>Izin</b>, atau <b>Alpa</b>, dan isi keterangannya bila '
                'perlu.',
                'Setelah selesai, tutup presensi agar tidak ada lagi '
                'perubahan kehadiran pada pertemuan tersebut.',
            ]},
            {'t': 'gambar', 'berkas': '27-guru-presensi-pertemuan.png'},
            TABEL_STATUS_PRESENSI,
            {'t': 'awas', 'isi': 'Keadaan awal setiap siswa adalah '
                                 '<b>Alpa</b>. Siswa yang hadir tetapi lupa '
                                 'menekan <b>Saya Hadir</b> akan tercatat '
                                 'alpa, sehingga status seperti itu perlu '
                                 'Anda perbaiki secara manual sebelum '
                                 'presensi ditutup.'},
            {'t': 'sub', 'isi': 'Melihat rekap presensi'},
            {'t': 'para', 'isi': 'Menu <b>Presensi</b> menyajikan rekap '
                                 'kehadiran seluruh siswa pada satu mata '
                                 'pelajaran, beserta persentase kehadiran '
                                 'masing-masing siswa sepanjang periode. '
                                 'Rekap ini dapat dicetak.'},
            {'t': 'gambar', 'berkas': '45-guru-rekap-presensi.png'},
        ],
    },
    {
        'judul': 'Memeriksa dan Menilai Pekerjaan Siswa',
        'intro': 'Menu <b>Penilaian</b> mengumpulkan seluruh pekerjaan siswa '
                 'yang perlu Anda periksa, dikelompokkan menurut mata '
                 'pelajaran dan penilaian, sehingga Anda tidak perlu '
                 'menelusuri tiap pertemuan satu per satu.',
        'blok': [
            {'t': 'sub', 'isi': 'Membuka daftar yang perlu dinilai'},
            {'t': 'langkah', 'isi': [
                'Klik menu <b>Penilaian</b>.',
                'Pilih mata pelajaran dan kelas yang ingin diperiksa.',
                'Pilih penilaian yang ingin diperiksa. Sistem menunjukkan '
                'berapa pekerjaan yang sudah terkumpul dan berapa yang masih '
                'menunggu penilaian.',
            ]},
            {'t': 'gambar', 'berkas': '34-guru-penilaian.png'},
            {'t': 'gambar', 'berkas': '35-guru-penilaian-mapel.png'},
            {'t': 'sub', 'isi': 'Menilai tugas'},
            {'t': 'para', 'isi': 'Daftar pengumpulan memperlihatkan siapa '
                                 'yang sudah mengumpulkan, siapa yang '
                                 'terlambat, dan siapa yang belum '
                                 'mengumpulkan sama sekali.'},
            {'t': 'gambar', 'berkas': '36-guru-daftar-pengumpulan.png'},
            {'t': 'langkah', 'isi': [
                'Pada baris siswa yang ingin dinilai, klik <b>Nilai</b>.',
                'Baca jawaban teks siswa. Bila siswa melampirkan berkas, '
                'klik <b>Lihat berkas</b> atau unduh berkasnya.',
                'Isi <b>Skor</b>.',
                'Isi <b>Catatan</b> bila Anda ingin memberi umpan balik '
                'kepada siswa. Bagian ini bersifat pilihan.',
                'Klik <b>Simpan Nilai</b>.',
            ]},
            {'t': 'gambar', 'berkas': '37-guru-form-nilai.png'},
            {'t': 'sub', 'isi': 'Jawaban esai yang disertai foto pekerjaan'},
            {'t': 'para', 'isi': 'Soal esai sering dikerjakan siswa pada '
                                 'kertas, lalu difoto dan diunggah. Foto '
                                 'pekerjaan itu ditampilkan langsung di atas '
                                 'kolom skor, sehingga Anda dapat memeriksa '
                                 'langkah pengerjaannya dan mengisi nilai '
                                 'pada satu tampilan yang sama tanpa '
                                 'berpindah halaman.'},
            {'t': 'gambar', 'berkas': '38-guru-nilai-lampiran-jawaban.png'},
            {'t': 'sub', 'isi': 'Memeriksa kuis'},
            {'t': 'langkah', 'isi': [
                'Buka penilaian bertipe kuis dari menu <b>Penilaian</b>.',
                'Pada baris siswa, klik <b>Periksa</b>.',
                'Soal pilihan ganda sudah bernilai otomatis dan ditandai '
                'benar atau salah oleh sistem.',
                'Isi skor untuk setiap soal esai. Lampiran jawaban siswa, '
                'bila ada, ditampilkan di bawah jawaban teksnya.',
                'Klik <b>Simpan Nilai</b>. Nilai kuis siswa adalah jumlah '
                'skor seluruh butir soalnya.',
            ]},
            {'t': 'gambar', 'berkas': '39-guru-pengumpulan-kuis.png'},
            {'t': 'gambar', 'berkas': '40-guru-penilaian-esai.png'},
            {'t': 'catatan', 'isi': 'Selama masih ada butir esai yang belum '
                                    'Anda beri skor, kuis siswa tersebut '
                                    'tetap berstatus menunggu penilaian, '
                                    'walaupun bagian pilihan gandanya sudah '
                                    'dinilai sistem.'},
        ],
    },
    {
        'judul': 'Rekap Nilai dan Cara Nilai Akhir Dihitung',
        'intro': 'Menu <b>Rekap Nilai</b> menampilkan seluruh penilaian satu '
                 'mata pelajaran dalam satu tabel, berurutan menurut '
                 'pertemuan, beserta nilai akhir, predikat, dan status '
                 'ketuntasan setiap siswa. Rekap ini dapat dicetak.',
        'blok': [
            {'t': 'sub', 'isi': 'Membuka rekap nilai'},
            {'t': 'langkah', 'isi': [
                'Klik menu <b>Rekap Nilai</b>.',
                'Pilih mata pelajaran dan kelas yang ingin dilihat.',
            ]},
            {'t': 'gambar', 'berkas': '41-guru-raport-daftar.png'},
            {'t': 'gambar', 'berkas': '42-guru-raport-nilai.png'},
            {'t': 'sub', 'isi': 'Cara nilai akhir dihitung'},
            {'t': 'para', 'isi': 'Nilai akhir <b>bukan</b> rata-rata biasa, '
                                 'melainkan nilai setiap penilaian dikalikan '
                                 'bobotnya, lalu dibagi jumlah seluruh bobot '
                                 'penilaian pada mata pelajaran tersebut:'},
            {'t': 'poin', 'isi': [
                '<b>Nilai akhir = jumlah (skor × bobot) ÷ jumlah '
                'seluruh bobot</b>',
            ]},
            {'t': 'awas', 'isi': 'Penilaian yang <b>belum dinilai dihitung '
                                 'nol</b> pada nilai akhir. Karena itu siswa '
                                 'yang hanya mengikuti sebagian penilaian '
                                 'tidak dapat memperoleh nilai akhir yang '
                                 'tinggi, walaupun nilainya besar pada '
                                 'penilaian yang diikutinya. Nilai akhir '
                                 'baru mencapai angka sebenarnya setelah '
                                 'seluruh penilaian siswa itu selesai '
                                 'dinilai.'},
            {'t': 'para', 'isi': 'Sebagai contoh, sebuah mata pelajaran '
                                 'memiliki empat penilaian dengan bobot yang '
                                 'berjumlah 100%. Seorang siswa tidak '
                                 'mengumpulkan kuisnya, sehingga kuis itu '
                                 'belum dinilai:'},
            {'t': 'tabel',
             'kepala': ['Penilaian', 'Bobot', 'Skor siswa',
                        'Sumbangan ke nilai akhir'],
             'lebar': [150, 70, 110, 158],
             'baris': [
                 ['Tugas', '20%', '80', '80 × 20 = 1600'],
                 ['Kuis', '25%', 'belum dinilai', '0 × 25 = 0'],
                 ['Ujian Tengah Semester', '25%', '90',
                  '90 × 25 = 2250'],
                 ['Ujian Akhir Semester', '30%', '85', '85 × 30 = 2550'],
                 ['<b>Jumlah</b>', '<b>100%</b>', '', '<b>6400</b>'],
             ]},
            {'t': 'para', 'isi': 'Nilai akhir siswa tersebut adalah 6400 '
                                 '÷ 100 = <b>64</b>, sehingga '
                                 'berpredikat <b>D</b> dan berstatus '
                                 '<b>Belum Tuntas</b>. Seandainya kuis itu '
                                 'diabaikan dan hanya penilaian yang sudah '
                                 'dinilai yang diperhitungkan, angkanya '
                                 'menjadi 6400 ÷ 75 = 85,3 — jauh '
                                 'lebih tinggi dan menyesatkan. Itulah '
                                 'sebabnya sistem menghitung penilaian yang '
                                 'belum dinilai sebagai nol.'},
            {'t': 'para', 'isi': 'Angka kecil di bawah nilai akhir pada tabel '
                                 'rekap menunjukkan berapa persen bobot yang '
                                 'sudah dinilai, sehingga Anda dapat '
                                 'membedakan nilai akhir yang sudah final '
                                 'dari yang masih akan berubah.'},
            {'t': 'sub', 'isi': 'Predikat dan ketuntasan'},
            {'t': 'para', 'isi': 'Kriteria Ketuntasan Minimal (KKM) yang '
                                 'digunakan sistem adalah <b>75</b>. Siswa '
                                 'berstatus <b>Tuntas</b> apabila nilai '
                                 'akhirnya 75 atau lebih, dan <b>Belum '
                                 'Tuntas</b> apabila kurang dari itu.'},
            TABEL_PREDIKAT,
            {'t': 'catatan', 'isi': 'Predikat menerangkan mutu capaian, '
                                    'sedangkan status menerangkan tercapai '
                                    'atau tidaknya KKM. Keduanya dapat '
                                    'berbeda: nilai 72 berpredikat '
                                    '<b>C (Cukup)</b> namun berstatus '
                                    '<b>Belum Tuntas</b> karena masih di '
                                    'bawah KKM 75.'},
            {'t': 'sub', 'isi': 'Mencari siswa tertentu'},
            {'t': 'para', 'isi': 'Pada kelas yang jumlah siswanya banyak, '
                                 'gunakan kotak pencarian di atas tabel '
                                 'untuk menyaring siswa menurut nama atau '
                                 'NIS. Rata-rata kelas tetap dihitung dari '
                                 'seluruh siswa, bukan hanya yang sedang '
                                 'tampil, sehingga pembandingnya tidak '
                                 'berubah saat Anda mencari.'},
            {'t': 'gambar', 'berkas': '43-guru-cari-siswa.png'},
        ],
    },
    {
        'judul': 'Jadwal Pelajaran',
        'intro': 'Menu <b>Jadwal Pelajaran</b> menampilkan jadwal mengajar '
                 'Anda sepanjang satu pekan, disusun menurut hari dan jam '
                 'pelajaran, beserta mata pelajaran dan kelasnya.',
        'blok': [
            {'t': 'gambar', 'berkas': '44-guru-jadwal-mengajar.png'},
            {'t': 'catatan', 'isi': 'Jadwal disusun oleh administrator. '
                                    'Sistem menolak penyusunan jadwal yang '
                                    'bentrok, baik bentrok ruang kelas '
                                    'maupun bentrok guru pengajar, sehingga '
                                    'Anda tidak akan dijadwalkan mengajar di '
                                    'dua kelas pada jam yang sama.'},
        ],
    },
    BAB_SANDI,
    {
        'judul': 'Periode Pembelajaran yang Telah Dikunci',
        'intro': 'Administrator dapat mengunci periode pembelajaran yang '
                 'sudah selesai. Periode yang terkunci berubah menjadi '
                 'arsip: seluruh datanya masih dapat dibaca, tetapi tidak '
                 'ada lagi yang dapat diubah.',
        'blok': [
            {'t': 'para', 'isi': 'Pada periode yang terkunci, sistem '
                                 'menampilkan penanda terkunci dan menolak '
                                 'setiap usaha pengubahan. Yang tidak lagi '
                                 'dapat dilakukan antara lain:'},
            {'t': 'poin', 'isi': [
                'Menambah atau mengubah pertemuan dan materi.',
                'Membuat atau mengubah tugas, kuis, dan butir soalnya.',
                'Membuka presensi atau mengubah status kehadiran.',
                'Mengubah nilai yang sudah tersimpan.',
            ]},
            {'t': 'gambar', 'berkas': '64-periode-terkunci-guru.png'},
            {'t': 'gambar', 'berkas': '65-periode-terkunci-pertemuan.png'},
            {'t': 'awas', 'isi': 'Pastikan seluruh penilaian sudah selesai '
                                 'Anda nilai sebelum periode dikunci. '
                                 'Setelah terkunci, nilai tidak dapat lagi '
                                 'diperbaiki tanpa bantuan administrator '
                                 'untuk membuka kuncinya kembali.'},
        ],
    },
    {
        'judul': 'Pertanyaan yang Sering Diajukan',
        'blok': [
            {'t': 'tabel',
             'kepala': ['Pertanyaan', 'Jawaban'],
             'lebar': [195, 293],
             'baris': [
                 ['Saya lupa kata sandi. Apa yang harus saya lakukan?',
                  'Hubungi administrator sekolah untuk menyetel ulang kata '
                  'sandi Anda. Kata sandi yang terlupa tidak dapat '
                  'dipulihkan sendiri dari halaman login.'],
                 ['Mengapa ada kelas yang tidak muncul di menu Kelas yang '
                  'Diajar?',
                  'Penugasan mengajar diatur administrator pada data kelas. '
                  'Mintalah administrator memeriksa penugasan mata pelajaran '
                  'dan guru pengajar pada kelas tersebut.'],
                 ['Mengapa nilai akhir siswa saya terlihat rendah padahal '
                  'nilai ujiannya bagus?',
                  'Penilaian yang belum dinilai dihitung nol. Periksa apakah '
                  'masih ada tugas atau kuis siswa tersebut yang belum Anda '
                  'nilai, lalu selesaikan penilaiannya.'],
                 ['Mengapa halaman Rekap Nilai memberi peringatan tentang '
                  'bobot?',
                  'Jumlah bobot seluruh penilaian pada mata pelajaran itu '
                  'belum mencapai 100%. Lengkapi bobot setiap penilaian '
                  'melalui halaman Kelola Isi pertemuan.'],
                 ['Siswa sudah hadir, tetapi tercatat alpa. Mengapa?',
                  'Keadaan awal setiap siswa adalah alpa, dan kehadiran '
                  'ditandai sendiri oleh siswa lewat tombol Saya Hadir. '
                  'Ubah statusnya secara manual sebelum presensi ditutup.'],
                 ['Berkas saya ditolak saat diunggah.',
                  'Periksa jenis dan ukurannya. Dokumen dan gambar dibatasi '
                  '20 MB, video 100 MB. Jenis berkas yang diterima '
                  'tercantum pada bab Mengisi Materi Pembelajaran.'],
                 ['Bisakah soal berupa gambar saja tanpa teks?',
                  'Bisa. Teks pertanyaan boleh dikosongkan apabila soalnya '
                  'seluruhnya berupa gambar yang dilampirkan.'],
                 ['Saya tidak dapat mengubah apa pun pada sebuah kelas.',
                  'Kemungkinan periode pembelajarannya sudah dikunci '
                  'administrator. Periode terkunci hanya dapat dibaca.'],
             ]},
            {'t': 'catatan', 'isi': 'Apabila masalah Anda tidak tercantum di '
                                    'atas, hubungi administrator Sistem '
                                    'E-Learning SMA Negeri 1 Karau Kuala.'},
        ],
    },
]

# ==========================================================================
# PANDUAN SISWA
# ==========================================================================
BAB_SISWA = [
    bab_kenal('siswa', 'siswa'),
    bab_masuk('siswa', '46-siswa-dashboard.png', 'Dashboard Siswa'),
    {
        'judul': 'Mengenal Halaman Dashboard',
        'intro': 'Dashboard adalah halaman pertama yang terbuka setelah Anda '
                 'masuk. Halaman ini dirancang supaya Anda langsung '
                 'mengetahui dua hal terpenting: pelajaran apa hari ini, dan '
                 'tugas apa yang batas waktunya sudah dekat.',
        'blok': [
            {'t': 'gambar', 'berkas': '46-siswa-dashboard.png'},
            {'t': 'para', 'isi': 'Isi halaman ini dari atas ke bawah:'},
            {'t': 'poin', 'isi': [
                'Sapaan beserta nama dan kelas Anda.',
                'Kartu rekapitulasi: jumlah mata pelajaran, tugas yang belum '
                'dikumpulkan, dan nilai rata-rata Anda.',
                '<b>Jadwal pelajaran hari ini</b>, berisi jam pelajaran, '
                'mata pelajaran, dan guru pengajarnya. Jadwal ini berganti '
                'sendiri mengikuti hari.',
                'Tugas yang batas waktunya segera berakhir, lengkap dengan '
                'sisa waktunya.',
            ]},
            {'t': 'catatan', 'isi': 'Pada layar telepon genggam, daftar menu '
                                    'tidak ditampilkan terus-menerus. '
                                    'Ketuk tombol menu di kiri atas untuk '
                                    'membukanya.'},
        ],
    },
    {
        'judul': 'Kelas Saya',
        'intro': 'Menu <b>Kelas Saya</b> memuat seluruh mata pelajaran di '
                 'kelas Anda pada periode yang sedang berjalan, beserta nama '
                 'guru pengajarnya.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Klik menu <b>Kelas Saya</b>.',
                'Pilih mata pelajaran yang ingin Anda buka.',
                'Sistem menampilkan daftar pertemuan mata pelajaran '
                'tersebut.',
            ]},
            {'t': 'gambar', 'berkas': '47-siswa-kelas-saya.png'},
            {'t': 'gambar', 'berkas': '48-siswa-daftar-pertemuan.png'},
        ],
    },
    {
        'judul': 'Membuka Materi Pembelajaran',
        'intro': 'Materi disusun per pertemuan, berurutan dari pertemuan '
                 'pertama. Dengan begitu Anda dapat belajar runut, dan dapat '
                 'membuka kembali materi pertemuan yang sudah lewat kapan '
                 'saja.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Buka menu <b>Kelas Saya</b>, lalu pilih mata pelajarannya.',
                'Klik pertemuan yang ingin Anda pelajari.',
                'Baca materi yang tersedia. Materi berupa uraian dapat '
                'dibaca langsung di halaman tersebut.',
                'Untuk materi berupa berkas, klik tombol unduh atau '
                '<b>Lihat berkas</b>.',
                'Untuk materi berupa video atau tautan, klik tautannya.',
            ]},
            {'t': 'gambar', 'berkas': '50-siswa-isi-pertemuan.png'},
            {'t': 'catatan', 'isi': 'Pada halaman pertemuan terdapat pula '
                                    'bagian presensi, daftar tugas dan kuis '
                                    'pertemuan itu, serta forum diskusi '
                                    'tempat Anda dapat bertanya kepada guru '
                                    'dengan tombol <b>Kirim Balasan</b>.'},
        ],
    },
    {
        'judul': 'Mengisi Presensi Kehadiran',
        'intro': 'Kehadiran Anda diisi oleh Anda sendiri, bukan oleh guru. '
                 'Setelah guru membuka presensi sebuah pertemuan, tombol '
                 '<b>Saya Hadir</b> muncul di halaman pertemuan tersebut.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Buka pertemuan yang sedang berlangsung melalui menu '
                '<b>Kelas Saya</b>, atau melalui menu <b>Presensi</b>.',
                'Pada bagian presensi, klik tombol <b>Saya Hadir</b>.',
                'Pastikan status Anda berubah menjadi <b>Hadir</b>.',
            ]},
            {'t': 'gambar', 'berkas': '49-siswa-presensi-pertemuan.png'},
            {'t': 'awas', 'isi': 'Keadaan awal setiap siswa adalah '
                                 '<b>Alpa</b>. Apabila Anda hadir tetapi '
                                 'lupa menekan <b>Saya Hadir</b> sebelum '
                                 'guru menutup presensi, kehadiran Anda '
                                 'tercatat alpa dan hanya guru yang dapat '
                                 'memperbaikinya. Biasakan menekan tombol '
                                 'itu di awal pelajaran.'},
            {'t': 'para', 'isi': 'Status <b>Sakit</b> dan <b>Izin</b> hanya '
                                 'dapat diisikan oleh guru. Sampaikan '
                                 'keterangan Anda kepada guru mata pelajaran '
                                 'agar status kehadiran Anda diperbaiki.'},
        ],
    },
    {
        'judul': 'Tugas dan Kuis',
        'intro': 'Menu <b>Tugas &amp; Kuis</b> mengumpulkan seluruh tugas, '
                 'kuis, Ujian Tengah Semester, dan Ujian Akhir Semester dari '
                 'semua mata pelajaran Anda dalam satu daftar, diurutkan '
                 'menurut batas waktunya.',
        'blok': [
            {'t': 'gambar', 'berkas': '51-siswa-tugas.png'},
            {'t': 'para', 'isi': 'Setiap baris menunjukkan judul, mata '
                                 'pelajaran, batas waktu, sisa waktu '
                                 'pengerjaan, serta status pengerjaan Anda. '
                                 'Tombol di sebelah kanan berubah mengikuti '
                                 'status tersebut:'},
            {'t': 'tabel',
             'kepala': ['Tombol', 'Arti'],
             'lebar': [140, 348],
             'baris': [
                 ['Kerjakan', 'Anda belum mengumpulkan pekerjaan ini.'],
                 ['Lihat Jawaban', 'Anda sudah mengumpulkan, tetapi guru '
                                   'belum selesai menilainya.'],
                 ['Lihat Hasil', 'Pekerjaan Anda sudah dinilai guru. '
                                 'Nilainya dapat Anda lihat.'],
             ]},
            {'t': 'para', 'isi': 'Klik <b>Lihat rincian</b> pada sebuah baris '
                                 'untuk membaca petunjuk pengerjaan tanpa '
                                 'membuka halaman pengerjaannya.'},
            {'t': 'gambar', 'berkas': '52-siswa-tugas-rincian.png'},
            {'t': 'awas', 'isi': 'Perhatikan penanda sisa waktu. Pengumpulan '
                                 'yang melewati batas waktu ditandai '
                                 '<b>Telat</b> dan penandaan itu terlihat '
                                 'oleh guru.'},
        ],
    },
    {
        'judul': 'Mengerjakan Kuis',
        'intro': 'Kuis dikerjakan langsung di dalam sistem. Butir soalnya '
                 'dapat berupa pilihan ganda, esai, atau campuran keduanya.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Buka menu <b>Tugas &amp; Kuis</b>.',
                'Pada kuis yang ingin dikerjakan, klik <b>Kerjakan</b>.',
                'Jawablah setiap butir soal. Untuk pilihan ganda, pilih salah '
                'satu pilihan jawaban. Untuk esai, tulis jawaban Anda pada '
                'kolom yang tersedia.',
                'Periksa kembali seluruh jawaban Anda.',
                'Klik <b>Kumpulkan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '60-siswa-kerjakan-kuis.png'},
            {'t': 'sub', 'isi': 'Soal yang memuat gambar'},
            {'t': 'para', 'isi': 'Sebagian soal disertai gambar, misalnya '
                                 'grafik fungsi atau potongan bacaan. '
                                 'Gambarnya ditampilkan langsung di bawah '
                                 'pertanyaan. Pilihan jawaban pun dapat '
                                 'berupa gambar. Soal seperti ini tetap '
                                 'terbaca jelas pada layar telepon genggam.'},
            {'t': 'gambar', 'berkas': '62-siswa-kuis-bergambar.png'},
            {'t': 'sub', 'isi': 'Melampirkan foto pekerjaan pada soal esai'},
            {'t': 'para', 'isi': 'Soal esai yang perlu langkah pengerjaan, '
                                 'misalnya soal matematika, boleh Anda '
                                 'kerjakan di kertas lalu difoto. Pada setiap '
                                 'soal esai tersedia isian <b>Lampiran '
                                 'jawaban (opsional) — foto pekerjaan di '
                                 'kertas atau PDF</b>.'},
            {'t': 'langkah', 'isi': [
                'Kerjakan soal pada kertas dengan tulisan yang jelas.',
                'Foto pekerjaan Anda. Pastikan seluruh tulisan terbaca dan '
                'tidak gelap.',
                'Pada kolom jawaban esai, tulis keterangan singkat, misalnya '
                '"Langkah pengerjaan saya ada pada lampiran foto".',
                'Klik pemilih berkas pada isian lampiran jawaban, lalu pilih '
                'foto tersebut. Berkas yang diterima berupa gambar atau PDF.',
                'Klik <b>Kumpulkan</b>.',
            ]},
            {'t': 'catatan', 'isi': 'Selama batas waktu belum terlewat, Anda '
                                    'dapat mengumpulkan ulang untuk '
                                    'memperbaiki jawaban. Lampiran yang sudah '
                                    'terkirim tetap tersimpan sampai Anda '
                                    'memilih berkas baru untuk '
                                    'menggantikannya.'},
        ],
    },
    {
        'judul': 'Mengerjakan dan Mengumpulkan Tugas',
        'intro': 'Berbeda dengan kuis yang berisi butir soal, tugas '
                 'dikumpulkan sebagai jawaban teks, berkas unggahan, atau '
                 'keduanya sekaligus.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Buka menu <b>Tugas &amp; Kuis</b>.',
                'Pada tugas yang ingin dikerjakan, klik <b>Kerjakan</b>.',
                'Baca petunjuk pengerjaan dari guru.',
                'Tulis jawaban Anda pada kolom <b>Jawaban (teks)</b> apabila '
                'tugas itu perlu dijawab dengan tulisan.',
                'Apabila Anda perlu melampirkan berkas, klik pemilih berkas '
                'pada <b>Lampiran Berkas (opsional)</b> lalu pilih berkas '
                'dari perangkat Anda.',
                'Klik <b>Kumpulkan</b>.',
            ]},
            {'t': 'gambar', 'berkas': '61-siswa-kerjakan-tugas.png'},
            {'t': 'sub', 'isi': 'Berkas yang dapat Anda unggah'},
            TABEL_BERKAS,
            {'t': 'awas', 'isi': 'Berkas yang jenisnya tidak terdaftar atau '
                                 'ukurannya melebihi batas akan ditolak, dan '
                                 'sistem menyebutkan alasannya. Bila foto '
                                 'pekerjaan Anda terlalu besar, perkecil '
                                 'dahulu ukurannya sebelum diunggah.'},
            {'t': 'catatan', 'isi': 'Setelah batas waktu terlewat, tombol '
                                    'pengumpulan tidak lagi tersedia. '
                                    'Kerjakan dan kumpulkan tugas Anda jauh '
                                    'sebelum batas waktunya.'},
        ],
    },
    {
        'judul': 'Melihat Hasil Kuis dan Nilai',
        'intro': 'Hasil pekerjaan Anda dapat dilihat segera setelah guru '
                 'selesai menilainya, tanpa perlu menunggu pembagian raport.',
        'blok': [
            {'t': 'sub', 'isi': 'Hasil pengerjaan kuis'},
            {'t': 'para', 'isi': 'Untuk kuis yang sudah dinilai, klik '
                                 '<b>Lihat Hasil</b> pada menu <b>Tugas '
                                 '&amp; Kuis</b>. Sistem menampilkan jawaban '
                                 'Anda butir demi butir, mana yang benar dan '
                                 'mana yang salah, skor setiap butir, serta '
                                 'catatan dari guru bila ada.'},
            {'t': 'gambar', 'berkas': '53-siswa-hasil-kuis.png'},
            {'t': 'sub', 'isi': 'Rekap nilai seluruh mata pelajaran'},
            {'t': 'para', 'isi': 'Menu <b>Nilai</b> merangkum nilai Anda pada '
                                 'setiap mata pelajaran, beserta rincian '
                                 'setiap penilaian dan bobotnya.'},
            {'t': 'gambar', 'berkas': '54-siswa-nilai.png'},
            {'t': 'sub', 'isi': 'Nilai periode sebelumnya'},
            {'t': 'para', 'isi': 'Nilai dari periode pembelajaran yang sudah '
                                 'lewat tetap tersimpan sebagai arsip dan '
                                 'masih dapat Anda buka.'},
            {'t': 'gambar', 'berkas': '55-siswa-nilai-arsip.png'},
        ],
    },
    {
        'judul': 'Raport Sementara',
        'intro': 'Menu <b>Raport Sementara</b> menyajikan nilai akhir Anda '
                 'pada seluruh mata pelajaran, beserta predikat, status '
                 'ketuntasan, dan peringkat Anda di kelas. Halaman ini dapat '
                 'dicetak dengan tombol <b>Cetak</b>.',
        'blok': [
            {'t': 'gambar', 'berkas': '56-siswa-raport.png'},
            {'t': 'sub', 'isi': 'Cara nilai akhir dihitung'},
            {'t': 'para', 'isi': 'Nilai akhir <b>bukan</b> rata-rata biasa. '
                                 'Nilai setiap penilaian dikalikan dahulu '
                                 'dengan bobotnya, lalu dibagi jumlah '
                                 'seluruh bobot penilaian pada mata '
                                 'pelajaran itu. Dengan begitu Ujian Akhir '
                                 'Semester yang berbobot 30% berpengaruh '
                                 'lebih besar daripada sebuah tugas yang '
                                 'berbobot 10%.'},
            {'t': 'awas', 'isi': 'Penilaian yang <b>belum dinilai dihitung '
                                 'nol</b>. Tugas atau kuis yang tidak Anda '
                                 'kumpulkan karena itu menurunkan nilai '
                                 'akhir Anda, walaupun nilai ujian Anda '
                                 'bagus. Inilah sebabnya setiap tugas perlu '
                                 'dikumpulkan, sekecil apa pun bobotnya.'},
            {'t': 'sub', 'isi': 'Predikat dan ketuntasan'},
            {'t': 'para', 'isi': 'Kriteria Ketuntasan Minimal (KKM) yang '
                                 'digunakan adalah <b>75</b>. Anda berstatus '
                                 '<b>Tuntas</b> pada sebuah mata pelajaran '
                                 'apabila nilai akhirnya 75 atau lebih.'},
            TABEL_PREDIKAT,
            {'t': 'catatan', 'isi': 'Predikat menerangkan mutu capaian, '
                                    'sedangkan status menerangkan tercapai '
                                    'atau tidaknya KKM. Nilai 72 berpredikat '
                                    '<b>C (Cukup)</b> tetapi berstatus '
                                    '<b>Belum Tuntas</b>, karena masih di '
                                    'bawah KKM 75.'},
        ],
    },
    {
        'judul': 'Jadwal Pelajaran dan Rekap Kehadiran',
        'intro': 'Dua menu berikut membantu Anda memantau kegiatan belajar '
                 'Anda sepanjang periode.',
        'blok': [
            {'t': 'sub', 'isi': 'Jadwal pelajaran kelas'},
            {'t': 'para', 'isi': 'Menu <b>Jadwal Pelajaran</b> menampilkan '
                                 'jadwal kelas Anda sepanjang satu pekan, '
                                 'disusun menurut hari dan jam pelajaran, '
                                 'beserta guru pengajarnya.'},
            {'t': 'gambar', 'berkas': '57-siswa-jadwal-kelas.png'},
            {'t': 'sub', 'isi': 'Rekap kehadiran'},
            {'t': 'para', 'isi': 'Menu <b>Presensi</b> menampilkan rekap '
                                 'kehadiran Anda pada setiap mata pelajaran, '
                                 'beserta persentase kehadiran sepanjang '
                                 'periode. Periksa halaman ini secara '
                                 'berkala, dan sampaikan kepada guru mata '
                                 'pelajaran apabila ada catatan kehadiran '
                                 'yang menurut Anda keliru.'},
            {'t': 'gambar', 'berkas': '59-siswa-rekap-presensi.png'},
        ],
    },
    BAB_SANDI,
    {
        'judul': 'Membuka Sistem dari Telepon Genggam',
        'intro': 'Sistem dapat dibuka dari telepon genggam melalui peramban, '
                 'tanpa memasang aplikasi apa pun. Tata letaknya menyesuaikan '
                 'diri dengan lebar layar, sehingga seluruh menu dan tombol '
                 'tetap dapat digunakan.',
        'blok': [
            {'t': 'langkah', 'isi': [
                'Buka peramban pada telepon genggam Anda.',
                f'Kunjungi <b>{ALAMAT}</b>.',
                'Masuk dengan akun Anda seperti biasa.',
                'Ketuk tombol menu di kiri atas untuk membuka daftar menu.',
            ]},
            {'t': 'gambar', 'berkas': '66-tampilan-mobile.png'},
            {'t': 'catatan', 'isi': 'Mengerjakan kuis dan mengunggah foto '
                                    'pekerjaan dapat dilakukan langsung dari '
                                    'telepon genggam, sehingga Anda dapat '
                                    'memotret pekerjaan di kertas lalu '
                                    'mengunggahnya tanpa berpindah '
                                    'perangkat.'},
        ],
    },
    {
        'judul': 'Pertanyaan yang Sering Diajukan',
        'blok': [
            {'t': 'tabel',
             'kepala': ['Pertanyaan', 'Jawaban'],
             'lebar': [195, 293],
             'baris': [
                 ['Saya lupa kata sandi. Apa yang harus saya lakukan?',
                  'Hubungi administrator sekolah atau wali kelas Anda untuk '
                  'disetel ulang. Kata sandi yang terlupa tidak dapat '
                  'dipulihkan sendiri dari halaman login.'],
                 ['Saya hadir, tetapi kehadiran saya tercatat alpa.',
                  'Kehadiran ditandai sendiri oleh siswa lewat tombol Saya '
                  'Hadir, dan keadaan awalnya adalah alpa. Sampaikan kepada '
                  'guru mata pelajaran agar status Anda diperbaiki.'],
                 ['Tombol Saya Hadir tidak muncul.',
                  'Guru belum membuka presensi pertemuan itu, atau presensi '
                  'sudah ditutup. Tanyakan kepada guru mata pelajaran.'],
                 ['Mengapa nilai akhir saya rendah padahal nilai ujian saya '
                  'bagus?',
                  'Penilaian yang belum dinilai dihitung nol. Tugas atau '
                  'kuis yang tidak Anda kumpulkan menurunkan nilai akhir '
                  'Anda. Periksa menu Tugas &amp; Kuis, apakah masih ada '
                  'yang belum dikumpulkan.'],
                 ['Saya sudah mengumpulkan, tetapi nilainya belum muncul.',
                  'Jawaban esai dan tugas dinilai guru, tidak otomatis. '
                  'Statusnya masih menunggu penilaian sampai guru selesai '
                  'memeriksanya.'],
                 ['Bisakah saya mengumpulkan ulang untuk memperbaiki '
                  'jawaban?',
                  'Bisa, selama batas waktunya belum terlewat. Lampiran yang '
                  'sudah terkirim tetap tersimpan sampai Anda memilih berkas '
                  'baru untuk menggantikannya.'],
                 ['Tombol Kumpulkan sudah tidak ada.',
                  'Batas waktu pengumpulan sudah terlewat. Hubungi guru mata '
                  'pelajaran yang bersangkutan.'],
                 ['Berkas saya ditolak saat diunggah.',
                  'Periksa jenis dan ukurannya. Dokumen dan gambar dibatasi '
                  '20 MB. Untuk foto pekerjaan, perkecil dahulu ukuran '
                  'fotonya bila perlu.'],
                 ['Bisakah saya membuka materi pertemuan yang sudah lewat?',
                  'Bisa. Seluruh materi tetap tersedia dan dapat dibuka '
                  'kembali kapan saja melalui menu Kelas Saya.'],
             ]},
            {'t': 'catatan', 'isi': 'Apabila masalah Anda tidak tercantum di '
                                    'atas, tanyakan kepada guru mata '
                                    'pelajaran, wali kelas, atau '
                                    'administrator sekolah.'},
        ],
    },
]

PANDUAN = {
    'guru': {
        'berkas': 'panduan-penggunaan-guru.pdf',
        'peran': 'GURU',
        'judul': 'Panduan Penggunaan Sistem E-Learning',
        'judul_kepala': 'Panduan Penggunaan — Guru',
        'ringkas': 'Panduan langkah demi langkah bagi guru: menyusun '
                   'pertemuan dan materi, membuat tugas dan kuis, mengelola '
                   'presensi, menilai pekerjaan siswa, serta membaca rekap '
                   'nilai.',
        'bab': BAB_GURU,
    },
    'siswa': {
        'berkas': 'panduan-penggunaan-siswa.pdf',
        'peran': 'SISWA',
        'judul': 'Panduan Penggunaan Sistem E-Learning',
        'judul_kepala': 'Panduan Penggunaan — Siswa',
        'ringkas': 'Panduan langkah demi langkah bagi siswa: membuka materi, '
                   'mengisi presensi, mengerjakan tugas dan kuis, '
                   'melampirkan foto pekerjaan, serta melihat nilai dan '
                   'raport sementara.',
        'bab': BAB_SISWA,
    },
}
