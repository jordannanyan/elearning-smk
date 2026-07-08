import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SiswaDashboard() {
  const { user } = useAuth();
  const [s, setS] = useState<any>(null);
  useEffect(() => { api.get('/dashboard').then((r) => setS(r.data)); }, []);

  const stats = [
    { lbl: 'Mata Pelajaran', num: s?.total_mapel },
    { lbl: 'Total Tugas', num: s?.total_tugas },
    { lbl: 'Sudah Dikumpulkan', num: s?.sudah_kumpul },
    { lbl: 'Belum Dikumpulkan', num: s?.belum_kumpul },
    { lbl: 'Sudah Dinilai', num: s?.sudah_dinilai },
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Siswa</h2></div>
      <div className="stats">
        {stats.map((x) => (
          <div className="stat" key={x.lbl}>
            <div className="num">{x.num ?? '-'}</div>
            <div className="lbl">{x.lbl}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Halo, {user?.nama} 👋</h3>
        <p className="muted">
          Akses materi pembelajaran, kerjakan tugas & kuis, lihat nilai, serta berdiskusi
          bersama guru dan teman melalui forum diskusi.
        </p>
      </div>
    </div>
  );
}
