import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [d, setD] = useState<any>(null);

  useEffect(() => { api.get('/dashboard').then((r) => setD(r.data)); }, []);
  if (!d) return <div className="card center-msg">Memuat...</div>;

  const kartu = [
    ['Guru Aktif', d.total_guru], ['Siswa Aktif', d.total_siswa],
    ['Kelas', d.total_kelas], ['Mata Pelajaran', d.total_mapel],
    ['Pengampuan Kelas', d.total_pengampuan], ['Pertemuan', d.total_pertemuan],
    ['Materi', d.total_materi], ['Tugas & Kuis', d.total_tugas],
  ];

  return (
    <div>
      <div className="page-head"><h2>Dashboard Administrator</h2></div>

      {d.periode ? (
        <div className="notice info">
          <span className="ikon">🗓️</span>
          <div>
            Periode pembelajaran yang sedang berjalan adalah <strong>{d.periode.kode}</strong>{' '}
            (Tahun Ajaran {d.periode.tahun_ajaran} semester{' '}
            {d.periode.semester === 1 ? 'ganjil' : 'genap'}). Seluruh angka di bawah ini dihitung pada
            periode tersebut. <Link to="/admin/periode">Kelola periode</Link>
          </div>
        </div>
      ) : (
        <div className="notice bahaya">
          <span className="ikon">⚠️</span>
          <div>
            Belum ada periode pembelajaran yang aktif sehingga guru dan siswa belum dapat menggunakan
            sistem. <Link to="/admin/periode">Aktifkan periode terlebih dahulu</Link>.
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

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Selamat datang, Administrator 👋</h3>
        <p className="muted" style={{ lineHeight: 1.8 }}>
          Alur pengelolaan sistem: <strong>Periode Pembelajaran</strong> → <strong>Data Kelas</strong> →{' '}
          <strong>Mata Pelajaran</strong> → <strong>Pengampuan Kelas</strong> (menentukan guru pengampu
          tiap mata pelajaran pada tiap kelas). Setelah pengampuan tersusun, guru dapat menyusun pertemuan
          beserta materi, tugas, dan forum diskusinya.
        </p>
        <p className="muted" style={{ marginTop: 10, lineHeight: 1.8 }}>
          Total periode tercatat: <strong>{d.total_periode}</strong>. Periode yang telah selesai dapat
          dikunci agar datanya tersimpan sebagai arsip yang tidak dapat diubah.
        </p>
      </div>
    </div>
  );
}
