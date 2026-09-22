import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SiswaDashboard() {
  const { user } = useAuth();
  const [d, setD] = useState<any>(null);

  useEffect(() => { api.get('/dashboard').then((r) => setD(r.data)); }, []);
  if (!d) return <div className="card center-msg">Memuat...</div>;

  const kartu = [
    ['Mata Pelajaran', d.total_mapel], ['Total Tugas', d.total_tugas],
    ['Sudah Dikumpulkan', d.sudah_kumpul], ['Belum Dikumpulkan', d.belum_kumpul],
    ['Sudah Dinilai', d.sudah_dinilai],
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Siswa</h2></div>

      {d.periode && (
        <div className="notice info">
          <span className="ikon">🗓️</span>
          <div>
            {d.kelas && <>Anda terdaftar di kelas <strong>{d.kelas.nama_kelas}</strong> pada </>}
            periode <strong>{d.periode.kode}</strong> — Tahun Ajaran {d.periode.tahun_ajaran} semester{' '}
            {d.periode.semester === 1 ? 'ganjil' : 'genap'}.
          </div>
        </div>
      )}

      <div className="stats">
        {kartu.map(([lbl, num]) => (
          <div className="stat" key={lbl as string}>
            <div className="num">{num ?? 0}</div>
            <div className="lbl">{lbl}</div>
          </div>
        ))}
      </div>

      {d.tugas_mendesak?.length > 0 && (
        <div className="blok">
          <div className="kepala">
            <span>⏳ Tugas yang Segera Berakhir</span>
            <Link className="btn small" to="/siswa/tugas">Lihat Semua Tugas</Link>
          </div>
          <div className="badan">
            {d.tugas_mendesak.map((t: any) => (
              <div className="materi-item" key={t.id} style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div className="judul">{t.judul}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                    {t.nama_mapel} · Batas waktu{' '}
                    {new Date(t.deadline.replace(' ', 'T')).toLocaleString('id-ID',
                      { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <span className={`deadline ${t.sisa_hari <= 1 ? 'kritis' : 'mendesak'}`}>
                  {t.sisa_hari <= 0 ? '⏳ Berakhir hari ini' : `⏳ ${t.sisa_hari} hari lagi`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Halo, {user?.nama} 👋</h3>
        <p className="muted" style={{ lineHeight: 1.8 }}>
          Buka menu <strong>Kelas Saya</strong> untuk melihat seluruh mata pelajaran di kelas Anda. Pada
          setiap mata pelajaran, materi tersusun per pertemuan sehingga Anda dapat belajar secara runut:
          membaca uraian materi, mengunduh berkas, menonton video, mengerjakan tugas, lalu berdiskusi
          bersama guru dan teman pada forum pertemuan tersebut.
        </p>
      </div>
    </div>
  );
}
