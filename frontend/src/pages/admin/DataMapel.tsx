import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Mapel } from '../../api/types';

const empty = { nama: '', kode: '', deskripsi: '', id_guru: '' };

export default function DataMapel() {
  const [rows, setRows] = useState<Mapel[]>([]);
  const [guru, setGuru] = useState<{ id: number; nama: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Mapel | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const [m, g] = await Promise.all([api.get('/mapel'), api.get('/guru/options')]);
    setRows(m.data); setGuru(g.data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEdit(null); setForm(empty); setErr(''); setShow(true); }
  function openEdit(r: Mapel) {
    setEdit(r);
    setForm({ nama: r.nama, kode: r.kode || '', deskripsi: r.deskripsi || '', id_guru: r.id_guru || '' });
    setErr(''); setShow(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const payload = { ...form, id_guru: form.id_guru || null };
    try {
      if (edit) await api.put(`/mapel/${edit.id}`, payload);
      else await api.post('/mapel', payload);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(r: Mapel) {
    if (!confirm(`Hapus mata pelajaran "${r.nama}"?`)) return;
    await api.delete(`/mapel/${r.id}`); load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Data Mata Pelajaran</h2>
        <button className="btn" onClick={openAdd}>+ Tambah Mapel</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Kode</th><th>Guru Pengampu</th><th>Deskripsi</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={5} className="center-msg">Belum ada mata pelajaran</td></tr>
                : rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nama}</td>
                    <td>{r.kode || '-'}</td>
                    <td>{r.nama_guru || <span className="muted">Belum ada</span>}</td>
                    <td className="muted">{r.deskripsi || '-'}</td>
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
        <Modal title={edit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} onClose={() => setShow(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Mata Pelajaran</label>
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
            <div className="field"><label>Kode</label>
              <input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} placeholder="Contoh: MTK-X" /></div>
            <div className="field"><label>Guru Pengampu</label>
              <select value={form.id_guru} onChange={(e) => setForm({ ...form, id_guru: e.target.value })}>
                <option value="">- Pilih Guru -</option>
                {guru.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}
              </select></div>
            <div className="field"><label>Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
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
