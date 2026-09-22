const pool = require('../config/db');

// ---------------------------------------------------------------------
// Penguncian periode pembelajaran
// ---------------------------------------------------------------------
// Administrator dapat mengunci sebuah periode apabila periode tersebut
// telah selesai. Seluruh data pada periode terkunci bersifat hanya-baca:
// guru tidak dapat lagi mengubah materi/tugas/nilai dan siswa tidak dapat
// mengumpulkan tugas, namun semua data tetap dapat dilihat sebagai arsip.
//
// Pengecekan dilakukan di sisi server (bukan sekadar menyembunyikan
// tombol pada antarmuka) agar penguncian benar-benar tidak dapat ditembus.
// ---------------------------------------------------------------------

const PESAN_TERKUNCI = (kode) =>
  `Periode pembelajaran ${kode} telah dikunci oleh administrator. ` +
  'Data pada periode ini hanya dapat dilihat dan tidak dapat diubah.';

// Periode yang sedang berjalan
async function periodeAktif() {
  const [rows] = await pool.query("SELECT * FROM periode WHERE status = 'aktif' LIMIT 1");
  return rows.length ? rows[0] : null;
}

// Menelusuri periode dari berbagai entitas pembelajaran
const JALUR = {
  kelas: `SELECT p.* FROM kelas k JOIN periode p ON p.id = k.id_periode WHERE k.id = ?`,
  kelas_mapel: `SELECT p.* FROM kelas_mapel km
                JOIN kelas k ON k.id = km.id_kelas
                JOIN periode p ON p.id = k.id_periode WHERE km.id = ?`,
  pertemuan: `SELECT p.* FROM pertemuan pt
              JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
              JOIN kelas k ON k.id = km.id_kelas
              JOIN periode p ON p.id = k.id_periode WHERE pt.id = ?`,
  materi: `SELECT p.* FROM materi m
           JOIN pertemuan pt ON pt.id = m.id_pertemuan
           JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
           JOIN kelas k ON k.id = km.id_kelas
           JOIN periode p ON p.id = k.id_periode WHERE m.id = ?`,
  tugas: `SELECT p.* FROM tugas t
          JOIN pertemuan pt ON pt.id = t.id_pertemuan
          JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
          JOIN kelas k ON k.id = km.id_kelas
          JOIN periode p ON p.id = k.id_periode WHERE t.id = ?`,
  soal: `SELECT p.* FROM soal s
         JOIN tugas t ON t.id = s.id_tugas
         JOIN pertemuan pt ON pt.id = t.id_pertemuan
         JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
         JOIN kelas k ON k.id = km.id_kelas
         JOIN periode p ON p.id = k.id_periode WHERE s.id = ?`,
  pengumpulan: `SELECT p.* FROM pengumpulan_tugas pg
                JOIN tugas t ON t.id = pg.id_tugas
                JOIN pertemuan pt ON pt.id = t.id_pertemuan
                JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
                JOIN kelas k ON k.id = km.id_kelas
                JOIN periode p ON p.id = k.id_periode WHERE pg.id = ?`,
  forum: `SELECT p.* FROM forum_diskusi f
          JOIN pertemuan pt ON pt.id = f.id_pertemuan
          JOIN kelas_mapel km ON km.id = pt.id_kelas_mapel
          JOIN kelas k ON k.id = km.id_kelas
          JOIN periode p ON p.id = k.id_periode WHERE f.id = ?`,
};

// Mengambil data periode dari sebuah entitas, contoh: periodeDari('tugas', 5)
async function periodeDari(entitas, id) {
  const sql = JALUR[entitas];
  if (!sql) throw new Error(`Jalur periode untuk "${entitas}" belum didefinisikan`);
  const [rows] = await pool.query(sql, [id]);
  return rows.length ? rows[0] : null;
}

/**
 * Middleware: menolak perubahan data apabila periode terkait telah dikunci.
 * Contoh pemakaian: pastikanPeriodeTerbuka('tugas', (req) => req.params.id)
 *
 * @param {string} entitas  nama entitas pada objek JALUR
 * @param {(req)=>any} ambilId  fungsi pengambil id dari request
 */
function pastikanPeriodeTerbuka(entitas, ambilId) {
  return async (req, res, next) => {
    try {
      const id = ambilId(req);
      if (!id) return res.status(400).json({ message: 'Data acuan tidak ditemukan pada permintaan' });
      const p = await periodeDari(entitas, id);
      if (!p) return res.status(404).json({ message: 'Data tidak ditemukan' });
      if (p.status === 'terkunci')
        return res.status(423).json({ message: PESAN_TERKUNCI(p.kode), periode: p.kode });
      if (p.status === 'draft')
        return res.status(423).json({
          message: `Periode ${p.kode} belum diaktifkan oleh administrator.`, periode: p.kode });
      req.periode = p;
      next();
    } catch (err) { next(err); }
  };
}

module.exports = { periodeAktif, periodeDari, pastikanPeriodeTerbuka, PESAN_TERKUNCI };
