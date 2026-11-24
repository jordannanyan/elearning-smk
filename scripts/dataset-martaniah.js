/* =====================================================================
 * Dataset pembelajaran Bahasa Indonesia — Martaniah, S.Pd
 * Kelas XI A, periode 2026/1 (Semester Ganjil 2025/2026)
 * ---------------------------------------------------------------------
 * Mengisi satu kelas mata pelajaran secara utuh pada periode yang sudah
 * lewat, dengan susunan penilaian berbobot:
 *
 *     Ulangan Akhir Semester 50%   (satu ujian pada akhir semester)
 *     Ujian Tengah Semester  25%
 *     Latihan                25%   (20 latihan mingguan @ 1,25%)
 *     --------------------------------------------------------- +
 *     Jumlah bobot          100%
 *
 * Latihan diberikan sekali seminggu, satu pada setiap pertemuan.
 * Seluruh siswa kelas tersebut mengumpulkan dan dinilai pada setiap
 * penilaian, sehingga tidak ada penilaian yang kosong. Hal ini penting
 * karena sistem menghitung penilaian yang belum dinilai sebagai nol.
 *
 * Ulangan Akhir Semester dan UTS berupa butir soal yang dijawab di dalam
 * sistem, sehingga nilainya terbentuk dari jawaban siswa, persis seperti
 * bila dikerjakan melalui antarmuka. Latihan berupa pengumpulan jawaban
 * teks yang dinilai guru.
 *
 * Skor setiap siswa dibangkitkan dari pembangkit acak bertaburan tetap
 * (deterministik), sehingga menjalankan ulang skrip ini menghasilkan
 * angka yang sama persis.
 *
 * Jalankan : node scripts/dataset-martaniah.js
 * Sifat    : idempoten — data lama pada kelas mata pelajaran yang sama
 *            dihapus lebih dahulu, lalu disusun ulang.
 * ===================================================================== */
const path = require('path');

const BACKEND_MODULES = path.join(__dirname, '..', 'backend', 'node_modules');
require(path.join(BACKEND_MODULES, 'dotenv'))
  .config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mysql = require(path.join(BACKEND_MODULES, 'mysql2', 'promise'));

// ---------------------------------------------------------------------
// Sasaran pengisian
// ---------------------------------------------------------------------
const GURU = 'Martaniah';
const MAPEL = 'BAHASA INDONESIA';
const KELAS = 'XI A';
const PERIODE = '2026/1';

const MULAI = '2025-07-14';        // Senin pertama semester ganjil
const BOBOT_LATIHAN = 1.25;        // 20 latihan mingguan -> 25%
const BOBOT_UTS = 25;              // 1 UTS              -> 25%
const BOBOT_ULANGAN = 50;          // 1 Ulangan Akhir    -> 50%

// ---------------------------------------------------------------------
// Dua puluh pertemuan mingguan beserta materi dan latihannya.
// Pokok bahasan mengikuti Bahasa Indonesia kelas XI semester ganjil.
// ---------------------------------------------------------------------
const PERTEMUAN = [
  {
    judul: 'Teks Prosedur: Struktur dan Kaidah Kebahasaan',
    materi: 'Teks prosedur memuat langkah-langkah yang harus ditempuh untuk '
      + 'mencapai suatu tujuan. Strukturnya terdiri atas tujuan, langkah-langkah, '
      + 'dan penegasan ulang. Kaidah kebahasaannya ditandai kalimat imperatif, '
      + 'konjungsi temporal, dan kata kerja material.',
    latihan: 'Menandai Struktur Teks Prosedur',
    tugas: 'Bacalah teks prosedur "Cara Membuat Pupuk Kompos" pada buku paket '
      + 'halaman 12. Tuliskan bagian tujuan, langkah-langkah, dan penegasan '
      + 'ulangnya, lalu kutip dua kalimat imperatif yang Anda temukan.',
  },
  {
    judul: 'Menyusun Teks Prosedur',
    materi: 'Penyusunan teks prosedur dimulai dari menentukan topik, menyusun '
      + 'kerangka langkah secara berurutan, lalu mengembangkannya dengan kalimat '
      + 'imperatif yang lugas. Urutan langkah tidak boleh tertukar karena akan '
      + 'mengubah hasil akhirnya.',
    latihan: 'Menulis Teks Prosedur Sederhana',
    tugas: 'Susunlah sebuah teks prosedur sederhana mengenai kegiatan yang '
      + 'Anda kuasai, minimal tujuh langkah. Sertakan bagian tujuan dan '
      + 'penegasan ulang.',
  },
  {
    judul: 'Teks Eksplanasi: Struktur dan Ciri Kebahasaan',
    materi: 'Teks eksplanasi menjelaskan proses terjadinya suatu fenomena alam '
      + 'maupun sosial. Strukturnya berupa pernyataan umum, deretan penjelas, '
      + 'dan interpretasi. Sifatnya faktual dan banyak memakai konjungsi '
      + 'kausalitas serta kronologis.',
    latihan: 'Mengidentifikasi Struktur Teks Eksplanasi',
    tugas: 'Carilah satu teks eksplanasi dari surat kabar atau laman berita. '
      + 'Tentukan pernyataan umum, deretan penjelas, dan interpretasinya, lalu '
      + 'daftarkan lima konjungsi kausalitas yang digunakan.',
  },
  {
    judul: 'Menganalisis Hubungan Kausalitas dalam Teks Eksplanasi',
    materi: 'Hubungan sebab-akibat merupakan inti teks eksplanasi. Konjungsi '
      + 'seperti karena, sebab, sehingga, dan oleh sebab itu menautkan peristiwa '
      + 'satu dengan peristiwa berikutnya sehingga pembaca memahami urutan '
      + 'terjadinya fenomena.',
    latihan: 'Memetakan Sebab dan Akibat',
    tugas: 'Buatlah bagan sebab-akibat dari teks eksplanasi berjudul '
      + '"Terjadinya Banjir Rob". Tuliskan minimal empat pasangan sebab dan '
      + 'akibat dalam bentuk uraian.',
  },
  {
    judul: 'Menyusun Teks Eksplanasi',
    materi: 'Menyusun teks eksplanasi menuntut penguasaan fakta. Penulis '
      + 'mengumpulkan data terlebih dahulu, menyusun kerangka berdasarkan urutan '
      + 'proses, lalu mengembangkannya menjadi paragraf yang padu.',
    latihan: 'Menulis Teks Eksplanasi Fenomena Alam',
    tugas: 'Tulislah teks eksplanasi mengenai satu fenomena alam di daerah '
      + 'Anda, minimal tiga paragraf, lengkap dengan ketiga bagian strukturnya.',
  },
  {
    judul: 'Teks Ceramah: Unsur dan Struktur',
    materi: 'Ceramah adalah penyampaian pengetahuan atau nasihat di depan umum. '
      + 'Unsurnya meliputi penceramah, pendengar, materi, dan metode. Strukturnya '
      + 'terdiri atas pendahuluan, isi, dan penutup.',
    latihan: 'Menganalisis Struktur Teks Ceramah',
    tugas: 'Simaklah sebuah rekaman ceramah, lalu tuliskan pendahuluan, isi, '
      + 'dan penutupnya. Catat pula sapaan yang digunakan penceramah kepada '
      + 'pendengarnya.',
  },
  {
    judul: 'Menyusun Teks Ceramah',
    materi: 'Naskah ceramah disusun dengan memperhatikan siapa pendengarnya. '
      + 'Pendahuluan berisi salam dan pengantar, isi memuat uraian beserta '
      + 'contoh, dan penutup berisi simpulan serta ajakan.',
    latihan: 'Menulis Naskah Ceramah Singkat',
    tugas: 'Susunlah naskah ceramah singkat bertema kedisiplinan di sekolah '
      + 'untuk disampaikan dalam waktu lima menit.',
  },
  {
    judul: 'Cerita Pendek: Unsur Intrinsik',
    materi: 'Unsur intrinsik cerpen meliputi tema, tokoh dan penokohan, alur, '
      + 'latar, sudut pandang, gaya bahasa, dan amanat. Seluruh unsur tersebut '
      + 'membangun cerita dari dalam.',
    latihan: 'Mengidentifikasi Unsur Intrinsik Cerpen',
    tugas: 'Bacalah cerpen "Robohnya Surau Kami" karya A.A. Navis. Tentukan '
      + 'tema, tokoh utama, latar, sudut pandang, dan amanatnya disertai '
      + 'kutipan pendukung.',
  },
  {
    judul: 'Nilai-Nilai Kehidupan dalam Cerita Pendek',
    materi: 'Cerpen memuat nilai religius, sosial, budaya, moral, dan estetika. '
      + 'Nilai tersebut tidak selalu dinyatakan langsung, melainkan tersirat '
      + 'melalui perilaku tokoh dan jalan cerita.',
    latihan: 'Menemukan Nilai dalam Cerpen',
    tugas: 'Dari cerpen yang dibahas pada pertemuan lalu, temukan tiga nilai '
      + 'kehidupan yang terkandung di dalamnya. Sertakan kutipan dan '
      + 'penjelasan keterkaitannya.',
  },
  {
    judul: 'Menulis Cerita Pendek Berdasarkan Pengalaman',
    materi: 'Pengalaman pribadi dapat menjadi bahan cerpen apabila diolah '
      + 'dengan sudut pandang, konflik, dan penokohan yang jelas. Konflik '
      + 'merupakan penggerak utama cerita.',
    latihan: 'Menulis Cerpen Pengalaman Pribadi',
    tugas: 'Tulislah sebuah cerpen berdasarkan pengalaman pribadi Anda, '
      + 'minimal lima paragraf, dengan konflik dan penyelesaian yang jelas.',
  },
  {
    judul: 'Buku Pengayaan Nonfiksi: Butir-Butir Penting',
    materi: 'Buku pengayaan nonfiksi memuat fakta dan pengetahuan. Pembaca '
      + 'mencatat butir penting melalui identitas buku, pokok pikiran tiap bab, '
      + 'dan simpulan isinya.',
    latihan: 'Mencatat Butir Penting Buku Nonfiksi',
    tugas: 'Pilihlah satu buku pengayaan nonfiksi di perpustakaan. Catat '
      + 'identitas bukunya dan tuliskan pokok pikiran dari tiga bab pertama.',
  },
  {
    judul: 'Menyusun Laporan Hasil Membaca Buku',
    materi: 'Laporan hasil membaca memuat identitas buku, ringkasan isi, '
      + 'penilaian pribadi, serta manfaat yang diperoleh pembaca. Penulisannya '
      + 'memakai bahasa baku dan objektif.',
    latihan: 'Menulis Laporan Hasil Membaca',
    tugas: 'Susunlah laporan hasil membaca buku yang Anda pilih pada pertemuan '
      + 'sebelumnya, memuat identitas, ringkasan, penilaian, dan manfaatnya.',
  },
  {
    judul: 'Proposal: Informasi Penting dan Sistematika',
    materi: 'Proposal adalah rencana kegiatan yang disusun sistematis untuk '
      + 'memperoleh persetujuan. Sistematikanya meliputi latar belakang, tujuan, '
      + 'bentuk kegiatan, sasaran, jadwal, anggaran, dan penutup.',
    latihan: 'Menelaah Sistematika Proposal',
    tugas: 'Telaahlah contoh proposal kegiatan Bulan Bahasa pada buku paket. '
      + 'Tuliskan bagian-bagiannya dan jelaskan fungsi masing-masing bagian.',
  },
  {
    judul: 'Menyusun Proposal Kegiatan',
    materi: 'Penyusunan proposal diawali penentuan kegiatan dan tujuannya, '
      + 'dilanjutkan perincian pelaksanaan dan anggaran. Bahasanya baku, lugas, '
      + 'dan tidak bermakna ganda.',
    latihan: 'Menulis Proposal Kegiatan Kelas',
    tugas: 'Susunlah proposal kegiatan kelas, misalnya bakti sosial atau '
      + 'pentas seni, lengkap dengan latar belakang, tujuan, jadwal, dan '
      + 'rancangan anggaran.',
  },
  {
    judul: 'Karya Ilmiah: Struktur dan Kebahasaan',
    materi: 'Karya ilmiah disusun berdasarkan data dan kajian. Strukturnya '
      + 'meliputi pendahuluan, pembahasan, dan simpulan, serta dilengkapi daftar '
      + 'pustaka. Bahasanya objektif, baku, dan menghindari pendapat pribadi '
      + 'tanpa dasar.',
    latihan: 'Membedakan Kalimat Objektif dan Subjektif',
    tugas: 'Tuliskan sepuluh kalimat, lima bersifat objektif dan lima bersifat '
      + 'subjektif. Jelaskan penanda yang membedakan keduanya.',
  },
  {
    judul: 'Menulis Karya Ilmiah Sederhana',
    materi: 'Karya ilmiah sederhana dimulai dari rumusan masalah yang jelas, '
      + 'dilanjutkan pengumpulan data, pembahasan, lalu simpulan. Setiap rujukan '
      + 'wajib dicantumkan dalam daftar pustaka.',
    latihan: 'Menyusun Kerangka Karya Ilmiah',
    tugas: 'Susunlah kerangka karya ilmiah sederhana bertema lingkungan '
      + 'sekolah, memuat rumusan masalah, tujuan, dan garis besar pembahasan.',
  },
  {
    judul: 'Resensi: Identitas dan Isi',
    materi: 'Resensi adalah ulasan dan penilaian terhadap sebuah karya. '
      + 'Bagiannya meliputi identitas karya, sinopsis, kepengarangan, kelebihan '
      + 'dan kekurangan, serta simpulan bagi calon pembaca.',
    latihan: 'Menelaah Bagian Resensi',
    tugas: 'Carilah satu resensi buku di surat kabar atau laman daring. '
      + 'Tunjukkan bagian identitas, sinopsis, kelebihan, kekurangan, dan '
      + 'simpulannya.',
  },
  {
    judul: 'Menyusun Resensi Buku',
    materi: 'Penulis resensi membaca karya secara utuh, mencatat keunggulan '
      + 'dan kelemahannya, lalu menyampaikan penilaian yang berimbang dan '
      + 'beralasan, bukan sekadar memuji atau mencela.',
    latihan: 'Menulis Resensi Buku Pilihan',
    tugas: 'Tulislah resensi atas buku yang telah Anda baca, memuat identitas, '
      + 'sinopsis, kelebihan, kekurangan, dan simpulan.',
  },
  {
    judul: 'Drama: Unsur dan Alur',
    materi: 'Drama ditulis untuk dipentaskan. Unsurnya meliputi tokoh, dialog, '
      + 'latar, dan alur. Naskah drama mengenal wawancang berupa dialog tokoh '
      + 'dan kramagung berupa petunjuk laku.',
    latihan: 'Mengidentifikasi Unsur Naskah Drama',
    tugas: 'Bacalah satu naskah drama pendek. Tentukan tokoh, latar, konflik, '
      + 'dan alurnya, lalu kutip satu wawancang dan satu kramagung.',
  },
  {
    judul: 'Mementaskan dan Menganalisis Naskah Drama',
    materi: 'Pementasan drama menuntut penghayatan tokoh, penguasaan dialog, '
      + 'serta dukungan tata panggung, busana, dan pencahayaan. Analisis '
      + 'pementasan menilai kesesuaian penampilan dengan naskahnya.',
    latihan: 'Menganalisis Pementasan Drama',
    tugas: 'Setelah pementasan kelompok, tulislah analisis singkat mengenai '
      + 'kesesuaian pemeranan, dialog, dan tata panggung dengan naskah aslinya.',
  },
];

// ---------------------------------------------------------------------
// Bank soal, dikelompokkan menurut pokok bahasan.
// Setiap entri: [pertanyaan, A, B, C, D, kunci]
//
// Empat bank pokok bahasan di bawah ini digabungkan menjadi butir soal
// Ulangan Akhir Semester, karena ulangan akhir menguji seluruh materi
// satu semester. Bank UTS terpisah karena hanya mencakup pertemuan 1
// sampai 10.
// ---------------------------------------------------------------------
const BANK_PROSEDUR_EKSPLANASI = [
  ['Teks yang berisi langkah-langkah untuk melakukan atau membuat sesuatu disebut teks ...',
    'prosedur', 'eksplanasi', 'ceramah', 'resensi', 'A'],
  ['Struktur teks prosedur yang tepat adalah ...',
    'tujuan, langkah-langkah, penegasan ulang',
    'orientasi, komplikasi, resolusi',
    'pernyataan umum, deretan penjelas, interpretasi',
    'identitas, sinopsis, penilaian', 'A'],
  ['Kalimat "Panaskan minyak dalam wajan hingga mendidih." termasuk kalimat ...',
    'imperatif', 'deklaratif', 'interogatif', 'eksklamatif', 'A'],
  ['Konjungsi yang menyatakan urutan waktu dalam teks prosedur adalah ...',
    'kemudian', 'tetapi', 'karena', 'meskipun', 'A'],
  ['Tujuan utama teks eksplanasi adalah ...',
    'menjelaskan proses terjadinya suatu fenomena',
    'membujuk pembaca agar mengikuti pendapat penulis',
    'menceritakan pengalaman pribadi penulis',
    'menilai kelebihan dan kekurangan sebuah karya', 'A'],
  ['Struktur teks eksplanasi adalah ...',
    'pernyataan umum, deretan penjelas, interpretasi',
    'tujuan, langkah-langkah, penegasan ulang',
    'abstrak, orientasi, krisis, reaksi, koda',
    'pembuka, isi, penutup', 'A'],
  ['Kelompok konjungsi kausalitas yang tepat adalah ...',
    'sebab, karena, sehingga', 'lalu, kemudian, setelah itu',
    'atau, dan, serta', 'jika, apabila, andaikan', 'A'],
  ['Kalimat berikut yang menggunakan konjungsi kronologis adalah ...',
    'Setelah itu, air hujan meresap ke dalam tanah.',
    'Banjir terjadi karena saluran air tersumbat.',
    'Banjir sangat merugikan warga sekitar.',
    'Marilah kita menjaga kebersihan sungai.', 'A'],
  ['Kalimat "Gempa bumi terjadi akibat pergeseran lempeng bumi." merupakan bagian ...',
    'deretan penjelas', 'interpretasi', 'tujuan', 'penegasan ulang', 'A'],
  ['Perbedaan pokok teks prosedur dan teks eksplanasi terletak pada ...',
    'tujuan penulisannya', 'jumlah paragrafnya',
    'penggunaan huruf kapitalnya', 'panjang kalimatnya', 'A'],
];

const BANK_CERAMAH_CERPEN = [
  ['Ceramah adalah ...',
    'penyampaian pengetahuan atau nasihat di depan umum',
    'percakapan dua orang mengenai suatu masalah',
    'tulisan ilmiah hasil penelitian lapangan',
    'laporan tertulis mengenai sebuah kegiatan', 'A'],
  ['Struktur teks ceramah terdiri atas ...',
    'pendahuluan, isi, penutup', 'orientasi, komplikasi, resolusi',
    'identitas, sinopsis, penilaian', 'tujuan, langkah, penegasan ulang', 'A'],
  ['Sapaan yang lazim digunakan penceramah kepada pendengarnya adalah ...',
    'hadirin', 'dia', 'mereka', 'beliau', 'A'],
  ['Unsur intrinsik cerpen yang berkaitan dengan tempat, waktu, dan suasana adalah ...',
    'latar', 'tema', 'amanat', 'sudut pandang', 'A'],
  ['Pesan moral yang hendak disampaikan pengarang melalui cerita disebut ...',
    'amanat', 'alur', 'tokoh', 'gaya bahasa', 'A'],
  ['Sudut pandang yang menempatkan "aku" sebagai tokoh utama disebut ...',
    'orang pertama pelaku utama', 'orang pertama pelaku sampingan',
    'orang ketiga serba tahu', 'orang ketiga terbatas', 'A'],
  ['Rangkaian peristiwa yang membangun jalan cerita disebut ...',
    'alur', 'latar', 'tema', 'penokohan', 'A'],
  ['Nilai yang berkaitan dengan hubungan manusia dengan Tuhan disebut nilai ...',
    'religius', 'sosial', 'budaya', 'estetika', 'A'],
  ['Buku pengayaan nonfiksi berisi ...',
    'fakta dan pengetahuan', 'khayalan pengarang',
    'kumpulan puisi', 'naskah drama', 'A'],
  ['Langkah pertama menyusun laporan hasil membaca buku adalah ...',
    'mencatat identitas buku', 'menilai sampul buku',
    'menghafal seluruh isi buku', 'menyalin seluruh isi buku', 'A'],
];

const BANK_PROPOSAL_ILMIAH = [
  ['Proposal adalah ...',
    'rencana kegiatan yang disusun secara sistematis',
    'laporan hasil kegiatan yang telah dilaksanakan',
    'catatan harian pelaksanaan kegiatan',
    'ringkasan isi sebuah buku', 'A'],
  ['Bagian proposal yang memuat alasan kegiatan perlu dilaksanakan adalah ...',
    'latar belakang', 'anggaran', 'susunan panitia', 'penutup', 'A'],
  ['Berikut ini yang bukan merupakan bagian proposal kegiatan adalah ...',
    'sinopsis', 'tujuan', 'jadwal kegiatan', 'anggaran', 'A'],
  ['Bahasa yang digunakan dalam proposal hendaknya ...',
    'baku, jelas, dan objektif', 'puitis dan penuh kiasan',
    'santai seperti percakapan sehari-hari', 'bermakna ganda agar luwes', 'A'],
  ['Karya ilmiah adalah tulisan yang disusun berdasarkan ...',
    'data dan kajian ilmiah', 'khayalan penulis',
    'curahan perasaan penulis', 'dialog antartokoh', 'A'],
  ['Rumusan masalah pada karya ilmiah terdapat pada bagian ...',
    'pendahuluan', 'metode penelitian', 'hasil pembahasan', 'simpulan', 'A'],
  ['Daftar pustaka berfungsi untuk ...',
    'mencantumkan sumber rujukan yang digunakan',
    'menambah jumlah halaman tulisan',
    'memperindah tampilan karya ilmiah',
    'menyimpulkan isi pembahasan', 'A'],
  ['Kalimat berikut yang bersifat objektif adalah ...',
    'Berdasarkan hasil survei, 70% siswa gemar membaca.',
    'Menurut saya, membaca itu paling menyenangkan.',
    'Pokoknya membaca itu wajib bagi semua orang.',
    'Buku itu sangat luar biasa sekali bagusnya.', 'A'],
  ['Penulisan kata serapan yang baku adalah ...',
    'analisis', 'analisa', 'analysis', 'analisys', 'A'],
  ['Sistematika karya ilmiah yang benar adalah ...',
    'pendahuluan, pembahasan, simpulan',
    'simpulan, pendahuluan, pembahasan',
    'pembahasan, pendahuluan, simpulan',
    'simpulan, pembahasan, pendahuluan', 'A'],
];

const BANK_RESENSI_DRAMA = [
  ['Resensi adalah ...',
    'ulasan dan penilaian terhadap sebuah karya',
    'ringkasan isi karya tanpa disertai penilaian',
    'daftar isi yang terdapat pada sebuah buku',
    'riwayat hidup penulis sebuah buku', 'A'],
  ['Bagian resensi yang memuat judul, penulis, penerbit, dan tahun terbit disebut ...',
    'identitas buku', 'sinopsis', 'kelebihan buku', 'simpulan', 'A'],
  ['Tujuan penulisan resensi adalah ...',
    'memberi pertimbangan kepada calon pembaca',
    'memaksa pembaca membeli buku tersebut',
    'menyalin isi buku secara lengkap',
    'menjatuhkan nama penulis buku', 'A'],
  ['Bagian resensi yang memaparkan ringkasan isi karya disebut ...',
    'sinopsis', 'identitas', 'kepengarangan', 'penilaian', 'A'],
  ['Drama merupakan karya sastra yang ditulis untuk ...',
    'dipentaskan', 'dinyanyikan', 'dibaca dalam hati', 'dihafalkan saja', 'A'],
  ['Percakapan antartokoh dalam naskah drama disebut ...',
    'dialog', 'prolog', 'epilog', 'sinopsis', 'A'],
  ['Petunjuk laku atau gerak tokoh dalam naskah drama disebut ...',
    'kramagung', 'wawancang', 'prolog', 'epilog', 'A'],
  ['Bagian awal drama yang memperkenalkan tokoh dan situasi disebut ...',
    'orientasi', 'klimaks', 'resolusi', 'epilog', 'A'],
  ['Konflik dalam drama mencapai puncaknya pada tahap ...',
    'klimaks', 'orientasi', 'eksposisi', 'resolusi', 'A'],
  ['Penataan panggung, busana, dan tata cahaya termasuk ...',
    'unsur pementasan drama', 'unsur intrinsik naskah',
    'tema drama', 'amanat drama', 'A'],
];

const UTS_PG = [
  ['Tujuan teks prosedur adalah ...',
    'memandu pembaca melakukan sesuatu secara berurutan',
    'menjelaskan sebab terjadinya suatu peristiwa alam',
    'menilai kelebihan dan kekurangan sebuah karya',
    'menghibur pembaca melalui jalinan cerita', 'A'],
  ['Kalimat imperatif pada teks prosedur ditandai dengan ...',
    'penggunaan kata kerja perintah', 'penggunaan tanda tanya',
    'penggunaan kata sifat berlebihan', 'penggunaan kata ganti orang ketiga', 'A'],
  ['Struktur teks eksplanasi diawali dengan ...',
    'pernyataan umum', 'interpretasi', 'deretan penjelas', 'penegasan ulang', 'A'],
  ['Konjungsi "oleh sebab itu" menyatakan hubungan ...',
    'kausalitas', 'pertentangan', 'penambahan', 'pemilihan', 'A'],
  ['Teks eksplanasi bersifat ...',
    'faktual', 'fiktif', 'persuasif', 'imajinatif', 'A'],
  ['Ceramah termasuk bentuk komunikasi ...',
    'satu arah', 'dua arah', 'lintas budaya', 'nonverbal', 'A'],
  ['Bagian penutup ceramah umumnya berisi ...',
    'simpulan dan ajakan', 'salam pembuka',
    'pengenalan penceramah', 'daftar pustaka', 'A'],
  ['Kalimat pembuka ceramah yang tepat adalah ...',
    'Hadirin yang saya hormati, puji syukur kita panjatkan ke hadirat Tuhan.',
    'Demikian yang dapat saya sampaikan, terima kasih.',
    'Jadi, kesimpulannya adalah kita harus disiplin.',
    'Sekian dan sampai jumpa pada kesempatan berikutnya.', 'A'],
  ['Salah satu ciri cerita pendek adalah ...',
    'habis dibaca dalam sekali duduk', 'memiliki banyak alur utama',
    'selalu berdasarkan kisah nyata', 'ditulis dalam bentuk dialog saja', 'A'],
  ['Tokoh yang menjadi pusat penceritaan disebut ...',
    'tokoh utama', 'tokoh tambahan', 'tokoh figuran', 'tokoh antagonis', 'A'],
  ['Watak tokoh dalam cerpen dapat diketahui melalui ...',
    'dialog dan tindakan tokoh', 'jumlah halaman cerita',
    'judul cerita saja', 'nama penerbit buku', 'A'],
  ['Latar suasana dalam cerpen menggambarkan ...',
    'keadaan perasaan yang menyelimuti cerita',
    'tempat terjadinya peristiwa', 'waktu terjadinya peristiwa',
    'jumlah tokoh dalam cerita', 'A'],
  ['Alur yang menceritakan peristiwa masa lampau disebut alur ...',
    'mundur', 'maju', 'campuran', 'melingkar', 'A'],
  ['Nilai sosial dalam cerpen berkaitan dengan ...',
    'hubungan antarmanusia dalam masyarakat',
    'hubungan manusia dengan Tuhan',
    'keindahan pilihan kata pengarang',
    'adat istiadat suatu daerah', 'A'],
  ['Perbedaan cerpen dan novel terletak pada ...',
    'kompleksitas dan panjang ceritanya', 'penggunaan bahasa bakunya',
    'jenis kertas yang digunakan', 'nama penerbitnya', 'A'],
];

const UTS_ESAI = [
  'Jelaskan perbedaan struktur teks prosedur dan teks eksplanasi. Sertakan '
  + 'satu contoh kalimat untuk setiap bagian strukturnya.',
  'Tentukan tema, tokoh utama, dan amanat sebuah cerpen yang pernah Anda baca. '
  + 'Jelaskan alasan Anda disertai bukti dari cerita tersebut.',
];

// Butir soal Ulangan Akhir Semester: seluruh bank pokok bahasan satu
// semester digabung, sehingga ujian ini benar-benar menguji materi
// pertemuan 1 sampai 20, bukan sebagian saja.
const UAS_PG = [
  ...BANK_PROSEDUR_EKSPLANASI,
  ...BANK_CERAMAH_CERPEN,
  ...BANK_PROPOSAL_ILMIAH,
  ...BANK_RESENSI_DRAMA,
];

const UAS_ESAI = [
  'Jelaskan perbedaan tujuan dan struktur antara teks prosedur, teks '
  + 'eksplanasi, dan teks ceramah. Sertakan satu contoh judul untuk '
  + 'masing-masing jenis teks tersebut.',
  'Pilihlah satu karya sastra yang dipelajari pada semester ini, berupa '
  + 'cerpen atau naskah drama. Uraikan unsur pembangunnya serta nilai '
  + 'kehidupan yang terkandung di dalamnya, disertai bukti dari karya '
  + 'tersebut.',
];

// Penilaian besar beserta pertemuan tempatnya dilekatkan.
// bobot_pg dan bobot_esai adalah bobot tiap butir soal, bukan bobot
// penilaian. Jumlah seluruh butir pada satu penilaian harus tepat 100
// supaya nilainya langsung terbaca pada skala 0-100, sesuai perhitungan
// otomatis pada tugasController.
const PENILAIAN_BESAR = [
  { pertemuan: 10, tipe: 'uts', bobot: BOBOT_UTS,
    soal: UTS_PG, esai: UTS_ESAI, bobot_pg: 4, bobot_esai: 20,
    judul: 'Ujian Tengah Semester Bahasa Indonesia',
    deskripsi: 'Ujian Tengah Semester meliputi materi pertemuan 1 sampai 10, '
      + 'terdiri atas 15 soal pilihan ganda dan 2 soal uraian.' },
  { pertemuan: 20, tipe: 'uas', bobot: BOBOT_ULANGAN,
    soal: UAS_PG, esai: UAS_ESAI, bobot_pg: 2, bobot_esai: 10,
    judul: 'Ulangan Akhir Semester Bahasa Indonesia',
    deskripsi: 'Ulangan Akhir Semester meliputi seluruh materi pertemuan 1 '
      + 'sampai 20, terdiri atas 40 soal pilihan ganda dan 2 soal uraian. '
      + 'Kerjakan dengan teliti, periksa kembali sebelum dikumpulkan.' },
];

// ---------------------------------------------------------------------
// Alat bantu
// ---------------------------------------------------------------------
/* Pembangkit acak bertaburan tetap (mulberry32). Dipakai agar angka yang
 * dihasilkan selalu sama pada setiap penjalanan, sehingga dataset dapat
 * dibangun ulang tanpa mengubah nilai siapa pun. */
function acak(benih) {
  let a = benih >>> 0;
  return function next() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const batas = (v, min, maks) => Math.min(maks, Math.max(min, v));
const bulat2 = (v) => Math.round(v * 100) / 100;

function tanggalKe(mulai, pekan) {
  const d = new Date(`${mulai}T00:00:00`);
  d.setDate(d.getDate() + pekan * 7);
  return d.toISOString().slice(0, 10);
}

const HURUF = ['A', 'B', 'C', 'D'];

// ---------------------------------------------------------------------
// Penyusunan dataset
// ---------------------------------------------------------------------
async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_smakk',
    multipleStatements: false,
  });

  // --- Menemukan kelas mata pelajaran sasaran -------------------------
  const [km] = await conn.query(`
    SELECT km.id, km.id_guru, k.id AS id_kelas, k.nama_kelas, p.kode
    FROM kelas_mapel km
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode p ON p.id = k.id_periode
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN guru g ON g.id = km.id_guru
    JOIN users u ON u.id = g.id_user
    WHERE u.nama LIKE ? AND mp.nama = ? AND k.nama_kelas = ? AND p.kode = ?`,
  [`%${GURU}%`, MAPEL, KELAS, PERIODE]);

  if (!km.length) {
    throw new Error(`Kelas mata pelajaran tidak ditemukan: ${GURU} / ${MAPEL}`
      + ` / ${KELAS} / ${PERIODE}`);
  }
  const { id: idKm, id_guru: idGuru, id_kelas: idKelas } = km[0];
  console.log(`Sasaran : ${MAPEL} ${KELAS} periode ${PERIODE} `
    + `(id_kelas_mapel ${idKm})`);

  // --- Daftar siswa ---------------------------------------------------
  const [siswa] = await conn.query(`
    SELECT s.id, u.nama FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    WHERE sk.id_kelas = ? ORDER BY u.nama`, [idKelas]);
  console.log(`Siswa   : ${siswa.length} orang`);
  if (!siswa.length) throw new Error('Kelas tidak memiliki siswa.');

  await conn.beginTransaction();
  try {
    // --- Membersihkan data lama agar skrip dapat diulang --------------
    // Seluruh tugas, soal, pengumpulan, nilai, jawaban, dan materi ikut
    // terhapus melalui ON DELETE CASCADE dari tabel pertemuan.
    const [hapus] = await conn.query(
      'DELETE FROM pertemuan WHERE id_kelas_mapel = ?', [idKm]);
    if (hapus.affectedRows) {
      console.log(`Bersih  : ${hapus.affectedRows} pertemuan lama dihapus`);
    }

    // --- Pertemuan, materi, dan latihan mingguan ----------------------
    const idPertemuan = [];
    const penilaian = [];   // { id, judul, bobot, tipe, berbutir }

    for (let i = 0; i < PERTEMUAN.length; i += 1) {
      const p = PERTEMUAN[i];
      const tgl = tanggalKe(MULAI, i);
      const [rp] = await conn.query(
        `INSERT INTO pertemuan (id_kelas_mapel, nomor, judul, deskripsi, tanggal)
         VALUES (?,?,?,?,?)`,
        [idKm, i + 1, p.judul,
          `Pertemuan ke-${i + 1} mata pelajaran Bahasa Indonesia kelas ${KELAS}.`,
          tgl]);
      idPertemuan.push(rp.insertId);

      await conn.query(
        `INSERT INTO materi (id_pertemuan, judul, konten, tipe)
         VALUES (?,?,?,'teks')`,
        [rp.insertId, `Ringkasan Materi: ${p.judul}`, p.materi]);

      // Latihan mingguan: batas waktu enam hari setelah pertemuan,
      // sehingga jatuh tempo sebelum pertemuan pekan berikutnya.
      const tglBatas = tanggalKe(MULAI, i);
      const batasWaktu = new Date(`${tglBatas}T00:00:00`);
      batasWaktu.setDate(batasWaktu.getDate() + 6);
      const [rt] = await conn.query(
        `INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe, bobot)
         VALUES (?,?,?,?, 'tugas', ?)`,
        [rp.insertId, `Latihan Pekan ${i + 1}: ${p.latihan}`, p.tugas,
          `${batasWaktu.toISOString().slice(0, 10)} 23:59:00`, BOBOT_LATIHAN]);
      penilaian.push({
        id: rt.insertId, judul: `Latihan Pekan ${i + 1}`, bobot: BOBOT_LATIHAN,
        tipe: 'tugas', berbutir: false, tanggal: tgl,
        deadline: `${batasWaktu.toISOString().slice(0, 10)} 23:59:00`,
      });
    }
    console.log(`Dibuat  : ${PERTEMUAN.length} pertemuan, `
      + `${PERTEMUAN.length} materi, ${PERTEMUAN.length} latihan mingguan`);

    // --- Ulangan harian dan UTS beserta butir soalnya -----------------
    for (const pb of PENILAIAN_BESAR) {
      const idp = idPertemuan[pb.pertemuan - 1];
      const tgl = tanggalKe(MULAI, pb.pertemuan - 1);
      const [rt] = await conn.query(
        `INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe, bobot)
         VALUES (?,?,?,?,?,?)`,
        [idp, pb.judul, pb.deskripsi, `${tgl} 23:59:00`, pb.tipe, pb.bobot]);
      const idTugas = rt.insertId;

      const bobotPg = pb.bobot_pg;
      const bobotEsai = pb.bobot_esai;
      const jumlahButir = pb.soal.length * bobotPg
        + (pb.esai || []).length * bobotEsai;
      if (jumlahButir !== 100) {
        throw new Error(`Bobot butir soal "${pb.judul}" berjumlah `
          + `${jumlahButir}, seharusnya 100.`);
      }
      let urut = 0;
      const butir = [];

      for (const s of pb.soal) {
        urut += 1;
        const [rs] = await conn.query(
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b,
                             pilihan_c, pilihan_d, jawaban_benar, bobot, urutan)
           VALUES (?,?,'pilihan_ganda',?,?,?,?,?,?,?)`,
          [idTugas, s[0], s[1], s[2], s[3], s[4], s[5], bobotPg, urut]);
        butir.push({ id: rs.insertId, tipe: 'pilihan_ganda',
          kunci: s[5], bobot: bobotPg });
      }
      for (const e of pb.esai || []) {
        urut += 1;
        const [rs] = await conn.query(
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, bobot, urutan)
           VALUES (?,?,'esai',?,?)`, [idTugas, e, bobotEsai, urut]);
        butir.push({ id: rs.insertId, tipe: 'esai', bobot: bobotEsai });
      }

      penilaian.push({
        id: idTugas, judul: pb.judul, bobot: pb.bobot, tipe: pb.tipe,
        berbutir: true, butir, tanggal: tgl, deadline: `${tgl} 23:59:00`,
      });
      console.log(`Dibuat  : ${pb.judul} (${butir.length} butir soal, `
        + `bobot ${pb.bobot}%)`);
    }

    // --- Pengerjaan oleh seluruh siswa --------------------------------
    // Setiap siswa diberi taraf kemampuan tetap, lalu seluruh skornya
    // dibangkitkan dari taraf tersebut. Dengan begitu nilai antarsiswa
    // berbeda namun tetap masuk akal: siswa yang kuat pada latihan juga
    // cenderung kuat pada ulangan.
    let jmlKumpul = 0;
    let jmlJawaban = 0;

    for (const s of siswa) {
      const rnd = acak(s.id * 7919 + 13);
      // Taraf kemampuan 66-94 dipilih agar sebaran nilai akhirnya wajar
      // untuk satu rombongan belajar: sebagian besar siswa tuntas
      // terhadap KKM 75, dengan beberapa siswa di bawahnya.
      const taraf = 66 + Math.floor(rnd() * 29);          // 66 - 94

      for (const t of penilaian) {
        // Waktu pengumpulan: latihan dikumpulkan beberapa hari setelah
        // pertemuan, ulangan dan UTS dikumpulkan pada hari pelaksanaan.
        let tglKumpul;
        let terlambat = 0;
        if (t.berbutir) {
          tglKumpul = `${t.tanggal} ${8 + Math.floor(rnd() * 3)}:`
            + `${String(10 + Math.floor(rnd() * 45)).padStart(2, '0')}:00`;
        } else {
          const d = new Date(`${t.tanggal}T00:00:00`);
          const selang = 1 + Math.floor(rnd() * 7);        // 1 - 7 hari
          d.setDate(d.getDate() + selang);
          const jam = 15 + Math.floor(rnd() * 8);
          tglKumpul = `${d.toISOString().slice(0, 10)} `
            + `${String(jam).padStart(2, '0')}:`
            + `${String(Math.floor(rnd() * 60)).padStart(2, '0')}:00`;
          terlambat = selang > 6 ? 1 : 0;
        }

        const jawabanTeks = t.berbutir ? null
          : `Jawaban ${s.nama} untuk ${t.judul}. Pekerjaan disusun `
            + 'berdasarkan materi pertemuan dan buku paket yang digunakan '
            + 'di kelas.';

        const [rk] = await conn.query(
          `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, jawaban,
                                          tgl_kumpul, terlambat)
           VALUES (?,?,?,?,?)`,
          [t.id, s.id, jawabanTeks, tglKumpul, terlambat]);
        const idKumpul = rk.insertId;
        jmlKumpul += 1;

        let skorAkhir;
        if (t.berbutir) {
          // Setiap butir dijawab. Peluang menjawab benar mengikuti taraf
          // kemampuan siswa, ditambah ragam kecil antarpenilaian supaya
          // seorang siswa tidak memperoleh angka yang itu-itu saja.
          const peluang = batas(taraf / 100 + (rnd() - 0.5) * 0.12,
            0.32, 0.97);
          let diperoleh = 0;
          let totalBobot = 0;

          for (const b of t.butir) {
            totalBobot += b.bobot;
            if (b.tipe === 'pilihan_ganda') {
              const benar = rnd() < peluang;
              let pilihan = b.kunci;
              if (!benar) {
                const salah = HURUF.filter((h) => h !== b.kunci);
                pilihan = salah[Math.floor(rnd() * salah.length)];
              }
              const skor = benar ? b.bobot : 0;
              diperoleh += skor;
              await conn.query(
                `INSERT INTO jawaban_siswa (id_pengumpulan, id_soal, pilihan,
                                            benar, skor)
                 VALUES (?,?,?,?,?)`,
                [idKumpul, b.id, pilihan, benar ? 1 : 0, skor]);
            } else {
              const mutu = batas(taraf / 100 + (rnd() - 0.5) * 0.18, 0.35, 1);
              const skor = bulat2(b.bobot * mutu);
              diperoleh += skor;
              await conn.query(
                `INSERT INTO jawaban_siswa (id_pengumpulan, id_soal,
                                            jawaban_teks, skor)
                 VALUES (?,?,?,?)`,
                [idKumpul, b.id,
                  'Uraian jawaban disusun berdasarkan materi yang telah '
                  + 'dipelajari pada pertemuan sebelumnya.', skor]);
            }
            jmlJawaban += 1;
          }
          // Rumus yang sama dengan penilaian otomatis pada sistem.
          skorAkhir = bulat2((diperoleh / totalBobot) * 100);
        } else {
          // Latihan cenderung lebih tinggi daripada ulangan karena
          // dikerjakan di rumah dengan bantuan buku dan catatan.
          skorAkhir = bulat2(batas(
            Math.round(taraf + 8 + (rnd() - 0.45) * 12), 60, 100));
        }

        await conn.query(
          `INSERT INTO nilai (id_kumpul, id_guru, skor, catatan, tgl_penilaian)
           VALUES (?,?,?,?,?)`,
          [idKumpul, idGuru, skorAkhir,
            skorAkhir >= 75 ? null : 'Pelajari kembali materi terkait.',
            tglKumpul]);
      }
    }

    console.log(`Dibuat  : ${jmlKumpul} pengumpulan, ${jmlJawaban} jawaban `
      + 'butir soal, seluruhnya sudah dinilai');

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  }

  // --- Pemeriksaan akhir ----------------------------------------------
  const [bobot] = await conn.query(`
    SELECT t.tipe, COUNT(*) AS jml, SUM(t.bobot) AS jumlah_bobot
    FROM tugas t JOIN pertemuan p ON p.id = t.id_pertemuan
    WHERE p.id_kelas_mapel = ? GROUP BY t.tipe`, [idKm]);
  console.log('\nRekapitulasi bobot penilaian:');
  let total = 0;
  for (const b of bobot) {
    total += Number(b.jumlah_bobot);
    console.log(`  ${String(b.tipe).padEnd(6)} ${String(b.jml).padStart(3)} `
      + `penilaian  ${Number(b.jumlah_bobot).toFixed(2)}%`);
  }
  console.log(`  ${'JUMLAH'.padEnd(6)} ${' '.repeat(3)}             `
    + `${total.toFixed(2)}%`);

  const [kosong] = await conn.query(`
    SELECT COUNT(*) AS n FROM tugas t
    JOIN pertemuan p ON p.id = t.id_pertemuan
    JOIN siswa_kelas sk ON sk.id_kelas = ?
    LEFT JOIN pengumpulan_tugas pg
      ON pg.id_tugas = t.id AND pg.id_siswa = sk.id_siswa
    LEFT JOIN nilai n ON n.id_kumpul = pg.id
    WHERE p.id_kelas_mapel = ? AND n.skor IS NULL`, [idKelas, idKm]);
  console.log(`\nPenilaian yang belum terisi: ${kosong[0].n} `
    + (kosong[0].n === 0 ? '(seluruh siswa sudah menjawab dan dinilai)' : ''));

  await conn.end();
}

main().catch((e) => {
  console.error('GAGAL:', e.message);
  process.exit(1);
});
