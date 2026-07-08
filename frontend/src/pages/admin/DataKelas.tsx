import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Kelas } from '../../api/types';

const empty = { nama_kelas: '', tingkat: 'X', tahun_ajaran: '2025/2026' };

export default function DataKelas() {
  const [rows, setRows] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Kelas | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get('/kelas');
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEdit(null); setForm(empty); setErr(''); setShow(true); }
  function openEdit(r: Kelas) {
    setEdit(r);
    setForm({ nama_kelas: r.nama_kelas, tingkat: r.tingkat, tahun_ajaran: r.tahun_ajaran });
    setErr(''); setShow(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/kelas/${edit.id}`, form);
      else await api.post('/kelas', form);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(r: Kelas) {
    if (!confirm(`Hapus kelas "${r.nama_kelas}"?`)) return;
    await api.delete(`/kelas/${r.id}`); load();
  }

  return (
    <div>
      <div className="page-head">
        <h2>Data Kelas</h2>
        <button className="btn" onClick={openAdd}>+ Tambah Kelas</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Nama Kelas</th><th>Tingkat</th><th>Tahun Ajaran</th><th>Jumlah Siswa</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={5} className="center-msg">Belum ada data kelas</td></tr>
                : rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nama_kelas}</td>
                    <td>{r.tingkat}</td>
                    <td>{r.tahun_ajaran}</td>
                    <td>{r.jumlah_siswa ?? 0} siswa</td>
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
        <Modal title={edit ? 'Edit Kelas' : 'Tambah Kelas'} onClose={() => setShow(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Kelas</label>
              <input value={form.nama_kelas} onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })} placeholder="Contoh: X IPA 1" required /></div>
            <div className="field"><label>Tingkat</label>
              <select value={form.tingkat} onChange={(e) => setForm({ ...form, tingkat: e.target.value })}>
                <option>X</option><option>XI</option><option>XII</option>
              </select></div>
            <div className="field"><label>Tahun Ajaran</label>
              <input value={form.tahun_ajaran} onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })} placeholder="2025/2026" required /></div>
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
