const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const auth = require('../controllers/authController');
const users = require('../controllers/userController');
const kelas = require('../controllers/kelasController');
const mapel = require('../controllers/mapelController');
const materi = require('../controllers/materiController');
const tugas = require('../controllers/tugasController');
const nilai = require('../controllers/nilaiController');
const forum = require('../controllers/forumController');
const dashboard = require('../controllers/dashboardController');

// ---------- Auth ----------
router.post('/auth/login', auth.login);
router.get('/auth/me', authenticate, auth.me);
router.put('/auth/password', authenticate, auth.changePassword);

// ---------- Dashboard ----------
router.get('/dashboard', authenticate, dashboard.summary);

// ---------- Users (admin) ----------
router.get('/users', authenticate, authorize('admin'), users.list);
router.post('/users', authenticate, authorize('admin'), users.create);
router.put('/users/:id', authenticate, authorize('admin'), users.update);
router.delete('/users/:id', authenticate, authorize('admin'), users.remove);

// ---------- Kelas ----------
router.get('/kelas', authenticate, kelas.list);
router.post('/kelas', authenticate, authorize('admin'), kelas.create);
router.put('/kelas/:id', authenticate, authorize('admin'), kelas.update);
router.delete('/kelas/:id', authenticate, authorize('admin'), kelas.remove);

// ---------- Mata Pelajaran ----------
router.get('/mapel', authenticate, mapel.list);
router.get('/guru/options', authenticate, authorize('admin'), mapel.guruOptions);
router.post('/mapel', authenticate, authorize('admin'), mapel.create);
router.put('/mapel/:id', authenticate, authorize('admin'), mapel.update);
router.delete('/mapel/:id', authenticate, authorize('admin'), mapel.remove);

// ---------- Materi ----------
router.get('/materi', authenticate, materi.list);
router.post('/materi', authenticate, authorize('guru'), upload.single('file'), materi.create);
router.put('/materi/:id', authenticate, authorize('guru'), upload.single('file'), materi.update);
router.delete('/materi/:id', authenticate, authorize('guru'), materi.remove);

// ---------- Tugas & Pengumpulan ----------
router.get('/tugas', authenticate, tugas.list);
router.post('/tugas', authenticate, authorize('guru'), tugas.create);
router.put('/tugas/:id', authenticate, authorize('guru'), tugas.update);
router.delete('/tugas/:id', authenticate, authorize('guru'), tugas.remove);
router.post('/tugas/:id/submit', authenticate, authorize('siswa'), upload.single('file'), tugas.submit);
router.get('/tugas/:id/pengumpulan', authenticate, authorize('guru'), tugas.listPengumpulan);

// ---------- Nilai ----------
router.post('/nilai', authenticate, authorize('guru'), nilai.beriNilai);
router.get('/nilai/saya', authenticate, authorize('siswa'), nilai.rekapSiswa);

// ---------- Forum ----------
router.get('/forum', authenticate, forum.list);
router.post('/forum', authenticate, forum.create);
router.delete('/forum/:id', authenticate, forum.remove);

module.exports = router;
