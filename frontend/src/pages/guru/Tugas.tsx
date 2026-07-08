import { useEffect, useState } from 'react';
import api, { API_BASE } from '../../api/client';
import Modal from '../../components/Modal';
import type { Tugas, Mapel, PengumpulanRow } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return '-';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function GuruTugas() {
  const [rows, setRows] = useState<Tugas[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Tugas | null>(null);
  const [form, setForm] = useState<any>({ id_mapel: '', judul: '', deskripsi: '', deadline: '', tipe: 'tugas' });
  const [err, setErr] = useState('');

  // Panel pengumpulan
  const [detail, setDetail] = useState<Tugas | null>(null);
  const [subs, setSubs] = useState<PengumpulanRow[]>([]);

  async function load() {
    setLoading(true);
    const [t, mp] = await Promise.all([api.get('/tugas'), api.get('/mapel')]);
    setRows(t.data); setMapel(mp.data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setEdit(null);
    setForm({ id_mapel: mapel[0]?.id || '', judul: '', deskripsi: '', deadline: '', tipe: 'tugas' });
    setErr(''); setShow(true);
  }
  function openEdit(r: Tugas) {
    setEdit(r);
    setForm({ id_mapel: r.id_mapel, judul: r.judul, deskripsi: r.deskripsi || '',
      deadline: r.deadline ? r.deadline.replace(' ', 'T').slice(0, 16) : '', tipe: r.tipe });
    setErr(''); setShow(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const payload = { ...form, deadline: form.deadline || null };
    try {
      if (edit) await api.put(`/tugas/${edit.id}`, payload);
      else await api.post('/tugas', payload);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(r: Tugas) {
    if (!confirm(`Hapus "${r.judul}"?`)) return;
    await api.delete(`/tugas/${r.id}`); load();
  }

  async function openDetail(t: Tugas) {
    setDetail(t);
    const { data } = await api.get(`/tugas/${t.id}/pengumpulan`);
    setSubs(data);
  }

  async function beriNilai(sub: PengumpulanRow) {
    const skor = prompt(`Nilai untuk ${sub.nama_siswa} (0-100):`, sub.skor?.toString() || '');
    if (skor === null) return;
    const catatan = prompt('Catatan (opsional):', sub.catatan || '') || '';
    await api.post('/nilai', { id_kumpul: sub.id, skor, catatan });
    if (detail) openDetail(detail);
    load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Tugas & Kuis</h2>
        <button className="btn" onClick={openAdd} disabled={!mapel.length}>+ Buat Tugas/Kuis</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Judul</th><th>Mapel</th><th>Tipe</th><th>Deadline</th><th>Terkumpul</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada tugas</td></tr>
                : rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.judul}</td>
                    <td>{r.nama_mapel}</td>
                    <td><span className={`badge ${r.tipe === 'kuis' ? 'orange' : 'green'}`}>{r.tipe}</span></td>
                    <td className="muted">{fmt(r.deadline)}</td>
                    <td>{r.jumlah_kumpul ?? 0}</td>
                    <td><div className="row-actions">
                      <button className="btn small" onClick={() => openDetail(r)}>Pengumpulan</button>
                      <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn danger small" onClick={() => del(r)}>Hapus</button>
                    </div></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? 'Edit Tugas/Kuis' : 'Buat Tugas/Kuis'} onClose={() => setShow(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Mata Pelajaran</label>
              <select value={form.id_mapel} onChange={(e) => setForm({ ...form, id_mapel: e.target.value })} required disabled={!!edit}>
                {mapel.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </select></div>
            <div className="field"><label>Tipe</label>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="tugas">Tugas</option><option value="kuis">Kuis</option>
              </select></div>
            <div className="field"><label>Judul</label>
              <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required /></div>
            <div className="field"><label>Deskripsi / Instruksi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
            <div className="field"><label>Deadline</label>
              <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`Pengumpulan: ${detail.judul}`} onClose={() => setDetail(null)}>
          {subs.length === 0 ? <p className="muted">Belum ada siswa yang mengumpulkan.</p> : (
            <div className="table-wrap" style={{ border: 'none' }}>
              <table>
                <thead><tr><th>Siswa</th><th>Waktu</th><th>File</th><th>Nilai</th><th></th></tr></thead>
                <tbody>
                  {subs.map((s) => (
                    <tr key={s.id}>
                      <td>{s.nama_siswa}{s.terlambat ? <span className="badge red" style={{ marginLeft: 6 }}>Telat</span> : null}</td>
                      <td className="muted">{fmt(s.tgl_kumpul)}</td>
                      <td>{s.file ? <a href={`${API_BASE}/uploads/${s.file}`} target="_blank">Lihat</a> : <span className="muted">-</span>}</td>
                      <td>{s.skor != null ? <strong>{s.skor}</strong> : <span className="muted">Belum</span>}</td>
                      <td><button className="btn small" onClick={() => beriNilai(s)}>Nilai</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="modal-actions"><button className="btn secondary" onClick={() => setDetail(null)}>Tutup</button></div>
        </Modal>
      )}
    </div>
  );
}
