const pool = require('../config/db');

// ---------------------------------------------------------------------
// Kumpulan fungsi bantu pemeriksaan hak akses terhadap data pembelajaran
// ---------------------------------------------------------------------

async function guruIdOf(userId) {
  const [g] = await pool.query('SELECT id FROM guru WHERE id_user = ?', [userId]);
  return g.length ? g[0].id : null;
}

async function siswaIdOf(userId) {
  const [s] = await pool.query('SELECT id FROM siswa WHERE id_user = ?', [userId]);
  return s.length ? s[0].id : null;
}

// Apakah kelas_mapel tersebut diampu oleh guru yang sedang login?
async function kelasMapelMilikGuru(userId, idKelasMapel) {
  const gid = await guruIdOf(userId);
  if (!gid) return false;
  const [rows] = await pool.query(
    'SELECT id FROM kelas_mapel WHERE id = ? AND id_guru = ?', [idKelasMapel, gid]);
  return rows.length > 0;
}

// Apakah siswa yang login terdaftar pada kelas dari kelas_mapel tersebut?
async function kelasMapelDiikutiSiswa(userId, idKelasMapel) {
  const sid = await siswaIdOf(userId);
  if (!sid) return false;
  const [rows] = await pool.query(`
    SELECT km.id FROM kelas_mapel km
    JOIN siswa_kelas sk ON sk.id_kelas = km.id_kelas
    WHERE km.id = ? AND sk.id_siswa = ?`, [idKelasMapel, sid]);
  return rows.length > 0;
}

// kelas_mapel dari sebuah pertemuan
async function kelasMapelDariPertemuan(idPertemuan) {
  const [rows] = await pool.query(
    'SELECT id_kelas_mapel FROM pertemuan WHERE id = ?', [idPertemuan]);
  return rows.length ? rows[0].id_kelas_mapel : null;
}

// kelas_mapel dari sebuah tugas
async function kelasMapelDariTugas(idTugas) {
  const [rows] = await pool.query(`
    SELECT pt.id_kelas_mapel FROM tugas t
    JOIN pertemuan pt ON pt.id = t.id_pertemuan WHERE t.id = ?`, [idTugas]);
  return rows.length ? rows[0].id_kelas_mapel : null;
}

// Memastikan pengguna (guru pengampu atau siswa peserta) berhak atas pertemuan
async function berhakAtasPertemuan(user, idPertemuan) {
  const km = await kelasMapelDariPertemuan(idPertemuan);
  if (!km) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'guru') return kelasMapelMilikGuru(user.id, km);
  return kelasMapelDiikutiSiswa(user.id, km);
}

// Menghitung sisa hari menuju batas waktu pengumpulan
function sisaHari(deadline) {
  if (!deadline) return null;
  const batas = new Date(typeof deadline === 'string' ? deadline.replace(' ', 'T') : deadline);
  const selisih = batas.getTime() - Date.now();
  return Math.ceil(selisih / (1000 * 60 * 60 * 24));
}

module.exports = {
  guruIdOf, siswaIdOf,
  kelasMapelMilikGuru, kelasMapelDiikutiSiswa,
  kelasMapelDariPertemuan, kelasMapelDariTugas,
  berhakAtasPertemuan, sisaHari,
};
