import { useEffect, useState } from 'react';
import api, { API_BASE } from '../../api/client';
import Modal from '../../components/Modal';
import PenilaianModal from '../../components/PenilaianModal';
import type { KelasMapel, PengumpulanRow, Periode, Tugas } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return '-';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

const STATUS: Record<string, { teks: string; warna: string }> = {
  belum_mengumpulkan: { teks: 'Belum mengumpulkan', warna: 'red' },
  terkumpul: { teks: 'Terkumpul', warna: 'gray' },
  perlu_nilai_esai: { teks: 'Perlu nilai esai', warna: 'orange' },
  dinilai: { teks: 'Sudah dinilai', warna: 'green' },
};

export default function GuruPenilaian() {
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilihPeriode, setPilihPeriode] = useState('');
  const [kelasMapel, setKelasMapel] = useState<KelasMapel[]>([]);
  const [pilihKm, setPilihKm] = useState('');
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState<Tugas | null>(null);
  const [subs, setSubs] = useState<PengumpulanRow[]>([]);
  const [nilaiUntuk, setNilaiUntuk] = useState<PengumpulanRow | null>(null);

  // Form nilai tugas biasa
  const [manual, setManual] = useState<PengumpulanRow | null>(null);
  const [fm, setFm] = useState({ skor: '', catatan: '' });
  const [errManual, setErrManual] = useState('');

  const periodeTerpilih = periode.find((p) => String(p.id) === String(pilihPeriode));
  const terkunci = periodeTerpilih?.status === 'terkunci';

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const idP = pilihPeriode || (aktif ? String(aktif.id) : '');
    if (!pilihPeriode && idP) setPilihPeriode(idP);

    const km = await api.get('/kelas-mapel', { params: { id_periode: idP } });
    setKelasMapel(km.data);

    const params: any = { id_periode: idP };
    if (pilihKm) params.id_kelas_mapel = pilihKm;
    const t = await api.get('/tugas', { params });
    setTugas(t.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, [pilihPeriode, pilihKm]);

  async function bukaDetail(t: Tugas) {
    setDetail(t);
    const { data } = await api.get(`/tugas/${t.id}/pengumpulan`);
    setSubs(data);
  }

  function bukaManual(s: PengumpulanRow) {
    setManual(s);
    setFm({ skor: s.skor != null ? String(s.skor) : '', catatan: s.catatan || '' });
    setErrManual('');
  }

  async function simpanManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manual) return;
    setErrManual('');
    try {
      await api.post('/nilai', { id_kumpul: manual.id, skor: fm.skor, catatan: fm.catatan });
      setManual(null);
      if (detail) bukaDetail(detail);
      load();
    } catch (e: any) { setErrManual(e.response?.data?.message || 'Gagal menyimpan nilai'); }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Penilaian</h2>
        <div className="pilih-periode">
          <select value={pilihPeriode} onChange={(e) => { setPilihPeriode(e.target.value); setPilihKm(''); }}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
          <select value={pilihKm} onChange={(e) => setPilihKm(e.target.value)}>
            <option value="">Semua Kelas Mata Pelajaran</option>
            {kelasMapel.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_mapel} — {k.nama_kelas}</option>
            ))}
          </select>
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>Periode <strong>{periodeTerpilih?.kode}</strong> terkunci. Nilai hanya dapat dilihat.</div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tugas / Kuis</th><th>Mata Pelajaran</th><th>Kelas</th><th>Pertemuan</th>
              <th>Tipe</th><th>Batas Waktu</th><th>Terkumpul</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8} className="center-msg">Memuat...</td></tr>
              : tugas.length === 0 ? <tr><td colSpan={8} className="center-msg">Belum ada tugas</td></tr>
                : tugas.map((t) => (
                  <tr key={t.id}>
                    <td>{t.judul}</td>
                    <td>{t.nama_mapel}</td>
                    <td><span className="badge gray">{t.nama_kelas}</span></td>
                    <td>Pertemuan {t.nomor_pertemuan}</td>
                    <td><span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span></td>
                    <td className="muted">{fmt(t.deadline)}</td>
                    <td>{t.jumlah_kumpul ?? 0}</td>
                    <td><button className="btn small" onClick={() => bukaDetail(t)}>Periksa & Nilai</button></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <Modal title={`Pengumpulan: ${detail.judul}`} onClose={() => setDetail(null)}>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
            {detail.nama_mapel} · {detail.nama_kelas} · Pertemuan {detail.nomor_pertemuan}
          </p>
          {subs.length === 0 ? <p className="muted">Belum ada siswa pada kelas ini.</p> : (
            <div className="table-wrap" style={{ border: 'none' }}>
              <table>
                <thead><tr><th>Siswa</th><th>Waktu Kumpul</th><th>Status</th>
                  <th>{detail.jumlah_soal ? '' : 'Berkas'}</th><th>Nilai</th><th></th></tr></thead>
                <tbody>
                  {subs.map((s) => {
                    const st = STATUS[s.status];
                    return (
                      <tr key={s.id_siswa}>
                        <td>{s.nama_siswa}
                          {s.terlambat ? <span className="badge red" style={{ marginLeft: 6 }}>Telat</span> : null}
                        </td>
                        <td className="muted">{fmt(s.tgl_kumpul)}</td>
                        <td><span className={`badge ${st.warna}`}>{st.teks}</span></td>
                        <td>{!detail.jumlah_soal && s.file
                          ? <a href={`${API_BASE}/uploads/${s.file}`} target="_blank" rel="noreferrer">Lihat</a>
                          : <span className="muted">-</span>}</td>
                        <td>{s.skor != null ? <strong>{s.skor}</strong> : <span className="muted">Belum</span>}</td>
                        <td>
                          {s.id && !terkunci && (detail.jumlah_soal
                            ? <button className="btn small" onClick={() => setNilaiUntuk(s)}>Periksa</button>
                            : <button className="btn small" onClick={() => bukaManual(s)}>Nilai</button>)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn secondary" onClick={() => setDetail(null)}>Tutup</button>
          </div>
        </Modal>
      )}

      {manual && (
        <Modal title={`Nilai — ${manual.nama_siswa}`} onClose={() => setManual(null)}>
          <form onSubmit={simpanManual}>
            {errManual && <div className="error-box">{errManual}</div>}
            {manual.jawaban && (
              <div className="field"><label>Jawaban Siswa</label>
                <div style={{
                  background: '#f9fafb', borderRadius: 6, padding: 10,
                  fontSize: 13, whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto',
                }}>{manual.jawaban}</div>
              </div>
            )}
            {manual.file && (
              <p style={{ marginBottom: 12 }}>
                <a className="btn secondary small" href={`${API_BASE}/uploads/${manual.file}`}
                  target="_blank" rel="noreferrer">⬇ Unduh Berkas Jawaban</a>
              </p>
            )}
            <div className="field"><label>Nilai (0 - 100)</label>
              <input type="number" min={0} max={100} value={fm.skor} required
                onChange={(e) => setFm({ ...fm, skor: e.target.value })} /></div>
            <div className="field"><label>Catatan untuk Siswa</label>
              <textarea value={fm.catatan}
                onChange={(e) => setFm({ ...fm, catatan: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setManual(null)}>Batal</button>
              <button className="btn">Simpan Nilai</button>
            </div>
          </form>
        </Modal>
      )}

      {nilaiUntuk && nilaiUntuk.id && (
        <PenilaianModal
          pengumpulanId={nilaiUntuk.id}
          namaSiswa={nilaiUntuk.nama_siswa}
          onClose={() => setNilaiUntuk(null)}
          onSaved={() => { if (detail) bukaDetail(detail); load(); }}
        />
      )}
    </div>
  );
}
