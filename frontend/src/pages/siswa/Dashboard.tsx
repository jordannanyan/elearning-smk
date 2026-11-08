import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { JadwalDashboardSiswa } from '../../api/types';

// ---------------------------------------------------------------------
// Dashboard siswa.
//
// Susunannya mengikuti urutan kebutuhan siswa ketika membuka sistem:
// ringkasan angka mata pelajaran dan tugas lebih dahulu, lalu sapaan
// beserta keterangan kelas, kemudian jadwal pelajaran hari Senin sampai
// Jum'at sehingga siswa mengetahui mata pelajaran apa saja yang
// ditempuhnya pada setiap hari, dan terakhir tugas yang tenggatnya
// segera berakhir.
// ---------------------------------------------------------------------
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

  const jadwal: JadwalDashboardSiswa | null = d.jadwal || null;

  return (
    <div>
      <div className="page-head"><h2>Dashboard Siswa</h2></div>

      <div className="stats">
        {kartu.map(([lbl, num]) => (
          <div className="stat" key={lbl as string}>
            <div className="num">{num ?? 0}</div>
            <div className="lbl">{lbl}</div>
          </div>
        ))}
      </div>

      <div className="card kartu-sapaan">
        <h3>Halo, {user?.nama} 👋</h3>
        {d.periode ? (
          <p className="muted">
            {d.kelas && <>Anda terdaftar di kelas <strong>{d.kelas.nama_kelas}</strong> pada </>}
            periode <strong>{d.periode.kode}</strong> — Tahun Ajaran {d.periode.tahun_ajaran}{' '}
            semester {d.periode.semester === 1 ? 'ganjil' : 'genap'}.
          </p>
        ) : (
          <p className="muted">Belum ada periode pembelajaran yang aktif.</p>
        )}
        <p className="muted">
          Buka menu <strong>Kelas Saya</strong> untuk mempelajari materi setiap mata pelajaran.
          Materi tersusun per pertemuan sehingga Anda dapat belajar secara runut: membaca uraian
          materi, mengunduh berkas, menonton video, mengerjakan tugas, lalu berdiskusi bersama
          guru dan teman pada forum pertemuan tersebut.
        </p>
      </div>

      {/* Jadwal pelajaran per hari */}
      <div className="blok">
        <div className="kepala">
          <span>🗓️ Jadwal Pelajaran Saya</span>
          <Link className="btn small" to="/siswa/jadwal">Lihat Jadwal Lengkap</Link>
        </div>
        <div className="badan">
          {!jadwal || jadwal.hari.every((h) => h.pelajaran.length === 0) ? (
            <p className="muted center-msg" style={{ padding: '10px 0' }}>
              Jadwal pelajaran belum tersedia pada periode pembelajaran ini.
            </p>
          ) : (
            <div className="jadwal-saya-grid ringkas">
              {jadwal.hari.map((h) => (
                <section className={`kartu-hari${jadwal.hari_ini === h.hari ? ' hari-ini' : ''}`}
                  key={h.hari}>
                  <h3>
                    {h.nama_hari}
                    {jadwal.hari_ini === h.hari && <span className="badge green">Hari ini</span>}
                  </h3>
                  {h.pelajaran.length === 0 ? (
                    <p className="muted kosong">Tidak ada jadwal</p>
                  ) : (
                    <ul>
                      {h.pelajaran.map((p, i) => (
                        <li key={i} className={p.kegiatan ? 'kegiatan' : ''}>
                          <span className="jam">
                            <strong>
                              {p.jam_dari}{p.jam_sampai > p.jam_dari && `–${p.jam_sampai}`}
                            </strong>
                            {p.mulai && <small>{p.mulai}–{p.selesai}</small>}
                          </span>
                          <span className="isi">
                            <span className="nama">{p.nama}</span>
                            <span className="ket">
                              {p.nama_guru
                                || (p.guru_bergantian ? 'Guru pendamping bergantian'
                                  : p.kegiatan ? 'Kegiatan sekolah' : '-')}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tugas yang segera berakhir diletakkan paling bawah */}
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
                  {/* Mata pelajaran ditulis paling menonjol, karena itulah
                      yang pertama dicari siswa; judul penilaiannya menyusul
                      di bawahnya sebagai keterangan. */}
                  <div className="judul">{t.nama_mapel}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                    {t.judul} · Batas waktu{' '}
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
    </div>
  );
}
