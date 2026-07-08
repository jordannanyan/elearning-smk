import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminDashboard() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { api.get('/dashboard').then((r) => setS(r.data)); }, []);

  const stats = [
    { lbl: 'Total Guru', num: s?.total_guru },
    { lbl: 'Total Siswa', num: s?.total_siswa },
    { lbl: 'Total Kelas', num: s?.total_kelas },
    { lbl: 'Mata Pelajaran', num: s?.total_mapel },
    { lbl: 'Total Materi', num: s?.total_materi },
    { lbl: 'Total Tugas', num: s?.total_tugas },
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Administrator</h2></div>
      <div className="stats">
        {stats.map((x) => (
          <div className="stat" key={x.lbl}>
            <div className="num">{x.num ?? '-'}</div>
            <div className="lbl">{x.lbl}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Selamat datang 👋</h3>
        <p className="muted">
          Anda masuk sebagai <strong>Administrator</strong>. Gunakan menu di samping untuk
          mengelola data guru, siswa, kelas, dan mata pelajaran. Administrator memiliki hak
          akses tertinggi untuk memantau seluruh aktivitas sistem e-learning.
        </p>
      </div>
    </div>
  );
}
