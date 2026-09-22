const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ---------------------------------------------------------------------
// Pembatasan jenis dan ukuran berkas unggahan
//   Dokumen/gambar : maksimum 20 MB
//   Video          : maksimum 100 MB
// ---------------------------------------------------------------------
const EKSTENSI_DOKUMEN = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'];
const EKSTENSI_GAMBAR = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const EKSTENSI_VIDEO = ['.mp4', '.webm', '.mkv', '.mov'];
const SEMUA_EKSTENSI = [...EKSTENSI_DOKUMEN, ...EKSTENSI_GAMBAR, ...EKSTENSI_VIDEO];

const BATAS_VIDEO = 100 * 1024 * 1024; // 100 MB
const BATAS_UMUM = 20 * 1024 * 1024;   // 20 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!SEMUA_EKSTENSI.includes(ext)) {
    const err = new Error(
      `Jenis berkas ${ext || '(tanpa ekstensi)'} tidak diizinkan. ` +
      `Gunakan dokumen (${EKSTENSI_DOKUMEN.join(', ')}), ` +
      `gambar (${EKSTENSI_GAMBAR.join(', ')}), atau video (${EKSTENSI_VIDEO.join(', ')}).`);
    err.status = 415;
    return cb(err);
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: BATAS_VIDEO } });

// Memeriksa ukuran berkas non-video setelah diunggah (batas lebih kecil)
function batasiUkuran(req, res, next) {
  if (!req.file) return next();
  const ext = path.extname(req.file.originalname).toLowerCase();
  const isVideo = EKSTENSI_VIDEO.includes(ext);
  const batas = isVideo ? BATAS_VIDEO : BATAS_UMUM;
  if (req.file.size > batas) {
    fs.unlink(req.file.path, () => {});
    return res.status(413).json({
      message: `Ukuran berkas melebihi batas ${Math.round(batas / 1024 / 1024)} MB ` +
        `untuk jenis berkas ${ext}.` });
  }
  next();
}

module.exports = upload;
module.exports.batasiUkuran = batasiUkuran;
module.exports.EKSTENSI = { EKSTENSI_DOKUMEN, EKSTENSI_GAMBAR, EKSTENSI_VIDEO };
module.exports.BATAS = { BATAS_UMUM, BATAS_VIDEO };
