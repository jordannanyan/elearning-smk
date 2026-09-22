import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { UserRow } from '../../api/types';

export default function DataGuru() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'' | 'aktif' | 'nonaktif'>('');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<UserRow | null>(null);
  const [form, setForm] = useState<any>({ nama: '', email: '', password: '', nip: '' });
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get('/users', { params: { role: 'guru', status: filter || undefined } });
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, [filter]);

  function openAdd() {
    setEdit(null); setForm({ nama: '', email: '', password: '', nip: '' });
    setErr(''); setShow(true);
  }
  function openEdit(r: UserRow) {
    setEdit(r); setForm({ nama: r.nama, email: r.email, password: '', nip: r.nip || '' });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/users/${edit.id}`, form);
      else await api.post('/users', { ...form, role: 'guru' });
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  // Penonaktifan akun menggantikan penghapusan data agar relasi
  // pengampuan, materi, tugas, dan nilai tidak ikut terhapus.
  async function ubahStatus(r: UserRow) {
    const jadiAktif = !r.aktif;
    const pesan = jadiAktif
      ? `Aktifkan kembali akun ${r.nama}?`
      : `Nonaktifkan akun ${r.nama}?\n\nGuru tidak dapat lagi masuk ke sistem, namun seluruh `
        + 'materi, tugas, dan nilai yang pernah dibuatnya tetap tersimpan.';
    if (!confirm(pesan)) return;
    await api.put(`/users/${r.id}/status`, { aktif: jadiAktif });
    load();
  }

  async function hapus(r: UserRow) {
    if (!confirm(`Hapus permanen data guru ${r.nama}?`)) return;
    try {
      await api.delete(`/users/${r.id}`);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal menghapus');
      load();
    }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Data Guru</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
            style={{ width: 'auto' }}>
            <option value="">Semua Status</option>
            <option value="aktif">Hanya Aktif</option>
            <option value="nonaktif">Hanya Nonaktif</option>
          </select>
          <button className="btn" onClick={openAdd}>+ Tambah Guru</button>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">ℹ️</span>
        <div>
          Guru yang sudah mengampu kelas tidak dapat dihapus permanen karena akan memutus data materi,
          tugas, dan nilai yang terkait. Gunakan tombol <strong>Nonaktifkan</strong> — akun tidak dapat
          lagi digunakan untuk masuk, tetapi seluruh riwayat pembelajarannya tetap tersimpan.
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama</th><th>NIP</th><th>Email</th><th>Pengampuan</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada data guru</td></tr>
                : rows.map((r) => (
                  <tr key={r.id} style={{ opacity: r.aktif ? 1 : .6 }}>
                    <td>{r.nama}</td>
                    <td className="muted">{r.nip || '-'}</td>
                    <td className="muted">{r.email}</td>
                    <td>{r.jumlah_pengampuan ? `${r.jumlah_pengampuan} kelas` : <span className="muted">-</span>}</td>
                    <td>
                      {r.aktif ? <span className="badge green">Aktif</span>
                        : <span className="badge gray">Nonaktif</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                        <button className={`btn small ${r.aktif ? 'secondary' : ''}`}
                          onClick={() => ubahStatus(r)}>
                          {r.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        {!r.jumlah_pengampuan && (
                          <button className="btn danger small" onClick={() => hapus(r)}>Hapus</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? 'Edit Guru' : 'Tambah Guru'} onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Lengkap</label>
              <input value={form.nama} required
                onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="field"><label>Email</label>
              <input type="email" value={form.email} required
                onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field">
              <label>Password {edit && <span className="muted">(kosongkan jika tidak diubah)</span>}</label>
              <input type="password" value={form.password} {...(edit ? {} : { required: true })}
                onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="field"><label>NIP</label>
              <input value={form.nip}
                onChange={(e) => setForm({ ...form, nip: e.target.value })} /></div>
            <p className="muted" style={{ fontSize: 12 }}>
              Mata pelajaran yang diampu guru ditentukan pada menu <strong>Pengampuan Kelas</strong>,
              sehingga seorang guru dapat mengampu beberapa mata pelajaran pada kelas yang berbeda.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
