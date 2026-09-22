import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import type { KelasMapel, Periode } from '../../api/types';

export default function GuruKelasSaya() {
  const [rows, setRows] = useState<KelasMapel[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilih, setPilih] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const id = pilih || (aktif ? String(aktif.id) : '');
    if (!pilih && id) setPilih(id);
    const { data } = await api.get('/kelas-mapel', { params: { id_periode: id } });
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilih]);

  const periodeTerpilih = periode.find((p) => String(p.id) === String(pilih));
  const terkunci = periodeTerpilih?.status === 'terkunci';

  return (
    <div>
      <div className="page-head">
        <h2>Kelas Saya</h2>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilih} onChange={(e) => setPilih(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'aktif' ? ' (aktif)' : p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{periodeTerpilih?.kode}</strong> sudah dikunci administrator. Kelas pada
            periode ini hanya dapat dilihat sebagai arsip — materi, tugas, dan nilai tidak dapat diubah lagi.
          </div>
        </div>
      )}

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? (
          <div className="card center-msg">
            Anda belum ditugaskan mengampu mata pelajaran pada periode ini.<br />
            Hubungi administrator untuk penetapan pengampuan kelas.
          </div>
        ) : (
          <div className="kartu-grid">
            {rows.map((r) => (
              <Link className="polos" to={`/guru/kelas/${r.id}`} key={r.id}>
                <div className={`kartu-mapel ${terkunci ? 'terkunci' : ''}`}>
                  <div>
                    <h3>{r.nama_mapel}</h3>
                    <div className="guru">🏫 {r.nama_kelas} · Tingkat {r.tingkat}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="badge gray">{r.kode_mapel}</span>
                    <span className="badge green">{r.jumlah_siswa} siswa</span>
                    {terkunci && <span className="badge orange">🔒 Arsip</span>}
                  </div>
                  <div className="angka">
                    <div><strong>{r.jumlah_pertemuan}</strong>Pertemuan</div>
                    <div><strong>{r.jumlah_materi}</strong>Materi</div>
                    <div><strong>{r.jumlah_tugas}</strong>Tugas</div>
                  </div>
                  <div className="kaki muted" style={{ fontSize: 12 }}>
                    Klik untuk mengelola pertemuan, materi, tugas, dan forum diskusi →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
