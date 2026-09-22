import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Kelas, KelasMapel, Mapel, Periode } from '../../api/types';

export default function Pengampuan() {
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilihPeriode, setPilihPeriode] = useState('');
  const [rows, setRows] = useState<KelasMapel[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [guru, setGuru] = useState<{ id: number; nama: string; nip?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<KelasMapel | null>(null);
  const [form, setForm] = useState<any>({ id_kelas: '', id_mapel: '', id_guru: '' });
  const [err, setErr] = useState('');

  const periodeTerpilih = periode.find((p) => String(p.id) === String(pilihPeriode));
  const terkunci = periodeTerpilih?.status === 'terkunci';

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const id = pilihPeriode || (aktif ? String(aktif.id) : '');
    if (!pilihPeriode && id) setPilihPeriode(id);

    const [km, k, m, g] = await Promise.all([
      api.get('/kelas-mapel', { params: { id_periode: id } }),
      api.get('/kelas', { params: { id_periode: id } }),
      api.get('/mapel'),
      api.get('/guru/options'),
    ]);
    setRows(km.data); setKelas(k.data); setMapel(m.data); setGuru(g.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, [pilihPeriode]);

  function openAdd() {
    setEdit(null);
    setForm({ id_kelas: kelas[0]?.id || '', id_mapel: '', id_guru: '' });
    setErr(''); setShow(true);
  }
  function openEdit(r: KelasMapel) {
    setEdit(r);
    setForm({ id_kelas: r.id_kelas, id_mapel: r.id_mapel, id_guru: r.id_guru || '' });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/kelas-mapel/${edit.id}`, { id_guru: form.id_guru || null });
      else await api.post('/kelas-mapel', { ...form, id_guru: form.id_guru || null });
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function hapus(r: KelasMapel) {
    if (!confirm(`Hapus pengampuan ${r.nama_mapel} pada kelas ${r.nama_kelas}?`)) return;
    try { await api.delete(`/kelas-mapel/${r.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  // Dikelompokkan per kelas agar mudah dibaca
  const perKelas = kelas.map((k) => ({ kelas: k, daftar: rows.filter((r) => r.id_kelas === k.id) }));

  return (
    <div>
      <div className="page-head">
        <h2>Pengampuan Kelas</h2>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilihPeriode} onChange={(e) => setPilihPeriode(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'aktif' ? ' (aktif)' : p.status === 'terkunci' ? ' (terkunci)' : ' (draft)'}
              </option>
            ))}
          </select>
          <button className="btn" onClick={openAdd} disabled={terkunci || !kelas.length}>
            + Tambah Pengampuan
          </button>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">🧩</span>
        <div>
          Pengampuan menghubungkan <strong>kelas + mata pelajaran + guru</strong> dalam satu periode.
          Satu mata pelajaran dapat diampu guru yang berbeda pada kelas yang berbeda. Setiap baris di
          bawah menjadi wadah pertemuan, materi, tugas, dan forum diskusi bagi guru dan siswa kelas tersebut.
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>Periode <strong>{periodeTerpilih?.kode}</strong> terkunci. Pengampuan hanya dapat dilihat.</div>
        </div>
      )}

      {loading ? <div className="card center-msg">Memuat...</div>
        : perKelas.length === 0 ? <div className="card center-msg">Belum ada kelas pada periode ini.</div>
          : perKelas.map(({ kelas: k, daftar }) => (
            <div className="blok" key={k.id}>
              <div className="kepala">
                <span>🏫 {k.nama_kelas} <span className="muted" style={{ fontWeight: 400 }}>
                  · Tingkat {k.tingkat} · {k.jumlah_siswa} siswa</span></span>
                <span className="badge gray">{daftar.length} mata pelajaran</span>
              </div>
              <div className="badan">
                {daftar.length === 0
                  ? <p className="muted">Belum ada mata pelajaran pada kelas ini.</p>
                  : (
                    <div className="table-wrap" style={{ border: 'none' }}>
                      <table>
                        <thead><tr><th>Mata Pelajaran</th><th>Kode</th><th>Guru Pengampu</th>
                          <th>Pertemuan</th><th>Materi</th><th>Tugas</th><th>Aksi</th></tr></thead>
                        <tbody>
                          {daftar.map((r) => (
                            <tr key={r.id}>
                              <td>{r.nama_mapel}</td>
                              <td><span className="badge gray">{r.kode_mapel}</span></td>
                              <td>{r.nama_guru || <span className="badge orange">Belum ditentukan</span>}</td>
                              <td>{r.jumlah_pertemuan}</td>
                              <td>{r.jumlah_materi}</td>
                              <td>{r.jumlah_tugas}</td>
                              <td>
                                {!terkunci && (
                                  <div className="row-actions">
                                    <button className="btn secondary small" onClick={() => openEdit(r)}>
                                      Ganti Guru
                                    </button>
                                    <button className="btn danger small" onClick={() => hapus(r)}>Hapus</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            </div>
          ))}

      {show && (
        <Modal title={edit ? `Ganti Guru — ${edit.nama_mapel} (${edit.nama_kelas})` : 'Tambah Pengampuan'}
          onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            {!edit && <>
              <div className="field"><label>Kelas</label>
                <select value={form.id_kelas} required
                  onChange={(e) => setForm({ ...form, id_kelas: e.target.value })}>
                  {kelas.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama_kelas} (Tingkat {k.tingkat})</option>
                  ))}
                </select></div>
              <div className="field"><label>Mata Pelajaran</label>
                <select value={form.id_mapel} required
                  onChange={(e) => setForm({ ...form, id_mapel: e.target.value })}>
                  <option value="">- Pilih mata pelajaran -</option>
                  {mapel.filter((m) => m.aktif).map((m) => (
                    <option key={m.id} value={m.id}>{m.nama} ({m.kelompok})</option>
                  ))}
                </select></div>
            </>}
            <div className="field"><label>Guru Pengampu</label>
              <select value={form.id_guru}
                onChange={(e) => setForm({ ...form, id_guru: e.target.value })}>
                <option value="">- Belum ditentukan -</option>
                {guru.map((g) => (
                  <option key={g.id} value={g.id}>{g.nama}{g.nip ? ` (${g.nip})` : ''}</option>
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
