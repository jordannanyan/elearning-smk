import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { KelasMapel, RekapPresensiKelas, StatusKehadiran } from '../../api/types';

// ---------------------------------------------------------------------
// Rekap presensi untuk guru: dipilih per mata pelajaran yang diampu,
// lalu ditampilkan sebagai matriks siswa terhadap pertemuan.
// Pengisian kehadirannya sendiri dilakukan pada halaman pertemuan.
// ---------------------------------------------------------------------
const HURUF: Record<StatusKehadiran, string> = { hadir: 'H', sakit: 'S', izin: 'I', alpa: 'A' };
const WARNA: Record<StatusKehadiran, string> = {
  hadir: 'hadir', sakit: 'sakit', izin: 'izin', alpa: 'alpa',
};

export default function PresensiGuru() {
  const [daftar, setDaftar] = useState<KelasMapel[]>([]);
  const [pilih, setPilih] = useState<number | null>(null);
  const [data, setData] = useState<RekapPresensiKelas | null>(null);
  const [muat, setMuat] = useState(true);
  const [muatRekap, setMuatRekap] = useState(false);

  useEffect(() => {
    api.get('/kelas-mapel').then((r) => setDaftar(r.data)).finally(() => setMuat(false));
  }, []);

  useEffect(() => {
    if (!pilih) return;
    setMuatRekap(true);
    api.get(`/presensi/kelas-mapel/${pilih}`)
      .then((r) => setData(r.data))
      .finally(() => setMuatRekap(false));
  }, [pilih]);

  if (muat) return <p className="center-msg">Memuat...</p>;

  if (!pilih) {
    return (
      <div>
        <div className="page-head"><h2>Presensi Kehadiran</h2></div>
        <div className="notice info">
          <span className="ikon">📋</span>
          <div>
            Presensi dibuka dan ditutup pada halaman pertemuan. Halaman ini merangkum kehadiran
            seluruh siswa pada setiap pertemuan yang presensinya sudah dibuka. Pilih mata pelajaran
            untuk melihat rekapnya.
          </div>
        </div>

        {daftar.length === 0 ? (
          <p className="center-msg">Anda belum mengampu mata pelajaran pada periode berjalan.</p>
        ) : (
          <div className="kartu-grid">
            {daftar.map((km) => (
              <article className="kartu-ringkas" key={km.id}>
                <div><span className="badge gray">{km.kode_mapel || '-'}</span></div>
                <h3>{km.nama_mapel}</h3>
                <div className="sub">Kelas {km.nama_kelas} · {km.kode_periode}</div>
                <div className="angka-baris">
                  <div><strong>{km.jumlah_siswa ?? '-'}</strong>Siswa</div>
                  <div><strong>{km.jumlah_pertemuan ?? '-'}</strong>Pertemuan</div>
                </div>
                <div className="kaki">
                  <button className="btn small" onClick={() => setPilih(km.id)}>
                    Lihat Rekap Presensi
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Rekap Presensi</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn secondary" onClick={() => { setPilih(null); setData(null); }}>
            ← Pilih Mata Pelajaran Lain
          </button>
          <button className="btn" onClick={() => window.print()} disabled={!data}>🖨️ Cetak</button>
        </div>
      </div>

      {muatRekap || !data ? <p className="center-msg">Memuat rekap...</p> : (
        <div className="lembar-raport">
          <div className="kepala-raport">
            <h3>REKAP PRESENSI KEHADIRAN</h3>
            <p>{data.kelas_mapel.nama_mapel} — Kelas {data.kelas_mapel.nama_kelas}</p>
            <p className="muted">SMA Negeri 1 Karau Kuala</p>
          </div>

          {data.pertemuan.filter((p) => p.id_presensi).length === 0 ? (
            <p className="center-msg">
              Belum ada pertemuan yang presensinya dibuka pada mata pelajaran ini.
            </p>
          ) : (
            <>
              <div className="table-wrap">
                <table className="tabel-raport">
                  <thead>
                    <tr>
                      <th className="lekat">No</th>
                      <th className="lekat nama">Nama Siswa</th>
                      <th>NIS</th>
                      {data.pertemuan.map((p) => (
                        <th key={p.id} className="tegak"
                          title={`Pertemuan ${p.nomor}: ${p.judul}`}>
                          P{p.nomor}
                        </th>
                      ))}
                      <th>H</th><th>S</th><th>I</th><th>A</th><th>% Hadir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.siswa.map((s, i) => (
                      <tr key={s.id_siswa}>
                        <td className="lekat">{i + 1}</td>
                        <td className="lekat nama">{s.nama}</td>
                        <td className="muted">{s.nis || '-'}</td>
                        {data.pertemuan.map((p) => {
                          const st = s.kehadiran[p.id];
                          return (
                            <td key={p.id} className={`sel-hadir ${st ? WARNA[st] : ''}`}>
                              {st ? HURUF[st] : '-'}
                            </td>
                          );
                        })}
                        <td className="tengah">{s.hadir}</td>
                        <td className="tengah">{s.sakit}</td>
                        <td className="tengah">{s.izin}</td>
                        <td className="tengah">{s.alpa}</td>
                        <td className={`angka-nilai tebal ${(s.persen_hadir ?? 0) >= 75 ? 'tuntas' : 'belum'}`}>
                          {s.persen_hadir ?? '-'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="keterangan-raport">
                <div>
                  <strong>Keterangan pertemuan</strong>
                  <ul>
                    {data.pertemuan.map((p) => (
                      <li key={p.id}>
                        <span className="badge gray">P{p.nomor}</span> {p.judul}
                        <span className="muted">
                          {' '}— {p.id_presensi
                            ? `presensi ${p.status}${p.tanggal ? `, ${p.tanggal}` : ''}`
                            : 'presensi belum dibuka'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Keterangan kehadiran</strong>
                  <ul>
                    <li>H — Hadir</li>
                    <li>S — Sakit</li>
                    <li>I — Izin</li>
                    <li>A — Alpa (tanpa keterangan)</li>
                    <li>- — Presensi pertemuan belum dibuka</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
