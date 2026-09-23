import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { AnggotaKelas, Kelas, KelasMapel, Mapel, Periode } from '../../api/types';

// ---------------------------------------------------------------------
// Data Kelas disajikan dalam bentuk kartu. Setiap kartu dibuka untuk
// melihat dua hal yang menjadi isi sebuah kelas:
//   1. Siswa yang terdaftar di kelas tersebut
//   2. Mata pelajaran yang diajarkan beserta guru pengajarnya
// Penentuan guru pengajar dilakukan langsung di sini agar jelas bahwa
// guru ditugaskan pada mata pelajaran di sebuah kelas.
// ---------------------------------------------------------------------

export default function DataKelas() {
  const [rows, setRows] = useState<Kelas[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilih, setPilih] = useState('');
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Kelas | null>(null);
  const [form, setForm] = useState<any>({ id_periode: '', nama_kelas: '', tingkat: 'X', wali_kelas: '' });
  const [err, setErr] = useState('');

  // Dialog rincian kelas
  const [detail, setDetail] = useState<Kelas | null>(null);
  const [tab, setTab] = useState<'mapel' | 'siswa'>('mapel');
  const [pengajar, setPengajar] = useState<KelasMapel[]>([]);
  const [anggota, setAnggota] = useState<AnggotaKelas[]>([]);

  // Form tambah mata pelajaran + guru pengajar
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [guru, setGuru] = useState<{ id: number; nama: string; nip?: string }[]>([]);
  const [fm, setFm] = useState({ id_mapel: '', id_guru: '' });
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
    const [k, m, g] = await Promise.all([
      api.get('/kelas', { params: id ? { id_periode: id } : { semua: 1 } }),
      api.get('/mapel'),
      api.get('/guru/options'),
    ]);
    setRows(k.data); setMapel(m.data); setGuru(g.data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilih]);

  /* ---------------- CRUD kelas ---------------- */
  function openAdd() {
    setEdit(null);
    setForm({ id_periode: pilih, nama_kelas: '', tingkat: 'X', wali_kelas: '' });
    setErr(''); setShow(true);
  }
  function openEdit(k: Kelas) {
    setEdit(k);
    setForm({
      id_periode: k.id_periode, nama_kelas: k.nama_kelas,
      tingkat: k.tingkat, wali_kelas: k.wali_kelas || '',
    });
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

  /* ---------------- Rincian kelas ---------------- */
  async function bukaDetail(k: Kelas, tabAwal: 'mapel' | 'siswa' = 'mapel') {
    setDetail(k); setTab(tabAwal);
    setFm({ id_mapel: '', id_guru: '' }); setSiswaBaru('');
    await muatIsiKelas(k);
  }
  async function muatIsiKelas(k: Kelas) {
    const [km, a, t] = await Promise.all([
      api.get('/kelas-mapel', { params: { id_kelas: k.id, id_periode: k.id_periode } }),
      api.get(`/kelas/${k.id}/siswa`),
      api.get('/users/siswa-tersedia', { params: { id_kelas: k.id } }),
    ]);
    setPengajar(km.data); setAnggota(a.data); setTersedia(t.data);
  }

  async function tambahMapel(e: React.FormEvent) {
    e.preventDefault();
    if (!detail || !fm.id_mapel) return;
    try {
      await api.post('/kelas-mapel', {
        id_kelas: detail.id, id_mapel: Number(fm.id_mapel), id_guru: fm.id_guru || null,
      });
      setFm({ id_mapel: '', id_guru: '' });
      muatIsiKelas(detail); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menambah mata pelajaran'); }
  }
  async function gantiGuru(km: KelasMapel, idGuru: string) {
    if (!detail) return;
    try {
      await api.put(`/kelas-mapel/${km.id}`, { id_guru: idGuru || null });
      muatIsiKelas(detail);
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal mengganti guru'); }
  }
  async function hapusMapel(km: KelasMapel) {
    if (!detail) return;
    if (!confirm(`Hapus mata pelajaran ${km.nama_mapel} dari kelas ${detail.nama_kelas}?`)) return;
    try { await api.delete(`/kelas-mapel/${km.id}`); muatIsiKelas(detail); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  async function tambahSiswa() {
    if (!detail || !siswaBaru) return;
    try {
      await api.post(`/kelas/${detail.id}/siswa`, { id_siswa: Number(siswaBaru) });
      setSiswaBaru(''); muatIsiKelas(detail); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menambahkan siswa'); }
  }
  async function keluarkanSiswa(a: AnggotaKelas) {
    if (!detail) return;
    if (!confirm(`Keluarkan ${a.nama} dari kelas ${detail.nama_kelas}?`)) return;
    try { await api.delete(`/kelas/${detail.id}/siswa/${a.id_siswa}`); muatIsiKelas(detail); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal mengeluarkan siswa'); }
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

      <div className="notice info">
        <span className="ikon">🏫</span>
        <div>
          Klik sebuah kelas untuk mengatur isinya: <strong>mata pelajaran beserta guru yang
          mengajarnya</strong> dan <strong>daftar siswa</strong> di kelas tersebut. Guru ditugaskan
          per mata pelajaran pada tiap kelas, sehingga satu mata pelajaran dapat diajar guru yang
          berbeda di kelas yang berbeda.
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{periodeTerpilih?.kode}</strong> telah dikunci. Data kelas pada periode
            ini hanya dapat dilihat sebagai arsip.
          </div>
        </div>
      )}

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? <div className="card center-msg">Belum ada kelas pada periode ini.</div>
          : (
            <div className="kartu-grid">
              {rows.map((k) => (
                <div className={`kartu-ringkas ${terkunci ? 'abu' : ''}`} key={k.id}
                  onClick={() => bukaDetail(k)}>
                  <div>
                    <h3>🏫 {k.nama_kelas}</h3>
                    <div className="sub">Tingkat {k.tingkat} · Periode {k.kode_periode}</div>
                  </div>
                  <div className="sub">
                    Wali kelas: <strong>{k.wali_kelas || 'Belum ditentukan'}</strong>
                  </div>
                  <div className="angka-baris">
                    <div><strong>{k.jumlah_siswa}</strong>Siswa</div>
                    <div><strong>{k.jumlah_mapel}</strong>Mata Pelajaran</div>
                  </div>
                  <div className="kaki" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Klik untuk atur mata pelajaran &amp; siswa →</span>
                    {!terkunci && (
                      <span className="row-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn secondary small" onClick={() => openEdit(k)}>Edit</button>
                        <button className="btn danger small" onClick={() => hapus(k)}>Hapus</button>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

      {/* ---------------- Form kelas ---------------- */}
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
              <input value={form.wali_kelas} placeholder="Nama wali kelas"
                onChange={(e) => setForm({ ...form, wali_kelas: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- Rincian kelas ---------------- */}
      {detail && (
        <Modal title={`Kelas ${detail.nama_kelas} — Periode ${detail.kode_periode}`}
          onClose={() => setDetail(null)}>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
            Tingkat {detail.tingkat} · Wali kelas {detail.wali_kelas || 'belum ditentukan'}
          </p>

          <div className="tab-bar">
            <button className={tab === 'mapel' ? 'aktif' : ''} onClick={() => setTab('mapel')}>
              Mata Pelajaran &amp; Guru ({pengajar.length})
            </button>
            <button className={tab === 'siswa' ? 'aktif' : ''} onClick={() => setTab('siswa')}>
              Siswa ({anggota.length})
            </button>
          </div>

          {tab === 'mapel' ? (
            <>
              {!terkunci && (
                <form onSubmit={tambahMapel} style={{
                  border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 14,
                }}>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Tambah Mata Pelajaran ke Kelas Ini</label>
                    <select value={fm.id_mapel} required
                      onChange={(e) => setFm({ ...fm, id_mapel: e.target.value })}>
                      <option value="">- Pilih mata pelajaran -</option>
                      {mapel.filter((m) => m.aktif
                        && !pengajar.some((k) => k.id_mapel === m.id)).map((m) => (
                        <option key={m.id} value={m.id}>{m.nama} ({m.kelompok})</option>
                      ))}
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Guru yang Mengajar</label>
                    <select value={fm.id_guru}
                      onChange={(e) => setFm({ ...fm, id_guru: e.target.value })}>
                      <option value="">- Belum ditentukan -</option>
                      {guru.map((g) => (
                        <option key={g.id} value={g.id}>{g.nama}{g.nip ? ` (${g.nip})` : ''}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn small">+ Tambahkan</button>
                </form>
              )}

              {pengajar.length === 0
                ? <p className="center-msg">Belum ada mata pelajaran pada kelas ini.</p>
                : (
                  <div className="rincian-list">
                    {pengajar.map((km) => (
                      <div className="rincian-item" key={km.id}>
                        <div className="kiri">
                          <div className="nama">{km.nama_mapel}</div>
                          <div className="ket">
                            <span className="badge gray">{km.kode_mapel}</span>{' '}
                            {km.jumlah_pertemuan} pertemuan · {km.jumlah_materi} materi ·{' '}
                            {km.jumlah_tugas} tugas
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {terkunci ? (
                            <span className="badge green">
                              👨‍🏫 {km.nama_guru || 'Belum ditentukan'}
                            </span>
                          ) : (
                            <>
                              <select value={km.id_guru || ''} style={{ width: 210 }}
                                onChange={(e) => gantiGuru(km, e.target.value)}>
                                <option value="">- Guru belum ditentukan -</option>
                                {guru.map((g) => (
                                  <option key={g.id} value={g.id}>{g.nama}</option>
                                ))}
                              </select>
                              <button className="btn danger small"
                                onClick={() => hapusMapel(km)}>Hapus</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </>
          ) : (
            <>
              {!terkunci && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <select value={siswaBaru} onChange={(e) => setSiswaBaru(e.target.value)}>
                    <option value="">- Pilih siswa untuk ditambahkan -</option>
                    {tersedia.map((s) => (
                      <option key={s.id} value={s.id}>{s.nama} {s.nis ? `(${s.nis})` : ''}</option>
                    ))}
                  </select>
                  <button className="btn" onClick={tambahSiswa} disabled={!siswaBaru}>Tambah</button>
                </div>
              )}

              {anggota.length === 0 ? <p className="center-msg">Belum ada siswa pada kelas ini.</p> : (
                <div className="rincian-list">
                  {anggota.map((a) => (
                    <div className="rincian-item" key={a.id_anggota}>
                      <div className="kiri">
                        <div className="nama">{a.nama}</div>
                        <div className="ket">NIS {a.nis || '-'} · {a.email}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {a.aktif ? <span className="badge green">Aktif</span>
                          : <span className="badge gray">Nonaktif</span>}
                        {!terkunci && (
                          <button className="btn danger small"
                            onClick={() => keluarkanSiswa(a)}>Keluarkan</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button className="btn secondary" onClick={() => setDetail(null)}>Tutup</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
