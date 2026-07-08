import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function GuruDashboard() {
  const { user } = useAuth();
  const [s, setS] = useState<any>(null);
  useEffect(() => { api.get('/dashboard').then((r) => setS(r.data)); }, []);

  const stats = [
    { lbl: 'Mata Pelajaran', num: s?.total_mapel },
    { lbl: 'Materi Diunggah', num: s?.total_materi },
    { lbl: 'Tugas & Kuis', num: s?.total_tugas },
    { lbl: 'Perlu Dinilai', num: s?.perlu_dinilai },
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Guru</h2></div>
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
          Kelola materi pembelajaran, buat tugas & kuis, nilai pekerjaan siswa, dan
          berinteraksi melalui forum diskusi lewat menu di samping.
        </p>
      </div>
    </div>
  );
}
