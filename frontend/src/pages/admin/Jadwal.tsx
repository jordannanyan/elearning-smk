import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { JadwalSekolah, Periode, ReferensiJadwal, SlotJadwal } from '../../api/types';

// ---------------------------------------------------------------------
// Penyusunan jadwal mata pelajaran oleh administrator.
//
// Tabelnya disusun sama dengan jadwal resmi sekolah: baris JAM KE-
// terhadap kolom kelas, dikelompokkan menurut fase. Setiap sel dapat
// diklik untuk menentukan mata pelajaran beserta gurunya, atau menandai
// jam tersebut sebagai kegiatan sekolah seperti UPACARA BENDERA.
// ---------------------------------------------------------------------
interface SelTerpilih {
  id_kelas: number; nama_kelas: string; hari: number; jam_ke: number;
  slot: SlotJadwal | null;
}

export default function AdminJadwal() {
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [idPeriode, setIdPeriode] = useState('');
  const [hari, setHari] = useState(1);
  const [ref, setRef] = useState<ReferensiJadwal | null>(null);
  const [jadwal, setJadwal] = useState<JadwalSekolah | null>(null);
  const [muat, setMuat] = useState(true);
  const [sel, setSel] = useState<SelTerpilih | null>(null);

  const [jenis, setJenis] = useState<'mapel' | 'kegiatan'>('mapel');
  const [form, setForm] = useState({ huruf: '', id_guru: '', kegiatan: '' });
  const [err, setErr] = useState('');
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    api.get('/periode').then((r) => {
      setPeriode(r.data);
      const aktif = r.data.find((p: Periode) => p.status === 'aktif') || r.data[0];
      if (aktif) setIdPeriode(String(aktif.id));
    });
  }, []);

  async function load() {
    if (!idPeriode) return;
    setMuat(true);
    const [a, b] = await Promise.all([
      api.get('/jadwal/referensi', { params: { id_periode: idPeriode } }),
      api.get('/jadwal/sekolah', { params: { id_periode: idPeriode } }),
    ]);
    setRef(a.data); setJadwal(b.data); setMuat(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [idPeriode]);

  const terkunci = ref?.periode.status === 'terkunci';

  // Peta isi sel agar pencarian per kelas dan jam cepat
  const isi = useMemo(() => {
    const m = new Map<string, SlotJadwal>();
    for (const s of (jadwal?.slot || [])) {
      if (s.hari === hari) m.set(`${s.id_kelas}|${s.jam_ke}`, s);
    }
    return m;
  }, [jadwal, hari]);

  function bukaSel(k: { id: number; nama_kelas: string }, jamKe: number) {
    if (terkunci) return;
    const slot = isi.get(`${k.id}|${jamKe}`) || null;
    setSel({ id_kelas: k.id, nama_kelas: k.nama_kelas, hari, jam_ke: jamKe, slot });
    if (slot?.kegiatan && slot.kegiatan !== 'P5') {
      setJenis('kegiatan');
      setForm({ huruf: '', id_guru: '', kegiatan: slot.kegiatan });
    } else {
      setJenis(slot?.kegiatan === 'P5' ? 'kegiatan' : 'mapel');
      setForm({
        huruf: slot?.kode ? slot.kode.replace(/\d+$/, '') : '',
        id_guru: slot?.id_guru ? String(slot.id_guru) : '',
        kegiatan: slot?.kegiatan || '',
      });
    }
    setErr('');
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!sel || !ref) return;
    setErr(''); setSibuk(true);
    try {
      const mapel = ref.mapel.find((m) => m.kode === form.huruf);
      await api.post('/jadwal', {
        id_kelas: sel.id_kelas, hari: sel.hari, jam_ke: sel.jam_ke,
        huruf_mapel: jenis === 'mapel' ? form.huruf : null,
        nama_mapel: jenis === 'mapel' ? mapel?.nama : null,
        id_guru: form.id_guru || null,
        kegiatan: jenis === 'kegiatan' ? form.kegiatan : null,
      });
      setSel(null);
      await load();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Jadwal gagal disimpan');
    } finally { setSibuk(false); }
  }

  async function kosongkan() {
    if (!sel?.slot) return;
    if (!confirm(`Kosongkan jam ke-${sel.jam_ke} kelas ${sel.nama_kelas}?`)) return;
    setSibuk(true);
    try {
      await api.delete(`/jadwal/${sel.slot.id}`);
      setSel(null);
      await load();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Gagal mengosongkan jam pelajaran');
    } finally { setSibuk(false); }
  }

  if (muat || !ref || !jadwal) return <p className="center-msg">Memuat jadwal...</p>;

  const kelas = ref.kelas;
  const faseE = kelas.filter((k) => k.tingkat === 'X');
  const faseF = kelas.filter((k) => k.tingkat !== 'X');
  const daftarJam = hari === 5 ? ref.jam.jumat : ref.jam.umum;
  const jumlahJam = jadwal.slot.filter((s) => s.hari === hari).length;

  return (
    <div>
      <div className="page-head">
        <h2>Jadwal Pelajaran</h2>
        <div className="pilih-periode">
          <select value={idPeriode} onChange={(e) => setIdPeriode(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'terkunci' ? ' (terkunci)' : p.status === 'draft' ? ' (draft)' : ''}
              </option>
            ))}
          </select>
          <select value={hari} onChange={(e) => setHari(Number(e.target.value))}
            style={{ width: 'auto' }}>
            {ref.hari.map((h, i) => <option key={h} value={i + 1}>{h}</option>)}
          </select>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">🗓️</span>
        <div>
          Susunan tabel mengikuti jadwal resmi sekolah: baris <strong>jam ke-</strong> terhadap
          kolom kelas. <strong>Klik sebuah sel</strong> untuk menentukan mata pelajaran beserta
          guru pengajarnya, atau menandainya sebagai kegiatan sekolah. Kode sel dibentuk otomatis
          dari huruf mata pelajaran dan nomor kode guru, misalnya <strong>E16</strong>. Seorang
          guru tidak dapat dijadwalkan pada dua kelas di jam yang sama.
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{ref.periode.kode}</strong> telah dikunci administrator. Jadwal pada
            periode ini hanya dapat dilihat sebagai arsip.
          </div>
        </div>
      )}

      <div className="jadwal-hari">
        <div className="judul-hari">
          {ref.hari[hari - 1]}
          <span style={{ float: 'right', fontWeight: 400, fontSize: 12 }}>
            {jumlahJam} jam terisi pada hari ini
          </span>
        </div>
        <div className="table-wrap">
          <table className="tabel-jadwal tabel-jadwal-sunting">
            <thead>
              <tr>
                <th rowSpan={2} className="kol-jam">JAM KE-</th>
                {faseE.length > 0 && <th colSpan={faseE.length}>FASE E</th>}
                {faseF.length > 0 && <th colSpan={faseF.length}>FASE F</th>}
              </tr>
              <tr>{kelas.map((k) => <th key={k.id}>{k.nama_kelas}</th>)}</tr>
            </thead>
            <tbody>
              {daftarJam.map((j, idx) => (
                j.jenis === 'pelajaran' ? (
                  <tr key={`j${j.jam_ke}`}>
                    <td className="kol-jam">{j.jam_ke}</td>
                    {kelas.map((k) => {
                      const s = isi.get(`${k.id}|${j.jam_ke}`);
                      return (
                        <td key={k.id}
                          className={`${s?.kegiatan && s.kegiatan !== 'P5' ? 'kegiatan' : ''} `
                            + `${terkunci ? '' : 'dapat-disunting'} ${!s ? 'kosong' : ''}`}
                          title={s ? [s.nama_mapel || s.kegiatan, s.nama_guru]
                            .filter(Boolean).join(' — ') : 'Klik untuk mengisi'}
                          onClick={() => bukaSel(k, j.jam_ke as number)}>
                          {s ? (s.kode || s.kegiatan || '') : (terkunci ? '' : '+')}
                        </td>
                      );
                    })}
                  </tr>
                ) : (
                  <tr key={`i${idx}`} className="baris-istirahat">
                    <td colSpan={kelas.length + 1}>
                      {j.mulai} {j.jenis === 'jumatan' ? "JUM'ATAN" : 'ISTIRAHAT'} {j.selesai}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <Modal title={`${ref.hari[sel.hari - 1]} jam ke-${sel.jam_ke} — Kelas ${sel.nama_kelas}`}
          onClose={() => setSel(null)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}

            <div className="field">
              <label>Isi jam pelajaran</label>
              <div className="tab-pilih" style={{ width: '100%' }}>
                <button type="button" style={{ flex: 1 }}
                  className={jenis === 'mapel' ? 'aktif' : ''}
                  onClick={() => setJenis('mapel')}>Mata Pelajaran</button>
                <button type="button" style={{ flex: 1 }}
                  className={jenis === 'kegiatan' ? 'aktif' : ''}
                  onClick={() => setJenis('kegiatan')}>Kegiatan Sekolah</button>
              </div>
            </div>

            {jenis === 'mapel' ? (
              <>
                <div className="field"><label>Mata Pelajaran</label>
                  <select value={form.huruf} required
                    onChange={(e) => setForm({ ...form, huruf: e.target.value })}>
                    <option value="">- Pilih mata pelajaran -</option>
                    {ref.mapel.map((m) => (
                      <option key={m.kode} value={m.kode}>{m.kode} — {m.nama}</option>
                    ))}
                  </select></div>
                <div className="field"><label>Guru Pengajar</label>
                  <select value={form.id_guru} required
                    onChange={(e) => setForm({ ...form, id_guru: e.target.value })}>
                    <option value="">- Pilih guru -</option>
                    {ref.guru.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nama}{g.kode_jadwal ? ` (kode ${g.kode_jadwal})` : ''}
                      </option>
                    ))}
                  </select></div>
                <p className="muted" style={{ fontSize: 12 }}>
                  Kode sel dibentuk otomatis dari huruf mata pelajaran dan nomor kode guru.
                  Guru yang belum memiliki nomor kode akan diberi nomor baru.
                </p>
              </>
            ) : (
              <>
                <div className="field"><label>Kegiatan</label>
                  <input list="daftar-kegiatan" value={form.kegiatan} required
                    placeholder="Contoh: UPACARA BENDERA"
                    onChange={(e) => setForm({ ...form, kegiatan: e.target.value.toUpperCase() })} />
                  <datalist id="daftar-kegiatan">
                    {ref.kegiatan.map((k) => <option key={k} value={k} />)}
                  </datalist></div>
                <div className="field"><label>Guru Pendamping <span className="muted">(opsional)</span></label>
                  <select value={form.id_guru}
                    onChange={(e) => setForm({ ...form, id_guru: e.target.value })}>
                    <option value="">- Tidak ada -</option>
                    {ref.guru.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}
                  </select></div>
              </>
            )}

            <div className="modal-actions">
              {sel.slot && (
                <button type="button" className="btn danger" disabled={sibuk}
                  onClick={kosongkan} style={{ marginRight: 'auto' }}>Kosongkan</button>
              )}
              <button type="button" className="btn secondary" onClick={() => setSel(null)}>Batal</button>
              <button className="btn" disabled={sibuk}>{sibuk ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
