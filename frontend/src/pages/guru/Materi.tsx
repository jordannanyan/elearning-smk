import { useEffect, useState } from 'react';
import api, { API_BASE } from '../../api/client';
import Modal from '../../components/Modal';
import type { Materi, Mapel } from '../../api/types';

export default function GuruMateri() {
  const [rows, setRows] = useState<Materi[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Materi | null>(null);
  const [form, setForm] = useState<any>({ id_mapel: '', judul: '', konten: '' });
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const [m, mp] = await Promise.all([api.get('/materi'), api.get('/mapel')]);
    setRows(m.data); setMapel(mp.data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setEdit(null); setForm({ id_mapel: mapel[0]?.id || '', judul: '', konten: '' });
    setFile(null); setErr(''); setShow(true);
  }
  function openEdit(r: Materi) {
    setEdit(r); setForm({ id_mapel: r.id_mapel, judul: r.judul, konten: r.konten || '' });
    setFile(null); setErr(''); setShow(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const fd = new FormData();
    fd.append('id_mapel', form.id_mapel);
    fd.append('judul', form.judul);
    fd.append('konten', form.konten);
    if (file) fd.append('file', file);
    try {
      if (edit) await api.put(`/materi/${edit.id}`, fd);
      else await api.post('/materi', fd);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(r: Materi) {
    if (!confirm(`Hapus materi "${r.judul}"?`)) return;
    await api.delete(`/materi/${r.id}`); load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Materi Pembelajaran</h2>
        <button className="btn" onClick={openAdd} disabled={!mapel.length}>+ Tambah Materi</button>
      </div>
      {!mapel.length && !loading && <div className="card muted">Belum ada mata pelajaran yang Anda ampu. Hubungi administrator.</div>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Judul</th><th>Mata Pelajaran</th><th>File</th><th>Tanggal</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={5} className="center-msg">Belum ada materi</td></tr>
                : rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.judul}</td>
                    <td>{r.nama_mapel}</td>
                    <td>{r.file ? <a href={`${API_BASE}/uploads/${r.file}`} target="_blank">Unduh</a> : <span className="muted">-</span>}</td>
                    <td className="muted">{r.tgl_upload?.slice(0, 10)}</td>
                    <td><div className="row-actions">
                      <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn danger small" onClick={() => del(r)}>Hapus</button>
                    </div></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? 'Edit Materi' : 'Tambah Materi'} onClose={() => setShow(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Mata Pelajaran</label>
              <select value={form.id_mapel} onChange={(e) => setForm({ ...form, id_mapel: e.target.value })} required disabled={!!edit}>
                {mapel.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </select></div>
            <div className="field"><label>Judul</label>
              <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required /></div>
            <div className="field"><label>Konten / Deskripsi</label>
              <textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} /></div>
            <div className="field"><label>File {edit && <span className="muted">(kosongkan jika tidak diubah)</span>}</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
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
