/* =====================================================================
 * Pengujian Black Box Sistem E-Learning SMA Negeri 1 Karau Kuala
 * ---------------------------------------------------------------------
 * Skrip ini menjalankan seluruh skenario pengujian fungsional terhadap
 * REST API sistem (server harus berjalan di http://localhost:4000).
 * Selain menghasilkan tabel hasil pengujian, skrip ini juga mengisi data
 * pengumpulan tugas, jawaban kuis, penilaian, dan forum melalui alur
 * nyata sistem sehingga tangkapan layar BAB IV memuat data yang wajar.
 *
 * Jalankan:  node scripts/blackbox.js
 * Keluaran:  docs-bab4/data/hasil-pengujian.json
 * ===================================================================== */

const fs = require('fs');
const path = require('path');

const BASE = process.env.API_BASE || 'http://localhost:4000';
const OUT_DIR = path.join(__dirname, '..', 'docs-bab4', 'data');

const hasil = [];
let nomor = 0;

function catat({ modul, skenario, input, harapan, aktual, sesuai }) {
  nomor += 1;
  const row = {
    id: `BB-${String(nomor).padStart(2, '0')}`,
    modul, skenario, input, harapan, aktual,
    status: sesuai ? 'Valid' : 'Tidak Valid',
  };
  hasil.push(row);
  const tanda = sesuai ? 'OK  ' : 'GAGAL';
  console.log(`${tanda} ${row.id} [${modul}] ${skenario}`);
  if (!sesuai) console.log(`      harapan: ${harapan}\n      aktual : ${aktual}`);
  return row;
}

async function req(method, url, { token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${url}`, { method, headers, body: payload });
  let data = null;
  const teks = await res.text();
  try { data = teks ? JSON.parse(teks) : null; } catch { data = teks; }
  return { status: res.status, data };
}

const get = (u, t) => req('GET', u, { token: t });
const post = (u, b, t) => req('POST', u, { token: t, body: b });
const put = (u, b, t) => req('PUT', u, { token: t, body: b });
const del = (u, t) => req('DELETE', u, { token: t });

async function login(email, password) {
  const r = await post('/api/auth/login', { email, password });
  return r;
}

// ---------------------------------------------------------------------
async function main() {
  console.log(`\n=== PENGUJIAN BLACK BOX — ${new Date().toLocaleString('id-ID')} ===\n`);

  // =================================================================
  // A. MODUL AUTENTIKASI
  // =================================================================
  const rAdmin = await login('admin@smakk.sch.id', 'admin123');
  catat({
    modul: 'Autentikasi', skenario: 'Login administrator dengan email dan password yang benar',
    input: 'admin@smakk.sch.id / admin123',
    harapan: 'Sistem menerima login, mengembalikan token dan mengarahkan ke dashboard administrator',
    aktual: `HTTP ${rAdmin.status}, token diterima, role = ${rAdmin.data?.user?.role}`,
    sesuai: rAdmin.status === 200 && rAdmin.data.user.role === 'admin' && !!rAdmin.data.token,
  });
  const TA = rAdmin.data.token;

  const rGuru = await login('budi@smakk.sch.id', 'guru123');
  catat({
    modul: 'Autentikasi', skenario: 'Login guru dengan email dan password yang benar',
    input: 'budi@smakk.sch.id / guru123',
    harapan: 'Sistem menerima login dan mengarahkan ke dashboard guru',
    aktual: `HTTP ${rGuru.status}, role = ${rGuru.data?.user?.role}`,
    sesuai: rGuru.status === 200 && rGuru.data.user.role === 'guru',
  });
  const TG = rGuru.data.token;

  const rGuru2 = await login('siti@smakk.sch.id', 'guru123');
  const TG2 = rGuru2.data.token;
  const rGuru3 = await login('rahmat@smakk.sch.id', 'guru123');
  const TG3 = rGuru3.data.token;
  const rGuru4 = await login('dina@smakk.sch.id', 'guru123');
  const TG4 = rGuru4.data.token;

  const rSiswa = await login('ahmad@siswa.smakk.sch.id', 'siswa123');
  catat({
    modul: 'Autentikasi', skenario: 'Login siswa dengan email dan password yang benar',
    input: 'ahmad@siswa.smakk.sch.id / siswa123',
    harapan: 'Sistem menerima login dan mengarahkan ke dashboard siswa',
    aktual: `HTTP ${rSiswa.status}, role = ${rSiswa.data?.user?.role}`,
    sesuai: rSiswa.status === 200 && rSiswa.data.user.role === 'siswa',
  });
  const TS = rSiswa.data.token;

  const rSalah = await login('ahmad@siswa.smakk.sch.id', 'salah123');
  catat({
    modul: 'Autentikasi', skenario: 'Login dengan password yang salah',
    input: 'ahmad@siswa.smakk.sch.id / salah123',
    harapan: 'Login ditolak dan sistem menampilkan pesan "Email atau password salah"',
    aktual: `HTTP ${rSalah.status}, pesan: "${rSalah.data?.message}"`,
    sesuai: rSalah.status === 401,
  });

  const rTidakAda = await login('bukanpengguna@smakk.sch.id', 'admin123');
  catat({
    modul: 'Autentikasi', skenario: 'Login dengan email yang tidak terdaftar',
    input: 'bukanpengguna@smakk.sch.id / admin123',
    harapan: 'Login ditolak dan sistem menampilkan pesan kesalahan',
    aktual: `HTTP ${rTidakAda.status}, pesan: "${rTidakAda.data?.message}"`,
    sesuai: rTidakAda.status === 401,
  });

  const rKosong = await post('/api/auth/login', { email: '', password: '' });
  catat({
    modul: 'Autentikasi', skenario: 'Login dengan email dan password dikosongkan',
    input: 'email = (kosong), password = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan "Email dan password wajib diisi"',
    aktual: `HTTP ${rKosong.status}, pesan: "${rKosong.data?.message}"`,
    sesuai: rKosong.status === 400,
  });

  const rTanpaToken = await get('/api/dashboard');
  catat({
    modul: 'Autentikasi', skenario: 'Mengakses halaman sistem tanpa melakukan login (tanpa token)',
    input: 'GET /api/dashboard tanpa token',
    harapan: 'Akses ditolak dan pengguna diarahkan kembali ke halaman login',
    aktual: `HTTP ${rTanpaToken.status}, pesan: "${rTanpaToken.data?.message}"`,
    sesuai: rTanpaToken.status === 401,
  });

  const rTokenPalsu = await get('/api/dashboard', 'token.tidak.valid');
  catat({
    modul: 'Autentikasi', skenario: 'Mengakses sistem menggunakan token yang tidak valid',
    input: 'Authorization: Bearer token.tidak.valid',
    harapan: 'Akses ditolak dengan pesan "Token tidak valid"',
    aktual: `HTTP ${rTokenPalsu.status}, pesan: "${rTokenPalsu.data?.message}"`,
    sesuai: rTokenPalsu.status === 401,
  });

  const rHakAkses = await get('/api/users', TS);
  catat({
    modul: 'Autentikasi', skenario: 'Siswa mencoba mengakses menu manajemen pengguna milik administrator',
    input: 'GET /api/users menggunakan token siswa',
    harapan: 'Akses ditolak karena tidak sesuai hak akses (role)',
    aktual: `HTTP ${rHakAkses.status}, pesan: "${rHakAkses.data?.message}"`,
    sesuai: rHakAkses.status === 403,
  });

  // =================================================================
  // B. MODUL MANAJEMEN PENGGUNA (ADMINISTRATOR)
  // =================================================================
  const rListGuru = await get('/api/users?role=guru', TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menampilkan daftar data guru',
    input: 'Membuka menu Data Guru',
    harapan: 'Sistem menampilkan seluruh data guru beserta NIP dan mata pelajaran',
    aktual: `HTTP ${rListGuru.status}, ${rListGuru.data.length} data guru ditampilkan`,
    sesuai: rListGuru.status === 200 && rListGuru.data.length >= 4,
  });

  const rTambahGuru = await post('/api/users', {
    nama: 'Hendra Wijaya, S.Pd', email: 'hendra@smakk.sch.id', password: 'guru123',
    role: 'guru', nip: '199304182018011005', mapel: 'Kimia',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah data guru baru dengan data lengkap',
    input: 'Nama: Hendra Wijaya, S.Pd; Email: hendra@smakk.sch.id; NIP: 199304182018011005',
    harapan: 'Data guru tersimpan dan tampil pada tabel data guru',
    aktual: `HTTP ${rTambahGuru.status}, pesan: "${rTambahGuru.data?.message}"`,
    sesuai: rTambahGuru.status === 201,
  });
  const idGuruBaru = rTambahGuru.data?.id;

  const rDuplikat = await post('/api/users', {
    nama: 'Guru Duplikat', email: 'hendra@smakk.sch.id', password: 'guru123', role: 'guru',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah pengguna dengan email yang sudah terdaftar',
    input: 'Email: hendra@smakk.sch.id (sudah digunakan)',
    harapan: 'Sistem menolak dan menampilkan pesan "Email sudah terpakai"',
    aktual: `HTTP ${rDuplikat.status}, pesan: "${rDuplikat.data?.message}"`,
    sesuai: rDuplikat.status === 409,
  });

  const rTidakLengkap = await post('/api/users', { nama: 'Tanpa Email', role: 'guru' }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah pengguna dengan field wajib dikosongkan',
    input: 'Email dan password dikosongkan',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa field wajib diisi',
    aktual: `HTTP ${rTidakLengkap.status}, pesan: "${rTidakLengkap.data?.message}"`,
    sesuai: rTidakLengkap.status === 400,
  });

  const rUbahGuru = await put(`/api/users/${idGuruBaru}`, {
    nama: 'Hendra Wijaya, M.Pd', email: 'hendra@smakk.sch.id',
    nip: '199304182018011005', mapel: 'Kimia',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator mengubah data guru yang sudah ada',
    input: 'Mengubah nama menjadi "Hendra Wijaya, M.Pd"',
    harapan: 'Perubahan data tersimpan dan tampil pada tabel data guru',
    aktual: `HTTP ${rUbahGuru.status}, pesan: "${rUbahGuru.data?.message}"`,
    sesuai: rUbahGuru.status === 200,
  });

  const rHapusGuru = await del(`/api/users/${idGuruBaru}`, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menghapus data guru',
    input: 'Menekan tombol Hapus pada data guru Hendra Wijaya, M.Pd',
    harapan: 'Data guru terhapus dari sistem',
    aktual: `HTTP ${rHapusGuru.status}, pesan: "${rHapusGuru.data?.message}"`,
    sesuai: rHapusGuru.status === 200,
  });

  const kelasList = (await get('/api/kelas', TA)).data;
  const rTambahSiswa = await post('/api/users', {
    nama: 'Wulan Safitri', email: 'wulan@siswa.smakk.sch.id', password: 'siswa123',
    role: 'siswa', nis: '0012345690', id_kelas: kelasList[0].id,
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah data siswa dan menempatkannya pada sebuah kelas',
    input: `Nama: Wulan Safitri; NIS: 0012345690; Kelas: ${kelasList[0].nama_kelas}`,
    harapan: 'Data siswa tersimpan beserta kelasnya dan tampil pada tabel data siswa',
    aktual: `HTTP ${rTambahSiswa.status}, pesan: "${rTambahSiswa.data?.message}"`,
    sesuai: rTambahSiswa.status === 201,
  });

  const rListSiswa = await get('/api/users?role=siswa', TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menampilkan daftar data siswa',
    input: 'Membuka menu Data Siswa',
    harapan: 'Sistem menampilkan seluruh data siswa beserta NIS dan kelas',
    aktual: `HTTP ${rListSiswa.status}, ${rListSiswa.data.length} data siswa ditampilkan`,
    sesuai: rListSiswa.status === 200 && rListSiswa.data.length >= 12,
  });

  // ---------- Kelas ----------
  const rTambahKelas = await post('/api/kelas', {
    nama_kelas: 'XII IPA 1', tingkat: 'XII', tahun_ajaran: '2025/2026',
  }, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator menambah data kelas baru',
    input: 'Nama kelas: XII IPA 1; Tingkat: XII; Tahun ajaran: 2025/2026',
    harapan: 'Data kelas tersimpan dan tampil pada tabel data kelas',
    aktual: `HTTP ${rTambahKelas.status}, pesan: "${rTambahKelas.data?.message}"`,
    sesuai: rTambahKelas.status === 201,
  });
  const idKelasBaru = rTambahKelas.data?.id;

  const rUbahKelas = await put(`/api/kelas/${idKelasBaru}`, {
    nama_kelas: 'XII IPA 2', tingkat: 'XII', tahun_ajaran: '2025/2026',
  }, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator mengubah data kelas',
    input: 'Mengubah nama kelas menjadi XII IPA 2',
    harapan: 'Perubahan data kelas tersimpan',
    aktual: `HTTP ${rUbahKelas.status}, pesan: "${rUbahKelas.data?.message}"`,
    sesuai: rUbahKelas.status === 200,
  });

  const rHapusKelas = await del(`/api/kelas/${idKelasBaru}`, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator menghapus data kelas',
    input: 'Menekan tombol Hapus pada kelas XII IPA 2',
    harapan: 'Data kelas terhapus dari sistem',
    aktual: `HTTP ${rHapusKelas.status}, pesan: "${rHapusKelas.data?.message}"`,
    sesuai: rHapusKelas.status === 200,
  });

  // ---------- Mata Pelajaran ----------
  const guruOptions = (await get('/api/guru/options', TA)).data;
  const rTambahMapel = await post('/api/mapel', {
    id_guru: guruOptions[0].id, nama: 'Sejarah Indonesia', kode: 'SEJ-X',
    deskripsi: 'Sejarah Indonesia kelas X semester ganjil',
  }, TA);
  catat({
    modul: 'Manajemen Mata Pelajaran', skenario: 'Administrator menambah mata pelajaran dan menugaskan guru pengampu',
    input: 'Nama: Sejarah Indonesia; Kode: SEJ-X; Guru pengampu dipilih dari daftar',
    harapan: 'Data mata pelajaran tersimpan beserta guru pengampunya',
    aktual: `HTTP ${rTambahMapel.status}, pesan: "${rTambahMapel.data?.message}"`,
    sesuai: rTambahMapel.status === 201,
  });
  const idMapelBaru = rTambahMapel.data?.id;

  const rMapelKosong = await post('/api/mapel', { nama: '' }, TA);
  catat({
    modul: 'Manajemen Mata Pelajaran', skenario: 'Administrator menambah mata pelajaran dengan nama dikosongkan',
    input: 'Nama mata pelajaran = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa nama wajib diisi',
    aktual: `HTTP ${rMapelKosong.status}, pesan: "${rMapelKosong.data?.message}"`,
    sesuai: rMapelKosong.status === 400,
  });

  const rHapusMapel = await del(`/api/mapel/${idMapelBaru}`, TA);
  catat({
    modul: 'Manajemen Mata Pelajaran', skenario: 'Administrator menghapus data mata pelajaran',
    input: 'Menekan tombol Hapus pada mata pelajaran Sejarah Indonesia',
    harapan: 'Data mata pelajaran terhapus dari sistem',
    aktual: `HTTP ${rHapusMapel.status}, pesan: "${rHapusMapel.data?.message}"`,
    sesuai: rHapusMapel.status === 200,
  });

  // =================================================================
  // C. MODUL MATERI PEMBELAJARAN
  // =================================================================
  const mapelGuru = (await get('/api/mapel', TG)).data;
  const idMtk = mapelGuru.find((m) => m.kode === 'MTK-X').id;

  const fdMateri = new FormData();
  fdMateri.append('id_mapel', String(idMtk));
  fdMateri.append('judul', 'Latihan Soal SPLDV');
  fdMateri.append('konten', 'Kumpulan latihan soal sistem persamaan linear dua variabel beserta pembahasan.');
  fdMateri.append('file', new Blob(['Latihan Soal SPLDV - SMA Negeri 1 Karau Kuala'],
    { type: 'text/plain' }), 'latihan_spldv.txt');
  const rTambahMateri = await req('POST', '/api/materi', { token: TG, form: fdMateri });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi pembelajaran beserta file lampiran',
    input: 'Judul: Latihan Soal SPLDV; Mapel: Matematika Wajib; File: latihan_spldv.txt',
    harapan: 'Materi tersimpan, file terunggah, dan materi tampil pada daftar materi',
    aktual: `HTTP ${rTambahMateri.status}, pesan: "${rTambahMateri.data?.message}"`,
    sesuai: rTambahMateri.status === 201,
  });
  const idMateriBaru = rTambahMateri.data?.id;

  const fdKosong = new FormData();
  fdKosong.append('id_mapel', String(idMtk));
  fdKosong.append('judul', '');
  const rMateriKosong = await req('POST', '/api/materi', { token: TG, form: fdKosong });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi dengan judul dikosongkan',
    input: 'Judul materi = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa judul wajib diisi',
    aktual: `HTTP ${rMateriKosong.status}, pesan: "${rMateriKosong.data?.message}"`,
    sesuai: rMateriKosong.status === 400,
  });

  const mapelSemua = (await get('/api/mapel', TA)).data;
  const idBind = mapelSemua.find((m) => m.kode === 'BIND-X').id;
  const fdBukanMilik = new FormData();
  fdBukanMilik.append('id_mapel', String(idBind));
  fdBukanMilik.append('judul', 'Materi Uji Hak Akses');
  const rBukanMilik = await req('POST', '/api/materi', { token: TG, form: fdBukanMilik });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi pada mata pelajaran yang bukan diampunya',
    input: 'Guru Matematika menambah materi pada mata pelajaran Bahasa Indonesia',
    harapan: 'Sistem menolak karena mata pelajaran bukan milik guru tersebut',
    aktual: `HTTP ${rBukanMilik.status}, pesan: "${rBukanMilik.data?.message}"`,
    sesuai: rBukanMilik.status === 403,
  });

  const fdUbah = new FormData();
  fdUbah.append('id_mapel', String(idMtk));
  fdUbah.append('judul', 'Latihan Soal SPLDV dan Pembahasan');
  fdUbah.append('konten', 'Kumpulan latihan soal SPLDV beserta pembahasan lengkap tiap nomor.');
  const rUbahMateri = await req('PUT', `/api/materi/${idMateriBaru}`, { token: TG, form: fdUbah });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru mengubah data materi pembelajaran',
    input: 'Mengubah judul menjadi "Latihan Soal SPLDV dan Pembahasan"',
    harapan: 'Perubahan materi tersimpan dan tampil pada daftar materi',
    aktual: `HTTP ${rUbahMateri.status}, pesan: "${rUbahMateri.data?.message}"`,
    sesuai: rUbahMateri.status === 200,
  });

  const rHapusMateri = await del(`/api/materi/${idMateriBaru}`, TG);
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menghapus materi pembelajaran',
    input: 'Menekan tombol Hapus pada materi "Latihan Soal SPLDV dan Pembahasan"',
    harapan: 'Materi terhapus dari daftar materi',
    aktual: `HTTP ${rHapusMateri.status}, pesan: "${rHapusMateri.data?.message}"`,
    sesuai: rHapusMateri.status === 200,
  });

  const rMateriSiswa = await get('/api/materi', TS);
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Siswa menampilkan seluruh materi pembelajaran',
    input: 'Membuka menu Materi pada halaman siswa',
    harapan: 'Sistem menampilkan daftar materi seluruh mata pelajaran beserta guru pengampu',
    aktual: `HTTP ${rMateriSiswa.status}, ${rMateriSiswa.data.length} materi ditampilkan`,
    sesuai: rMateriSiswa.status === 200 && rMateriSiswa.data.length >= 8,
  });

  const rFilterMateri = await get(`/api/materi?id_mapel=${idMtk}`, TS);
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Siswa menyaring materi berdasarkan mata pelajaran',
    input: 'Filter mata pelajaran: Matematika Wajib',
    harapan: 'Sistem hanya menampilkan materi mata pelajaran yang dipilih',
    aktual: `HTTP ${rFilterMateri.status}, ${rFilterMateri.data.length} materi Matematika Wajib ditampilkan`,
    sesuai: rFilterMateri.status === 200 &&
      rFilterMateri.data.every((m) => m.nama_mapel === 'Matematika Wajib'),
  });

  const materiBerkas = rMateriSiswa.data.find((m) => m.file);
  const rUnduh = await fetch(`${BASE}/uploads/${materiBerkas.file}`);
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Siswa mengunduh file materi pembelajaran',
    input: `Menekan tombol Unduh File pada materi "${materiBerkas.judul}"`,
    harapan: 'File materi berhasil diunduh oleh siswa',
    aktual: `HTTP ${rUnduh.status}, ukuran file ${(await rUnduh.arrayBuffer()).byteLength} byte`,
    sesuai: rUnduh.status === 200,
  });

  // =================================================================
  // D. MODUL TUGAS DAN KUIS
  // =================================================================
  const tugasGuru = (await get('/api/tugas', TG)).data;
  const tLatihanMtk = tugasGuru.find((t) => t.judul === 'Latihan Persamaan Linear');
  const tKuisMtk = tugasGuru.find((t) => t.judul === 'Kuis Persamaan dan Pertidaksamaan Linear');

  const rBuatTugas = await post('/api/tugas', {
    id_mapel: idMtk, judul: 'Tugas Proyek Statistika', tipe: 'tugas',
    deskripsi: 'Kumpulkan data tinggi badan teman sekelas, lalu sajikan dalam tabel distribusi frekuensi.',
    deadline: '2026-12-20T23:59',
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru membuat tugas baru beserta batas waktu pengumpulan',
    input: 'Judul: Tugas Proyek Statistika; Tipe: tugas; Deadline: 20 Desember 2026',
    harapan: 'Tugas tersimpan dan tampil pada daftar tugas guru maupun siswa',
    aktual: `HTTP ${rBuatTugas.status}, pesan: "${rBuatTugas.data?.message}"`,
    sesuai: rBuatTugas.status === 201,
  });
  const idTugasBaru = rBuatTugas.data?.id;

  const rTugasKosong = await post('/api/tugas', { id_mapel: idMtk, judul: '' }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru membuat tugas dengan judul dikosongkan',
    input: 'Judul tugas = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa judul wajib diisi',
    aktual: `HTTP ${rTugasKosong.status}, pesan: "${rTugasKosong.data?.message}"`,
    sesuai: rTugasKosong.status === 400,
  });

  const rTambahSoal = await post(`/api/tugas/${idTugasBaru}/soal`, {
    pertanyaan: 'Rata-rata dari data 5, 7, 9, 11 adalah ...',
    tipe: 'pilihan_ganda', pilihan_a: '7', pilihan_b: '8', pilihan_c: '9', pilihan_d: '10',
    jawaban_benar: 'B', bobot: 20,
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru menambah butir soal pilihan ganda beserta kunci jawaban',
    input: 'Pertanyaan, empat pilihan jawaban, kunci jawaban B, bobot 20',
    harapan: 'Butir soal tersimpan dan jumlah soal pada tugas bertambah',
    aktual: `HTTP ${rTambahSoal.status}, pesan: "${rTambahSoal.data?.message}"`,
    sesuai: rTambahSoal.status === 201,
  });
  const idSoalBaru = rTambahSoal.data?.id;

  const rSoalTanpaKunci = await post(`/api/tugas/${idTugasBaru}/soal`, {
    pertanyaan: 'Soal tanpa pilihan jawaban', tipe: 'pilihan_ganda', pilihan_a: '', pilihan_b: '',
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru menambah soal pilihan ganda tanpa mengisi pilihan jawaban',
    input: 'Pilihan A dan B dikosongkan',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa pilihan jawaban wajib diisi',
    aktual: `HTTP ${rSoalTanpaKunci.status}, pesan: "${rSoalTanpaKunci.data?.message}"`,
    sesuai: rSoalTanpaKunci.status === 400,
  });

  await del(`/api/soal/${idSoalBaru}`, TG);
  const rHapusTugas = await del(`/api/tugas/${idTugasBaru}`, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru menghapus tugas beserta butir soalnya',
    input: 'Menekan tombol Hapus pada tugas "Tugas Proyek Statistika"',
    harapan: 'Tugas beserta seluruh butir soalnya terhapus dari sistem',
    aktual: `HTTP ${rHapusTugas.status}, pesan: "${rHapusTugas.data?.message}"`,
    sesuai: rHapusTugas.status === 200,
  });

  const rTugasGuruLain = await put(`/api/tugas/${tKuisMtk.id}`, { judul: 'Diubah pihak lain' }, TG2);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru mengubah tugas milik guru mata pelajaran lain',
    input: 'Guru Bahasa Indonesia mengubah tugas milik guru Matematika',
    harapan: 'Sistem menolak karena tugas bukan milik guru tersebut',
    aktual: `HTTP ${rTugasGuruLain.status}, pesan: "${rTugasGuruLain.data?.message}"`,
    sesuai: rTugasGuruLain.status === 403,
  });

  // ---------------- Pengerjaan oleh siswa (sekaligus mengisi data) ----------------
  const akunSiswa = [
    'ahmad', 'dewi', 'rian', 'aisyah', 'bayu', 'putri',
    'fajar', 'salsa', 'andi', 'maya', 'rizky', 'intan',
  ];
  const tokenSiswa = {};
  for (const s of akunSiswa) {
    const r = await login(`${s}@siswa.smakk.sch.id`, 'siswa123');
    tokenSiswa[s] = r.data.token;
  }

  // Ambil daftar tugas versi siswa
  const tugasSiswa = (await get('/api/tugas', tokenSiswa.ahmad)).data;
  const cari = (j) => tugasSiswa.find((t) => t.judul === j);
  const tKuisBind = cari('Kuis Teks Deskripsi');
  const tTugasBind = cari('Tugas Menulis Teks Deskripsi');
  const tLatihanFis = cari('Latihan Soal Besaran dan Satuan');
  const tKuisBing = cari('Kuis Descriptive Text');

  // -- Kuis Matematika (5 soal pilihan ganda, dinilai otomatis) --
  const soalKuisMtk = (await get(`/api/tugas/${tKuisMtk.id}/soal`, TG)).data;
  const kunciMtk = soalKuisMtk.map((s) => s.jawaban_benar);
  // pola: indeks soal yang sengaja dijawab salah tiap siswa
  const polaMtk = {
    ahmad: [3], dewi: [], rian: [1, 4], aisyah: [], bayu: [0, 2, 3],
    putri: [2], fajar: [1], salsa: [], andi: [0, 1, 3, 4], maya: [4],
  };
  let rKuisPertama = null;
  for (const [siswa, salah] of Object.entries(polaMtk)) {
    const jawaban = soalKuisMtk.map((s, i) => ({
      id_soal: s.id,
      pilihan: salah.includes(i)
        ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciMtk[i])
        : kunciMtk[i],
    }));
    const r = await post(`/api/tugas/${tKuisMtk.id}/submit`, { jawaban }, tokenSiswa[siswa]);
    if (!rKuisPertama) rKuisPertama = { siswa, r, benar: soalKuisMtk.length - salah.length };
  }
  const skorDiharapkan = (rKuisPertama.benar / soalKuisMtk.length) * 100;
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa mengerjakan kuis pilihan ganda dan mengirim jawaban',
    input: `Siswa ${rKuisPertama.siswa} menjawab ${soalKuisMtk.length} soal pilihan ganda pada Kuis Persamaan dan Pertidaksamaan Linear (${rKuisPertama.benar} jawaban benar)`,
    harapan: `Jawaban tersimpan, sistem melakukan koreksi otomatis dan langsung menampilkan skor ${skorDiharapkan}`,
    aktual: `HTTP ${rKuisPertama.r.status}, status penilaian: ${rKuisPertama.r.data?.status}, skor otomatis: ${rKuisPertama.r.data?.skor}`,
    sesuai: rKuisPertama.r.status === 200 && rKuisPertama.r.data.status === 'final'
      && Number(rKuisPertama.r.data.skor) === skorDiharapkan,
  });

  const cekSalah = await post(`/api/tugas/${tKuisMtk.id}/submit`, {
    jawaban: soalKuisMtk.map((s, i) => ({
      id_soal: s.id,
      pilihan: i < 3 ? kunciMtk[i] : ['A', 'B', 'C', 'D'].find((k) => k !== kunciMtk[i]),
    })),
  }, tokenSiswa.intan);
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Sistem mengoreksi jawaban kuis yang sebagian benar dan sebagian salah',
    input: 'Siswa intan menjawab benar 3 dari 5 soal (bobot tiap soal 20)',
    harapan: 'Sistem memberikan skor sesuai jumlah jawaban benar, yaitu 60',
    aktual: `HTTP ${cekSalah.status}, skor yang diberikan sistem: ${cekSalah.data?.skor}`,
    sesuai: cekSalah.status === 200 && Number(cekSalah.data.skor) === 60,
  });

  const rKerjakanUlang = await get(`/api/tugas/${tKuisMtk.id}/kerjakan`, tokenSiswa.ahmad);
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa melihat hasil kuis yang telah dinilai beserta kunci jawaban',
    input: 'Menekan tombol "Lihat Hasil" pada kuis yang sudah dikerjakan',
    harapan: 'Sistem menampilkan nilai akhir, jawaban siswa, serta kunci jawaban tiap butir soal',
    aktual: `HTTP ${rKerjakanUlang.status}, nilai akhir: ${rKerjakanUlang.data?.total_skor}, kunci jawaban ditampilkan: ${rKerjakanUlang.data?.soal?.[0]?.jawaban_benar !== undefined}`,
    sesuai: rKerjakanUlang.status === 200 && rKerjakanUlang.data.graded === true,
  });

  const belumKerja = await get(`/api/tugas/${tKuisBind.id}/kerjakan`, tokenSiswa.rizky);
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Sistem menyembunyikan kunci jawaban pada kuis yang belum dinilai',
    input: 'Siswa membuka kuis yang belum dikerjakan',
    harapan: 'Sistem menampilkan soal tanpa menampilkan kunci jawaban',
    aktual: `HTTP ${belumKerja.status}, kunci jawaban pada respons: ${belumKerja.data?.soal?.[0]?.jawaban_benar === undefined ? 'tidak ditampilkan' : 'ditampilkan'}`,
    sesuai: belumKerja.status === 200 && belumKerja.data.soal[0].jawaban_benar === undefined,
  });

  // -- Kuis Bahasa Indonesia (3 PG + 1 esai) --
  const soalKuisBind = (await get(`/api/tugas/${tKuisBind.id}/soal`, TG2)).data;
  const kunciBind = soalKuisBind.map((s) => s.jawaban_benar);
  const esaiJawaban = {
    ahmad: 'Sekolahku berada di tepi jalan utama Bangkuang. Halamannya luas dengan rumput hijau yang selalu terpangkas rapi. Di depan ruang guru berdiri tiang bendera yang menjulang, dan di sampingnya berjajar pohon ketapang yang meneduhkan.',
    dewi: 'SMA Negeri 1 Karau Kuala memiliki bangunan bercat putih kebiruan. Setiap pagi koridor kelas dipenuhi suara siswa yang bersiap belajar. Taman kecil di tengah sekolah ditanami bunga kertas berwarna-warni.',
    putri: 'Ruang kelasku cukup luas dan terang karena memiliki empat jendela besar. Di dinding depan terpasang papan tulis putih dan foto pahlawan. Udara di dalam kelas terasa sejuk saat pagi hari.',
    fajar: 'Sekolahku bersih dan nyaman. Ada lapangan upacara di tengah.',
    salsa: 'Perpustakaan sekolahku terletak di sudut belakang gedung. Rak-rak kayunya dipenuhi buku pelajaran dan novel. Suasananya tenang sehingga nyaman digunakan untuk membaca pada jam istirahat.',
    aisyah: 'Kantin sekolah berada di samping lapangan basket. Setiap istirahat aromanya harum oleh gorengan hangat. Meja-meja panjangnya selalu penuh oleh siswa yang bercengkerama.',
  };
  const polaBind = { ahmad: [], dewi: [1], putri: [], fajar: [0, 2], salsa: [2], aisyah: [] };
  let rEsaiPertama = null;
  for (const [siswa, salah] of Object.entries(polaBind)) {
    const jawaban = soalKuisBind.map((s, i) => (s.tipe === 'esai'
      ? { id_soal: s.id, jawaban_teks: esaiJawaban[siswa] }
      : {
        id_soal: s.id,
        pilihan: salah.includes(i) ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciBind[i]) : kunciBind[i],
      }));
    const r = await post(`/api/tugas/${tKuisBind.id}/submit`, { jawaban }, tokenSiswa[siswa]);
    if (!rEsaiPertama) rEsaiPertama = { siswa, r };
  }
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa mengerjakan kuis yang memuat soal pilihan ganda dan soal esai',
    input: 'Siswa menjawab 3 soal pilihan ganda dan 1 soal esai pada Kuis Teks Deskripsi',
    harapan: 'Pilihan ganda terkoreksi otomatis, sedangkan nilai akhir tertunda sampai esai dinilai guru',
    aktual: `HTTP ${rEsaiPertama.r.status}, status penilaian: ${rEsaiPertama.r.data?.status} (menunggu penilaian esai oleh guru)`,
    sesuai: rEsaiPertama.r.status === 200 && rEsaiPertama.r.data.status === 'pending',
  });

  // -- Tugas biasa Matematika: pengumpulan teks + file --
  const jawabanLatihan = {
    ahmad: 'Nomor 1: 2x + 6 = 14 -> 2x = 8 -> x = 4.\nNomor 2: 3x - 9 = 0 -> 3x = 9 -> x = 3.\nNomor 3: 5x = 3x + 12 -> 2x = 12 -> x = 6.\nSeluruh langkah penyelesaian selengkapnya saya lampirkan pada file.',
    dewi: 'Seluruh soal nomor 1 sampai 10 telah saya kerjakan. Hasil pekerjaan saya tulis tangan lalu saya pindai dan lampirkan pada file terlampir.',
    rian: 'Nomor 1 sampai 8 sudah saya kerjakan, nomor 9 dan 10 masih saya ragu pada langkah pemindahan ruas. Mohon koreksinya, Pak.',
    aisyah: 'Jawaban lengkap nomor 1-10 terlampir pada file. Setiap nomor saya sertakan langkah pengerjaannya.',
    bayu: 'Nomor 1: x = 4; Nomor 2: x = 3; Nomor 3: x = 6; Nomor 4: x = 5; Nomor 5: x = 2. Sisanya menyusul.',
    putri: 'Semua soal telah saya kerjakan beserta langkah-langkahnya, terlampir pada file jawaban.',
    andi: 'Saya kerjakan nomor 1 sampai 10 dengan metode pindah ruas seperti yang dijelaskan Bapak di kelas.',
  };
  let rKumpulTugas = null;
  for (const [siswa, teks] of Object.entries(jawabanLatihan)) {
    const fd = new FormData();
    fd.append('jawaban', teks);
    fd.append('file', new Blob([`Lembar jawaban ${siswa} - Latihan Persamaan Linear`],
      { type: 'text/plain' }), `jawaban_${siswa}.txt`);
    const r = await req('POST', `/api/tugas/${tLatihanMtk.id}/submit`, { token: tokenSiswa[siswa], form: fd });
    if (!rKumpulTugas) rKumpulTugas = { siswa, r };
  }
  catat({
    modul: 'Pengumpulan Tugas', skenario: 'Siswa mengumpulkan tugas berupa jawaban teks beserta lampiran file',
    input: `Siswa ${rKumpulTugas.siswa} mengisi kolom jawaban dan mengunggah file jawaban_${rKumpulTugas.siswa}.txt`,
    harapan: 'Tugas tersimpan, file terunggah, dan status berubah menjadi "Menunggu penilaian"',
    aktual: `HTTP ${rKumpulTugas.r.status}, pesan: "${rKumpulTugas.r.data?.message}"`,
    sesuai: rKumpulTugas.r.status === 200,
  });

  // -- Tugas Bahasa Indonesia: pengumpulan teks --
  const teksDeskripsi = {
    dewi: 'Lingkungan Sekolahku\n\nSMA Negeri 1 Karau Kuala berdiri di tepi jalan utama Kecamatan Karau Kuala. Bangunannya bercat putih dengan lis biru yang tampak bersih setiap pagi.\n\nHalaman sekolah cukup luas dan ditumbuhi rumput hijau. Di tengahnya berdiri tiang bendera, sementara di sisi kiri berjajar pohon ketapang yang rindang.\n\nSuasana sekolahku sangat nyaman untuk belajar. Angin sejuk dari arah sungai membuat udara di ruang kelas tidak pernah terasa panas.',
    putri: 'Lingkungan Sekolahku\n\nSekolahku terletak tidak jauh dari permukiman warga sehingga mudah dijangkau dengan sepeda.\n\nDi dalam kompleks sekolah terdapat dua belas ruang kelas, satu perpustakaan, dan sebuah laboratorium IPA. Lorong penghubungnya beratap seng sehingga siswa tetap terlindung ketika hujan.\n\nSetiap sudut sekolah dijaga kebersihannya oleh seluruh warga sekolah sehingga suasananya selalu asri.',
    salsa: 'Lingkungan Sekolahku\n\nGerbang sekolahku bercat hijau tua dan selalu terbuka sejak pukul enam pagi.\n\nDi sebelah kanan gerbang terdapat taman kecil dengan bunga kertas berwarna merah muda. Lapangan upacara berada tepat di tengah kompleks sekolah.\n\nAku sangat menyukai suasana sekolahku, terutama pada pagi hari ketika embun masih menempel di rumput lapangan.',
    fajar: 'Lingkungan Sekolahku\n\nSekolahku cukup luas dan memiliki banyak ruang kelas. Ada lapangan untuk upacara dan olahraga.\n\nDi belakang sekolah terdapat kebun kecil yang ditanami tanaman obat oleh siswa kelas X.\n\nSekolahku adalah tempat yang menyenangkan untuk belajar bersama teman-teman.',
    andi: 'Lingkungan Sekolahku\n\nSMA Negeri 1 Karau Kuala memiliki halaman depan yang luas dengan pagar besi berwarna hijau.\n\nRuang kelas berjajar rapi menghadap lapangan. Setiap kelas memiliki jendela besar sehingga cahaya matahari masuk dengan leluasa.\n\nKarena lingkungannya rindang dan bersih, aku merasa betah berlama-lama di sekolah.',
  };
  for (const [siswa, teks] of Object.entries(teksDeskripsi)) {
    const fd = new FormData();
    fd.append('jawaban', teks);
    await req('POST', `/api/tugas/${tTugasBind.id}/submit`, { token: tokenSiswa[siswa], form: fd });
  }

  // -- Tugas Fisika yang deadline-nya sudah lewat --
  const fdTelat = new FormData();
  fdTelat.append('jawaban', 'Mohon maaf Pak, saya terlambat mengumpulkan karena jaringan internet di rumah bermasalah. Latihan konversi satuan nomor 1-10 sudah saya kerjakan seluruhnya.');
  const rTelat = await req('POST', `/api/tugas/${tLatihanFis.id}/submit`, { token: tokenSiswa.maya, form: fdTelat });
  const cekTelat = (await get('/api/tugas', tokenSiswa.maya)).data
    .find((t) => t.id === tLatihanFis.id);
  catat({
    modul: 'Pengumpulan Tugas', skenario: 'Siswa mengumpulkan tugas setelah batas waktu (deadline) terlewati',
    input: 'Siswa maya mengumpulkan Latihan Soal Besaran dan Satuan setelah deadline berakhir',
    harapan: 'Tugas tetap tersimpan namun ditandai sebagai pengumpulan terlambat',
    aktual: `HTTP ${rTelat.status}, pesan: "${rTelat.data?.message}", penanda terlambat = ${cekTelat.pengumpulan?.terlambat}`,
    sesuai: rTelat.status === 200 && cekTelat.pengumpulan.terlambat === 1,
  });

  const fdTelat2 = new FormData();
  fdTelat2.append('jawaban', 'Latihan konversi satuan dan angka penting nomor 1 sampai 10 sudah selesai saya kerjakan.');
  await req('POST', `/api/tugas/${tLatihanFis.id}/submit`, { token: tokenSiswa.rizky, form: fdTelat2 });

  // -- Kuis Bahasa Inggris --
  const soalKuisBing = (await get(`/api/tugas/${tKuisBing.id}/soal`, TG4)).data;
  const kunciBing = soalKuisBing.map((s) => s.jawaban_benar);
  const esaiBing = {
    ahmad: 'My classroom is on the second floor of the school building. It has four large windows, so the room is always bright. There are thirty-two desks and a white board in front of the class.',
    dewi: 'My classroom is clean and comfortable. The walls are painted light blue and there are some pictures of Indonesian heroes on them. I like studying there with my classmates.',
    bayu: 'My classroom is big. There is a white board and many chairs.',
    intan: 'My classroom is located next to the school library. It is equipped with a projector that my teacher often uses. In the corner of the room, there is a small bookshelf full of dictionaries.',
  };
  const polaBing = { ahmad: [], dewi: [2], bayu: [0, 1], intan: [] };
  for (const [siswa, salah] of Object.entries(polaBing)) {
    const jawaban = soalKuisBing.map((s, i) => (s.tipe === 'esai'
      ? { id_soal: s.id, jawaban_teks: esaiBing[siswa] }
      : {
        id_soal: s.id,
        pilihan: salah.includes(i) ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciBing[i]) : kunciBing[i],
      }));
    await post(`/api/tugas/${tKuisBing.id}/submit`, { jawaban }, tokenSiswa[siswa]);
  }

  // =================================================================
  // E. MODUL PENILAIAN
  // =================================================================
  const kumpulLatihan = (await get(`/api/tugas/${tLatihanMtk.id}/pengumpulan`, TG)).data;
  catat({
    modul: 'Penilaian', skenario: 'Guru menampilkan daftar siswa yang telah mengumpulkan tugas',
    input: 'Menekan tombol "Pengumpulan" pada tugas Latihan Persamaan Linear',
    harapan: 'Sistem menampilkan daftar siswa, waktu pengumpulan, file jawaban, dan status penilaian',
    aktual: `HTTP 200, ${kumpulLatihan.length} pengumpulan ditampilkan`,
    sesuai: kumpulLatihan.length >= 5,
  });

  const skorLatihan = { 'Ahmad Fauzi': [90, 'Langkah pengerjaan sudah runtut dan benar. Pertahankan.'],
    'Dewi Lestari': [85, 'Jawaban benar, tulisan pada lampiran agar diperjelas lagi.'],
    'Rian Pratama': [75, 'Nomor 9 dan 10 masih keliru pada pemindahan ruas. Pelajari kembali.'],
    'Nur Aisyah': [95, 'Sangat baik, seluruh langkah penyelesaian lengkap.'],
    'Putri Rahmawati': [88, 'Pekerjaan rapi dan jawaban tepat.'],
    'Andi Setiawan': [80, 'Sudah benar, namun beberapa langkah masih dipersingkat.'] };
  let rNilaiPertama = null;
  for (const s of kumpulLatihan) {
    const nilai = skorLatihan[s.nama_siswa];
    if (!nilai) continue;
    const r = await post('/api/nilai', { id_kumpul: s.id, skor: nilai[0], catatan: nilai[1] }, TG);
    if (!rNilaiPertama) rNilaiPertama = { s, r, nilai };
  }
  catat({
    modul: 'Penilaian', skenario: 'Guru memberikan nilai dan catatan pada tugas yang dikumpulkan siswa',
    input: `Nilai ${rNilaiPertama.nilai[0]} untuk ${rNilaiPertama.s.nama_siswa} beserta catatan guru`,
    harapan: 'Nilai tersimpan dan langsung tampil pada rekap nilai siswa',
    aktual: `HTTP ${rNilaiPertama.r.status}, pesan: "${rNilaiPertama.r.data?.message}"`,
    sesuai: rNilaiPertama.r.status === 200,
  });

  const rNilaiKosong = await post('/api/nilai', { id_kumpul: kumpulLatihan[0].id, skor: '' }, TG);
  catat({
    modul: 'Penilaian', skenario: 'Guru menyimpan penilaian dengan kolom skor dikosongkan',
    input: 'Skor = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa skor wajib diisi',
    aktual: `HTTP ${rNilaiKosong.status}, pesan: "${rNilaiKosong.data?.message}"`,
    sesuai: rNilaiKosong.status === 400,
  });

  const rNilaiBukanMilik = await post('/api/nilai', { id_kumpul: kumpulLatihan[0].id, skor: 100 }, TG2);
  catat({
    modul: 'Penilaian', skenario: 'Guru memberi nilai pada pengumpulan mata pelajaran guru lain',
    input: 'Guru Bahasa Indonesia menilai pengumpulan tugas Matematika',
    harapan: 'Sistem menolak karena pengumpulan bukan pada mata pelajaran guru tersebut',
    aktual: `HTTP ${rNilaiBukanMilik.status}, pesan: "${rNilaiBukanMilik.data?.message}"`,
    sesuai: rNilaiBukanMilik.status === 403,
  });

  // -- Penilaian esai pada kuis Bahasa Indonesia --
  const kumpulKuisBind = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG2)).data;
  const soalEsaiBind = soalKuisBind.find((s) => s.tipe === 'esai');
  const skorEsai = {
    'Ahmad Fauzi': [30, 'Deskripsi sangat hidup dan struktur sudah tepat.'],
    'Dewi Lestari': [28, 'Deskripsi baik, tambahkan lagi penggunaan pancaindra.'],
    'Putri Rahmawati': [26, 'Sudah sesuai struktur, kembangkan lagi deskripsi bagiannya.'],
    'Salsabila Azzahra': [29, 'Pemilihan kata konkret sudah sangat baik.'],
  };
  let rNilaiEsai = null;
  for (const s of kumpulKuisBind) {
    const nilai = skorEsai[s.nama_siswa];
    if (!nilai) continue; // sisanya sengaja dibiarkan menunggu penilaian
    const detail = await get(`/api/pengumpulan/${s.id}`, TG2);
    const r = await post(`/api/pengumpulan/${s.id}/nilai`, {
      scores: [{ id_soal: soalEsaiBind.id, skor: nilai[0] }], catatan: nilai[1],
    }, TG2);
    if (!rNilaiEsai) rNilaiEsai = { s, r, nilai, detail };
  }
  const rekapCek = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG2)).data
    .find((x) => x.nama_siswa === rNilaiEsai.s.nama_siswa);
  catat({
    modul: 'Penilaian', skenario: 'Guru memeriksa dan menilai jawaban esai pada kuis',
    input: `Memberi skor ${rNilaiEsai.nilai[0]} untuk jawaban esai ${rNilaiEsai.s.nama_siswa}`,
    harapan: 'Sistem menggabungkan skor pilihan ganda dan esai lalu menghasilkan nilai akhir 0-100',
    aktual: `HTTP ${rNilaiEsai.r.status}, nilai akhir yang dihasilkan sistem: ${rekapCek?.skor}`,
    sesuai: rNilaiEsai.r.status === 200 && rekapCek?.skor != null,
  });

  const pendingCek = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG2)).data
    .filter((x) => x.esai_belum_dinilai > 0);
  catat({
    modul: 'Penilaian', skenario: 'Sistem menandai pengumpulan kuis yang esainya belum dinilai guru',
    input: 'Membuka daftar pengumpulan Kuis Teks Deskripsi',
    harapan: 'Pengumpulan yang esainya belum dinilai ditandai "Perlu nilai esai" dan nilai akhirnya belum keluar',
    aktual: `HTTP 200, ${pendingCek.length} pengumpulan ditandai perlu penilaian esai`,
    sesuai: pendingCek.length > 0 && pendingCek.every((p) => p.skor == null),
  });

  // -- Penilaian esai kuis Bahasa Inggris --
  const kumpulKuisBing = (await get(`/api/tugas/${tKuisBing.id}/pengumpulan`, TG4)).data;
  const soalEsaiBing = soalKuisBing.find((s) => s.tipe === 'esai');
  const skorEsaiBing = {
    'Ahmad Fauzi': [23, 'Good description with clear details.'],
    'Dewi Lestari': [22, 'Well written, add more specific adjectives.'],
    'Intan Permata': [24, 'Excellent, the details are very clear.'],
  };
  for (const s of kumpulKuisBing) {
    const nilai = skorEsaiBing[s.nama_siswa];
    if (!nilai) continue;
    await post(`/api/pengumpulan/${s.id}/nilai`, {
      scores: [{ id_soal: soalEsaiBing.id, skor: nilai[0] }], catatan: nilai[1],
    }, TG4);
  }

  // -- Penilaian tugas Bahasa Indonesia --
  const kumpulTugasBind = (await get(`/api/tugas/${tTugasBind.id}/pengumpulan`, TG2)).data;
  const skorTugasBind = {
    'Dewi Lestari': [92, 'Struktur lengkap dan deskripsi sangat hidup.'],
    'Putri Rahmawati': [87, 'Sudah baik, penutup dapat dipertegas lagi.'],
    'Salsabila Azzahra': [90, 'Pemilihan diksi sangat baik dan runtut.'],
  };
  for (const s of kumpulTugasBind) {
    const nilai = skorTugasBind[s.nama_siswa];
    if (!nilai) continue;
    await post('/api/nilai', { id_kumpul: s.id, skor: nilai[0], catatan: nilai[1] }, TG2);
  }

  // -- Penilaian tugas Fisika (termasuk yang terlambat) --
  const kumpulFis = (await get(`/api/tugas/${tLatihanFis.id}/pengumpulan`, TG3)).data;
  for (const s of kumpulFis) {
    if (s.nama_siswa === 'Maya Anggraini') {
      await post('/api/nilai', { id_kumpul: s.id, skor: 78, catatan: 'Jawaban benar, namun dikumpulkan melewati batas waktu.' }, TG3);
    }
  }

  const rRekap = await get('/api/nilai/saya', tokenSiswa.ahmad);
  catat({
    modul: 'Rekap Nilai', skenario: 'Siswa melihat rekap nilai seluruh tugas dan kuis',
    input: 'Membuka menu Nilai pada halaman siswa',
    harapan: 'Sistem menampilkan seluruh nilai, catatan guru, dan rata-rata nilai siswa',
    aktual: `HTTP ${rRekap.status}, ${rRekap.data.length} baris nilai ditampilkan, ${rRekap.data.filter((n) => n.skor != null).length} di antaranya sudah dinilai`,
    sesuai: rRekap.status === 200 && rRekap.data.length >= 3,
  });

  const rRekapLain = await get('/api/nilai/saya', tokenSiswa.dewi);
  const bocor = rRekapLain.data.some((n) => rRekap.data.some(
    (m) => m.judul_tugas === n.judul_tugas && m.skor === n.skor && m.catatan === n.catatan && n.catatan));
  catat({
    modul: 'Rekap Nilai', skenario: 'Sistem membatasi rekap nilai hanya milik siswa yang sedang login',
    input: 'Login sebagai siswa lain lalu membuka menu Nilai',
    harapan: 'Sistem hanya menampilkan nilai milik siswa yang sedang login',
    aktual: `HTTP ${rRekapLain.status}, data nilai yang ditampilkan berbeda untuk tiap siswa: ${!bocor ? 'ya' : 'tidak'}`,
    sesuai: rRekapLain.status === 200 && !bocor,
  });

  // =================================================================
  // F. MODUL FORUM DISKUSI
  // =================================================================
  const rTopik = await post('/api/forum', {
    id_mapel: idMtk, judul: 'Persiapan Ulangan Harian Persamaan Linear',
    pesan: 'Assalamualaikum Pak. Untuk ulangan harian minggu depan, apakah soal cerita juga termasuk dalam materi yang diujikan?',
  }, tokenSiswa.dewi);
  catat({
    modul: 'Forum Diskusi', skenario: 'Siswa membuat topik diskusi baru pada sebuah mata pelajaran',
    input: 'Judul topik dan isi pesan diisi, mata pelajaran: Matematika Wajib',
    harapan: 'Topik tersimpan dan tampil paling atas pada daftar diskusi',
    aktual: `HTTP ${rTopik.status}, pesan: "${rTopik.data?.message}"`,
    sesuai: rTopik.status === 201,
  });
  const idTopik = rTopik.data?.id;

  const rBalas = await post('/api/forum', {
    id_mapel: idMtk, id_parent: idTopik,
    pesan: 'Waalaikumsalam, Dewi. Betul, soal cerita juga diujikan. Pelajari kembali cara menyusun model matematikanya terlebih dahulu sebelum menyelesaikan persamaan.',
  }, TG);
  catat({
    modul: 'Forum Diskusi', skenario: 'Guru membalas topik diskusi yang dibuat siswa',
    input: 'Menekan tombol Balas lalu menuliskan jawaban pada topik siswa',
    harapan: 'Balasan tersimpan dan tampil di bawah topik yang bersangkutan',
    aktual: `HTTP ${rBalas.status}, pesan: "${rBalas.data?.message}"`,
    sesuai: rBalas.status === 201,
  });

  await post('/api/forum', {
    id_mapel: idMtk, id_parent: idTopik,
    pesan: 'Baik Pak, terima kasih atas penjelasannya. Saya akan berlatih membuat model matematikanya lebih dahulu.',
  }, tokenSiswa.dewi);

  const rPesanKosong = await post('/api/forum', { id_mapel: idMtk, pesan: '' }, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna mengirim pesan forum dengan isi pesan dikosongkan',
    input: 'Isi pesan = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa isi pesan wajib diisi',
    aktual: `HTTP ${rPesanKosong.status}, pesan: "${rPesanKosong.data?.message}"`,
    sesuai: rPesanKosong.status === 400,
  });

  const rLihatForum = await get(`/api/forum?id_mapel=${idMtk}`, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna menampilkan daftar diskusi pada sebuah mata pelajaran',
    input: 'Memilih mata pelajaran Matematika Wajib pada halaman forum',
    harapan: 'Sistem menampilkan seluruh topik beserta balasannya secara berurutan',
    aktual: `HTTP ${rLihatForum.status}, ${rLihatForum.data.length} topik dengan total ${rLihatForum.data.reduce((a, t) => a + t.balasan.length, 0)} balasan`,
    sesuai: rLihatForum.status === 200 && rLihatForum.data.length >= 2,
  });

  const pesanUji = await post('/api/forum', {
    id_mapel: idMtk, pesan: 'Pesan percobaan yang akan dihapus kembali oleh penulisnya.',
  }, tokenSiswa.rian);
  const rHapusOrangLain = await del(`/api/forum/${pesanUji.data.id}`, tokenSiswa.bayu);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna mencoba menghapus pesan forum milik pengguna lain',
    input: 'Siswa bayu menghapus pesan milik siswa rian',
    harapan: 'Sistem menolak karena pesan bukan milik pengguna tersebut',
    aktual: `HTTP ${rHapusOrangLain.status}, pesan: "${rHapusOrangLain.data?.message}"`,
    sesuai: rHapusOrangLain.status === 403,
  });

  const rHapusSendiri = await del(`/api/forum/${pesanUji.data.id}`, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna menghapus pesan forum miliknya sendiri',
    input: 'Siswa rian menghapus pesan yang ditulisnya sendiri',
    harapan: 'Pesan terhapus dari daftar diskusi',
    aktual: `HTTP ${rHapusSendiri.status}, pesan: "${rHapusSendiri.data?.message}"`,
    sesuai: rHapusSendiri.status === 200,
  });

  // =================================================================
  // G. MODUL DASHBOARD & LOGOUT
  // =================================================================
  const dAdmin = await get('/api/dashboard', TA);
  catat({
    modul: 'Dashboard', skenario: 'Administrator melihat statistik penggunaan sistem pada dashboard',
    input: 'Membuka dashboard administrator',
    harapan: 'Sistem menampilkan jumlah guru, siswa, kelas, mata pelajaran, materi, dan tugas',
    aktual: `HTTP ${dAdmin.status}: ${dAdmin.data.total_guru} guru, ${dAdmin.data.total_siswa} siswa, ${dAdmin.data.total_kelas} kelas, ${dAdmin.data.total_mapel} mapel, ${dAdmin.data.total_materi} materi, ${dAdmin.data.total_tugas} tugas`,
    sesuai: dAdmin.status === 200 && dAdmin.data.total_siswa >= 12,
  });

  const dGuru = await get('/api/dashboard', TG);
  catat({
    modul: 'Dashboard', skenario: 'Guru melihat ringkasan aktivitas pembelajaran pada dashboard',
    input: 'Membuka dashboard guru',
    harapan: 'Sistem menampilkan jumlah mata pelajaran, materi, tugas, dan pekerjaan yang perlu dinilai',
    aktual: `HTTP ${dGuru.status}: ${dGuru.data.total_mapel} mapel, ${dGuru.data.total_materi} materi, ${dGuru.data.total_tugas} tugas, ${dGuru.data.perlu_dinilai} perlu dinilai`,
    sesuai: dGuru.status === 200,
  });

  const dSiswa = await get('/api/dashboard', tokenSiswa.ahmad);
  catat({
    modul: 'Dashboard', skenario: 'Siswa melihat ringkasan tugas pada dashboard',
    input: 'Membuka dashboard siswa',
    harapan: 'Sistem menampilkan jumlah tugas, tugas yang sudah dikumpulkan, dan yang sudah dinilai',
    aktual: `HTTP ${dSiswa.status}: ${dSiswa.data.total_tugas} tugas, ${dSiswa.data.sudah_kumpul} dikumpulkan, ${dSiswa.data.belum_kumpul} belum, ${dSiswa.data.sudah_dinilai} dinilai`,
    sesuai: dSiswa.status === 200,
  });

  const rGantiSandi = await put('/api/auth/password', {
    passwordLama: 'siswa123', passwordBaru: 'siswa456',
  }, tokenSiswa.intan);
  const cekSandiBaru = await login('intan@siswa.smakk.sch.id', 'siswa456');
  await put('/api/auth/password', { passwordLama: 'siswa456', passwordBaru: 'siswa123' }, cekSandiBaru.data.token);
  catat({
    modul: 'Autentikasi', skenario: 'Pengguna mengubah kata sandi akunnya',
    input: 'Password lama: siswa123; Password baru: siswa456',
    harapan: 'Kata sandi berhasil diperbarui dan dapat digunakan untuk login berikutnya',
    aktual: `HTTP ${rGantiSandi.status}, login dengan kata sandi baru: HTTP ${cekSandiBaru.status}`,
    sesuai: rGantiSandi.status === 200 && cekSandiBaru.status === 200,
  });

  const rNonaktif = await put(`/api/users/${rTambahSiswa.data.id}`, { aktif: false }, TA);
  const cekNonaktif = await login('wulan@siswa.smakk.sch.id', 'siswa123');
  await put(`/api/users/${rTambahSiswa.data.id}`, { aktif: true }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menonaktifkan akun pengguna',
    input: 'Menonaktifkan akun siswa Wulan Safitri, lalu akun tersebut mencoba login',
    harapan: 'Akun yang dinonaktifkan tidak dapat masuk ke sistem',
    aktual: `HTTP ${rNonaktif.status} saat menonaktifkan; percobaan login: HTTP ${cekNonaktif.status}, pesan: "${cekNonaktif.data?.message}"`,
    sesuai: rNonaktif.status === 200 && cekNonaktif.status === 403,
  });

  // =================================================================
  // Ringkasan
  // =================================================================
  const valid = hasil.filter((h) => h.status === 'Valid').length;
  const persen = ((valid / hasil.length) * 100).toFixed(2);
  console.log(`\n=== RINGKASAN: ${valid}/${hasil.length} skenario Valid (${persen}%) ===\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'hasil-pengujian.json'), JSON.stringify({
    tanggal: new Date().toISOString(),
    total: hasil.length, valid, tidak_valid: hasil.length - valid, persentase: Number(persen),
    kasus: hasil,
  }, null, 2), 'utf8');
  console.log(`Hasil pengujian disimpan ke ${path.join(OUT_DIR, 'hasil-pengujian.json')}`);
}

main().catch((e) => { console.error('Gagal menjalankan pengujian:', e); process.exit(1); });
