import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Kelas, UserRow } from '../../api/types';

export default function DataSiswa() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'' | 'aktif' | 'nonaktif'>('');
  const [cari, setCari] = useState('');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<UserRow | null>(null);
  const [form, setForm] = useState<any>({ nama: '', email: '', password: '', nis: '', id_kelas: '' });
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const [u, k] = await Promise.all([
      api.get('/users', { params: { role: 'siswa', status: filter || undefined, q: cari || undefined } }),
      api.get('/kelas'),
    ]);
    setRows(u.data); setKelas(k.data); setLoading(false);
  }
  useEffect(() => { load(); }, [filter]);

  function openAdd() {
    setEdit(null);
    setForm({ nama: '', email: '', password: '', nis: '', id_kelas: kelas[0]?.id || '' });
    setErr(''); setShow(true);
  }
  function openEdit(r: UserRow) {
    const kelasSekarang = kelas.find((k) => k.nama_kelas === (r.kelas_aktif || '').split(', ')[0]);
    setEdit(r);
    setForm({
      nama: r.nama, email: r.email, password: '', nis: r.nis || '',
      id_kelas: kelasSekarang?.id || '',
    });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const payload = { ...form, id_kelas: form.id_kelas || null };
      if (edit) await api.put(`/users/${edit.id}`, payload);
      else await api.post('/users', { ...payload, role: 'siswa' });
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  // Siswa yang lulus atau pindah cukup dinonaktifkan, tidak dihapus,
  // agar riwayat nilainya pada periode terdahulu tetap dapat ditelusuri.
  async function ubahStatus(r: UserRow) {
    const jadiAktif = !r.aktif;
    const pesan = jadiAktif
      ? `Aktifkan kembali akun ${r.nama}?`
      : `Nonaktifkan akun ${r.nama}?\n\nGunakan ini apabila siswa sudah lulus atau pindah sekolah. `
        + 'Siswa tidak dapat lagi masuk ke sistem, namun seluruh riwayat tugas dan nilainya tetap tersimpan.';
    if (!confirm(pesan)) return;
    await api.put(`/users/${r.id}/status`, { aktif: jadiAktif });
    load();
  }

  async function hapus(r: UserRow) {
    if (!confirm(`Hapus permanen data siswa ${r.nama}?`)) return;
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
        <h2>Data Siswa</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="Cari nama / email..." value={cari} style={{ width: 200 }}
            onChange={(e) => setCari(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') load(); }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={{ width: 'auto' }}>
            <option value="">Semua Status</option>
            <option value="aktif">Hanya Aktif</option>
            <option value="nonaktif">Hanya Nonaktif</option>
          </select>
          <button className="btn" onClick={openAdd}>+ Tambah Siswa</button>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">ℹ️</span>
        <div>
          Siswa yang telah lulus atau pindah sekolah <strong>tidak dihapus</strong>, melainkan cukup
          <strong> dinonaktifkan</strong>. Dengan begitu riwayat pengumpulan tugas dan nilainya pada
          periode terdahulu tetap dapat ditelusuri. Kolom kelas menampilkan kelas siswa pada periode
          pembelajaran yang sedang aktif.
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama</th><th>NIS</th><th>Email</th><th>Kelas (Periode Aktif)</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada data siswa</td></tr>
                : rows.map((r) => (
                  <tr key={r.id} style={{ opacity: r.aktif ? 1 : .6 }}>
                    <td>{r.nama}</td>
                    <td className="muted">{r.nis || '-'}</td>
                    <td className="muted">{r.email}</td>
                    <td>{r.kelas_aktif
                      ? <span className="badge green">{r.kelas_aktif}</span>
                      : <span className="muted">Belum ditempatkan</span>}</td>
                    <td>{r.aktif ? <span className="badge green">Aktif</span>
                      : <span className="badge gray">Nonaktif</span>}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                        <button className={`btn small ${r.aktif ? 'secondary' : ''}`}
                          onClick={() => ubahStatus(r)}>
                          {r.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        {!r.kelas_aktif && (
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
        <Modal title={edit ? 'Edit Siswa' : 'Tambah Siswa'} onClose={() => setShow(false)}>
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
            <div className="field"><label>NIS</label>
              <input value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })} /></div>
            <div className="field"><label>Kelas (Periode Aktif)</label>
              <select value={form.id_kelas}
                onChange={(e) => setForm({ ...form, id_kelas: e.target.value })}>
                <option value="">- Belum ditempatkan -</option>
                {kelas.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kelas} ({k.kode_periode})</option>
                ))}
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
