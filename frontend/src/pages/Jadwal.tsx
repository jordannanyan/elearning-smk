import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import TabelJadwalSK from '../components/TabelJadwalSK';
import type { JadwalSaya, JadwalSekolah } from '../api/types';

// ---------------------------------------------------------------------
// Halaman jadwal mata pelajaran untuk guru dan siswa.
//   Tab "Jadwal Saya"    : jadwal kelas siswa, atau jadwal mengajar guru
//   Tab "Jadwal Sekolah" : seluruh kelas dengan susunan yang sama persis
//                          dengan jadwal resmi pada SK
// ---------------------------------------------------------------------
export default function Jadwal() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'saya' | 'sekolah'>('saya');
  const [saya, setSaya] = useState<JadwalSaya | null>(null);
  const [sekolah, setSekolah] = useState<JadwalSekolah | null>(null);
  const [muat, setMuat] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jadwal/saya').then((r) => setSaya(r.data)),
      api.get('/jadwal/sekolah').then((r) => setSekolah(r.data)),
    ]).finally(() => setMuat(false));
  }, []);

  if (muat) return <p className="center-msg">Memuat jadwal...</p>;

  const adaJadwal = (sekolah?.slot.length || 0) > 0;

  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Jadwal Mata Pelajaran</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="tab-pilih">
            <button className={tab === 'saya' ? 'aktif' : ''} onClick={() => setTab('saya')}>
              {user?.role === 'guru' ? 'Jadwal Mengajar Saya' : 'Jadwal Kelas Saya'}
            </button>
            <button className={tab === 'sekolah' ? 'aktif' : ''} onClick={() => setTab('sekolah')}>
              Jadwal Sekolah
            </button>
          </div>
          <button className="btn" onClick={() => window.print()} disabled={!adaJadwal}>
            🖨️ Cetak
          </button>
        </div>
      </div>

      {!adaJadwal && (
        <div className="notice info">
          <span className="ikon">🗓️</span>
          <div>
            Jadwal mata pelajaran belum tersedia pada periode pembelajaran ini. Jadwal dimuat dari
            berkas jadwal resmi sekolah ketika data sekolah diimpor ke dalam sistem.
          </div>
        </div>
      )}

      {adaJadwal && tab === 'saya' && saya && <JadwalSayaTab data={saya} />}
      {adaJadwal && tab === 'sekolah' && sekolah && (
        <JadwalSekolahTab data={sekolah} sorotKelas={saya?.milik?.jenis === 'kelas'
          ? saya.milik.nama : null} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Jadwal pribadi: daftar per hari, lengkap dengan jam dan guru/kelasnya
// ---------------------------------------------------------------------
function JadwalSayaTab({ data }: { data: JadwalSaya }) {
  if (!data.milik) {
    return <p className="center-msg">Anda belum memiliki jadwal pada periode pembelajaran ini.</p>;
  }

  const jamUmum = new Map(data.jam.umum.filter((j) => j.jenis === 'pelajaran')
    .map((j) => [j.jam_ke, j]));
  const jamJumat = new Map(data.jam.jumat.filter((j) => j.jenis === 'pelajaran')
    .map((j) => [j.jam_ke, j]));

  return (
    <div>
      <div className="notice info tanpa-cetak">
        <span className="ikon">🗓️</span>
        <div>
          {data.milik.jenis === 'kelas' ? (
            <>Jadwal pelajaran <strong>kelas {data.milik.nama}</strong> pada periode{' '}
              <strong>{data.periode?.kode}</strong> ({data.periode?.tahun_ajaran} semester{' '}
              {data.periode?.nama_semester}). Wali kelas: {data.milik.wali_kelas || '-'}.</>
          ) : (
            <>Jadwal mengajar <strong>{data.milik.nama}</strong> (kode guru{' '}
              <strong>{data.milik.kode_jadwal}</strong>) pada periode{' '}
              <strong>{data.periode?.kode}</strong>, seluruhnya{' '}
              <strong>{data.milik.jumlah_jam} jam pelajaran</strong> per minggu.</>
          )}
        </div>
      </div>

      <div className="jadwal-saya-grid">
        {data.hari.map((nama, i) => {
          const hariKe = i + 1;
          const isi = data.slot.filter((s) => s.hari === hariKe);
          const petaJam = hariKe === 5 ? jamJumat : jamUmum;
          return (
            <section className="kartu-hari" key={nama}>
              <h3>{nama}</h3>
              {isi.length === 0 ? <p className="muted kosong">Tidak ada jadwal</p> : (
                <ul>
                  {isi.map((s) => {
                    const j = petaJam.get(s.jam_ke);
                    return (
                      <li key={s.id} className={s.kegiatan ? 'kegiatan' : ''}>
                        <span className="jam">
                          <strong>{s.jam_ke}</strong>
                          {j && <small>{j.mulai}–{j.selesai}</small>}
                        </span>
                        <span className="isi">
                          <span className="nama">{s.nama_mapel || s.kegiatan}</span>
                          <span className="ket">
                            {s.kode && <span className="badge gray">{s.kode}</span>}{' '}
                            {data.milik?.jenis === 'kelas'
                              ? (s.nama_guru || (s.kegiatan ? 'Kegiatan sekolah' : '-'))
                              : `Kelas ${s.nama_kelas}`}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Jadwal sekolah dalam format yang sama dengan SK
// ---------------------------------------------------------------------
function JadwalSekolahTab({ data, sorotKelas }: { data: JadwalSekolah; sorotKelas: string | null }) {
  const { user } = useAuth();

  return (
    <div className="lembar-jadwal">
      <div className="kepala-jadwal">
        <h3>JADWAL MATA PELAJARAN SEMESTER {data.periode?.semester === 1 ? 'I (SATU)' : 'II (DUA)'}</h3>
        <p>{data.sekolah}</p>
        <p className="muted">TAHUN AJARAN : {data.periode?.tahun_ajaran}</p>
      </div>

      {data.hari.map((nama, i) => (
        <TabelJadwalSK
          key={nama}
          hari={nama}
          kelas={data.kelas}
          jam={i + 1 === 5 ? data.jam.jumat : data.jam.umum}
          slot={data.slot.filter((s) => s.hari === i + 1)}
          sorotKelas={user?.role === 'siswa' ? sorotKelas : null}
        />
      ))}

      <div className="legenda-jadwal">
        <section>
          <h4>KODE GURU</h4>
          <ol className="kode-guru">
            {data.kode_guru.map((g) => (
              <li key={g.nomor}><span className="no">{g.nomor}</span> {g.nama}</li>
            ))}
          </ol>
        </section>
        <section>
          <h4>KODE MATA PELAJARAN</h4>
          <ul className="kode-mapel">
            {data.kode_mapel.map((m) => (
              <li key={m.kode}><span className="badge gray">{m.kode}</span> {m.nama}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>KETERANGAN</h4>
          <p className="muted" style={{ lineHeight: 1.8, marginBottom: 14 }}>
            Kode sel disusun dari huruf mata pelajaran dan nomor guru, misalnya{' '}
            <strong>E16</strong> berarti MATEMATIKA [U] yang diajar guru bernomor 16. Sel yang
            hanya berisi angka merupakan jam <strong>P5</strong> (Projek Penguatan Profil Pelajar
            Pancasila) dengan guru pendamping bernomor tersebut.
          </p>
          <h4>WAKTU SEKOLAH</h4>
          <table className="tabel-waktu">
            <tbody>
              {data.jam.umum.map((j, idx) => (
                <tr key={idx} className={j.jenis !== 'pelajaran' ? 'istirahat' : ''}>
                  <td>{j.jenis === 'pelajaran' ? j.jam_ke : '—'}</td>
                  <td>{j.mulai}–{j.selesai}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 style={{ marginTop: 12 }}>*) KHUSUS HARI JUM&apos;AT</h4>
          <table className="tabel-waktu">
            <tbody>
              {data.jam.jumat.map((j, idx) => (
                <tr key={idx} className={j.jenis !== 'pelajaran' ? 'istirahat' : ''}>
                  <td>{j.jenis === 'pelajaran' ? j.jam_ke
                    : j.jenis === 'jumatan' ? "JUM'ATAN" : '—'}</td>
                  <td>{j.mulai}–{j.selesai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
