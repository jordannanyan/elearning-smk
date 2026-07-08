import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from './Modal';
import type { SoalPenilaian } from '../api/types';

export default function PenilaianModal({ pengumpulanId, namaSiswa, onClose, onSaved }:
  { pengumpulanId: number; namaSiswa: string; onClose: () => void; onSaved: () => void }) {
  const [soal, setSoal] = useState<SoalPenilaian[]>([]);
  const [scores, setScores] = useState<Record<number, string>>({});
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get(`/pengumpulan/${pengumpulanId}`);
    setSoal(data.soal);
    setCatatan(data.pengumpulan?.catatan || '');
    const init: Record<number, string> = {};
    data.soal.forEach((s: SoalPenilaian) => {
      if (s.tipe === 'esai') init[s.id] = s.skor_didapat != null ? String(s.skor_didapat) : '';
    });
    setScores(init);
    setLoading(false);
  }
  useEffect(() => { load(); }, [pengumpulanId]);

  const opt = (s: SoalPenilaian, k: string) => (s as any)[`pilihan_${k.toLowerCase()}`];

  async function simpan() {
    setErr(''); setSaving(true);
    const payload = {
      scores: soal.filter((s) => s.tipe === 'esai').map((s) => ({ id_soal: s.id, skor: Number(scores[s.id] || 0) })),
      catatan,
    };
    try {
      await api.post(`/pengumpulan/${pengumpulanId}/nilai`, payload);
      onSaved(); onClose();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
    finally { setSaving(false); }
  }

  return (
    <Modal title={`Nilai — ${namaSiswa}`} onClose={onClose}>
      {loading ? <p className="muted">Memuat...</p> : (
        <>
          {err && <div className="error-box">{err}</div>}
          {soal.map((s, i) => (
            <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <span className={`badge ${s.tipe === 'esai' ? 'orange' : 'green'}`}>{s.tipe === 'esai' ? 'Esai' : 'PG'}</span>
                <span className="badge gray">bobot {s.bobot}</span>
              </div>
              <div style={{ fontWeight: 600 }}>{i + 1}. {s.pertanyaan}</div>

              {s.tipe === 'pilihan_ganda' ? (
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  <div>Jawaban siswa: <strong>{s.pilihan || '-'}</strong>
                    {s.pilihan && <span className="muted"> ({opt(s, s.pilihan) || ''})</span>}
                    {s.benar === 1 ? <span className="badge green" style={{ marginLeft: 8 }}>Benar +{s.bobot}</span>
                      : <span className="badge red" style={{ marginLeft: 8 }}>Salah 0</span>}
                  </div>
                  <div className="muted">Kunci: {s.jawaban_benar}</div>
                </div>
              ) : (
                <div style={{ marginTop: 6 }}>
                  <div className="muted" style={{ fontSize: 12 }}>Jawaban siswa:</div>
                  <div style={{ background: '#f9fafb', borderRadius: 6, padding: 8, margin: '4px 0', fontSize: 13, whiteSpace: 'pre-wrap' }}>
                    {s.jawaban_teks || <span className="muted">(kosong)</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 13 }}>Skor:</label>
                    <input type="number" min={0} max={s.bobot} style={{ width: 90 }}
                      value={scores[s.id] ?? ''} onChange={(e) => setScores({ ...scores, [s.id]: e.target.value })} />
                    <span className="muted">/ {s.bobot}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="field"><label>Catatan (opsional)</label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} /></div>

          <div className="modal-actions">
            <button className="btn secondary" onClick={onClose}>Batal</button>
            <button className="btn" onClick={simpan} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan & Finalisasi Nilai'}</button>
          </div>
        </>
      )}
    </Modal>
  );
}
