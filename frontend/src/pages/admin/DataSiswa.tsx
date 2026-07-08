import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { UserRow, Kelas } from '../../api/types';

const empty = { nama: '', email: '', password: '', nis: '', id_kelas: '' };

export default function DataSiswa() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<UserRow | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const [u, k] = await Promise.all([
      api.get('/users', { params: { role: 'siswa' } }),
      api.get('/kelas'),
    ]);
    setRows(u.data); setKelas(k.data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEdit(null); setForm(empty); setErr(''); setShow(true); }
  function openEdit(r: UserRow) {
    setEdit(r);
    setForm({ nama: r.nama, email: r.email, password: '', nis: r.nis || '', id_kelas: r.id_kelas || '' });
    setErr(''); setShow(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const payload = { ...form, id_kelas: form.id_kelas || null };
    try {
      if (edit) await api.put(`/users/${edit.id}`, payload);
      else await api.post('/users', { ...payload, role: 'siswa' });
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(r: UserRow) {
    if (!confirm(`Hapus siswa "${r.nama}"?`)) return;
    await api.delete(`/users/${r.id}`); load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Data Siswa</h2>
        <button className="btn" onClick={openAdd}>+ Tambah Siswa</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama</th><th>Email</th><th>NIS</th><th>Kelas</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada data siswa</td></tr>
                : rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nama}</td>
                    <td>{r.email}</td>
                    <td>{r.nis || '-'}</td>
                    <td>{r.nama_kelas || '-'}</td>
                    <td>{r.aktif ? <span className="badge green">Aktif</span> : <span className="badge gray">Nonaktif</span>}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn danger small" onClick={() => del(r)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? 'Edit Siswa' : 'Tambah Siswa'} onClose={() => setShow(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Lengkap</label>
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
            <div className="field"><label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="field"><label>Password {edit && <span className="muted">(kosongkan jika tidak diubah)</span>}</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(edit ? {} : { required: true })} /></div>
            <div className="field"><label>NIS</label>
              <input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} /></div>
            <div className="field"><label>Kelas</label>
              <select value={form.id_kelas} onChange={(e) => setForm({ ...form, id_kelas: e.target.value })}>
                <option value="">- Pilih Kelas -</option>
                {kelas.map((k) => <option key={k.id} value={k.id}>{k.nama_kelas} ({k.tahun_ajaran})</option>)}
              </select></div>
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
