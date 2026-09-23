import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function GuruDashboard() {
  const { user } = useAuth();
  const [d, setD] = useState<any>(null);

  useEffect(() => { api.get('/dashboard').then((r) => setD(r.data)); }, []);
  if (!d) return <div className="card center-msg">Memuat...</div>;

  // Ringkasan dibatasi pada hal yang langsung dibutuhkan guru
  const kartu = [
    ['Mata Pelajaran yang Diajar', d.total_kelas_mapel],
    ['Jumlah Siswa', d.total_siswa],
    ['Materi', d.total_materi],
    ['Tugas & Kuis', d.total_tugas],
    ['Perlu Dinilai', d.perlu_dinilai],
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Guru</h2></div>

      {d.periode ? (
        <div className="notice info">
          <span className="ikon">🗓️</span>
          <div>
            Periode berjalan: <strong>{d.periode.kode}</strong> — Tahun Ajaran {d.periode.tahun_ajaran}{' '}
            semester {d.periode.semester === 1 ? 'ganjil' : 'genap'}. Seluruh ringkasan di bawah dihitung
            pada periode ini.
          </div>
        </div>
      ) : (
        <div className="notice bahaya">
          <span className="ikon">⚠️</span>
          <div>Belum ada periode pembelajaran aktif. Hubungi administrator.</div>
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

      {d.perlu_dinilai > 0 && (
        <div className="notice kunci">
          <span className="ikon">⭐</span>
          <div>
            Terdapat <strong>{d.perlu_dinilai} pekerjaan siswa</strong> yang belum dinilai.{' '}
            <Link to="/guru/penilaian">Buka halaman penilaian</Link>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Halo, {user?.nama} 👋</h3>
        {d.daftar_kelas?.length > 0 && (
          <p className="muted" style={{ lineHeight: 1.8, marginBottom: 10 }}>
            Kelas yang Anda ajar pada periode ini:{' '}
            {d.daftar_kelas.map((k: any) => (
              <span className="badge green" key={k.id} style={{ marginRight: 6 }}>
                {k.nama_mapel} — {k.nama_kelas}
              </span>
            ))}
          </p>
        )}
        <p className="muted" style={{ lineHeight: 1.8 }}>
          Alur mengajar pada sistem ini: buka <strong>Kelas yang Diajar</strong> → pilih kelas →
          susun <strong>Pertemuan 1, 2, 3, ...</strong> Pada setiap pertemuan Anda dapat mengunggah materi
          berupa uraian, berkas, video, maupun tautan YouTube, kemudian menambahkan tugas atau kuis dan
          membuka forum diskusi. Susunan per pertemuan ini membuat siswa mengikuti pembelajaran secara runut.
        </p>
      </div>
    </div>
  );
}
