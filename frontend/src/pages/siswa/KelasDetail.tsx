import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import type { KelasMapel, Pertemuan } from '../../api/types';

export default function SiswaKelasDetail() {
  const { id } = useParams();
  const [km, setKm] = useState<KelasMapel | null>(null);
  const [rows, setRows] = useState<Pertemuan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [k, p] = await Promise.all([
        api.get(`/kelas-mapel/${id}`),
        api.get(`/kelas-mapel/${id}/pertemuan`),
      ]);
      setKm(k.data); setRows(p.data); setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="card center-msg">Memuat...</div>;
  if (!km) return <div className="card center-msg">Mata pelajaran tidak ditemukan.</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to="/siswa/kelas" className="muted" style={{ fontSize: 13 }}>← Kembali ke Kelas Saya</Link>
          <h2 style={{ marginTop: 6 }}>{km.nama_mapel}</h2>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            👨‍🏫 {km.nama_guru || 'Guru belum ditentukan'} · 🏫 {km.nama_kelas} ·
            Periode {km.kode_periode} ({km.tahun_ajaran} {km.semester === 1 ? 'Ganjil' : 'Genap'})
          </div>
        </div>
      </div>

      {km.status_periode === 'terkunci' && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>Periode ini sudah berakhir. Materi dan tugas ditampilkan sebagai riwayat belajar.</div>
        </div>
      )}

      <div className="notice info">
        <span className="ikon">📚</span>
        <div>
          Materi disusun per pertemuan secara berurutan. Buka pertemuan untuk melihat uraian materi,
          berkas yang dapat diunduh, video pembelajaran, tugas, serta forum diskusi pada pertemuan tersebut.
        </div>
      </div>

      {rows.length === 0
        ? <div className="card center-msg">Guru belum menyusun pertemuan pada mata pelajaran ini.</div>
        : rows.map((p) => (
          <Link className="polos" to={`/siswa/pertemuan/${p.id}`} key={p.id}>
            <div className="pertemuan-item">
              <div className="nomor"><small>PERTEMUAN</small>{p.nomor}</div>
              <div className="isi">
                <h3>{p.judul}</h3>
                {p.deskripsi && <p className="muted" style={{ fontSize: 13 }}>{p.deskripsi}</p>}
                <div className="meta">
                  <span className="badge gray">📄 {p.jumlah_materi} materi</span>
                  <span className="badge green">📝 {p.jumlah_tugas} tugas</span>
                  <span className="badge orange">💬 {p.jumlah_diskusi} diskusi</span>
                  {p.tanggal && <span className="muted" style={{ fontSize: 12, alignSelf: 'center' }}>
                    {new Date(p.tanggal).toLocaleDateString('id-ID',
                      { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>}
                </div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--gray)' }}>›</div>
            </div>
          </Link>
        ))}
    </div>
  );
}
