const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { batasiUkuran } = require('../middleware/upload');
const { pastikanPeriodeTerbuka } = require('../middleware/periode');

const auth = require('../controllers/authController');
const users = require('../controllers/userController');
const periode = require('../controllers/periodeController');
const kelas = require('../controllers/kelasController');
const mapel = require('../controllers/mapelController');
const kelasMapel = require('../controllers/kelasMapelController');
const pertemuan = require('../controllers/pertemuanController');
const materi = require('../controllers/materiController');
const tugas = require('../controllers/tugasController');
const soal = require('../controllers/soalController');
const nilai = require('../controllers/nilaiController');
const forum = require('../controllers/forumController');
const dashboard = require('../controllers/dashboardController');

// Pintasan penulisan middleware penguncian periode
const kunci = (entitas, ambilId) => pastikanPeriodeTerbuka(entitas, ambilId);
const dariParam = (req) => req.params.id;
const dariBody = (kolom) => (req) => req.body[kolom];

// ---------- Auth ----------
router.post('/auth/login', auth.login);
router.get('/auth/me', authenticate, auth.me);
router.put('/auth/password', authenticate, auth.changePassword);

// ---------- Dashboard ----------
router.get('/dashboard', authenticate, dashboard.summary);

// ---------- Periode pembelajaran (admin) ----------
router.get('/periode', authenticate, periode.list);
router.get('/periode/aktif', authenticate, periode.aktif);
router.post('/periode', authenticate, authorize('admin'), periode.create);
router.put('/periode/:id', authenticate, authorize('admin'), periode.update);
router.post('/periode/:id/aktifkan', authenticate, authorize('admin'), periode.aktifkan);
router.post('/periode/:id/kunci', authenticate, authorize('admin'), periode.kunci);
router.post('/periode/:id/buka-kunci', authenticate, authorize('admin'), periode.bukaKunci);
router.delete('/periode/:id', authenticate, authorize('admin'), periode.remove);

// ---------- Pengguna (admin) ----------
router.get('/users', authenticate, authorize('admin'), users.list);
router.get('/users/siswa-tersedia', authenticate, authorize('admin'), users.siswaTersedia);
router.post('/users', authenticate, authorize('admin'), users.create);
router.put('/users/:id', authenticate, authorize('admin'), users.update);
router.put('/users/:id/status', authenticate, authorize('admin'), users.ubahStatus);
router.delete('/users/:id', authenticate, authorize('admin'), users.remove);

// ---------- Kelas ----------
router.get('/kelas', authenticate, kelas.list);
router.get('/kelas/:id/siswa', authenticate, kelas.anggota);
router.post('/kelas', authenticate, authorize('admin'), kelas.create);
router.put('/kelas/:id', authenticate, authorize('admin'),
  kunci('kelas', dariParam), kelas.update);
router.delete('/kelas/:id', authenticate, authorize('admin'),
  kunci('kelas', dariParam), kelas.remove);
router.post('/kelas/:id/siswa', authenticate, authorize('admin'),
  kunci('kelas', dariParam), kelas.tambahAnggota);
router.delete('/kelas/:id/siswa/:idSiswa', authenticate, authorize('admin'),
  kunci('kelas', dariParam), kelas.hapusAnggota);

// ---------- Katalog mata pelajaran (admin) ----------
router.get('/mapel', authenticate, mapel.list);
router.get('/guru/options', authenticate, authorize('admin'), mapel.guruOptions);
router.post('/mapel', authenticate, authorize('admin'), mapel.create);
router.put('/mapel/:id', authenticate, authorize('admin'), mapel.update);
router.put('/mapel/:id/status', authenticate, authorize('admin'), mapel.ubahStatus);
router.delete('/mapel/:id', authenticate, authorize('admin'), mapel.remove);

// ---------- Pengampuan / kelas mata pelajaran ----------
router.get('/kelas-mapel', authenticate, kelasMapel.list);
router.get('/kelas-mapel/:id', authenticate, kelasMapel.detail);
router.post('/kelas-mapel', authenticate, authorize('admin'),
  kunci('kelas', dariBody('id_kelas')), kelasMapel.create);
router.put('/kelas-mapel/:id', authenticate, authorize('admin'),
  kunci('kelas_mapel', dariParam), kelasMapel.update);
router.delete('/kelas-mapel/:id', authenticate, authorize('admin'),
  kunci('kelas_mapel', dariParam), kelasMapel.remove);

// ---------- Pertemuan ----------
router.get('/kelas-mapel/:id/pertemuan', authenticate, pertemuan.list);
router.get('/pertemuan/:id', authenticate, pertemuan.detail);
router.post('/kelas-mapel/:id/pertemuan', authenticate, authorize('guru'),
  kunci('kelas_mapel', dariParam), pertemuan.create);
router.put('/pertemuan/:id', authenticate, authorize('guru'),
  kunci('pertemuan', dariParam), pertemuan.update);
router.delete('/pertemuan/:id', authenticate, authorize('guru'),
  kunci('pertemuan', dariParam), pertemuan.remove);

// ---------- Materi ----------
router.get('/materi', authenticate, materi.list);
router.post('/materi', authenticate, authorize('guru'),
  upload.single('file'), batasiUkuran,
  kunci('pertemuan', dariBody('id_pertemuan')), materi.create);
router.put('/materi/:id', authenticate, authorize('guru'),
  upload.single('file'), batasiUkuran,
  kunci('materi', dariParam), materi.update);
router.delete('/materi/:id', authenticate, authorize('guru'),
  kunci('materi', dariParam), materi.remove);

// ---------- Tugas & kuis ----------
router.get('/tugas', authenticate, tugas.list);
router.post('/tugas', authenticate, authorize('guru'),
  kunci('pertemuan', dariBody('id_pertemuan')), tugas.create);
router.put('/tugas/:id', authenticate, authorize('guru'),
  kunci('tugas', dariParam), tugas.update);
router.delete('/tugas/:id', authenticate, authorize('guru'),
  kunci('tugas', dariParam), tugas.remove);

router.get('/tugas/:id/kerjakan', authenticate, authorize('siswa'), tugas.kerjakan);
router.post('/tugas/:id/submit', authenticate, authorize('siswa'),
  upload.single('file'), batasiUkuran,
  kunci('tugas', dariParam), tugas.submit);

router.get('/tugas/:id/pengumpulan', authenticate, authorize('guru'), tugas.listPengumpulan);
router.get('/pengumpulan/:id', authenticate, authorize('guru'), tugas.detailPengumpulan);
router.post('/pengumpulan/:id/nilai', authenticate, authorize('guru'),
  kunci('pengumpulan', dariParam), tugas.nilaiEsai);

// ---------- Butir soal ----------
router.get('/tugas/:id/soal', authenticate, authorize('guru'), soal.list);
router.post('/tugas/:id/soal', authenticate, authorize('guru'),
  kunci('tugas', dariParam), soal.create);
router.put('/soal/:id', authenticate, authorize('guru'),
  kunci('soal', dariParam), soal.update);
router.delete('/soal/:id', authenticate, authorize('guru'),
  kunci('soal', dariParam), soal.remove);

// ---------- Nilai ----------
router.post('/nilai', authenticate, authorize('guru'),
  kunci('pengumpulan', dariBody('id_kumpul')), nilai.beriNilai);
router.get('/nilai/saya', authenticate, authorize('siswa'), nilai.rekapSiswa);
router.get('/nilai/kelas-mapel/:id', authenticate, authorize('guru', 'admin'), nilai.rekapKelasMapel);

// ---------- Forum diskusi ----------
router.get('/forum', authenticate, forum.list);
router.post('/forum', authenticate,
  kunci('pertemuan', dariBody('id_pertemuan')), forum.create);
router.delete('/forum/:id', authenticate,
  kunci('forum', dariParam), forum.remove);

module.exports = router;
