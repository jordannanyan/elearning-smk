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
  console.log(`${sesuai ? 'OK  ' : 'GAGAL'} ${row.id} [${modul}] ${skenario}`);
  if (!sesuai) console.log(`      harapan: ${harapan}\n      aktual : ${aktual}`);
  return row;
}

async function req(method, url, { token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(`${BASE}${url}`, { method, headers, body: payload });
  const teks = await res.text();
  let data = null;
  try { data = teks ? JSON.parse(teks) : null; } catch { data = teks; }
  return { status: res.status, data };
}

const get = (u, t) => req('GET', u, { token: t });
const post = (u, b, t) => req('POST', u, { token: t, body: b });
const put = (u, b, t) => req('PUT', u, { token: t, body: b });
const del = (u, t) => req('DELETE', u, { token: t });
const login = (email, password) => post('/api/auth/login', { email, password });

// ---------------------------------------------------------------------
async function main() {
  console.log(`\n=== PENGUJIAN BLACK BOX — ${new Date().toLocaleString('id-ID')} ===\n`);

  // =================================================================
  // A. MODUL AUTENTIKASI DAN HAK AKSES
  // =================================================================
  const rAdmin = await login('admin@smakk.sch.id', 'admin123');
  catat({
    modul: 'Autentikasi', skenario: 'Login administrator dengan email dan password yang benar',
    input: 'admin@smakk.sch.id / admin123',
    harapan: 'Sistem menerima login, mengembalikan token, dan mengarahkan ke dashboard administrator',
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
  const TG_SITI = (await login('siti@smakk.sch.id', 'guru123')).data.token;
  const TG_RAHMAT = (await login('rahmat@smakk.sch.id', 'guru123')).data.token;
  const TG_DINA = (await login('dina@smakk.sch.id', 'guru123')).data.token;

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
    harapan: 'Sistem menolak dan menampilkan pesan bahwa email dan password wajib diisi',
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

  const rHakAkses = await get('/api/users', TS);
  catat({
    modul: 'Autentikasi', skenario: 'Siswa mencoba mengakses menu manajemen pengguna milik administrator',
    input: 'GET /api/users menggunakan token siswa',
    harapan: 'Akses ditolak karena tidak sesuai hak akses (role)',
    aktual: `HTTP ${rHakAkses.status}, pesan: "${rHakAkses.data?.message}"`,
    sesuai: rHakAkses.status === 403,
  });

  // =================================================================
  // B. MODUL PERIODE PEMBELAJARAN
  // =================================================================
  const daftarPeriode = (await get('/api/periode', TA)).data;
  const pAktif = daftarPeriode.find((p) => p.status === 'aktif');
  const pTerkunci = daftarPeriode.find((p) => p.status === 'terkunci');

  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator menampilkan daftar periode pembelajaran',
    input: 'Membuka menu Periode Pembelajaran',
    harapan: 'Sistem menampilkan seluruh periode beserta status aktif, draft, atau terkunci',
    aktual: `HTTP 200, ${daftarPeriode.length} periode: ` +
      daftarPeriode.map((p) => `${p.kode} (${p.status})`).join(', '),
    sesuai: daftarPeriode.length >= 2 && !!pAktif && !!pTerkunci,
  });

  const rPeriodeAktif = await get('/api/periode/aktif', TG);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Sistem menampilkan periode yang sedang berjalan pada seluruh halaman',
    input: 'Membuka sistem sebagai guru',
    harapan: 'Sistem menampilkan kode periode aktif beserta tahun ajaran dan semesternya',
    aktual: `HTTP ${rPeriodeAktif.status}, periode aktif: ${rPeriodeAktif.data?.kode} ` +
      `(${rPeriodeAktif.data?.tahun_ajaran} ${rPeriodeAktif.data?.nama_semester})`,
    sesuai: rPeriodeAktif.status === 200 && rPeriodeAktif.data?.status === 'aktif',
  });

  const rBuatPeriode = await post('/api/periode', {
    tahun_ajaran: '2025/2026', semester: 2, tgl_mulai: '2026-01-05', tgl_selesai: '2026-06-19',
  }, TA);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator menambah periode pembelajaran baru',
    input: 'Tahun Ajaran 2025/2026, Semester 2 (genap)',
    harapan: 'Periode tersimpan dengan kode 2026/2 dan berstatus draft',
    aktual: `HTTP ${rBuatPeriode.status}, kode terbentuk: ${rBuatPeriode.data?.kode}`,
    sesuai: rBuatPeriode.status === 201 && rBuatPeriode.data.kode === '2026/2',
  });
  const idPeriodeBaru = rBuatPeriode.data?.id;

  const rPeriodeDuplikat = await post('/api/periode', { tahun_ajaran: '2025/2026', semester: 2 }, TA);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator menambah periode yang sudah terdaftar',
    input: 'Tahun Ajaran 2025/2026 Semester 2 (sudah ada)',
    harapan: 'Sistem menolak karena periode dengan kode tersebut sudah terdaftar',
    aktual: `HTTP ${rPeriodeDuplikat.status}, pesan: "${rPeriodeDuplikat.data?.message}"`,
    sesuai: rPeriodeDuplikat.status === 409,
  });

  const rSemesterSalah = await post('/api/periode', { tahun_ajaran: '2027/2028', semester: 3 }, TA);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator mengisi semester di luar nilai yang diizinkan',
    input: 'Semester = 3',
    harapan: 'Sistem menolak karena semester hanya boleh 1 (ganjil) atau 2 (genap)',
    aktual: `HTTP ${rSemesterSalah.status}, pesan: "${rSemesterSalah.data?.message}"`,
    sesuai: rSemesterSalah.status === 400,
  });

  const rHapusPeriodeBaru = await del(`/api/periode/${idPeriodeBaru}`, TA);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator menghapus periode yang belum memiliki kelas',
    input: 'Menghapus periode 2026/2 yang masih kosong',
    harapan: 'Periode berhasil dihapus karena belum memuat data pembelajaran',
    aktual: `HTTP ${rHapusPeriodeBaru.status}, pesan: "${rHapusPeriodeBaru.data?.message}"`,
    sesuai: rHapusPeriodeBaru.status === 200,
  });

  const rHapusPeriodeIsi = await del(`/api/periode/${pAktif.id}`, TA);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Administrator menghapus periode yang sudah berisi kelas',
    input: `Menghapus periode ${pAktif.kode} yang memuat ${pAktif.jumlah_kelas} kelas`,
    harapan: 'Sistem menolak penghapusan demi menjaga keutuhan data historis',
    aktual: `HTTP ${rHapusPeriodeIsi.status}, pesan: "${rHapusPeriodeIsi.data?.message}"`,
    sesuai: rHapusPeriodeIsi.status === 409,
  });

  const rKunciSiswa = await post(`/api/periode/${pAktif.id}/kunci`, {}, TS);
  catat({
    modul: 'Periode Pembelajaran', skenario: 'Siswa mencoba mengunci periode pembelajaran',
    input: 'POST kunci periode menggunakan token siswa',
    harapan: 'Ditolak karena penguncian periode merupakan wewenang administrator',
    aktual: `HTTP ${rKunciSiswa.status}, pesan: "${rKunciSiswa.data?.message}"`,
    sesuai: rKunciSiswa.status === 403,
  });

  // ---- Pengujian penguncian periode terhadap seluruh peran ----
  const kmTerkunci = (await get('/api/kelas-mapel?semua=1', TG)).data
    .find((k) => k.status_periode === 'terkunci');
  const ptTerkunci = (await get(`/api/kelas-mapel/${kmTerkunci.id}/pertemuan`, TG)).data[0];

  const rKunciPertemuan = await post(`/api/kelas-mapel/${kmTerkunci.id}/pertemuan`,
    { judul: 'Pertemuan tambahan pada periode arsip' }, TG);
  catat({
    modul: 'Penguncian Periode', skenario: 'Guru menambah pertemuan pada periode yang telah dikunci',
    input: `Menambah pertemuan pada mata pelajaran periode ${kmTerkunci.kode_periode} (terkunci)`,
    harapan: 'Sistem menolak perubahan karena periode sudah dikunci administrator',
    aktual: `HTTP ${rKunciPertemuan.status}, pesan: "${rKunciPertemuan.data?.message}"`,
    sesuai: rKunciPertemuan.status === 423,
  });

  const rKunciMateri = await (async () => {
    const fd = new FormData();
    fd.append('id_pertemuan', String(ptTerkunci.id));
    fd.append('judul', 'Materi tambahan pada periode arsip');
    fd.append('tipe', 'teks');
    return req('POST', '/api/materi', { token: TG, form: fd });
  })();
  catat({
    modul: 'Penguncian Periode', skenario: 'Guru menambah materi pada periode yang telah dikunci',
    input: `Menambah materi pada pertemuan periode ${kmTerkunci.kode_periode}`,
    harapan: 'Sistem menolak karena data periode terkunci bersifat hanya-baca',
    aktual: `HTTP ${rKunciMateri.status}, pesan: "${rKunciMateri.data?.message}"`,
    sesuai: rKunciMateri.status === 423,
  });

  const tugasTerkunci = (await get(`/api/pertemuan/${ptTerkunci.id}`, TG)).data.tugas[0];
  const rKunciEditTugas = await put(`/api/tugas/${tugasTerkunci.id}`,
    { judul: 'Judul diubah', tipe: 'tugas' }, TG);
  catat({
    modul: 'Penguncian Periode', skenario: 'Guru mengubah tugas pada periode yang telah dikunci',
    input: `Mengubah judul tugas "${tugasTerkunci.judul}" pada periode arsip`,
    harapan: 'Sistem menolak perubahan data pada periode terkunci',
    aktual: `HTTP ${rKunciEditTugas.status}, pesan: "${rKunciEditTugas.data?.message}"`,
    sesuai: rKunciEditTugas.status === 423,
  });

  const TS_MAYA = (await login('maya@siswa.smakk.sch.id', 'siswa123')).data.token;
  const fdKunci = new FormData();
  fdKunci.append('jawaban', 'Percobaan mengumpulkan tugas pada periode yang sudah berakhir.');
  const rKunciSubmit = await req('POST', `/api/tugas/${tugasTerkunci.id}/submit`,
    { token: TS_MAYA, form: fdKunci });
  catat({
    modul: 'Penguncian Periode', skenario: 'Siswa mengumpulkan tugas pada periode yang telah dikunci',
    input: 'Siswa mengumpulkan tugas pada periode arsip',
    harapan: 'Sistem menolak pengumpulan karena periode sudah ditutup',
    aktual: `HTTP ${rKunciSubmit.status}, pesan: "${rKunciSubmit.data?.message}"`,
    sesuai: rKunciSubmit.status === 423,
  });

  const rLihatArsip = await get(`/api/pertemuan/${ptTerkunci.id}`, TG);
  catat({
    modul: 'Penguncian Periode', skenario: 'Pengguna membuka data pada periode yang telah dikunci',
    input: 'Membuka pertemuan pada periode arsip',
    harapan: 'Data tetap dapat dilihat sebagai arsip meskipun tidak dapat diubah',
    aktual: `HTTP ${rLihatArsip.status}, pertemuan "${rLihatArsip.data?.pertemuan?.judul}" ` +
      `dengan ${rLihatArsip.data?.materi?.length} materi berhasil ditampilkan`,
    sesuai: rLihatArsip.status === 200 && rLihatArsip.data.materi.length > 0,
  });

  // =================================================================
  // C. MODUL MANAJEMEN PENGGUNA
  // =================================================================
  const rListGuru = await get('/api/users?role=guru', TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menampilkan daftar data guru',
    input: 'Membuka menu Data Guru',
    harapan: 'Sistem menampilkan seluruh data guru beserta NIP dan jumlah pengampuannya',
    aktual: `HTTP ${rListGuru.status}, ${rListGuru.data.length} data guru ditampilkan`,
    sesuai: rListGuru.status === 200 && rListGuru.data.length >= 6,
  });

  const rTambahGuru = await post('/api/users', {
    nama: 'Yuni Kartika, S.Pd', email: 'yuni@smakk.sch.id', password: 'guru123',
    role: 'guru', nip: '199506152019032007',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah data guru baru dengan data lengkap',
    input: 'Nama: Yuni Kartika, S.Pd; Email: yuni@smakk.sch.id; NIP: 199506152019032007',
    harapan: 'Data guru tersimpan dan tampil pada tabel data guru',
    aktual: `HTTP ${rTambahGuru.status}, pesan: "${rTambahGuru.data?.message}"`,
    sesuai: rTambahGuru.status === 201,
  });
  const idGuruBaru = rTambahGuru.data?.id;

  const rDuplikat = await post('/api/users', {
    nama: 'Guru Duplikat', email: 'yuni@smakk.sch.id', password: 'guru123', role: 'guru',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah pengguna dengan email yang sudah terdaftar',
    input: 'Email: yuni@smakk.sch.id (sudah digunakan)',
    harapan: 'Sistem menolak dan menampilkan pesan "Email sudah terpakai"',
    aktual: `HTTP ${rDuplikat.status}, pesan: "${rDuplikat.data?.message}"`,
    sesuai: rDuplikat.status === 409,
  });

  const rSandiPendek = await post('/api/users', {
    nama: 'Uji Sandi', email: 'ujisandi@smakk.sch.id', password: '123', role: 'guru',
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator membuat akun dengan password kurang dari 6 karakter',
    input: 'Password: 123',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa password minimal 6 karakter',
    aktual: `HTTP ${rSandiPendek.status}, pesan: "${rSandiPendek.data?.message}"`,
    sesuai: rSandiPendek.status === 400,
  });

  const rHapusGuruBaru = await del(`/api/users/${idGuruBaru}`, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menghapus guru yang belum mengampu kelas',
    input: 'Menghapus akun Yuni Kartika, S.Pd yang belum memiliki pengampuan',
    harapan: 'Data guru berhasil dihapus karena belum memiliki jejak pembelajaran',
    aktual: `HTTP ${rHapusGuruBaru.status}, pesan: "${rHapusGuruBaru.data?.message}"`,
    sesuai: rHapusGuruBaru.status === 200,
  });

  const guruBudi = rListGuru.data.find((u) => u.nama.startsWith('Budi'));
  const rHapusGuruAktif = await del(`/api/users/${guruBudi.id}`, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menghapus guru yang sudah mengampu kelas',
    input: `Menghapus akun ${guruBudi.nama} yang mengampu ${guruBudi.jumlah_pengampuan} kelas`,
    harapan: 'Sistem menolak penghapusan dan menyarankan penonaktifan akun agar data tetap utuh',
    aktual: `HTTP ${rHapusGuruAktif.status}, pesan: "${rHapusGuruAktif.data?.message}"`,
    sesuai: rHapusGuruAktif.status === 409,
  });

  const rNonaktifGuru = await put(`/api/users/${guruBudi.id}/status`, { aktif: false }, TA);
  const cekLoginNonaktif = await login('budi@smakk.sch.id', 'guru123');
  await put(`/api/users/${guruBudi.id}/status`, { aktif: true }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menonaktifkan akun guru sebagai pengganti penghapusan',
    input: `Menonaktifkan akun ${guruBudi.nama}, lalu akun tersebut mencoba login`,
    harapan: 'Akun tidak dapat masuk ke sistem, namun seluruh data pembelajarannya tetap tersimpan',
    aktual: `HTTP ${rNonaktifGuru.status} saat menonaktifkan; percobaan login: HTTP ${cekLoginNonaktif.status} ` +
      `("${cekLoginNonaktif.data?.message}")`,
    sesuai: rNonaktifGuru.status === 200 && cekLoginNonaktif.status === 403,
  });

  const kelasAktif = (await get('/api/kelas', TA)).data;
  const kelasX1 = kelasAktif.find((k) => k.nama_kelas === 'X MIPA 1');

  const rTambahSiswa = await post('/api/users', {
    nama: 'Wulan Safitri', email: 'wulan@siswa.smakk.sch.id', password: 'siswa123',
    role: 'siswa', nis: '0012345699', id_kelas: kelasX1.id,
  }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menambah data siswa dan menempatkannya pada sebuah kelas',
    input: `Nama: Wulan Safitri; NIS: 0012345699; Kelas: ${kelasX1.nama_kelas}`,
    harapan: 'Data siswa tersimpan beserta penempatan kelasnya pada periode aktif',
    aktual: `HTTP ${rTambahSiswa.status}, pesan: "${rTambahSiswa.data?.message}"`,
    sesuai: rTambahSiswa.status === 201,
  });

  const rListSiswa = await get('/api/users?role=siswa', TA);
  const siswaAhmad = rListSiswa.data.find((u) => u.nama === 'Ahmad Fauzi');
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menampilkan daftar siswa beserta kelasnya',
    input: 'Membuka menu Data Siswa',
    harapan: 'Sistem menampilkan data siswa beserta kelas pada periode pembelajaran aktif',
    aktual: `HTTP ${rListSiswa.status}, ${rListSiswa.data.length} siswa; contoh: ` +
      `${siswaAhmad.nama} kelas ${siswaAhmad.kelas_aktif}`,
    sesuai: rListSiswa.status === 200 && !!siswaAhmad.kelas_aktif,
  });

  const rHapusSiswaAktif = await del(`/api/users/${siswaAhmad.id}`, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menghapus siswa yang sudah terdaftar pada kelas',
    input: `Menghapus akun ${siswaAhmad.nama}`,
    harapan: 'Sistem menolak dan menyarankan penonaktifan agar riwayat nilai siswa tetap tersimpan',
    aktual: `HTTP ${rHapusSiswaAktif.status}, pesan: "${rHapusSiswaAktif.data?.message}"`,
    sesuai: rHapusSiswaAktif.status === 409,
  });

  const rNonaktifSiswa = await put(`/api/users/${rTambahSiswa.data.id}/status`, { aktif: false }, TA);
  const cekSiswaNonaktif = await login('wulan@siswa.smakk.sch.id', 'siswa123');
  await put(`/api/users/${rTambahSiswa.data.id}/status`, { aktif: true }, TA);
  catat({
    modul: 'Manajemen Pengguna', skenario: 'Administrator menonaktifkan akun siswa (lulus atau pindah sekolah)',
    input: 'Menonaktifkan akun Wulan Safitri, lalu akun tersebut mencoba login',
    harapan: 'Akun tidak dapat masuk, namun riwayat tugas dan nilainya tetap tersimpan',
    aktual: `HTTP ${rNonaktifSiswa.status} saat menonaktifkan; percobaan login: HTTP ${cekSiswaNonaktif.status}`,
    sesuai: rNonaktifSiswa.status === 200 && cekSiswaNonaktif.status === 403,
  });

  // =================================================================
  // D. KELAS, MATA PELAJARAN, DAN PENGAMPUAN
  // =================================================================
  const rTambahKelas = await post('/api/kelas', {
    id_periode: pAktif.id, nama_kelas: 'XII IPS 1', tingkat: 'XII', wali_kelas: 'Dina Marlina, S.Pd',
  }, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator menambah kelas pada periode aktif',
    input: 'Nama kelas: XII IPS 1; Tingkat: XII; Periode: ' + pAktif.kode,
    harapan: 'Kelas tersimpan pada periode pembelajaran yang dipilih',
    aktual: `HTTP ${rTambahKelas.status}, pesan: "${rTambahKelas.data?.message}"`,
    sesuai: rTambahKelas.status === 201,
  });
  const idKelasBaru = rTambahKelas.data?.id;

  const rKelasDuplikat = await post('/api/kelas', {
    id_periode: pAktif.id, nama_kelas: 'XII IPS 1', tingkat: 'XII',
  }, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator menambah kelas dengan nama yang sudah ada pada periode sama',
    input: 'Nama kelas: XII IPS 1 (sudah terdaftar pada periode ' + pAktif.kode + ')',
    harapan: 'Sistem menolak karena nama kelas harus unik dalam satu periode',
    aktual: `HTTP ${rKelasDuplikat.status}, pesan: "${rKelasDuplikat.data?.message}"`,
    sesuai: rKelasDuplikat.status === 409,
  });

  const rHapusKelasIsi = await del(`/api/kelas/${kelasX1.id}`, TA);
  catat({
    modul: 'Manajemen Kelas', skenario: 'Administrator menghapus kelas yang masih berisi siswa dan mata pelajaran',
    input: `Menghapus kelas ${kelasX1.nama_kelas}`,
    harapan: 'Sistem menolak agar data pembelajaran kelas tersebut tidak ikut terhapus',
    aktual: `HTTP ${rHapusKelasIsi.status}, pesan: "${rHapusKelasIsi.data?.message}"`,
    sesuai: rHapusKelasIsi.status === 409,
  });

  await del(`/api/kelas/${idKelasBaru}`, TA);

  const mapelSemua = (await get('/api/mapel', TA)).data;
  catat({
    modul: 'Mata Pelajaran', skenario: 'Administrator menampilkan katalog mata pelajaran sekolah',
    input: 'Membuka menu Mata Pelajaran',
    harapan: 'Sistem menampilkan seluruh mata pelajaran SMA beserta kelompoknya',
    aktual: `HTTP 200, ${mapelSemua.length} mata pelajaran pada ` +
      `${new Set(mapelSemua.map((m) => m.kelompok)).size} kelompok`,
    sesuai: mapelSemua.length >= 27,
  });

  const mapelBind = mapelSemua.find((m) => m.kode === 'BIND');
  const pengampuanBind = (await get('/api/kelas-mapel?semua=1', TA)).data
    .filter((k) => k.kode_mapel === 'BIND');
  const guruBindBerbeda = new Set(pengampuanBind.map((k) => k.nama_guru));
  catat({
    modul: 'Pengampuan Kelas', skenario: 'Satu mata pelajaran diampu guru berbeda pada tingkat kelas berbeda',
    input: `Memeriksa pengampuan mata pelajaran ${mapelBind.nama}`,
    harapan: 'Sistem mengizinkan satu mata pelajaran diampu lebih dari satu guru pada kelas berbeda',
    aktual: `${pengampuanBind.length} pengampuan oleh ${guruBindBerbeda.size} guru berbeda: ` +
      pengampuanBind.map((k) => `${k.nama_kelas} (${k.nama_guru})`).join(', '),
    sesuai: guruBindBerbeda.size >= 2,
  });

  const rHapusMapelDipakai = await del(`/api/mapel/${mapelBind.id}`, TA);
  catat({
    modul: 'Mata Pelajaran', skenario: 'Administrator menghapus mata pelajaran yang sudah diajarkan',
    input: `Menghapus mata pelajaran ${mapelBind.nama}`,
    harapan: 'Sistem menolak dan menyarankan penonaktifan mata pelajaran',
    aktual: `HTTP ${rHapusMapelDipakai.status}, pesan: "${rHapusMapelDipakai.data?.message}"`,
    sesuai: rHapusMapelDipakai.status === 409,
  });

  const rNonaktifMapel = await put(`/api/mapel/${mapelBind.id}/status`, { aktif: false }, TA);
  await put(`/api/mapel/${mapelBind.id}/status`, { aktif: true }, TA);
  catat({
    modul: 'Mata Pelajaran', skenario: 'Administrator menonaktifkan mata pelajaran',
    input: `Menonaktifkan ${mapelBind.nama}`,
    harapan: 'Mata pelajaran tidak dapat dipilih lagi pada pengampuan baru, data lama tetap tersimpan',
    aktual: `HTTP ${rNonaktifMapel.status}, pesan: "${rNonaktifMapel.data?.message}"`,
    sesuai: rNonaktifMapel.status === 200,
  });

  const rTambahMapel = await post('/api/mapel', {
    nama: 'Bahasa Jerman', kode: 'BJER', kelompok: 'Peminatan Bahasa',
    deskripsi: 'Mata pelajaran pilihan bahasa asing',
  }, TA);
  catat({
    modul: 'Mata Pelajaran', skenario: 'Administrator menambah mata pelajaran baru ke katalog',
    input: 'Nama: Bahasa Jerman; Kode: BJER; Kelompok: Peminatan Bahasa',
    harapan: 'Mata pelajaran tersimpan pada katalog sekolah',
    aktual: `HTTP ${rTambahMapel.status}, pesan: "${rTambahMapel.data?.message}"`,
    sesuai: rTambahMapel.status === 201,
  });
  await del(`/api/mapel/${rTambahMapel.data.id}`, TA);

  const rMapelKosong = await post('/api/mapel', { nama: '' }, TA);
  catat({
    modul: 'Mata Pelajaran', skenario: 'Administrator menambah mata pelajaran dengan nama dikosongkan',
    input: 'Nama mata pelajaran = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa nama wajib diisi',
    aktual: `HTTP ${rMapelKosong.status}, pesan: "${rMapelKosong.data?.message}"`,
    sesuai: rMapelKosong.status === 400,
  });

  // =================================================================
  // E. PERTEMUAN, MATERI, DAN TUGAS
  // =================================================================
  const kmGuru = (await get('/api/kelas-mapel', TG)).data;
  const kmMtk = kmGuru.find((k) => k.kode_mapel === 'MTK-W' && k.nama_kelas === 'X MIPA 1');
  catat({
    modul: 'Kelas Mata Pelajaran', skenario: 'Guru menampilkan daftar kelas mata pelajaran yang diampunya',
    input: 'Membuka menu Kelas Saya',
    harapan: 'Sistem hanya menampilkan kelas mata pelajaran yang diampu guru tersebut pada periode aktif',
    aktual: `HTTP 200, ${kmGuru.length} kelas mata pelajaran: ` +
      kmGuru.map((k) => `${k.nama_mapel} (${k.nama_kelas})`).join(', '),
    sesuai: kmGuru.length > 0 && kmGuru.every((k) => k.status_periode === 'aktif'),
  });

  const rBuatPertemuan = await post(`/api/kelas-mapel/${kmMtk.id}/pertemuan`, {
    judul: 'Nilai Mutlak Persamaan Linear',
    deskripsi: 'Konsep nilai mutlak dan penyelesaian persamaan nilai mutlak linear satu variabel.',
    tanggal: '2025-12-01',
  }, TG);
  catat({
    modul: 'Pertemuan', skenario: 'Guru menambah pertemuan baru pada kelas mata pelajaran',
    input: 'Judul: Nilai Mutlak Persamaan Linear',
    harapan: 'Pertemuan tersimpan dengan nomor urut otomatis melanjutkan pertemuan sebelumnya',
    aktual: `HTTP ${rBuatPertemuan.status}, tersimpan sebagai Pertemuan ke-${rBuatPertemuan.data?.nomor}`,
    sesuai: rBuatPertemuan.status === 201 && rBuatPertemuan.data.nomor === 4,
  });
  const idPertemuanBaru = rBuatPertemuan.data?.id;

  const rPertemuanKosong = await post(`/api/kelas-mapel/${kmMtk.id}/pertemuan`, { judul: '' }, TG);
  catat({
    modul: 'Pertemuan', skenario: 'Guru menambah pertemuan dengan judul dikosongkan',
    input: 'Judul pertemuan = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa judul wajib diisi',
    aktual: `HTTP ${rPertemuanKosong.status}, pesan: "${rPertemuanKosong.data?.message}"`,
    sesuai: rPertemuanKosong.status === 400,
  });

  const rPertemuanBukanMilik = await post(`/api/kelas-mapel/${kmMtk.id}/pertemuan`,
    { judul: 'Pertemuan oleh guru lain' }, TG_SITI);
  catat({
    modul: 'Pertemuan', skenario: 'Guru menambah pertemuan pada kelas mata pelajaran yang bukan diampunya',
    input: 'Guru Bahasa Indonesia menambah pertemuan pada kelas Matematika',
    harapan: 'Sistem menolak karena kelas mata pelajaran tersebut bukan yang diampunya',
    aktual: `HTTP ${rPertemuanBukanMilik.status}, pesan: "${rPertemuanBukanMilik.data?.message}"`,
    sesuai: rPertemuanBukanMilik.status === 403,
  });

  // ---- Materi berbagai jenis ----
  const fdTeks = new FormData();
  fdTeks.append('id_pertemuan', String(idPertemuanBaru));
  fdTeks.append('judul', 'Konsep Nilai Mutlak');
  fdTeks.append('konten', 'Nilai mutlak suatu bilangan adalah jaraknya terhadap titik nol pada garis bilangan.');
  fdTeks.append('tipe', 'teks');
  const rMateriTeks = await req('POST', '/api/materi', { token: TG, form: fdTeks });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi berupa uraian teks pada sebuah pertemuan',
    input: 'Judul: Konsep Nilai Mutlak; Jenis: teks',
    harapan: 'Materi tersimpan dan tampil pada pertemuan yang bersangkutan',
    aktual: `HTTP ${rMateriTeks.status}, pesan: "${rMateriTeks.data?.message}"`,
    sesuai: rMateriTeks.status === 201,
  });

  const fdFile = new FormData();
  fdFile.append('id_pertemuan', String(idPertemuanBaru));
  fdFile.append('judul', 'Lembar Kerja Nilai Mutlak');
  fdFile.append('konten', 'Lembar kerja latihan nilai mutlak.');
  fdFile.append('tipe', 'file');
  fdFile.append('file', new Blob(['Lembar Kerja Nilai Mutlak - SMA Negeri 1 Karau Kuala'],
    { type: 'text/plain' }), 'lembar_kerja_nilai_mutlak.txt');
  const rMateriFile = await req('POST', '/api/materi', { token: TG, form: fdFile });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru mengunggah materi berupa berkas dokumen',
    input: 'Jenis: file; Berkas: lembar_kerja_nilai_mutlak.txt',
    harapan: 'Berkas terunggah dan dapat diunduh oleh siswa',
    aktual: `HTTP ${rMateriFile.status}, pesan: "${rMateriFile.data?.message}"`,
    sesuai: rMateriFile.status === 201,
  });

  const fdLink = new FormData();
  fdLink.append('id_pertemuan', String(idPertemuanBaru));
  fdLink.append('judul', 'Video Pembahasan Nilai Mutlak');
  fdLink.append('konten', 'Video penjelasan penyelesaian persamaan nilai mutlak.');
  fdLink.append('tipe', 'link');
  fdLink.append('url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const rMateriLink = await req('POST', '/api/materi', { token: TG, form: fdLink });
  const cekEmbed = (await get(`/api/materi?id_pertemuan=${idPertemuanBaru}`, TG)).data
    .find((m) => m.tipe === 'link');
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi berupa tautan video YouTube',
    input: 'Jenis: link; URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    harapan: 'Tautan tersimpan dan diubah menjadi tautan sematan agar video dapat ditonton langsung',
    aktual: `HTTP ${rMateriLink.status}, tautan sematan: ${cekEmbed?.embed_url}`,
    sesuai: rMateriLink.status === 201 && !!cekEmbed?.embed_url,
  });

  const fdLinkSalah = new FormData();
  fdLinkSalah.append('id_pertemuan', String(idPertemuanBaru));
  fdLinkSalah.append('judul', 'Tautan tidak valid');
  fdLinkSalah.append('tipe', 'link');
  fdLinkSalah.append('url', 'youtube-tanpa-protokol');
  const rLinkSalah = await req('POST', '/api/materi', { token: TG, form: fdLinkSalah });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru mengisi tautan materi dengan format yang tidak valid',
    input: 'URL: youtube-tanpa-protokol',
    harapan: 'Sistem menolak dan meminta tautan diawali http:// atau https://',
    aktual: `HTTP ${rLinkSalah.status}, pesan: "${rLinkSalah.data?.message}"`,
    sesuai: rLinkSalah.status === 400,
  });

  const fdTanpaBerkas = new FormData();
  fdTanpaBerkas.append('id_pertemuan', String(idPertemuanBaru));
  fdTanpaBerkas.append('judul', 'Materi video tanpa berkas');
  fdTanpaBerkas.append('tipe', 'video');
  const rTanpaBerkas = await req('POST', '/api/materi', { token: TG, form: fdTanpaBerkas });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru memilih jenis materi video namun tidak mengunggah berkas',
    input: 'Jenis: video; berkas tidak dipilih',
    harapan: 'Sistem menolak dan meminta berkas video diunggah',
    aktual: `HTTP ${rTanpaBerkas.status}, pesan: "${rTanpaBerkas.data?.message}"`,
    sesuai: rTanpaBerkas.status === 400,
  });

  const fdEkstensi = new FormData();
  fdEkstensi.append('id_pertemuan', String(idPertemuanBaru));
  fdEkstensi.append('judul', 'Berkas tidak diizinkan');
  fdEkstensi.append('tipe', 'file');
  fdEkstensi.append('file', new Blob(['MZ'], { type: 'application/octet-stream' }), 'program.exe');
  const rEkstensi = await req('POST', '/api/materi', { token: TG, form: fdEkstensi });
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru mengunggah berkas dengan ekstensi yang tidak diizinkan',
    input: 'Berkas: program.exe',
    harapan: 'Sistem menolak dan menampilkan daftar jenis berkas yang diizinkan',
    aktual: `HTTP ${rEkstensi.status}, pesan: "${String(rEkstensi.data?.message).slice(0, 90)}..."`,
    sesuai: rEkstensi.status === 415,
  });

  const rMateriKosong = await (async () => {
    const fd = new FormData();
    fd.append('id_pertemuan', String(idPertemuanBaru));
    fd.append('judul', '');
    fd.append('tipe', 'teks');
    return req('POST', '/api/materi', { token: TG, form: fd });
  })();
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Guru menambah materi dengan judul dikosongkan',
    input: 'Judul materi = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa judul wajib diisi',
    aktual: `HTTP ${rMateriKosong.status}, pesan: "${rMateriKosong.data?.message}"`,
    sesuai: rMateriKosong.status === 400,
  });

  const rHapusPertemuanUji = await del(`/api/pertemuan/${idPertemuanBaru}`, TG);
  catat({
    modul: 'Pertemuan', skenario: 'Guru menghapus pertemuan beserta seluruh materi di dalamnya',
    input: 'Menghapus Pertemuan 4 "Nilai Mutlak Persamaan Linear"',
    harapan: 'Pertemuan beserta materi, tugas, dan diskusinya terhapus dari sistem',
    aktual: `HTTP ${rHapusPertemuanUji.status}, pesan: "${rHapusPertemuanUji.data?.message}"`,
    sesuai: rHapusPertemuanUji.status === 200,
  });

  // ---- Alur belajar siswa yang runut ----
  const kmSiswa = (await get('/api/kelas-mapel', TS)).data;
  catat({
    modul: 'Alur Pembelajaran Siswa', skenario: 'Siswa menampilkan daftar mata pelajaran di kelasnya',
    input: 'Membuka menu Kelas Saya',
    harapan: 'Sistem menampilkan kartu mata pelajaran kelas siswa, bukan seluruh materi yang bertumpuk',
    aktual: `HTTP 200, ${kmSiswa.length} mata pelajaran: ` +
      kmSiswa.map((k) => k.nama_mapel).join(', '),
    sesuai: kmSiswa.length > 0 && kmSiswa.every((k) => k.nama_kelas === 'X MIPA 1'),
  });

  const kmSiswaMtk = kmSiswa.find((k) => k.kode_mapel === 'MTK-W');
  const ptSiswa = (await get(`/api/kelas-mapel/${kmSiswaMtk.id}/pertemuan`, TS)).data;
  catat({
    modul: 'Alur Pembelajaran Siswa', skenario: 'Siswa membuka mata pelajaran lalu melihat daftar pertemuan',
    input: `Membuka mata pelajaran ${kmSiswaMtk.nama_mapel}`,
    harapan: 'Materi tersusun per pertemuan secara berurutan mulai dari pertemuan pertama',
    aktual: `HTTP 200, ${ptSiswa.length} pertemuan: ` +
      ptSiswa.map((p) => `Pertemuan ${p.nomor} (${p.jumlah_materi} materi, ${p.jumlah_tugas} tugas)`).join('; '),
    sesuai: ptSiswa.length > 0 && ptSiswa[0].nomor === 1,
  });

  const isiPertemuan = (await get(`/api/pertemuan/${ptSiswa[0].id}`, TS)).data;
  catat({
    modul: 'Alur Pembelajaran Siswa', skenario: 'Siswa membuka satu pertemuan untuk mengikuti pembelajaran',
    input: `Membuka Pertemuan ${ptSiswa[0].nomor}`,
    harapan: 'Sistem menampilkan materi, tugas, dan forum diskusi pertemuan tersebut secara berurutan',
    aktual: `HTTP 200, ${isiPertemuan.materi.length} materi, ${isiPertemuan.tugas.length} tugas, ` +
      `${isiPertemuan.diskusi.length} topik diskusi`,
    sesuai: isiPertemuan.materi.length > 0,
  });

  const jenisMateri = new Set(isiPertemuan.materi.map((m) => m.tipe));
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Sistem menampilkan materi berupa teks, berkas, dan video sekaligus',
    input: 'Membuka pertemuan yang memuat berbagai jenis materi',
    harapan: 'Materi teks, berkas unduhan, dan video pembelajaran ditampilkan pada satu pertemuan',
    aktual: `Jenis materi yang tampil: ${[...jenisMateri].join(', ')}`,
    sesuai: jenisMateri.size >= 3,
  });

  const materiBerkas = isiPertemuan.materi.find((m) => m.file);
  const rUnduh = await fetch(`${BASE}/uploads/${materiBerkas.file}`);
  catat({
    modul: 'Materi Pembelajaran', skenario: 'Siswa mengunduh berkas materi pembelajaran',
    input: `Menekan tombol Unduh pada materi "${materiBerkas.judul}"`,
    harapan: 'Berkas materi berhasil diunduh oleh siswa',
    aktual: `HTTP ${rUnduh.status}, ukuran berkas ${(await rUnduh.arrayBuffer()).byteLength} byte`,
    sesuai: rUnduh.status === 200,
  });

  const rPertemuanKelasLain = await get(`/api/pertemuan/${ptTerkunci.id}`, TS);
  catat({
    modul: 'Alur Pembelajaran Siswa', skenario: 'Siswa membuka pertemuan pada kelas yang tidak diikutinya',
    input: 'Membuka pertemuan milik kelas lain',
    harapan: 'Akses ditolak karena siswa tidak terdaftar pada kelas tersebut',
    aktual: `HTTP ${rPertemuanKelasLain.status}, pesan: "${rPertemuanKelasLain.data?.message}"`,
    sesuai: rPertemuanKelasLain.status === 403,
  });

  // =================================================================
  // F. TUGAS, KUIS, DAN BATAS WAKTU
  // =================================================================
  const tugasSiswa = (await get('/api/tugas', TS)).data;
  const adaSisaHari = tugasSiswa.every((t) => t.sisa_hari !== undefined);
  const contohMendesak = tugasSiswa.find((t) => t.urgensi === 'kritis' || t.urgensi === 'mendesak');
  catat({
    modul: 'Tugas dan Batas Waktu', skenario: 'Sistem menampilkan sisa hari menuju batas waktu pengumpulan',
    input: 'Membuka daftar tugas sebagai siswa',
    harapan: 'Setiap tugas menampilkan sisa hari beserta penanda tingkat kemendesakannya',
    aktual: contohMendesak
      ? `Contoh: "${contohMendesak.judul}" sisa ${contohMendesak.sisa_hari} hari, penanda ${contohMendesak.urgensi}`
      : `${tugasSiswa.length} tugas menampilkan sisa hari`,
    sesuai: adaSisaHari && tugasSiswa.length > 0,
  });

  const statusTugas = new Set(tugasSiswa.map((t) => t.status));
  catat({
    modul: 'Tugas dan Batas Waktu', skenario: 'Sistem mengelompokkan tugas siswa berdasarkan status pengerjaan',
    input: 'Membuka menu Tugas & Kuis sebagai siswa',
    harapan: 'Tugas terpisah menjadi belum dikerjakan, menunggu penilaian, sudah dinilai, dan terlewat',
    aktual: `Status yang terbentuk: ${[...statusTugas].join(', ')}`,
    sesuai: statusTugas.size >= 2,
  });

  const kmGuruMtk = kmGuru.find((k) => k.kode_mapel === 'MTK-W' && k.nama_kelas === 'X MIPA 1');
  const ptGuru = (await get(`/api/kelas-mapel/${kmGuruMtk.id}/pertemuan`, TG)).data;
  const rBuatTugas = await post('/api/tugas', {
    id_pertemuan: ptGuru[0].id, judul: 'Tugas Uji Coba Sistem', tipe: 'tugas',
    deskripsi: 'Tugas percobaan untuk pengujian sistem.', deadline: '2026-12-20T23:59',
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru membuat tugas baru pada sebuah pertemuan',
    input: 'Judul: Tugas Uji Coba Sistem; Batas waktu: 20 Desember 2026',
    harapan: 'Tugas tersimpan pada pertemuan tersebut dan tampil bagi siswa kelas terkait',
    aktual: `HTTP ${rBuatTugas.status}, pesan: "${rBuatTugas.data?.message}"`,
    sesuai: rBuatTugas.status === 201,
  });
  const idTugasUji = rBuatTugas.data?.id;

  const rTugasKosong = await post('/api/tugas', { id_pertemuan: ptGuru[0].id, judul: '' }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru membuat tugas dengan judul dikosongkan',
    input: 'Judul tugas = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa judul wajib diisi',
    aktual: `HTTP ${rTugasKosong.status}, pesan: "${rTugasKosong.data?.message}"`,
    sesuai: rTugasKosong.status === 400,
  });

  const rTambahSoal = await post(`/api/tugas/${idTugasUji}/soal`, {
    pertanyaan: 'Hasil dari 12 : 4 + 5 adalah ...', tipe: 'pilihan_ganda',
    pilihan_a: '6', pilihan_b: '7', pilihan_c: '8', pilihan_d: '9', jawaban_benar: 'C', bobot: 20,
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru menambah butir soal pilihan ganda beserta kunci jawaban',
    input: 'Pertanyaan, empat pilihan jawaban, kunci jawaban C, bobot 20',
    harapan: 'Butir soal tersimpan dan jumlah soal pada tugas bertambah',
    aktual: `HTTP ${rTambahSoal.status}, pesan: "${rTambahSoal.data?.message}"`,
    sesuai: rTambahSoal.status === 201,
  });

  const rSoalTanpaKunci = await post(`/api/tugas/${idTugasUji}/soal`, {
    pertanyaan: 'Soal tanpa pilihan jawaban', tipe: 'pilihan_ganda', pilihan_a: '', pilihan_b: '',
  }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru menambah soal pilihan ganda tanpa mengisi pilihan jawaban',
    input: 'Pilihan A dan B dikosongkan',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa pilihan jawaban wajib diisi',
    aktual: `HTTP ${rSoalTanpaKunci.status}, pesan: "${rSoalTanpaKunci.data?.message}"`,
    sesuai: rSoalTanpaKunci.status === 400,
  });

  await del(`/api/tugas/${idTugasUji}`, TG);

  const tugasGuruLain = (await get('/api/tugas', TG_SITI)).data[0];
  const rTugasGuruLain = await put(`/api/tugas/${tugasGuruLain.id}`, { judul: 'Diubah' }, TG);
  catat({
    modul: 'Tugas dan Kuis', skenario: 'Guru mengubah tugas milik guru mata pelajaran lain',
    input: 'Guru Matematika mengubah tugas milik guru Bahasa Indonesia',
    harapan: 'Sistem menolak karena tugas berada pada kelas mata pelajaran yang bukan diampunya',
    aktual: `HTTP ${rTugasGuruLain.status}, pesan: "${rTugasGuruLain.data?.message}"`,
    sesuai: rTugasGuruLain.status === 403,
  });

  // =================================================================
  // G. PENGERJAAN OLEH SISWA (sekaligus mengisi data)
  // =================================================================
  const akunSiswa = ['ahmad', 'dewi', 'rian', 'aisyah', 'bayu', 'putri'];
  const tokenSiswa = {};
  for (const s of akunSiswa) {
    tokenSiswa[s] = (await login(`${s}@siswa.smakk.sch.id`, 'siswa123')).data.token;
  }

  const semuaTugas = (await get('/api/tugas', tokenSiswa.ahmad)).data;
  const cari = (j) => semuaTugas.find((t) => t.judul === j);
  const tLatihanMtk = cari('Latihan Persamaan Linear');
  const tKuisMtk = cari('Kuis Persamaan dan Pertidaksamaan Linear');
  const tTugasBind = cari('Tugas Menulis Teks Deskripsi');
  const tKuisBind = cari('Kuis Teks Deskripsi');
  const tLatihanFis = cari('Latihan Soal Besaran dan Satuan');
  const tKuisBing = cari('Kuis Descriptive Text');
  const tProyekSpldv = cari('Tugas Proyek SPLDV');

  // ---- Kuis Matematika (5 soal pilihan ganda) ----
  const soalKuisMtk = (await get(`/api/tugas/${tKuisMtk.id}/soal`, TG)).data;
  const kunciMtk = soalKuisMtk.map((s) => s.jawaban_benar);
  const polaMtk = { ahmad: [3], dewi: [], rian: [1, 4], aisyah: [], bayu: [0, 2, 3], putri: [2] };
  let rKuisPertama = null;
  for (const [siswa, salah] of Object.entries(polaMtk)) {
    const jawaban = soalKuisMtk.map((s, i) => ({
      id_soal: s.id,
      pilihan: salah.includes(i) ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciMtk[i]) : kunciMtk[i],
    }));
    const r = await post(`/api/tugas/${tKuisMtk.id}/submit`, { jawaban }, tokenSiswa[siswa]);
    if (!rKuisPertama) rKuisPertama = { siswa, r, benar: soalKuisMtk.length - salah.length };
  }
  const skorDiharapkan = (rKuisPertama.benar / soalKuisMtk.length) * 100;
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa mengerjakan kuis pilihan ganda dan mengirim jawaban',
    input: `Siswa ${rKuisPertama.siswa} menjawab benar ${rKuisPertama.benar} dari ${soalKuisMtk.length} soal`,
    harapan: `Sistem mengoreksi otomatis dan langsung memberikan nilai ${skorDiharapkan}`,
    aktual: `HTTP ${rKuisPertama.r.status}, status: ${rKuisPertama.r.data?.status}, ` +
      `skor otomatis: ${rKuisPertama.r.data?.skor}`,
    sesuai: rKuisPertama.r.status === 200 && rKuisPertama.r.data.status === 'final'
      && Number(rKuisPertama.r.data.skor) === skorDiharapkan,
  });

  const rKerjakanUlang = await get(`/api/tugas/${tKuisMtk.id}/kerjakan`, tokenSiswa.ahmad);
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa melihat hasil kuis yang telah dinilai beserta kunci jawaban',
    input: 'Menekan tombol "Lihat Hasil" pada kuis yang sudah dikerjakan',
    harapan: 'Sistem menampilkan nilai akhir, jawaban siswa, dan kunci jawaban tiap butir soal',
    aktual: `HTTP ${rKerjakanUlang.status}, nilai akhir ${rKerjakanUlang.data?.total_skor}, ` +
      `kunci jawaban ditampilkan: ${rKerjakanUlang.data?.soal?.[0]?.jawaban_benar !== undefined}`,
    sesuai: rKerjakanUlang.status === 200 && rKerjakanUlang.data.graded === true,
  });

  const belumKerja = await get(`/api/tugas/${tKuisBind.id}/kerjakan`, tokenSiswa.rian);
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Sistem menyembunyikan kunci jawaban pada kuis yang belum dinilai',
    input: 'Siswa membuka kuis yang belum dikerjakan',
    harapan: 'Soal ditampilkan tanpa memperlihatkan kunci jawaban',
    aktual: `HTTP ${belumKerja.status}, kunci jawaban: ` +
      `${belumKerja.data?.soal?.[0]?.jawaban_benar === undefined ? 'tidak ditampilkan' : 'ditampilkan'}`,
    sesuai: belumKerja.status === 200 && belumKerja.data.soal[0].jawaban_benar === undefined,
  });

  // ---- Kuis Bahasa Indonesia (PG + esai) ----
  const soalKuisBind = (await get(`/api/tugas/${tKuisBind.id}/soal`, TG_SITI)).data;
  const kunciBind = soalKuisBind.map((s) => s.jawaban_benar);
  const esaiBind = {
    ahmad: 'Sekolahku berada di tepi jalan utama Bangkuang. Halamannya luas dengan rumput hijau yang selalu terpangkas rapi. Di depan ruang guru berdiri tiang bendera yang menjulang, dan di sampingnya berjajar pohon ketapang yang meneduhkan.',
    dewi: 'SMA Negeri 1 Karau Kuala memiliki bangunan bercat putih kebiruan. Setiap pagi koridor kelas dipenuhi suara siswa yang bersiap belajar. Taman kecil di tengah sekolah ditanami bunga kertas berwarna-warni.',
    putri: 'Ruang kelasku cukup luas dan terang karena memiliki empat jendela besar. Di dinding depan terpasang papan tulis putih dan foto pahlawan. Udara di dalam kelas terasa sejuk saat pagi hari.',
    aisyah: 'Kantin sekolah berada di samping lapangan basket. Setiap istirahat aromanya harum oleh gorengan hangat. Meja-meja panjangnya selalu penuh oleh siswa yang bercengkerama.',
    bayu: 'Sekolahku bersih dan nyaman. Ada lapangan upacara di tengah.',
  };
  const polaBind = { ahmad: [], dewi: [1], putri: [], aisyah: [], bayu: [0, 2] };
  let rEsaiPertama = null;
  for (const [siswa, salah] of Object.entries(polaBind)) {
    const jawaban = soalKuisBind.map((s, i) => (s.tipe === 'esai'
      ? { id_soal: s.id, jawaban_teks: esaiBind[siswa] }
      : {
        id_soal: s.id,
        pilihan: salah.includes(i) ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciBind[i]) : kunciBind[i],
      }));
    const r = await post(`/api/tugas/${tKuisBind.id}/submit`, { jawaban }, tokenSiswa[siswa]);
    if (!rEsaiPertama) rEsaiPertama = { siswa, r };
  }
  catat({
    modul: 'Pengerjaan Kuis', skenario: 'Siswa mengerjakan kuis yang memuat soal pilihan ganda dan esai',
    input: 'Siswa menjawab 3 soal pilihan ganda dan 1 soal esai pada Kuis Teks Deskripsi',
    harapan: 'Pilihan ganda terkoreksi otomatis, nilai akhir ditahan sampai esai dinilai guru',
    aktual: `HTTP ${rEsaiPertama.r.status}, status penilaian: ${rEsaiPertama.r.data?.status}`,
    sesuai: rEsaiPertama.r.status === 200 && rEsaiPertama.r.data.status === 'pending',
  });

  // ---- Tugas biasa ----
  const jawabanLatihan = {
    ahmad: 'Nomor 1: 2x + 6 = 14 -> 2x = 8 -> x = 4.\nNomor 2: 3x - 9 = 0 -> 3x = 9 -> x = 3.\nNomor 3: 5x = 3x + 12 -> 2x = 12 -> x = 6.\nLangkah selengkapnya saya lampirkan pada berkas.',
    dewi: 'Seluruh soal nomor 1 sampai 10 telah saya kerjakan. Hasil pekerjaan saya tulis tangan lalu saya pindai dan lampirkan pada berkas terlampir.',
    rian: 'Nomor 1 sampai 8 sudah saya kerjakan, nomor 9 dan 10 masih saya ragu pada langkah pemindahan ruas. Mohon koreksinya, Pak.',
    aisyah: 'Jawaban lengkap nomor 1-10 terlampir pada berkas. Setiap nomor saya sertakan langkah pengerjaannya.',
    putri: 'Semua soal telah saya kerjakan beserta langkah-langkahnya, terlampir pada berkas jawaban.',
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
    modul: 'Pengumpulan Tugas', skenario: 'Siswa mengumpulkan tugas berupa jawaban teks beserta lampiran berkas',
    input: `Siswa ${rKumpulTugas.siswa} mengisi kolom jawaban dan mengunggah berkas jawaban`,
    harapan: 'Tugas tersimpan, berkas terunggah, dan status berubah menjadi menunggu penilaian',
    aktual: `HTTP ${rKumpulTugas.r.status}, pesan: "${rKumpulTugas.r.data?.message}"`,
    sesuai: rKumpulTugas.r.status === 200,
  });

  const teksDeskripsi = {
    dewi: 'Lingkungan Sekolahku\n\nSMA Negeri 1 Karau Kuala berdiri di tepi jalan utama Kecamatan Karau Kuala. Bangunannya bercat putih dengan lis biru yang tampak bersih setiap pagi.\n\nHalaman sekolah cukup luas dan ditumbuhi rumput hijau. Di tengahnya berdiri tiang bendera, sementara di sisi kiri berjajar pohon ketapang yang rindang.\n\nSuasana sekolahku sangat nyaman untuk belajar. Angin sejuk dari arah sungai membuat udara di ruang kelas tidak pernah terasa panas.',
    putri: 'Lingkungan Sekolahku\n\nSekolahku terletak tidak jauh dari permukiman warga sehingga mudah dijangkau dengan sepeda.\n\nDi dalam kompleks sekolah terdapat dua belas ruang kelas, satu perpustakaan, dan sebuah laboratorium IPA. Lorong penghubungnya beratap seng sehingga siswa tetap terlindung ketika hujan.\n\nSetiap sudut sekolah dijaga kebersihannya oleh seluruh warga sekolah sehingga suasananya selalu asri.',
    aisyah: 'Lingkungan Sekolahku\n\nGerbang sekolahku bercat hijau tua dan selalu terbuka sejak pukul enam pagi.\n\nDi sebelah kanan gerbang terdapat taman kecil dengan bunga kertas berwarna merah muda. Lapangan upacara berada tepat di tengah kompleks sekolah.\n\nAku sangat menyukai suasana sekolahku, terutama pada pagi hari ketika embun masih menempel di rumput lapangan.',
    ahmad: 'Lingkungan Sekolahku\n\nSMA Negeri 1 Karau Kuala memiliki halaman depan yang luas dengan pagar besi berwarna hijau.\n\nRuang kelas berjajar rapi menghadap lapangan. Setiap kelas memiliki jendela besar sehingga cahaya matahari masuk dengan leluasa.\n\nKarena lingkungannya rindang dan bersih, aku merasa betah berlama-lama di sekolah.',
  };
  for (const [siswa, teks] of Object.entries(teksDeskripsi)) {
    const fd = new FormData();
    fd.append('jawaban', teks);
    await req('POST', `/api/tugas/${tTugasBind.id}/submit`, { token: tokenSiswa[siswa], form: fd });
  }

  const fdProyek = new FormData();
  fdProyek.append('jawaban', 'Soal cerita: Harga 2 buku dan 3 pensil Rp 21.000, sedangkan 1 buku dan 2 pensil Rp 12.000. Dengan metode eliminasi diperoleh harga buku Rp 6.000 dan pensil Rp 3.000.');
  await req('POST', `/api/tugas/${tProyekSpldv.id}/submit`, { token: tokenSiswa.dewi, form: fdProyek });
  await req('POST', `/api/tugas/${tProyekSpldv.id}/submit`, { token: tokenSiswa.aisyah, form: fdProyek });

  // ---- Pengumpulan terlambat ----
  const fdTelat = new FormData();
  fdTelat.append('jawaban', 'Mohon maaf Pak, saya terlambat mengumpulkan karena jaringan internet di rumah bermasalah. Latihan konversi satuan nomor 1-10 sudah saya kerjakan seluruhnya.');
  const rTelat = await req('POST', `/api/tugas/${tLatihanFis.id}/submit`,
    { token: tokenSiswa.bayu, form: fdTelat });
  const cekTelat = (await get('/api/tugas', tokenSiswa.bayu)).data.find((t) => t.id === tLatihanFis.id);
  catat({
    modul: 'Pengumpulan Tugas', skenario: 'Siswa mengumpulkan tugas setelah batas waktu (deadline) terlewati',
    input: 'Siswa mengumpulkan Latihan Soal Besaran dan Satuan setelah batas waktunya berakhir',
    harapan: 'Tugas tetap tersimpan namun ditandai sebagai pengumpulan terlambat',
    aktual: `HTTP ${rTelat.status}, pesan: "${rTelat.data?.message}", ` +
      `penanda terlambat = ${cekTelat.pengumpulan?.terlambat}`,
    sesuai: rTelat.status === 200 && cekTelat.pengumpulan.terlambat === 1,
  });

  // ---- Kuis Bahasa Inggris ----
  const soalKuisBing = (await get(`/api/tugas/${tKuisBing.id}/soal`, TG_DINA)).data;
  const kunciBing = soalKuisBing.map((s) => s.jawaban_benar);
  const esaiBing = {
    ahmad: 'My classroom is on the second floor of the school building. It has four large windows, so the room is always bright. There are thirty-two desks and a white board in front of the class.',
    dewi: 'My classroom is clean and comfortable. The walls are painted light blue and there are some pictures of Indonesian heroes on them. I like studying there with my classmates.',
    rian: 'My classroom is big. There is a white board and many chairs.',
  };
  for (const [siswa, salah] of Object.entries({ ahmad: [], dewi: [2], rian: [0, 1] })) {
    const jawaban = soalKuisBing.map((s, i) => (s.tipe === 'esai'
      ? { id_soal: s.id, jawaban_teks: esaiBing[siswa] }
      : {
        id_soal: s.id,
        pilihan: salah.includes(i) ? ['A', 'B', 'C', 'D'].find((k) => k !== kunciBing[i]) : kunciBing[i],
      }));
    await post(`/api/tugas/${tKuisBing.id}/submit`, { jawaban }, tokenSiswa[siswa]);
  }

  // =================================================================
  // H. PENILAIAN
  // =================================================================
  const kumpulLatihan = (await get(`/api/tugas/${tLatihanMtk.id}/pengumpulan`, TG)).data;
  const belumKumpul = kumpulLatihan.filter((s) => s.status === 'belum_mengumpulkan');
  catat({
    modul: 'Penilaian', skenario: 'Guru menampilkan daftar pengumpulan termasuk siswa yang belum mengumpulkan',
    input: 'Membuka daftar pengumpulan tugas Latihan Persamaan Linear',
    harapan: 'Sistem menampilkan seluruh siswa kelas beserta status pengumpulannya, termasuk yang belum mengumpulkan',
    aktual: `HTTP 200, ${kumpulLatihan.length} siswa; ${belumKumpul.length} di antaranya belum mengumpulkan`,
    sesuai: kumpulLatihan.length > 0 && belumKumpul.length > 0,
  });

  const skorLatihan = {
    'Ahmad Fauzi': [90, 'Langkah pengerjaan sudah runtut dan benar. Pertahankan.'],
    'Dewi Lestari': [85, 'Jawaban benar, tulisan pada lampiran agar diperjelas lagi.'],
    'Rian Pratama': [75, 'Nomor 9 dan 10 masih keliru pada pemindahan ruas. Pelajari kembali.'],
    'Nur Aisyah': [95, 'Sangat baik, seluruh langkah penyelesaian lengkap.'],
    'Putri Rahmawati': [88, 'Pekerjaan rapi dan jawaban tepat.'],
  };
  let rNilaiPertama = null;
  for (const s of kumpulLatihan) {
    const nilai = skorLatihan[s.nama_siswa];
    if (!nilai || !s.id) continue;
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

  const rNilaiKosong = await post('/api/nilai', { id_kumpul: rNilaiPertama.s.id, skor: '' }, TG);
  catat({
    modul: 'Penilaian', skenario: 'Guru menyimpan penilaian dengan kolom skor dikosongkan',
    input: 'Skor = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa skor wajib diisi',
    aktual: `HTTP ${rNilaiKosong.status}, pesan: "${rNilaiKosong.data?.message}"`,
    sesuai: rNilaiKosong.status === 400,
  });

  const rNilaiLebih = await post('/api/nilai', { id_kumpul: rNilaiPertama.s.id, skor: 150 }, TG);
  catat({
    modul: 'Penilaian', skenario: 'Guru mengisi nilai melebihi batas maksimum',
    input: 'Skor = 150',
    harapan: 'Sistem menolak karena nilai hanya boleh berada pada rentang 0 sampai 100',
    aktual: `HTTP ${rNilaiLebih.status}, pesan: "${rNilaiLebih.data?.message}"`,
    sesuai: rNilaiLebih.status === 400,
  });

  const rNilaiBukanMilik = await post('/api/nilai',
    { id_kumpul: rNilaiPertama.s.id, skor: 100 }, TG_SITI);
  catat({
    modul: 'Penilaian', skenario: 'Guru memberi nilai pada pengumpulan kelas mata pelajaran guru lain',
    input: 'Guru Bahasa Indonesia menilai pengumpulan tugas Matematika',
    harapan: 'Sistem menolak karena pengumpulan bukan pada kelas mata pelajaran yang diampunya',
    aktual: `HTTP ${rNilaiBukanMilik.status}, pesan: "${rNilaiBukanMilik.data?.message}"`,
    sesuai: rNilaiBukanMilik.status === 403,
  });

  // ---- Penilaian esai ----
  const kumpulKuisBind = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG_SITI)).data;
  const soalEsaiBind = soalKuisBind.find((s) => s.tipe === 'esai');
  const skorEsai = {
    'Ahmad Fauzi': [30, 'Deskripsi sangat hidup dan struktur sudah tepat.'],
    'Dewi Lestari': [28, 'Deskripsi baik, tambahkan lagi penggunaan pancaindra.'],
    'Putri Rahmawati': [26, 'Sudah sesuai struktur, kembangkan lagi deskripsi bagiannya.'],
  };
  let rNilaiEsai = null;
  for (const s of kumpulKuisBind) {
    const nilai = skorEsai[s.nama_siswa];
    if (!nilai || !s.id) continue;
    const r = await post(`/api/pengumpulan/${s.id}/nilai`, {
      scores: [{ id_soal: soalEsaiBind.id, skor: nilai[0] }], catatan: nilai[1],
    }, TG_SITI);
    if (!rNilaiEsai) rNilaiEsai = { s, r, nilai };
  }
  const rekapCek = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG_SITI)).data
    .find((x) => x.nama_siswa === rNilaiEsai.s.nama_siswa);
  catat({
    modul: 'Penilaian', skenario: 'Guru memeriksa dan menilai jawaban esai pada kuis',
    input: `Memberi skor ${rNilaiEsai.nilai[0]} untuk jawaban esai ${rNilaiEsai.s.nama_siswa}`,
    harapan: 'Sistem menggabungkan skor pilihan ganda dan esai lalu menghasilkan nilai akhir skala 0-100',
    aktual: `HTTP ${rNilaiEsai.r.status}, nilai akhir yang dihasilkan sistem: ${rekapCek?.skor}`,
    sesuai: rNilaiEsai.r.status === 200 && rekapCek?.skor != null,
  });

  const pendingCek = (await get(`/api/tugas/${tKuisBind.id}/pengumpulan`, TG_SITI)).data
    .filter((x) => x.status === 'perlu_nilai_esai');
  catat({
    modul: 'Penilaian', skenario: 'Sistem menandai pengumpulan kuis yang esainya belum dinilai guru',
    input: 'Membuka daftar pengumpulan Kuis Teks Deskripsi',
    harapan: 'Pengumpulan bertanda "Perlu nilai esai" dan nilai akhirnya belum dikeluarkan',
    aktual: `HTTP 200, ${pendingCek.length} pengumpulan menunggu penilaian esai`,
    sesuai: pendingCek.length > 0 && pendingCek.every((p) => p.skor == null),
  });

  // Penilaian sisa data agar rekap terlihat wajar
  const soalEsaiBing = soalKuisBing.find((s) => s.tipe === 'esai');
  for (const s of (await get(`/api/tugas/${tKuisBing.id}/pengumpulan`, TG_DINA)).data) {
    const nilai = { 'Ahmad Fauzi': 23, 'Dewi Lestari': 22 }[s.nama_siswa];
    if (!nilai || !s.id) continue;
    await post(`/api/pengumpulan/${s.id}/nilai`, {
      scores: [{ id_soal: soalEsaiBing.id, skor: nilai }],
      catatan: 'Good description with clear details.',
    }, TG_DINA);
  }
  for (const s of (await get(`/api/tugas/${tTugasBind.id}/pengumpulan`, TG_SITI)).data) {
    const nilai = {
      'Dewi Lestari': [92, 'Struktur lengkap dan deskripsi sangat hidup.'],
      'Putri Rahmawati': [87, 'Sudah baik, penutup dapat dipertegas lagi.'],
      'Nur Aisyah': [90, 'Pemilihan diksi sangat baik dan runtut.'],
    }[s.nama_siswa];
    if (!nilai || !s.id) continue;
    await post('/api/nilai', { id_kumpul: s.id, skor: nilai[0], catatan: nilai[1] }, TG_SITI);
  }
  for (const s of (await get(`/api/tugas/${tLatihanFis.id}/pengumpulan`, TG_RAHMAT)).data) {
    if (s.nama_siswa === 'Bayu Saputra' && s.id) {
      await post('/api/nilai', {
        id_kumpul: s.id, skor: 78,
        catatan: 'Jawaban benar, namun dikumpulkan melewati batas waktu.',
      }, TG_RAHMAT);
    }
  }

  // =================================================================
  // I. REKAP NILAI
  // =================================================================
  const rRekap = await get('/api/nilai/saya', tokenSiswa.ahmad);
  catat({
    modul: 'Rekap Nilai', skenario: 'Siswa melihat rekap nilai yang dikelompokkan per mata pelajaran',
    input: 'Membuka menu Nilai',
    harapan: 'Nilai disajikan terpisah per mata pelajaran beserta rata-rata masing-masing, tidak digabung',
    aktual: `HTTP ${rRekap.status}, ${rRekap.data.mapel.length} mata pelajaran; contoh: ` +
      rRekap.data.mapel.slice(0, 3).map((m) => `${m.nama_mapel} (rata-rata ${m.rata_rata})`).join(', '),
    sesuai: rRekap.status === 200 && rRekap.data.mapel.length >= 2
      && rRekap.data.mapel.every((m) => Array.isArray(m.tugas)),
  });

  catat({
    modul: 'Rekap Nilai', skenario: 'Sistem menandai tugas yang tidak dikumpulkan siswa hingga batas waktu',
    input: 'Membuka rekap nilai siswa',
    harapan: 'Tugas yang terlewat batas waktunya ditandai sebagai tidak dikumpulkan',
    aktual: `${rRekap.data.ringkasan.jumlah_missing} tugas ditandai tidak dikumpulkan ` +
      `dari total ${rRekap.data.ringkasan.jumlah_tugas} tugas`,
    sesuai: rRekap.data.ringkasan.jumlah_missing >= 0
      && rRekap.data.mapel.some((m) => m.tugas.some((t) => t.status === 'tidak_dikumpulkan')),
  });

  const periodeSiswaMaya = await get('/api/nilai/saya', TS_MAYA);
  catat({
    modul: 'Rekap Nilai', skenario: 'Siswa menelusuri riwayat nilai pada periode pembelajaran sebelumnya',
    input: 'Memilih periode terdahulu pada menu Nilai',
    harapan: 'Sistem menampilkan daftar periode yang pernah diikuti siswa beserta kelasnya',
    aktual: `HTTP ${periodeSiswaMaya.status}, ${periodeSiswaMaya.data.daftar_periode.length} periode: ` +
      periodeSiswaMaya.data.daftar_periode.map((p) => `${p.kode} (kelas ${p.nama_kelas})`).join(', '),
    sesuai: periodeSiswaMaya.status === 200 && periodeSiswaMaya.data.daftar_periode.length >= 2,
  });

  const rekapDewi = await get('/api/nilai/saya', tokenSiswa.dewi);
  const berbeda = JSON.stringify(rekapDewi.data.mapel) !== JSON.stringify(rRekap.data.mapel);
  catat({
    modul: 'Rekap Nilai', skenario: 'Sistem membatasi rekap nilai hanya milik siswa yang sedang login',
    input: 'Login sebagai siswa lain lalu membuka menu Nilai',
    harapan: 'Sistem hanya menampilkan nilai milik siswa yang sedang login',
    aktual: `HTTP ${rekapDewi.status}, data nilai tiap siswa berbeda: ${berbeda ? 'ya' : 'tidak'}`,
    sesuai: rekapDewi.status === 200 && berbeda,
  });

  const rRekapGuru = await get(`/api/nilai/kelas-mapel/${kmGuruMtk.id}`, TG);
  catat({
    modul: 'Rekap Nilai', skenario: 'Guru melihat rekap nilai seluruh siswa pada satu kelas mata pelajaran',
    input: `Membuka rekap nilai ${kmGuruMtk.nama_mapel} kelas ${kmGuruMtk.nama_kelas}`,
    harapan: 'Sistem menampilkan nilai seluruh siswa untuk setiap tugas beserta rata-ratanya',
    aktual: `HTTP ${rRekapGuru.status}, ${rRekapGuru.data.siswa.length} siswa dan ` +
      `${rRekapGuru.data.tugas.length} tugas ditampilkan`,
    sesuai: rRekapGuru.status === 200 && rRekapGuru.data.siswa.length > 0,
  });

  // =================================================================
  // J. FORUM DISKUSI
  // =================================================================
  const pertemuanForum = ptGuru[0];
  const rTopikSiswa = await post('/api/forum', {
    id_pertemuan: pertemuanForum.id, judul: 'Topik dari siswa',
    pesan: 'Percobaan membuat topik diskusi oleh siswa.',
  }, tokenSiswa.ahmad);
  catat({
    modul: 'Forum Diskusi', skenario: 'Siswa mencoba membuka topik diskusi baru',
    input: 'Siswa mengirim topik diskusi baru pada sebuah pertemuan',
    harapan: 'Ditolak karena topik diskusi hanya boleh dibuka oleh guru pengampu; siswa menanggapi lewat balasan',
    aktual: `HTTP ${rTopikSiswa.status}, pesan: "${rTopikSiswa.data?.message}"`,
    sesuai: rTopikSiswa.status === 403,
  });

  const rTopikGuru = await post('/api/forum', {
    id_pertemuan: pertemuanForum.id,
    judul: 'Kesulitan pada Latihan Persamaan Linear',
    pesan: 'Anak-anak, bagian mana dari latihan persamaan linear yang masih terasa sulit? '
      + 'Tuliskan di sini agar Bapak bahas kembali pada pertemuan berikutnya.',
  }, TG);
  catat({
    modul: 'Forum Diskusi', skenario: 'Guru membuka topik diskusi pada sebuah pertemuan',
    input: 'Guru pengampu mengisi judul dan isi topik diskusi',
    harapan: 'Topik tersimpan dan tampil pada forum diskusi pertemuan tersebut',
    aktual: `HTTP ${rTopikGuru.status}, pesan: "${rTopikGuru.data?.message}"`,
    sesuai: rTopikGuru.status === 201,
  });
  const idTopik = rTopikGuru.data?.id;

  const rBalasSiswa = await post('/api/forum', {
    id_pertemuan: pertemuanForum.id, id_parent: idTopik,
    pesan: 'Saya masih bingung ketika variabel berada di kedua ruas, contohnya 5x = 3x + 12, Pak.',
  }, tokenSiswa.ahmad);
  catat({
    modul: 'Forum Diskusi', skenario: 'Siswa menanggapi topik diskusi yang dibuka guru',
    input: 'Siswa menekan tombol Balas lalu menuliskan tanggapannya',
    harapan: 'Balasan tersimpan dan tampil di bawah topik yang bersangkutan',
    aktual: `HTTP ${rBalasSiswa.status}, pesan: "${rBalasSiswa.data?.message}"`,
    sesuai: rBalasSiswa.status === 201,
  });

  await post('/api/forum', {
    id_pertemuan: pertemuanForum.id, id_parent: idTopik,
    pesan: 'Pertanyaan bagus, Ahmad. Pindahkan semua suku yang memuat variabel ke ruas kiri sehingga '
      + 'menjadi 5x - 3x = 12, lalu 2x = 12 dan x = 6.',
  }, TG);
  await post('/api/forum', {
    id_pertemuan: pertemuanForum.id, id_parent: idTopik,
    pesan: 'Terima kasih Pak, penjelasannya sudah jelas. Berarti tandanya berubah saat pindah ruas ya, Pak.',
  }, tokenSiswa.dewi);

  const rPesanKosong = await post('/api/forum',
    { id_pertemuan: pertemuanForum.id, id_parent: idTopik, pesan: '   ' }, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna mengirim balasan forum dengan isi pesan dikosongkan',
    input: 'Isi pesan = (kosong)',
    harapan: 'Sistem menolak dan menampilkan pesan bahwa isi pesan wajib diisi',
    aktual: `HTTP ${rPesanKosong.status}, pesan: "${rPesanKosong.data?.message}"`,
    sesuai: rPesanKosong.status === 400,
  });

  const rLihatForum = await get(`/api/forum?id_pertemuan=${pertemuanForum.id}`, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna menampilkan forum diskusi yang menyatu dalam materi pertemuan',
    input: `Membuka Pertemuan ${pertemuanForum.nomor} lalu melihat bagian forum diskusi`,
    harapan: 'Forum diskusi tampil di dalam pertemuan beserta seluruh balasannya secara berurutan',
    aktual: `HTTP ${rLihatForum.status}, ${rLihatForum.data.length} topik dengan total ` +
      `${rLihatForum.data.reduce((a, t) => a + t.balasan.length, 0)} balasan`,
    sesuai: rLihatForum.status === 200 && rLihatForum.data.length >= 1,
  });

  const pesanUji = await post('/api/forum', {
    id_pertemuan: pertemuanForum.id, id_parent: idTopik,
    pesan: 'Pesan percobaan yang akan dihapus kembali oleh penulisnya.',
  }, tokenSiswa.rian);
  const rHapusOrangLain = await del(`/api/forum/${pesanUji.data.id}`, tokenSiswa.bayu);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna mencoba menghapus pesan forum milik pengguna lain',
    input: 'Siswa lain menekan tombol hapus pada pesan yang bukan miliknya',
    harapan: 'Sistem menolak karena pesan bukan milik pengguna tersebut',
    aktual: `HTTP ${rHapusOrangLain.status}, pesan: "${rHapusOrangLain.data?.message}"`,
    sesuai: rHapusOrangLain.status === 403,
  });

  const rHapusSendiri = await del(`/api/forum/${pesanUji.data.id}`, tokenSiswa.rian);
  catat({
    modul: 'Forum Diskusi', skenario: 'Pengguna menghapus pesan forum miliknya sendiri',
    input: 'Siswa menghapus balasan yang ditulisnya sendiri',
    harapan: 'Pesan terhapus dari forum diskusi',
    aktual: `HTTP ${rHapusSendiri.status}, pesan: "${rHapusSendiri.data?.message}"`,
    sesuai: rHapusSendiri.status === 200,
  });

  // =================================================================
  // K. DASHBOARD
  // =================================================================
  const dAdmin = await get('/api/dashboard', TA);
  const cekMapel = (await get('/api/mapel', TA)).data.filter((m) => m.aktif).length;
  const cekKelas = (await get('/api/kelas', TA)).data.length;
  catat({
    modul: 'Dashboard', skenario: 'Statistik dashboard administrator sesuai dengan isi menu terkait',
    input: 'Membandingkan angka dashboard dengan jumlah data pada menu Kelas dan Mata Pelajaran',
    harapan: 'Seluruh angka pada dashboard sama dengan jumlah data sebenarnya pada periode aktif',
    aktual: `Dashboard: ${dAdmin.data.total_kelas} kelas & ${dAdmin.data.total_mapel} mapel; ` +
      `data sebenarnya: ${cekKelas} kelas & ${cekMapel} mapel`,
    sesuai: dAdmin.data.total_kelas === cekKelas && dAdmin.data.total_mapel === cekMapel,
  });

  const dGuru = await get('/api/dashboard', TG);
  catat({
    modul: 'Dashboard', skenario: 'Guru melihat ringkasan aktivitas pembelajaran pada dashboard',
    input: 'Membuka dashboard guru',
    harapan: 'Sistem menampilkan jumlah kelas, pertemuan, materi, tugas, dan pekerjaan yang perlu dinilai',
    aktual: `HTTP ${dGuru.status}: ${dGuru.data.total_kelas_mapel} kelas mapel, ` +
      `${dGuru.data.total_pertemuan} pertemuan, ${dGuru.data.total_materi} materi, ` +
      `${dGuru.data.total_tugas} tugas, ${dGuru.data.perlu_dinilai} perlu dinilai`,
    sesuai: dGuru.status === 200 && dGuru.data.periode !== null,
  });

  const dSiswa = await get('/api/dashboard', tokenSiswa.ahmad);
  catat({
    modul: 'Dashboard', skenario: 'Siswa melihat ringkasan tugas dan pengingat batas waktu pada dashboard',
    input: 'Membuka dashboard siswa',
    harapan: 'Sistem menampilkan ringkasan tugas beserta daftar tugas yang tenggatnya sudah dekat',
    aktual: `HTTP ${dSiswa.status}: kelas ${dSiswa.data.kelas?.nama_kelas}, ` +
      `${dSiswa.data.total_tugas} tugas, ${dSiswa.data.sudah_kumpul} dikumpulkan, ` +
      `${dSiswa.data.tugas_mendesak.length} tugas mendesak`,
    sesuai: dSiswa.status === 200 && !!dSiswa.data.kelas,
  });

  const rGantiSandi = await put('/api/auth/password',
    { passwordLama: 'siswa123', passwordBaru: 'siswa456' }, tokenSiswa.putri);
  const cekSandiBaru = await login('putri@siswa.smakk.sch.id', 'siswa456');
  await put('/api/auth/password',
    { passwordLama: 'siswa456', passwordBaru: 'siswa123' }, cekSandiBaru.data.token);
  catat({
    modul: 'Autentikasi', skenario: 'Pengguna mengubah kata sandi akunnya',
    input: 'Password lama: siswa123; Password baru: siswa456',
    harapan: 'Kata sandi berhasil diperbarui dan dapat digunakan untuk login berikutnya',
    aktual: `HTTP ${rGantiSandi.status}, login dengan kata sandi baru: HTTP ${cekSandiBaru.status}`,
    sesuai: rGantiSandi.status === 200 && cekSandiBaru.status === 200,
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
