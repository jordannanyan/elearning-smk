/* =====================================================================
 * Dataset pembelajaran Bahasa Indonesia — Martaniah, S.Pd
 * Kelas XI A, periode 2026/2 (Semester Genap 2025/2026)
 * ---------------------------------------------------------------------
 * Lanjutan dari scripts/dataset-martaniah.js yang mengisi semester
 * ganjil. Susunan bobot penilaiannya sama:
 *
 *     Ulangan Akhir Semester 50%
 *     Ujian Tengah Semester  25%
 *     Latihan                25%   (20 latihan mingguan @ 1,25%)
 *     --------------------------------------------------------- +
 *     Jumlah bobot          100%
 *
 * Pokok bahasannya berbeda dari semester ganjil agar tidak mengulang:
 * Teks Argumentasi, penerapannya pada isu pangan lokal, Teks Berita,
 * penyajian berita dalam bentuk vlog, dan Puisi.
 *
 * Setiap pertemuan diisi materi yang diambil dari berkas data
 * scripts/materi-bindo-xi-genap.json, berupa:
 *   - uraian teks,
 *   - tautan video pembelajaran YouTube (seluruhnya sudah diperiksa),
 *   - modul ajar PDF, dan
 *   - video paparan yang diputar langsung di dalam sistem.
 *
 * Berkas modul dan video dibuat lebih dahulu oleh
 * scripts/buat-materi-ajar.py dan tersimpan pada folder materi-ajar/.
 * Skrip ini menyalinnya ke backend/uploads/ supaya dapat dilayani.
 *
 * Jalankan : node scripts/buat-materi-ajar.py terlebih dahulu, lalu
 *            node scripts/dataset-martaniah-genap.js
 * Sifat    : idempoten — data lama pada kelas mata pelajaran yang sama
 *            dihapus lebih dahulu, lalu disusun ulang.
 * ===================================================================== */
const fs = require('fs');
const path = require('path');

const AKAR = path.join(__dirname, '..');
const BACKEND_MODULES = path.join(AKAR, 'backend', 'node_modules');
require(path.join(BACKEND_MODULES, 'dotenv'))
  .config({ path: path.join(AKAR, 'backend', '.env') });
const mysql = require(path.join(BACKEND_MODULES, 'mysql2', 'promise'));

const DATA = path.join(__dirname, 'materi-bindo-xi-genap.json');
const DIR_MATERI = path.join(AKAR, 'materi-ajar');
const DIR_UPLOAD = path.join(AKAR, 'backend', 'uploads');

const BOBOT_LATIHAN = 1.25;        // 20 latihan mingguan -> 25%
const BOBOT_UTS = 25;              // 1 UTS              -> 25%
const BOBOT_ULANGAN = 50;          // 1 Ulangan Akhir    -> 50%

// ---------------------------------------------------------------------
// Bank soal. Setiap entri: [pertanyaan, A, B, C, D, kunci]
// ---------------------------------------------------------------------
const UTS_PG = [
  ['Teks yang berisi pendapat penulis beserta alasan dan bukti pendukungnya disebut teks ...',
    'argumentasi', 'deskripsi', 'narasi', 'prosedur', 'A'],
  ['Tujuan utama teks argumentasi adalah ...',
    'meyakinkan pembaca bahwa pendapat penulis layak diterima',
    'menggambarkan suatu objek secara terperinci',
    'menceritakan rangkaian peristiwa secara runtut',
    'memandu pembaca melakukan sesuatu', 'A'],
  ['Urutan struktur teks argumentasi yang tepat adalah ...',
    'tesis, rangkaian argumen, penegasan ulang',
    'orientasi, komplikasi, resolusi',
    'kepala, tubuh, ekor',
    'pernyataan umum, deretan penjelas, interpretasi', 'A'],
  ['Bagian teks argumentasi yang memuat pendapat penulis disebut ...',
    'tesis', 'penegasan ulang', 'rangkaian argumen', 'simpulan', 'A'],
  ['Perbedaan teks argumentasi dan teks eksposisi terletak pada ...',
    'adanya pendirian penulis yang hendak dibuktikan',
    'jumlah paragraf yang digunakan',
    'penggunaan huruf kapital pada judul',
    'panjang kalimat pada tiap paragraf', 'A'],
  ['Kelompok konjungsi kausalitas yang lazim dipakai pada teks argumentasi adalah ...',
    'karena, sebab, sehingga', 'lalu, kemudian, setelah itu',
    'atau, dan, serta', 'bagai, seperti, laksana', 'A'],
  ['Kalimat berikut yang merupakan fakta adalah ...',
    'Berdasarkan data BPS, produksi sagu nasional meningkat 12 persen.',
    'Menurut saya, sagu adalah pangan terbaik di Indonesia.',
    'Sebaiknya semua orang mulai menyukai sagu.',
    'Sagu terasa jauh lebih enak daripada beras.', 'A'],
  ['Kesesatan berpikir yang menyimpulkan sesuatu dari contoh yang terlalu sedikit disebut ...',
    'generalisasi tergesa', 'serangan pribadi',
    'argumen otoritas semu', 'sebab-akibat palsu', 'A'],
  ['Menyerang pribadi lawan bicara dan bukan pendapatnya termasuk kesesatan ...',
    'serangan pribadi', 'generalisasi tergesa',
    'sebab-akibat palsu', 'argumen otoritas semu', 'A'],
  ['Kata kerja mental yang lazim muncul pada teks argumentasi adalah ...',
    'berpendapat', 'memasak', 'berlari', 'menanam', 'A'],
  ['Teks yang memberitakan peristiwa aktual kepada khalayak disebut teks ...',
    'berita', 'argumentasi', 'puisi', 'prosedur', 'A'],
  ['Singkatan ADIKSIMBA pada teks berita memuat unsur ...',
    'apa, di mana, kapan, siapa, mengapa, bagaimana',
    'awal, deskripsi, isi, simpulan, bagan',
    'analisis, diksi, kalimat, sintaksis, makna, bahasa',
    'ajakan, data, informasi, kesan, simbol, bukti', 'A'],
  ['Bagian berita yang memuat inti peristiwa dan diletakkan paling awal disebut ...',
    'kepala berita', 'tubuh berita', 'ekor berita', 'penegasan ulang', 'A'],
  ['Pola penyusunan berita yang meletakkan informasi terpenting di awal disebut ...',
    'piramida terbalik', 'piramida tegak', 'alur maju', 'spiral', 'A'],
  ['Bahasa yang digunakan dalam teks berita hendaknya ...',
    'lugas, baku, dan tidak memihak', 'puitis dan penuh kiasan',
    'santai seperti percakapan sehari-hari', 'berlebihan agar menarik', 'A'],
];

const UTS_ESAI = [
  'Jelaskan perbedaan teks argumentasi, teks eksposisi, dan teks persuasi. '
  + 'Sertakan satu contoh kalimat untuk masing-masing jenis teks tersebut.',
  'Tuliskan sebuah tesis mengenai pentingnya mengonsumsi pangan lokal, lalu '
  + 'susunlah dua argumen pendukung yang masing-masing disertai bukti berupa '
  + 'fakta atau data.',
];

const UAS_PG = [
  ['Bagian teks argumentasi yang menguatkan kembali tesis setelah seluruh argumen dipaparkan adalah ...',
    'penegasan ulang', 'tesis', 'rangkaian argumen', 'orientasi', 'A'],
  ['Argumen dikatakan kuat apabila ...',
    'bersandar pada bukti yang relevan dan dapat ditelusuri sumbernya',
    'disampaikan dengan suara yang lantang',
    'ditulis dalam kalimat yang sangat panjang',
    'mengutip tokoh terkenal tanpa memeriksa bidang keahliannya', 'A'],
  ['Mengutip pihak yang tidak berkompeten di bidangnya termasuk kesesatan ...',
    'argumen otoritas semu', 'generalisasi tergesa',
    'serangan pribadi', 'sebab-akibat palsu', 'A'],
  ['Menganggap dua peristiwa yang berurutan pasti berhubungan sebab-akibat termasuk kesesatan ...',
    'sebab-akibat palsu', 'serangan pribadi',
    'generalisasi tergesa', 'argumen otoritas semu', 'A'],
  ['Berikut ini yang termasuk pangan lokal Indonesia adalah ...',
    'sagu, sorgum, dan talas', 'gandum, kurma, dan zaitun',
    'kentang, apel, dan anggur', 'kedelai, gandum, dan barley', 'A'],
  ['Alasan utama keragaman pangan lokal penting bagi ketahanan pangan adalah ...',
    'mengurangi ketergantungan pada satu jenis pangan pokok',
    'menurunkan harga seluruh bahan makanan',
    'mempercepat proses memasak di rumah tangga',
    'menghapus kebutuhan akan lahan pertanian', 'A'],
  ['Sumber data yang paling tepat untuk mendukung argumen tentang produksi pangan adalah ...',
    'Badan Pusat Statistik', 'cerita teman sekelas',
    'komentar di media sosial', 'perasaan penulis sendiri', 'A'],
  ['Langkah pertama menulis teks argumentasi adalah ...',
    'menentukan tesis atau pendapat yang akan dibuktikan',
    'menyunting ejaan dan tanda baca',
    'mencetak naskah untuk dibagikan',
    'menghitung jumlah kata pada naskah', 'A'],
  ['Penyuntingan teks argumentasi memeriksa tiga hal, yaitu ...',
    'ketepatan isi, keruntutan penalaran, dan kebakuan bahasa',
    'warna kertas, jenis huruf, dan ukuran margin',
    'jumlah halaman, berat berkas, dan nama penulis',
    'harga cetak, waktu kirim, dan jumlah salinan', 'A'],
  ['Unsur berita yang menjawab pertanyaan "mengapa" berkaitan dengan ...',
    'sebab terjadinya peristiwa', 'tempat terjadinya peristiwa',
    'waktu terjadinya peristiwa', 'pihak yang terlibat', 'A'],
  ['Bagian berita yang memuat kutipan narasumber dan penjelasan rinci adalah ...',
    'tubuh berita', 'kepala berita', 'ekor berita', 'judul berita', 'A'],
  ['Kelebihan pola piramida terbalik pada berita adalah ...',
    'pembaca tetap memperoleh inti meski hanya membaca bagian awal',
    'berita menjadi jauh lebih panjang',
    'penulis tidak perlu mencantumkan narasumber',
    'berita tidak dapat dipotong oleh penyunting', 'A'],
  ['Konjungsi temporal yang lazim dipakai pada teks berita adalah ...',
    'kemudian', 'namun', 'meskipun', 'seandainya', 'A'],
  ['Kalimat "Kepala sekolah menyatakan bahwa kegiatan itu berjalan lancar." merupakan kalimat ...',
    'tidak langsung', 'langsung', 'perintah', 'tanya', 'A'],
  ['Langkah yang tepat untuk memeriksa kebenaran sebuah berita adalah ...',
    'mencari berita serupa pada media lain yang kredibel',
    'membagikannya lebih dahulu agar cepat tersebar',
    'mempercayai judul yang paling menarik perhatian',
    'mengabaikan tanggal terbit berita tersebut', 'A'],
  ['Ciri berita palsu yang paling mudah dikenali adalah ...',
    'judul berlebihan yang membangkitkan amarah',
    'mencantumkan nama narasumber dengan jelas',
    'menyertakan data dari lembaga resmi',
    'ditulis dengan bahasa baku dan lugas', 'A'],
  ['Dalam vlog berita, unsur ADIKSIMBA ...',
    'tetap wajib dipenuhi', 'boleh diabaikan seluruhnya',
    'diganti dengan unsur intrinsik', 'hanya berlaku untuk berita cetak', 'A'],
  ['Rancangan gambar per adegan beserta narasinya pada pembuatan vlog disebut ...',
    'papan cerita', 'daftar pustaka', 'kerangka karangan', 'notula', 'A'],
  ['Papan cerita vlog berita sebaiknya memuat ...',
    'nomor adegan, keterangan gambar, narasi, dan durasi',
    'nama penerbit, tahun terbit, dan kota terbit',
    'tesis, argumen, dan penegasan ulang',
    'tema, rasa, nada, dan amanat', 'A'],
  ['Pengambilan gambar untuk vlog sebaiknya dilakukan secara ...',
    'mendatar (landscape)', 'tegak (portrait)',
    'miring empat puluh lima derajat', 'berputar terus-menerus', 'A'],
  ['Agar wajah narasumber tidak gelap, sumber cahaya sebaiknya berada ...',
    'di depan objek', 'di belakang objek',
    'tepat di atas kamera saja', 'dimatikan seluruhnya', 'A'],
  ['Unsur batin puisi meliputi ...',
    'tema, rasa, nada, dan amanat', 'diksi, rima, dan tipografi',
    'kepala, tubuh, dan ekor', 'tesis, argumen, dan penegasan ulang', 'A'],
  ['Pemilihan kata yang tepat dalam puisi disebut ...',
    'diksi', 'rima', 'tipografi', 'amanat', 'A'],
  ['Penggunaan kata yang membangkitkan penginderaan pembaca disebut ...',
    'pengimajian', 'tipografi', 'rima', 'tema', 'A'],
  ['Majas yang memberikan sifat manusia kepada benda mati disebut ...',
    'personifikasi', 'hiperbola', 'simile', 'repetisi', 'A'],
];

const UAS_ESAI = [
  'Pilihlah satu isu di lingkungan sekolah Anda. Susunlah kerangka teks '
  + 'argumentasi yang memuat tesis, tiga argumen beserta bukti pendukungnya, '
  + 'dan penegasan ulang.',
  'Ambillah satu puisi yang Anda kenal. Tentukan tema dan amanatnya, lalu '
  + 'tunjukkan dua majas dan satu bentuk pengimajian yang terdapat di '
  + 'dalamnya, masing-masing disertai kutipan larik.',
];

const PENILAIAN_BESAR = [
  { pertemuan: 10, tipe: 'uts', bobot: BOBOT_UTS,
    soal: UTS_PG, esai: UTS_ESAI, bobot_pg: 4, bobot_esai: 20,
    judul: 'Ujian Tengah Semester Bahasa Indonesia',
    deskripsi: 'Ujian Tengah Semester meliputi materi pertemuan 1 sampai 10, '
      + 'yaitu teks argumentasi, penerapannya pada isu pangan lokal, serta '
      + 'pengenalan teks berita. Terdiri atas 15 soal pilihan ganda dan 2 '
      + 'soal uraian.' },
  { pertemuan: 20, tipe: 'uas', bobot: BOBOT_ULANGAN,
    soal: UAS_PG, esai: UAS_ESAI, bobot_pg: 2, bobot_esai: 25,
    judul: 'Ulangan Akhir Semester Bahasa Indonesia',
    deskripsi: 'Ulangan Akhir Semester meliputi seluruh materi pertemuan 1 '
      + 'sampai 20, yaitu teks argumentasi, pangan lokal, teks berita, vlog '
      + 'berita, dan puisi. Terdiri atas 25 soal pilihan ganda dan 2 soal '
      + 'uraian.' },
];

// ---------------------------------------------------------------------
// Alat bantu
// ---------------------------------------------------------------------
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
const HURUF = ['A', 'B', 'C', 'D'];

function tanggalKe(mulai, pekan) {
  const d = new Date(`${mulai}T00:00:00`);
  d.setDate(d.getDate() + pekan * 7);
  return d.toISOString().slice(0, 10);
}

/* Menyalin berkas materi ke folder unggahan backend. Nama berkasnya dibuat
 * tetap (bukan bercap waktu seperti unggahan lewat antarmuka) supaya skrip
 * ini dapat dijalankan berulang tanpa menumpuk salinan. */
function salinKeUnggahan(relatif) {
  const asal = path.join(DIR_MATERI, relatif);
  if (!fs.existsSync(asal)) {
    throw new Error(`Berkas materi belum ada: ${asal}\n`
      + 'Jalankan lebih dahulu: python scripts/buat-materi-ajar.py');
  }
  fs.mkdirSync(DIR_UPLOAD, { recursive: true });
  const nama = `ajar-${path.basename(relatif)}`;
  fs.copyFileSync(asal, path.join(DIR_UPLOAD, nama));
  return nama;
}

// ---------------------------------------------------------------------
async function main() {
  const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_smakk',
  });

  const [km] = await conn.query(`
    SELECT km.id, km.id_guru, k.id AS id_kelas
    FROM kelas_mapel km
    JOIN kelas k ON k.id = km.id_kelas
    JOIN periode p ON p.id = k.id_periode
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN guru g ON g.id = km.id_guru
    JOIN users u ON u.id = g.id_user
    WHERE u.nama LIKE ? AND mp.nama = ? AND k.nama_kelas = ? AND p.kode = ?`,
  [`%${d.guru}%`, d.mapel, d.kelas, d.periode]);

  if (!km.length) {
    throw new Error(`Kelas mata pelajaran tidak ditemukan: ${d.guru} / `
      + `${d.mapel} / ${d.kelas} / ${d.periode}`);
  }
  const { id: idKm, id_guru: idGuru, id_kelas: idKelas } = km[0];
  console.log(`Sasaran : ${d.mapel} ${d.kelas} periode ${d.periode} `
    + `(id_kelas_mapel ${idKm})`);

  const [siswa] = await conn.query(`
    SELECT s.id, u.nama FROM siswa_kelas sk
    JOIN siswa s ON s.id = sk.id_siswa
    JOIN users u ON u.id = s.id_user
    WHERE sk.id_kelas = ? ORDER BY u.nama`, [idKelas]);
  console.log(`Siswa   : ${siswa.length} orang`);
  if (!siswa.length) throw new Error('Kelas tidak memiliki siswa.');

  // Berkas materi disalin lebih dahulu agar kegagalan penyalinan tidak
  // meninggalkan basis data dalam keadaan setengah terisi.
  const berkasModul = new Map();
  for (const m of d.modul) {
    berkasModul.set(m.pertemuan,
      { nama: salinKeUnggahan(path.join('modul', `${m.kode}.pdf`)), modul: m });
  }
  const berkasVideo = new Map();
  for (const v of d.video_berkas) {
    berkasVideo.set(v.pertemuan,
      { nama: salinKeUnggahan(path.join('video', `${v.kode}.mp4`)), video: v });
  }
  console.log(`Berkas  : ${berkasModul.size} modul PDF dan `
    + `${berkasVideo.size} video paparan disalin ke backend/uploads`);

  await conn.beginTransaction();
  try {
    const [hapus] = await conn.query(
      'DELETE FROM pertemuan WHERE id_kelas_mapel = ?', [idKm]);
    if (hapus.affectedRows) {
      console.log(`Bersih  : ${hapus.affectedRows} pertemuan lama dihapus`);
    }

    const idPertemuan = [];
    const penilaian = [];
    let jmlMateri = 0;

    for (const p of d.pertemuan) {
      const tgl = tanggalKe(d.mulai, p.nomor - 1);
      const [rp] = await conn.query(
        `INSERT INTO pertemuan (id_kelas_mapel, nomor, judul, deskripsi, tanggal)
         VALUES (?,?,?,?,?)`,
        [idKm, p.nomor, p.judul,
          `Unit ${p.unit}. Pertemuan ke-${p.nomor} mata pelajaran Bahasa `
          + `Indonesia kelas ${d.kelas}.`, tgl]);
      const idp = rp.insertId;
      idPertemuan.push(idp);

      // 1) Uraian materi
      await conn.query(
        `INSERT INTO materi (id_pertemuan, judul, konten, tipe, tgl_upload)
         VALUES (?,?,?,'teks',?)`,
        [idp, `Uraian Materi: ${p.judul}`, p.uraian, `${tgl} 07:00:00`]);
      jmlMateri += 1;

      // 2) Modul ajar PDF, pada pertemuan pembuka tiap unit
      if (berkasModul.has(p.nomor)) {
        const { nama, modul } = berkasModul.get(p.nomor);
        await conn.query(
          `INSERT INTO materi (id_pertemuan, judul, konten, tipe, file, tgl_upload)
           VALUES (?,?,?,'file',?,?)`,
          [idp, `Modul Ajar: ${modul.judul}`,
            `${modul.ringkas} Modul ini menjadi rujukan untuk seluruh `
            + `pertemuan pada unit ${p.unit}.`, nama, `${tgl} 07:05:00`]);
        jmlMateri += 1;
      }

      // 3) Video paparan yang diputar langsung di dalam sistem
      if (berkasVideo.has(p.nomor)) {
        const { nama, video } = berkasVideo.get(p.nomor);
        await conn.query(
          `INSERT INTO materi (id_pertemuan, judul, konten, tipe, file, tgl_upload)
           VALUES (?,?,?,'video',?,?)`,
          [idp, video.judul,
            'Video paparan berupa salindia ringkasan materi, tanpa suara. '
            + 'Penjelasan lisan tersedia pada materi tautan di bawah.',
            nama, `${tgl} 07:10:00`]);
        jmlMateri += 1;
      }

      // 4) Tautan video pembelajaran
      if (p.video) {
        await conn.query(
          `INSERT INTO materi (id_pertemuan, judul, konten, tipe, url, tgl_upload)
           VALUES (?,?,?,'link',?,?)`,
          [idp, `Video Pembelajaran: ${p.video.judul}`,
            `Tontonlah video berikut sebagai pelengkap uraian materi. `
            + `Sumber: kanal ${p.video.kanal} di YouTube.`,
            `https://www.youtube.com/watch?v=${p.video.id}`,
            `${tgl} 07:15:00`]);
        jmlMateri += 1;
      }

      // Latihan mingguan
      const bw = new Date(`${tgl}T00:00:00`);
      bw.setDate(bw.getDate() + 6);
      const deadline = `${bw.toISOString().slice(0, 10)} 23:59:00`;
      const [rt] = await conn.query(
        `INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe, bobot)
         VALUES (?,?,?,?, 'tugas', ?)`,
        [idp, `Latihan Pekan ${p.nomor}: ${p.latihan.judul}`,
          p.latihan.perintah, deadline, BOBOT_LATIHAN]);
      penilaian.push({
        id: rt.insertId, judul: `Latihan Pekan ${p.nomor}`,
        berbutir: false, tanggal: tgl,
      });
    }
    console.log(`Dibuat  : ${d.pertemuan.length} pertemuan, ${jmlMateri} materi, `
      + `${d.pertemuan.length} latihan mingguan`);

    for (const pb of PENILAIAN_BESAR) {
      const idp = idPertemuan[pb.pertemuan - 1];
      const tgl = tanggalKe(d.mulai, pb.pertemuan - 1);
      const jumlahButir = pb.soal.length * pb.bobot_pg
        + pb.esai.length * pb.bobot_esai;
      if (jumlahButir !== 100) {
        throw new Error(`Bobot butir soal "${pb.judul}" berjumlah `
          + `${jumlahButir}, seharusnya 100.`);
      }
      const [rt] = await conn.query(
        `INSERT INTO tugas (id_pertemuan, judul, deskripsi, deadline, tipe, bobot)
         VALUES (?,?,?,?,?,?)`,
        [idp, pb.judul, pb.deskripsi, `${tgl} 23:59:00`, pb.tipe, pb.bobot]);
      const idTugas = rt.insertId;

      let urut = 0;
      const butir = [];
      for (const s of pb.soal) {
        urut += 1;
        const [rs] = await conn.query(
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, pilihan_a, pilihan_b,
                             pilihan_c, pilihan_d, jawaban_benar, bobot, urutan)
           VALUES (?,?,'pilihan_ganda',?,?,?,?,?,?,?)`,
          [idTugas, s[0], s[1], s[2], s[3], s[4], s[5], pb.bobot_pg, urut]);
        butir.push({ id: rs.insertId, tipe: 'pilihan_ganda',
          kunci: s[5], bobot: pb.bobot_pg });
      }
      for (const e of pb.esai) {
        urut += 1;
        const [rs] = await conn.query(
          `INSERT INTO soal (id_tugas, pertanyaan, tipe, bobot, urutan)
           VALUES (?,?,'esai',?,?)`, [idTugas, e, pb.bobot_esai, urut]);
        butir.push({ id: rs.insertId, tipe: 'esai', bobot: pb.bobot_esai });
      }

      penilaian.push({
        id: idTugas, judul: pb.judul, berbutir: true, butir, tanggal: tgl,
      });
      console.log(`Dibuat  : ${pb.judul} (${butir.length} butir soal, `
        + `bobot ${pb.bobot}%)`);
    }

    // Pengerjaan oleh seluruh siswa
    let jmlKumpul = 0;
    let jmlJawaban = 0;
    for (const s of siswa) {
      const rnd = acak(s.id * 7919 + 29);
      const taraf = 66 + Math.floor(rnd() * 29);

      for (const t of penilaian) {
        let tglKumpul;
        let terlambat = 0;
        if (t.berbutir) {
          tglKumpul = `${t.tanggal} ${8 + Math.floor(rnd() * 3)}:`
            + `${String(10 + Math.floor(rnd() * 45)).padStart(2, '0')}:00`;
        } else {
          const dd = new Date(`${t.tanggal}T00:00:00`);
          const selang = 1 + Math.floor(rnd() * 7);
          dd.setDate(dd.getDate() + selang);
          const jam = 15 + Math.floor(rnd() * 8);
          tglKumpul = `${dd.toISOString().slice(0, 10)} `
            + `${String(jam).padStart(2, '0')}:`
            + `${String(Math.floor(rnd() * 60)).padStart(2, '0')}:00`;
          terlambat = selang > 6 ? 1 : 0;
        }

        const jawabanTeks = t.berbutir ? null
          : `Jawaban ${s.nama} untuk ${t.judul}. Pekerjaan disusun `
            + 'berdasarkan uraian materi, modul ajar, dan video pembelajaran '
            + 'pada pertemuan tersebut.';

        const [rk] = await conn.query(
          `INSERT INTO pengumpulan_tugas (id_tugas, id_siswa, jawaban,
                                          tgl_kumpul, terlambat)
           VALUES (?,?,?,?,?)`,
          [t.id, s.id, jawabanTeks, tglKumpul, terlambat]);
        const idKumpul = rk.insertId;
        jmlKumpul += 1;

        let skorAkhir;
        if (t.berbutir) {
          const peluang = batas(taraf / 100 + (rnd() - 0.5) * 0.12, 0.32, 0.97);
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
          skorAkhir = bulat2((diperoleh / totalBobot) * 100);
        } else {
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

  // Pemeriksaan akhir
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
  console.log(`  ${'JUMLAH'.padEnd(6)}                  ${total.toFixed(2)}%`);

  const [jenisMateri] = await conn.query(`
    SELECT m.tipe, COUNT(*) AS jml FROM materi m
    JOIN pertemuan p ON p.id = m.id_pertemuan
    WHERE p.id_kelas_mapel = ? GROUP BY m.tipe`, [idKm]);
  console.log('\nMateri menurut jenis:');
  for (const m of jenisMateri) {
    console.log(`  ${String(m.tipe).padEnd(6)} ${String(m.jml).padStart(3)}`);
  }

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
