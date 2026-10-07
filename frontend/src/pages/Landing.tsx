import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------
// Halaman depan sekolah. Halaman ini dapat dibuka tanpa login dan hanya
// menampilkan profil sekolah beserta angka rekapitulasi, sehingga tidak
// ada data pribadi guru maupun siswa yang terbuka untuk umum.
// ---------------------------------------------------------------------
interface Profil {
  sekolah: {
    nama: string; penyelenggara: string; alamat: string;
    npsn: string; nss: string; laman: string; surel: string; kepala_sekolah: string;
  };
  statistik: { total_guru: number; total_siswa: number; total_kelas: number; total_mapel: number };
  periode: { kode: string; tahun_ajaran: string; nama_semester: string } | null;
}

const FITUR = [
  {
    ikon: '👨‍🏫', judul: 'Untuk Guru',
    isi: 'Menyusun pertemuan pembelajaran, mengunggah materi berupa uraian, berkas, maupun video, '
      + 'membuat tugas dan kuis, memeriksa pengumpulan, memberi nilai, serta membuka forum diskusi.',
  },
  {
    ikon: '🎓', judul: 'Untuk Siswa',
    isi: 'Mengikuti pembelajaran per pertemuan pada setiap mata pelajaran di kelasnya, mengunduh '
      + 'materi, mengerjakan tugas dan kuis dengan penanda batas waktu, serta melihat raport sementara.',
  },
  {
    ikon: '🗂️', judul: 'Untuk Administrator',
    isi: 'Mengelola periode pembelajaran, data guru dan siswa, kelas beserta mata pelajaran dan guru '
      + 'pengajarnya. Periode yang telah selesai dapat dikunci sehingga datanya tersimpan sebagai arsip.',
  },
];

const ALUR = [
  { nomor: 1, judul: 'Periode Pembelajaran', isi: 'Tahun ajaran dan semester, misalnya 2026/2.' },
  { nomor: 2, judul: 'Kelas', isi: 'Rombongan belajar beserta wali kelas dan siswa anggotanya.' },
  { nomor: 3, judul: 'Mata Pelajaran', isi: 'Mata pelajaran di kelas tersebut beserta guru pengajarnya.' },
  { nomor: 4, judul: 'Pertemuan', isi: 'Materi, tugas dan kuis, serta forum diskusi pada tiap pertemuan.' },
];

export default function Landing() {
  const { user } = useAuth();
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    api.get('/publik/profil').then((r) => setProfil(r.data)).catch(() => setProfil(null));
  }, []);

  const s = profil?.statistik;
  const sekolah = profil?.sekolah;

  return (
    <div className="landing">
      <header className="landing-bar">
        <div className="landing-isi bar-isi">
          <div className="identitas">
            <div className="lambang">🏫</div>
            <div>
              <strong>SMA Negeri 1 Karau Kuala</strong>
              <span>Sistem E-Learning Berbasis Web</span>
            </div>
          </div>
          <nav>
            <a href="#fitur">Fitur</a>
            <a href="#alur">Alur Pembelajaran</a>
            <a href="#profil">Profil Sekolah</a>
            <Link className="btn" to={user ? `/${user.role}` : '/login'}>
              {user ? 'Buka Dashboard' : 'Masuk'}
            </Link>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-isi">
          {profil?.periode && (
            <span className="tanda">
              🗓️ Periode berjalan: {profil.periode.tahun_ajaran} Semester {profil.periode.nama_semester}
              {' '}({profil.periode.kode})
            </span>
          )}
          <h1>Belajar tidak lagi terbatas<br />ruang dan waktu kelas</h1>
          <p>
            Sistem e-learning SMA Negeri 1 Karau Kuala menyatukan materi, tugas, kuis, forum diskusi,
            dan penilaian dalam satu tempat. Guru dapat membagikan materi kapan saja dan siswa dapat
            mengaksesnya kembali setiap saat, termasuk ketika pembelajaran tatap muka tidak dapat
            dilaksanakan.
          </p>
          <div className="tombol-hero">
            <Link className="btn besar" to={user ? `/${user.role}` : '/login'}>
              {user ? 'Buka Dashboard' : 'Masuk ke Sistem'}
            </Link>
            <a className="btn secondary besar" href="#fitur">Lihat Fitur</a>
          </div>
        </div>
      </section>

      <section className="landing-isi angka-sekolah">
        <div className="angka"><strong>{s ? s.total_guru : '—'}</strong><span>Guru</span></div>
        <div className="angka"><strong>{s ? s.total_siswa : '—'}</strong><span>Siswa</span></div>
        <div className="angka"><strong>{s ? s.total_kelas : '—'}</strong><span>Rombongan Belajar</span></div>
        <div className="angka"><strong>{s ? s.total_mapel : '—'}</strong><span>Mata Pelajaran</span></div>
      </section>

      <section className="landing-isi blok-landing" id="fitur">
        <h2>Fitur Sistem</h2>
        <p className="penjelas">
          Setiap pengguna masuk dengan akunnya masing-masing dan memperoleh menu sesuai perannya.
        </p>
        <div className="kartu-fitur-grid">
          {FITUR.map((f) => (
            <article className="kartu-fitur" key={f.judul}>
              <div className="ikon">{f.ikon}</div>
              <h3>{f.judul}</h3>
              <p>{f.isi}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-isi blok-landing" id="alur">
        <h2>Alur Pembelajaran</h2>
        <p className="penjelas">
          Susunan pembelajaran pada sistem mengikuti alur yang sudah berjalan di sekolah.
        </p>
        <div className="alur-grid">
          {ALUR.map((a) => (
            <div className="alur-item" key={a.nomor}>
              <span className="nomor">{a.nomor}</span>
              <div>
                <h3>{a.judul}</h3>
                <p>{a.isi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-isi blok-landing" id="profil">
        <h2>Profil Sekolah</h2>
        <div className="profil-grid">
          <dl className="profil-identitas">
            <div><dt>Nama Sekolah</dt><dd>{sekolah?.nama || 'SMA Negeri 1 Karau Kuala'}</dd></div>
            <div><dt>NPSN</dt><dd>{sekolah?.npsn || '-'}</dd></div>
            <div><dt>NSS</dt><dd>{sekolah?.nss || '-'}</dd></div>
            <div><dt>Penyelenggara</dt><dd>{sekolah?.penyelenggara || '-'}</dd></div>
            <div><dt>Kepala Sekolah</dt><dd>{sekolah?.kepala_sekolah || '-'}</dd></div>
            <div><dt>Alamat</dt><dd>{sekolah?.alamat || '-'}</dd></div>
            <div><dt>Laman</dt><dd>{sekolah?.laman || '-'}</dd></div>
            <div><dt>Pos-el</dt><dd>{sekolah?.surel || '-'}</dd></div>
          </dl>
          <aside className="profil-ajakan">
            <h3>Sudah memiliki akun?</h3>
            <p>
              Akun guru dan siswa dibuatkan oleh administrator sekolah. Gunakan alamat surel dan
              kata sandi yang diberikan untuk masuk ke sistem.
            </p>
            <Link className="btn besar" to={user ? `/${user.role}` : '/login'}>
              {user ? 'Buka Dashboard' : 'Masuk ke Sistem'}
            </Link>
          </aside>
        </div>
      </section>

      <footer className="landing-kaki">
        <div className="landing-isi">
          <strong>SMA Negeri 1 Karau Kuala</strong>
          <span>{sekolah?.alamat}</span>
          <span className="muted">
            Sistem E-Learning Berbasis Web — Kabupaten Barito Selatan, Kalimantan Tengah
          </span>
        </div>
      </footer>
    </div>
  );
}
