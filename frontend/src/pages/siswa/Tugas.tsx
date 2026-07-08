import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Tugas, KerjakanResponse, SoalKerjakan } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SiswaTugas() {
  const [rows, setRows] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal pengerjaan
  const [open, setOpen] = useState<Tugas | null>(null);
  const [data, setData] = useState<KerjakanResponse | null>(null);
  const [ans, setAns] = useState<Record<number, { pilihan?: string; jawaban_teks?: string }>>({});
  const [teks, setTeks] = useState('');       // tugas biasa: jawaban teks
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await api.get('/tugas');
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function openTugas(t: Tugas) {
    setOpen(t); setData(null); setErr(''); setFile(null); setTeks('');
    const { data } = await api.get(`/tugas/${t.id}/kerjakan`);
    setData(data);
    // prefill jawaban lama
    const init: Record<number, any> = {};
    data.soal.forEach((s: SoalKerjakan) => {
      init[s.id] = { pilihan: s.jawaban?.pilihan || '', jawaban_teks: s.jawaban?.jawaban_teks || '' };
    });
    setAns(init);
  }

  async function submit() {
    if (!open || !data) return;
    setErr(''); setSaving(true);
    try {
      if (data.berbasis_soal) {
        const jawaban = data.soal.map((s) => ({
          id_soal: s.id,
          pilihan: ans[s.id]?.pilihan || null,
          jawaban_teks: ans[s.id]?.jawaban_teks || null,
        }));
        await api.post(`/tugas/${open.id}/submit`, { jawaban });
      } else {
        const fd = new FormData();
        fd.append('jawaban', teks);
        if (file) fd.append('file', file);
        await api.post(`/tugas/${open.id}/submit`, fd);
      }
      setOpen(null); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal mengumpulkan'); }
    finally { setSaving(false); }
  }

  function statusBadge(t: Tugas) {
    if (t.pengumpulan?.skor != null) return <span className="badge green">Nilai: {t.pengumpulan.skor}</span>;
    if (t.pengumpulan) return <span className="badge orange">Menunggu penilaian</span>;
    const lewat = t.deadline && new Date() > new Date(t.deadline.replace(' ', 'T'));
    return lewat ? <span className="badge red">Belum · Lewat deadline</span> : <span className="badge gray">Belum dikumpulkan</span>;
  }

  const graded = data?.graded;

  return (
    <div>
      <div className="page-head"><h2>Tugas & Kuis</h2></div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Judul</th><th>Mapel</th><th>Guru</th><th>Tipe</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="center-msg">Belum ada tugas</td></tr>
                : rows.map((t) => (
                  <tr key={t.id}>
                    <td>{t.judul}{t.jumlah_soal ? <span className="badge gray" style={{ marginLeft: 6 }}>{t.jumlah_soal} soal</span> : null}</td>
                    <td>{t.nama_mapel}</td>
                    <td className="muted">{t.nama_guru || '-'}</td>
                    <td><span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span></td>
                    <td className="muted">{fmt(t.deadline)}</td>
                    <td>{statusBadge(t)}</td>
                    <td><button className="btn small" onClick={() => openTugas(t)}>
                      {t.pengumpulan?.skor != null ? 'Lihat Hasil' : t.pengumpulan ? 'Lihat / Perbarui' : 'Kerjakan'}
                    </button></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={open.judul} onClose={() => setOpen(null)}>
          {!data ? <p className="muted">Memuat...</p> : (
            <>
              <p style={{ marginBottom: 6, fontSize: 13 }}>
                <span className="badge green">{open.nama_mapel}</span>
                {open.nama_guru && <span className="badge gray" style={{ marginLeft: 6 }}>👨‍🏫 {open.nama_guru}</span>}
              </p>
              <p className="muted" style={{ marginBottom: 6 }}>{data.tugas.deskripsi || 'Tidak ada instruksi.'}</p>
              <p className="muted" style={{ fontSize: 12 }}>Deadline: {fmt(data.tugas.deadline)}</p>
              {graded && <div className="hint" style={{ marginTop: 10 }}>Nilai akhir Anda: <strong style={{ fontSize: 16 }}>{data.total_skor}</strong></div>}
              {err && <div className="error-box" style={{ marginTop: 10 }}>{err}</div>}

              {/* ---- Kuis berbasis soal ---- */}
              {data.berbasis_soal ? (
                <div style={{ marginTop: 14 }}>
                  {data.soal.map((s, i) => {
                    const a = ans[s.id] || {};
                    const jw = s.jawaban;
                    return (
                      <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          <span className={`badge ${s.tipe === 'esai' ? 'orange' : 'green'}`}>{s.tipe === 'esai' ? 'Esai' : 'PG'}</span>
                          <span className="badge gray">bobot {s.bobot}</span>
                          {graded && s.tipe === 'pilihan_ganda' && (jw?.benar === 1
                            ? <span className="badge green">Benar</span> : <span className="badge red">Salah</span>)}
                          {graded && s.tipe === 'esai' && <span className="badge gray">skor {jw?.skor ?? 0}/{s.bobot}</span>}
                        </div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{i + 1}. {s.pertanyaan}</div>

                        {s.tipe === 'pilihan_ganda' ? (
                          <div style={{ display: 'grid', gap: 6 }}>
                            {(['A', 'B', 'C', 'D'] as const).map((k) => {
                              const val = (s as any)[`pilihan_${k.toLowerCase()}`];
                              if (!val) return null;
                              const isKunci = graded && s.jawaban_benar === k;
                              const dipilih = a.pilihan === k;
                              return (
                                <label key={k} style={{
                                  display: 'flex', gap: 8, alignItems: 'center', padding: '7px 10px',
                                  border: '1px solid', borderColor: isKunci ? 'var(--primary)' : 'var(--border)',
                                  borderRadius: 6, cursor: graded ? 'default' : 'pointer',
                                  background: isKunci ? 'var(--primary-light)' : dipilih ? '#f0f4ff' : '#fff',
                                }}>
                                  <input type="radio" name={`s${s.id}`} style={{ width: 'auto' }}
                                    checked={dipilih} disabled={!!graded}
                                    onChange={() => setAns({ ...ans, [s.id]: { ...a, pilihan: k } })} />
                                  <span><strong>{k}.</strong> {val}</span>
                                  {isKunci && <span className="badge green" style={{ marginLeft: 'auto' }}>Kunci</span>}
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          graded ? (
                            <div style={{ background: '#f9fafb', borderRadius: 6, padding: 8, fontSize: 13, whiteSpace: 'pre-wrap' }}>
                              {jw?.jawaban_teks || <span className="muted">(kosong)</span>}
                            </div>
                          ) : (
                            <textarea placeholder="Tulis jawaban esai..." value={a.jawaban_teks || ''}
                              onChange={(e) => setAns({ ...ans, [s.id]: { ...a, jawaban_teks: e.target.value } })} />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ---- Tugas biasa (kumpul teks/file) ---- */
                !graded && (
                  <div style={{ marginTop: 14 }}>
                    <div className="field"><label>Jawaban (teks)</label>
                      <textarea value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Tulis jawaban Anda..." /></div>
                    <div className="field"><label>Lampiran File (opsional)</label>
                      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
                  </div>
                )
              )}

              <div className="modal-actions">
                <button className="btn secondary" onClick={() => setOpen(null)}>Tutup</button>
                {!graded && <button className="btn" onClick={submit} disabled={saving}>{saving ? 'Mengirim...' : 'Kumpulkan'}</button>}
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
