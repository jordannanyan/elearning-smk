import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { ForumPost, Mapel } from '../api/types';

function fmt(dt: string) {
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}
const roleBadge = (r: string) =>
  r === 'guru' ? 'green' : r === 'admin' ? 'orange' : 'gray';

export default function ForumView() {
  const { user } = useAuth();
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [threads, setThreads] = useState<ForumPost[]>([]);
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    api.get('/mapel').then((r) => {
      setMapel(r.data);
      if (r.data[0]) setSel(r.data[0].id);
    });
  }, []);

  async function loadThreads(id: number) {
    const { data } = await api.get('/forum', { params: { id_mapel: id } });
    setThreads(data);
  }
  useEffect(() => { if (sel) loadThreads(sel); }, [sel]);

  async function postThread(e: React.FormEvent) {
    e.preventDefault();
    if (!pesan.trim() || !sel) return;
    await api.post('/forum', { id_mapel: sel, judul, pesan });
    setJudul(''); setPesan(''); loadThreads(sel);
  }

  async function postReply(parentId: number) {
    if (!replyText.trim() || !sel) return;
    await api.post('/forum', { id_mapel: sel, pesan: replyText, id_parent: parentId });
    setReplyText(''); setReplyTo(null); loadThreads(sel);
  }

  async function del(id: number) {
    if (!confirm('Hapus pesan ini?')) return;
    await api.delete(`/forum/${id}`);
    if (sel) loadThreads(sel);
  }

  return (
    <div>
      <div className="page-head"><h2>Forum Diskusi</h2></div>

      <div className="card">
        <div className="field" style={{ maxWidth: 320, marginBottom: 0 }}>
          <label>Pilih Mata Pelajaran</label>
          <select value={sel ?? ''} onChange={(e) => setSel(Number(e.target.value))}>
            {mapel.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
          </select>
        </div>
      </div>

      {sel && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Mulai Topik Baru</h3>
          <form onSubmit={postThread}>
            <div className="field"><input placeholder="Judul topik (opsional)" value={judul} onChange={(e) => setJudul(e.target.value)} /></div>
            <div className="field"><textarea placeholder="Tulis pesan..." value={pesan} onChange={(e) => setPesan(e.target.value)} required /></div>
            <button className="btn">Kirim</button>
          </form>
        </div>
      )}

      {threads.length === 0 ? (
        <div className="card center-msg">Belum ada diskusi pada mata pelajaran ini.</div>
      ) : threads.map((t) => (
        <div className="card" key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {t.judul && <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.judul}</div>}
              <span className={`badge ${roleBadge(t.role)}`}>{t.nama_user}</span>
              <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(t.tgl_post)}</span>
            </div>
            {(user?.id === t.id_user || user?.role === 'admin') &&
              <button className="btn danger small" onClick={() => del(t.id)}>Hapus</button>}
          </div>
          <p style={{ margin: '10px 0' }}>{t.pesan}</p>

          <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14, marginLeft: 4 }}>
            {t.balasan?.map((b) => (
              <div key={b.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span className={`badge ${roleBadge(b.role)}`}>{b.nama_user}</span>
                    <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(b.tgl_post)}</span>
                  </div>
                  {(user?.id === b.id_user || user?.role === 'admin') &&
                    <button className="btn danger small" onClick={() => del(b.id)}>Hapus</button>}
                </div>
                <p style={{ marginTop: 4 }}>{b.pesan}</p>
              </div>
            ))}

            {replyTo === t.id ? (
              <div style={{ marginTop: 8 }}>
                <textarea placeholder="Tulis balasan..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn small" onClick={() => postReply(t.id)}>Balas</button>
                  <button className="btn secondary small" onClick={() => { setReplyTo(null); setReplyText(''); }}>Batal</button>
                </div>
              </div>
            ) : (
              <button className="btn secondary small" onClick={() => { setReplyTo(t.id); setReplyText(''); }}>+ Balas</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
