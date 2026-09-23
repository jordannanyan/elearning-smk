import { useEffect, useState } from 'react';
import api, { API_BASE } from '../../api/client';
import Modal from '../../components/Modal';
import PenilaianModal from '../../components/PenilaianModal';
import type { KelasMapel, PengumpulanRow, Periode, Tugas } from '../../api/types';

// ---------------------------------------------------------------------
// Penilaian dikelompokkan per mata pelajaran, tidak dicampur menjadi satu
// daftar panjang. Guru memilih mata pelajaran terlebih dahulu, kemudian
// melihat tugasnya yang tersusun menurut pertemuan.
// ---------------------------------------------------------------------

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
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);

  // Mata pelajaran yang sedang dibuka
  const [terbuka, setTerbuka] = useState<KelasMapel | null>(null);

  const [detail, setDetail] = useState<Tugas | null>(null);
  const [subs, setSubs] = useState<PengumpulanRow[]>([]);
  const [nilaiUntuk, setNilaiUntuk] = useState<PengumpulanRow | null>(null);

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

    const [km, t] = await Promise.all([
      api.get('/kelas-mapel', { params: { id_periode: idP } }),
      api.get('/tugas', { params: { id_periode: idP } }),
    ]);
    setKelasMapel(km.data); setTugas(t.data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilihPeriode]);

  // Jumlah pekerjaan yang masih perlu dinilai pada sebuah mata pelajaran
  function perluDinilai(km: KelasMapel) {
    return tugas.filter((t) => t.id_kelas_mapel === km.id)
      .reduce((a, t) => a + (t.jumlah_kumpul ?? 0), 0);
  }

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

  // Tugas pada mata pelajaran terbuka, diurutkan menurut pertemuan
  const tugasTerbuka = terbuka
    ? tugas.filter((t) => t.id_kelas_mapel === terbuka.id)
      .sort((a, b) => (a.nomor_pertemuan ?? 0) - (b.nomor_pertemuan ?? 0))
    : [];

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Penilaian</h2>
          {terbuka && (
            <button className="tombol-rincian" style={{ marginTop: 6 }}
              onClick={() => setTerbuka(null)}>← Kembali ke daftar mata pelajaran</button>
          )}
        </div>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilihPeriode}
            onChange={(e) => { setPilihPeriode(e.target.value); setTerbuka(null); }}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
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

      {loading ? <div className="card center-msg">Memuat...</div>
        : !terbuka ? (
          /* ---------- Daftar mata pelajaran ---------- */
          <>
            <div className="notice info">
              <span className="ikon">⭐</span>
              <div>
                Pilih mata pelajaran untuk menilai pekerjaan siswa. Di dalamnya tugas tersusun
                menurut urutan pertemuan.
              </div>
            </div>

            {kelasMapel.length === 0
              ? <div className="card center-msg">Anda belum mengajar mata pelajaran pada periode ini.</div>
              : (
                <div className="kartu-grid">
                  {kelasMapel.map((km) => {
                    const jml = tugas.filter((t) => t.id_kelas_mapel === km.id).length;
                    return (
                      <div className={`kartu-ringkas ${terkunci ? 'abu' : ''}`} key={km.id}
                        onClick={() => setTerbuka(km)}>
                        <div>
                          <h3>{km.nama_mapel}</h3>
                          <div className="sub">🏫 {km.nama_kelas} · Tingkat {km.tingkat}</div>
                        </div>
                        <div className="angka-baris">
                          <div><strong>{jml}</strong>Tugas &amp; Kuis</div>
                          <div><strong>{perluDinilai(km)}</strong>Terkumpul</div>
                          <div><strong>{km.jumlah_siswa}</strong>Siswa</div>
                        </div>
                        <div className="kaki">Klik untuk memeriksa dan menilai →</div>
                      </div>
                    );
                  })}
                </div>
              )}
          </>
        ) : (
          /* ---------- Tugas pada satu mata pelajaran ---------- */
          <>
            <div className="notice info">
              <span className="ikon">📘</span>
              <div>
                <strong>{terbuka.nama_mapel}</strong> — kelas {terbuka.nama_kelas} ·{' '}
                {terbuka.jumlah_siswa} siswa · {tugasTerbuka.length} tugas &amp; kuis
              </div>
            </div>

            {tugasTerbuka.length === 0
              ? <div className="card center-msg">Belum ada tugas pada mata pelajaran ini.</div>
              : tugasTerbuka.map((t) => (
                <div className="kartu-tugas aman" key={t.id}>
                  <div className="utama">
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge gray">Pertemuan {t.nomor_pertemuan}</span>
                      <span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span>
                      {!!t.jumlah_soal && <span className="badge gray">{t.jumlah_soal} soal</span>}
                    </div>
                    <div className="judul">{t.judul}</div>
                    <div className="mapel">Batas waktu: {fmt(t.deadline)}</div>
                  </div>
                  <div className="aksi">
                    <span className="badge green">{t.jumlah_kumpul ?? 0} terkumpul</span>
                    <button className="btn small" onClick={() => bukaDetail(t)}>Periksa &amp; Nilai</button>
                  </div>
                </div>
              ))}
          </>
        )}

      {detail && (
        <Modal title={`Pengumpulan: ${detail.judul}`} onClose={() => setDetail(null)}>
          <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
            {detail.nama_mapel} · {detail.nama_kelas} · Pertemuan {detail.nomor_pertemuan}
          </p>
          {subs.length === 0 ? <p className="muted">Belum ada siswa pada kelas ini.</p> : (
            <div className="rincian-list">
              {subs.map((s) => {
                const st = STATUS[s.status];
                return (
                  <div className="rincian-item" key={s.id_siswa}>
                    <div className="kiri">
                      <div className="nama">
                        {s.nama_siswa}
                        {s.terlambat ? <span className="badge red" style={{ marginLeft: 6 }}>Telat</span> : null}
                      </div>
                      <div className="ket">
                        {s.tgl_kumpul ? `Dikumpulkan ${fmt(s.tgl_kumpul)}` : 'Belum mengumpulkan'}
                        {!detail.jumlah_soal && s.file && (
                          <> · <a href={`${API_BASE}/uploads/${s.file}`} target="_blank"
                            rel="noreferrer">Lihat berkas</a></>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`badge ${st.warna}`}>{st.teks}</span>
                      {s.skor != null && <strong>{s.skor}</strong>}
                      {s.id && !terkunci && (detail.jumlah_soal
                        ? <button className="btn small" onClick={() => setNilaiUntuk(s)}>Periksa</button>
                        : <button className="btn small" onClick={() => bukaManual(s)}>Nilai</button>)}
                    </div>
                  </div>
                );
              })}
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
