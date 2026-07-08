import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Tugas } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SiswaTugas() {
  const [rows, setRows] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Tugas | null>(null);
  const [jawaban, setJawaban] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await api.get('/tugas');
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function open(t: Tugas) { setSel(t); setJawaban(''); setFile(null); setErr(''); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sel) return;
    setErr(''); setSaving(true);
    const fd = new FormData();
    fd.append('jawaban', jawaban);
    if (file) fd.append('file', file);
    try {
      await api.post(`/tugas/${sel.id}/submit`, fd);
      setSel(null); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal mengumpulkan'); }
    finally { setSaving(false); }
  }

  function statusBadge(t: Tugas) {
    if (t.pengumpulan?.skor != null) return <span className="badge green">Dinilai: {t.pengumpulan.skor}</span>;
    if (t.pengumpulan) return <span className="badge orange">Menunggu penilaian</span>;
    const lewat = t.deadline && new Date() > new Date(t.deadline.replace(' ', 'T'));
    return lewat ? <span className="badge red">Belum · Lewat deadline</span> : <span className="badge gray">Belum dikumpulkan</span>;
  }

  return (
    <div>
      <div className="page-head"><h2>Tugas & Kuis</h2></div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Judul</th><th>Mapel</th><th>Tipe</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada tugas</td></tr>
                : rows.map((t) => (
                  <tr key={t.id}>
                    <td>{t.judul}</td>
                    <td>{t.nama_mapel}</td>
                    <td><span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span></td>
                    <td className="muted">{fmt(t.deadline)}</td>
                    <td>{statusBadge(t)}</td>
                    <td><button className="btn small" onClick={() => open(t)}>
                      {t.pengumpulan ? 'Lihat / Perbarui' : 'Kerjakan'}
                    </button></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <Modal title={sel.judul} onClose={() => setSel(null)}>
          <span className={`badge ${sel.tipe === 'kuis' ? 'orange' : 'green'}`}>{sel.tipe}</span>
          <p className="muted" style={{ margin: '10px 0' }}>{sel.deskripsi || 'Tidak ada instruksi.'}</p>
          <p className="muted" style={{ fontSize: 12 }}>Deadline: {fmt(sel.deadline)}</p>
          {sel.pengumpulan?.skor != null && (
            <div className="hint" style={{ marginTop: 12 }}>Nilai Anda: <strong>{sel.pengumpulan.skor}</strong></div>
          )}
          <form onSubmit={submit} style={{ marginTop: 16 }}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Jawaban (teks)</label>
              <textarea value={jawaban} onChange={(e) => setJawaban(e.target.value)} placeholder="Tulis jawaban Anda di sini..." /></div>
            <div className="field"><label>Lampiran File (opsional)</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setSel(null)}>Tutup</button>
              <button className="btn" disabled={saving}>{saving ? 'Mengirim...' : 'Kumpulkan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
