import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Mapel } from '../../api/types';

const KELOMPOK = ['Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa', 'Muatan Lokal'];

export default function DataMapel() {
  const [rows, setRows] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Mapel | null>(null);
  const [form, setForm] = useState<any>({ nama: '', kode: '', kelompok: 'Wajib', deskripsi: '' });
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get('/mapel');
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const tampil = useMemo(
    () => (filter ? rows.filter((r) => r.kelompok === filter) : rows), [rows, filter]);

  function openAdd() {
    setEdit(null); setForm({ nama: '', kode: '', kelompok: 'Wajib', deskripsi: '' });
    setErr(''); setShow(true);
  }
  function openEdit(r: Mapel) {
    setEdit(r);
    setForm({ nama: r.nama, kode: r.kode || '', kelompok: r.kelompok || 'Wajib', deskripsi: r.deskripsi || '' });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/mapel/${edit.id}`, form);
      else await api.post('/mapel', form);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function ubahStatus(r: Mapel) {
    const jadiAktif = !r.aktif;
    if (!confirm(jadiAktif
      ? `Aktifkan kembali mata pelajaran ${r.nama}?`
      : `Nonaktifkan mata pelajaran ${r.nama}?\n\nMata pelajaran tidak dapat lagi dipilih pada `
        + 'pengampuan kelas baru, namun data pembelajaran yang sudah berjalan tetap tersimpan.')) return;
    await api.put(`/mapel/${r.id}/status`, { aktif: jadiAktif });
    load();
  }

  async function hapus(r: Mapel) {
    if (!confirm(`Hapus mata pelajaran ${r.nama}?`)) return;
    try { await api.delete(`/mapel/${r.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Katalog Mata Pelajaran</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">Semua Kelompok ({rows.length})</option>
            {KELOMPOK.map((k) => (
              <option key={k} value={k}>{k} ({rows.filter((r) => r.kelompok === k).length})</option>
            ))}
          </select>
          <button className="btn" onClick={openAdd}>+ Tambah Mapel</button>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">ℹ️</span>
        <div>
          Daftar ini merupakan <strong>katalog mata pelajaran sekolah</strong>. Penentuan guru pengampu
          dilakukan pada menu <strong>Pengampuan Kelas</strong>, sehingga satu mata pelajaran dapat diampu
          oleh guru yang berbeda pada tingkat kelas yang berbeda — misalnya Bahasa Indonesia kelas X dan
          kelas XI diampu guru yang tidak sama.
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama Mata Pelajaran</th><th>Kode</th><th>Kelompok</th>
              <th>Diampu di</th><th>Jumlah Guru</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="center-msg">Memuat...</td></tr>
              : tampil.length === 0 ? <tr><td colSpan={7} className="center-msg">Tidak ada data</td></tr>
                : tampil.map((r) => (
                  <tr key={r.id} style={{ opacity: r.aktif ? 1 : .6 }}>
                    <td>{r.nama}</td>
                    <td><span className="badge gray">{r.kode || '-'}</span></td>
                    <td className="muted">{r.kelompok || '-'}</td>
                    <td>{r.jumlah_pengampuan ? `${r.jumlah_pengampuan} kelas` : <span className="muted">-</span>}</td>
                    <td>{r.jumlah_guru || 0}</td>
                    <td>{r.aktif ? <span className="badge green">Aktif</span>
                      : <span className="badge gray">Nonaktif</span>}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                        <button className={`btn small ${r.aktif ? 'secondary' : ''}`}
                          onClick={() => ubahStatus(r)}>{r.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
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
        <Modal title={edit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Mata Pelajaran</label>
              <input value={form.nama} required
                onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="field"><label>Kode</label>
              <input value={form.kode} placeholder="Contoh: MTK-W"
                onChange={(e) => setForm({ ...form, kode: e.target.value })} /></div>
            <div className="field"><label>Kelompok</label>
              <select value={form.kelompok}
                onChange={(e) => setForm({ ...form, kelompok: e.target.value })}>
                {KELOMPOK.map((k) => <option key={k}>{k}</option>)}
              </select></div>
            <div className="field"><label>Deskripsi</label>
              <textarea value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
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
