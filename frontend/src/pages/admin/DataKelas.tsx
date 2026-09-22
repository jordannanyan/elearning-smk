import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { AnggotaKelas, Kelas, Periode } from '../../api/types';

export default function DataKelas() {
  const [rows, setRows] = useState<Kelas[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilih, setPilih] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Kelas | null>(null);
  const [form, setForm] = useState<any>({ id_periode: '', nama_kelas: '', tingkat: 'X', wali_kelas: '' });
  const [err, setErr] = useState('');

  // Panel anggota kelas
  const [anggotaDari, setAnggotaDari] = useState<Kelas | null>(null);
  const [anggota, setAnggota] = useState<AnggotaKelas[]>([]);
  const [tersedia, setTersedia] = useState<{ id: number; nama: string; nis?: string }[]>([]);
  const [siswaBaru, setSiswaBaru] = useState('');

  const periodeTerpilih = periode.find((p) => String(p.id) === String(pilih));
  const terkunci = periodeTerpilih?.status === 'terkunci';

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const id = pilih || (aktif ? String(aktif.id) : '');
    if (!pilih && id) setPilih(id);
    const { data } = await api.get('/kelas', { params: id ? { id_periode: id } : { semua: 1 } });
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilih]);

  function openAdd() {
    setEdit(null);
    setForm({ id_periode: pilih, nama_kelas: '', tingkat: 'X', wali_kelas: '' });
    setErr(''); setShow(true);
  }
  function openEdit(k: Kelas) {
    setEdit(k);
    setForm({ id_periode: k.id_periode, nama_kelas: k.nama_kelas, tingkat: k.tingkat, wali_kelas: k.wali_kelas || '' });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/kelas/${edit.id}`, form);
      else await api.post('/kelas', form);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function hapus(k: Kelas) {
    if (!confirm(`Hapus kelas ${k.nama_kelas}?`)) return;
    try { await api.delete(`/kelas/${k.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  async function bukaAnggota(k: Kelas) {
    setAnggotaDari(k); setSiswaBaru('');
    const [a, t] = await Promise.all([
      api.get(`/kelas/${k.id}/siswa`),
      api.get('/users/siswa-tersedia', { params: { id_kelas: k.id } }),
    ]);
    setAnggota(a.data); setTersedia(t.data);
  }

  async function tambahAnggota() {
    if (!siswaBaru || !anggotaDari) return;
    try {
      await api.post(`/kelas/${anggotaDari.id}/siswa`, { id_siswa: Number(siswaBaru) });
      bukaAnggota(anggotaDari); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menambahkan siswa'); }
  }

  async function keluarkanAnggota(a: AnggotaKelas) {
    if (!anggotaDari) return;
    if (!confirm(`Keluarkan ${a.nama} dari kelas ${anggotaDari.nama_kelas}?`)) return;
    try {
      await api.delete(`/kelas/${anggotaDari.id}/siswa/${a.id_siswa}`);
      bukaAnggota(anggotaDari); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal mengeluarkan siswa'); }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Data Kelas</h2>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilih} onChange={(e) => setPilih(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'aktif' ? ' (aktif)' : p.status === 'terkunci' ? ' (terkunci)' : ' (draft)'}
              </option>
            ))}
          </select>
          <button className="btn" onClick={openAdd} disabled={terkunci}>+ Tambah Kelas</button>
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{periodeTerpilih?.kode}</strong> telah dikunci oleh administrator. Data kelas
            pada periode ini hanya dapat dilihat sebagai arsip dan tidak dapat diubah.
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama Kelas</th><th>Tingkat</th><th>Wali Kelas</th><th>Jumlah Siswa</th>
              <th>Mata Pelajaran</th><th>Periode</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="center-msg">Belum ada kelas pada periode ini</td></tr>
                : rows.map((k) => (
                  <tr key={k.id}>
                    <td><strong>{k.nama_kelas}</strong></td>
                    <td>{k.tingkat}</td>
                    <td className="muted">{k.wali_kelas || '-'}</td>
                    <td>{k.jumlah_siswa}</td>
                    <td>{k.jumlah_mapel}</td>
                    <td><span className="badge gray">{k.kode_periode}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="btn small" onClick={() => bukaAnggota(k)}>Siswa</button>
                        {!terkunci && <>
                          <button className="btn secondary small" onClick={() => openEdit(k)}>Edit</button>
                          <button className="btn danger small" onClick={() => hapus(k)}>Hapus</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? 'Edit Kelas' : 'Tambah Kelas'} onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Periode Pembelajaran</label>
              <select value={form.id_periode} disabled={!!edit}
                onChange={(e) => setForm({ ...form, id_periode: e.target.value })}>
                {periode.filter((p) => p.status !== 'terkunci').map((p) => (
                  <option key={p.id} value={p.id}>{p.kode} — {p.tahun_ajaran} {p.nama_semester}</option>
                ))}
              </select></div>
            <div className="field"><label>Nama Kelas</label>
              <input value={form.nama_kelas} placeholder="Contoh: X MIPA 1" required
                onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })} /></div>
            <div className="field"><label>Tingkat</label>
              <select value={form.tingkat} onChange={(e) => setForm({ ...form, tingkat: e.target.value })}>
                <option>X</option><option>XI</option><option>XII</option>
              </select></div>
            <div className="field"><label>Wali Kelas</label>
              <input value={form.wali_kelas}
                onChange={(e) => setForm({ ...form, wali_kelas: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {anggotaDari && (
        <Modal title={`Siswa Kelas ${anggotaDari.nama_kelas} (${anggotaDari.kode_periode})`}
          onClose={() => setAnggotaDari(null)}>
          {!terkunci && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <select value={siswaBaru} onChange={(e) => setSiswaBaru(e.target.value)}>
                <option value="">- Pilih siswa untuk ditambahkan -</option>
                {tersedia.map((s) => (
                  <option key={s.id} value={s.id}>{s.nama} {s.nis ? `(${s.nis})` : ''}</option>
                ))}
              </select>
              <button className="btn" onClick={tambahAnggota} disabled={!siswaBaru}>Tambah</button>
            </div>
          )}

          {anggota.length === 0 ? <p className="center-msg">Belum ada siswa pada kelas ini.</p> : (
            <div className="table-wrap" style={{ border: 'none' }}>
              <table>
                <thead><tr><th>Nama</th><th>NIS</th><th>Status</th>{!terkunci && <th></th>}</tr></thead>
                <tbody>
                  {anggota.map((a) => (
                    <tr key={a.id_anggota}>
                      <td>{a.nama}</td>
                      <td className="muted">{a.nis || '-'}</td>
                      <td>{a.aktif ? <span className="badge green">Aktif</span>
                        : <span className="badge gray">Nonaktif</span>}</td>
                      {!terkunci && (
                        <td><button className="btn danger small"
                          onClick={() => keluarkanAnggota(a)}>Keluarkan</button></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn secondary" onClick={() => setAnggotaDari(null)}>Tutup</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
