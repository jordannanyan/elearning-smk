const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const {
  guruIdOf, siswaIdOf, kelasMapelMilikGuru,
  kelasMapelDariPertemuan, berhakAtasPertemuan,
} = require('../utils/akses');

// ---------------------------------------------------------------------
// Materi pembelajaran kini melekat pada sebuah pertemuan dan mendukung
// empat jenis penyajian:
//   teks  -> uraian materi yang diketik guru
//   file  -> berkas yang diunggah (PDF, dokumen, presentasi, gambar)
//   video -> berkas video yang diunggah guru
//   link  -> tautan video YouTube atau sumber belajar lain
// ---------------------------------------------------------------------

const TIPE_VALID = ['teks', 'file', 'video', 'link'];

// Mengubah berbagai bentuk tautan YouTube menjadi URL sematan (embed)
function embedYoutube(url) {
  if (!url) return null;
  const pola = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const p of pola) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

function lengkapi(m) {
  return { ...m, embed_url: m.tipe === 'link' ? embedYoutube(m.url) : null };
}

// GET /api/materi?id_pertemuan=..&id_kelas_mapel=..
exports.list = asyncHandler(async (req, res) => {
  const { id_pertemuan, id_kelas_mapel } = req.query;
  const where = [];
  const params = [];

  if (id_pertemuan) { where.push('m.id_pertemuan = ?'); params.push(id_pertemuan); }
  if (id_kelas_mapel) { where.push('pt.id_kelas_mapel = ?'); params.push(id_kelas_mapel); }

  if (req.user.role === 'guru') {
    const gid = await guruIdOf(req.user.id);
    where.push('km.id_guru = ?'); params.push(gid);
  } else if (req.user.role === 'siswa') {
    const sid = await siswaIdOf(req.user.id);
    where.push('EXISTS (SELECT 1 FROM siswa_kelas sk WHERE sk.id_kelas = km.id_kelas AND sk.id_siswa = ?)');
    params.push(sid);
  }

  const [rows] = await pool.query(`
    SELECT m.*, pt.nomor AS nomor_pertemuan, pt.judul AS judul_pertemuan,
           mp.nama AS nama_mapel, k.nama_kelas, u.nama AS nama_guru
    FROM materi m
    JOIN pertemuan pt ON pt.id = m.id_pertemuan
    JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
    JOIN mata_pelajaran mp ON mp.id = km.id_mapel
    JOIN kelas k ON k.id = km.id_kelas
    LEFT JOIN guru g  ON g.id = km.id_guru
    LEFT JOIN users u ON u.id = g.id_user
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY pt.nomor, m.id
  `, params);
  res.json(rows.map(lengkapi));
});

// POST /api/materi  (guru) -> multipart: id_pertemuan, judul, konten, tipe, url, file
exports.create = asyncHandler(async (req, res) => {
  const { id_pertemuan, judul, konten, url } = req.body;
  const tipe = TIPE_VALID.includes(req.body.tipe) ? req.body.tipe : 'teks';

  if (!id_pertemuan || !judul)
    return res.status(400).json({ message: 'Pertemuan dan judul materi wajib diisi' });

  const idKm = await kelasMapelDariPertemuan(id_pertemuan);
  if (!idKm) return res.status(404).json({ message: 'Pertemuan tidak ditemukan' });
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Pertemuan ini bukan pada kelas yang Anda ampu' });

  if ((tipe === 'file' || tipe === 'video') && !req.file)
    return res.status(400).json({ message: `Berkas wajib diunggah untuk materi bertipe ${tipe}` });
  if (tipe === 'link') {
    if (!url) return res.status(400).json({ message: 'Tautan materi wajib diisi untuk tipe link' });
    if (!/^https?:\/\//i.test(url))
      return res.status(400).json({ message: 'Tautan harus diawali http:// atau https://' });
  }

  const [r] = await pool.query(
    'INSERT INTO materi (id_pertemuan, judul, konten, tipe, file, url) VALUES (?,?,?,?,?,?)',
    [id_pertemuan, judul, konten || null, tipe,
      req.file ? req.file.filename : null, tipe === 'link' ? url : null]
  );
  res.status(201).json({ id: r.insertId, message: 'Materi berhasil ditambahkan' });
});

// PUT /api/materi/:id  (guru)
exports.update = asyncHandler(async (req, res) => {
  const { judul, konten, url } = req.body;
  const [m] = await pool.query('SELECT * FROM materi WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Materi tidak ditemukan' });

  const idKm = await kelasMapelDariPertemuan(m[0].id_pertemuan);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan materi pada kelas yang Anda ampu' });

  const tipe = TIPE_VALID.includes(req.body.tipe) ? req.body.tipe : m[0].tipe;
  if (tipe === 'link' && url && !/^https?:\/\//i.test(url))
    return res.status(400).json({ message: 'Tautan harus diawali http:// atau https://' });

  const file = req.file ? req.file.filename : m[0].file;
  await pool.query(
    'UPDATE materi SET judul = ?, konten = ?, tipe = ?, file = ?, url = ? WHERE id = ?',
    [judul ?? m[0].judul, konten || null, tipe, file,
      tipe === 'link' ? (url || m[0].url) : null, req.params.id]
  );
  res.json({ message: 'Materi berhasil diperbarui' });
});

// DELETE /api/materi/:id  (guru)
exports.remove = asyncHandler(async (req, res) => {
  const [m] = await pool.query('SELECT * FROM materi WHERE id = ?', [req.params.id]);
  if (!m.length) return res.status(404).json({ message: 'Materi tidak ditemukan' });
  const idKm = await kelasMapelDariPertemuan(m[0].id_pertemuan);
  if (!(await kelasMapelMilikGuru(req.user.id, idKm)))
    return res.status(403).json({ message: 'Bukan materi pada kelas yang Anda ampu' });
  await pool.query('DELETE FROM materi WHERE id = ?', [req.params.id]);
  res.json({ message: 'Materi berhasil dihapus' });
});

exports.berhakAtasPertemuan = berhakAtasPertemuan;
exports.embedYoutube = embedYoutube;
exports.lengkapiMateri = lengkapi;
