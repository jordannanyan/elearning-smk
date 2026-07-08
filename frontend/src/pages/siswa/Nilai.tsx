import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { NilaiRow } from '../../api/types';

export default function SiswaNilai() {
  const [rows, setRows] = useState<NilaiRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/nilai/saya').then((r) => { setRows(r.data); setLoading(false); });
  }, []);

  const dinilai = rows.filter((r) => r.skor != null);
  const rata = dinilai.length
    ? (dinilai.reduce((a, b) => a + Number(b.skor), 0) / dinilai.length).toFixed(1)
    : '-';

  return (
    <div>
      <div className="page-head"><h2>Rekap Nilai</h2></div>

      <div className="stats">
        <div className="stat"><div className="num">{rows.length}</div><div className="lbl">Tugas Dikumpulkan</div></div>
        <div className="stat"><div className="num">{dinilai.length}</div><div className="lbl">Sudah Dinilai</div></div>
        <div className="stat"><div className="num">{rata}</div><div className="lbl">Rata-rata Nilai</div></div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Tugas/Kuis</th><th>Mapel</th><th>Tipe</th><th>Dikumpulkan</th><th>Nilai</th><th>Catatan Guru</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="center-msg">Belum ada nilai.</td></tr>
                : rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.judul_tugas}</td>
                    <td>{r.nama_mapel}</td>
                    <td><span className={`badge ${r.tipe === 'kuis' ? 'orange' : 'green'}`}>{r.tipe}</span></td>
                    <td className="muted">{r.tgl_kumpul?.slice(0, 10)}{r.terlambat ? <span className="badge red" style={{ marginLeft: 6 }}>Telat</span> : null}</td>
                    <td>{r.skor != null ? <strong>{r.skor}</strong> : <span className="badge orange">Menunggu</span>}</td>
                    <td className="muted">{r.catatan || '-'}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
