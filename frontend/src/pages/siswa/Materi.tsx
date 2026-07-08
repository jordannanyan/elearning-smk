import { useEffect, useState } from 'react';
import api, { API_BASE } from '../../api/client';
import type { Materi, Mapel } from '../../api/types';

export default function SiswaMateri() {
  const [rows, setRows] = useState<Materi[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [sel, setSel] = useState<string>('');
  const [loading, setLoading] = useState(true);

  async function load(id_mapel?: string) {
    setLoading(true);
    const { data } = await api.get('/materi', { params: id_mapel ? { id_mapel } : {} });
    setRows(data); setLoading(false);
  }
  useEffect(() => {
    api.get('/mapel').then((r) => setMapel(r.data));
    load();
  }, []);

  function onFilter(v: string) { setSel(v); load(v); }

  return (
    <div>
      <div className="page-head"><h2>Materi Pembelajaran</h2></div>

      <div className="card">
        <div className="field" style={{ maxWidth: 320, marginBottom: 0 }}>
          <label>Filter Mata Pelajaran</label>
          <select value={sel} onChange={(e) => onFilter(e.target.value)}>
            <option value="">Semua Mata Pelajaran</option>
            {mapel.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? <div className="card center-msg">Belum ada materi.</div>
          : rows.map((r) => (
            <div className="card" key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{r.judul}</div>
                  <span className="badge green" style={{ marginTop: 6, display: 'inline-block' }}>{r.nama_mapel}</span>
                  {r.konten && <p style={{ marginTop: 10 }} className="muted">{r.konten}</p>}
                  <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>Diunggah: {r.tgl_upload?.slice(0, 10)}</div>
                </div>
                {r.file && <a className="btn small" href={`${API_BASE}/uploads/${r.file}`} target="_blank">⬇ Unduh File</a>}
              </div>
            </div>
          ))}
    </div>
  );
}
