import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import type { RekapPresensiSiswa, StatusKehadiran } from '../../api/types';

// ---------------------------------------------------------------------
// Rekap kehadiran siswa pada seluruh mata pelajaran di periode berjalan.
// Pengisian kehadiran sendiri dilakukan pada halaman pertemuan, halaman
// ini merangkum hasilnya.
// ---------------------------------------------------------------------
const WARNA: Record<StatusKehadiran, string> = {
  hadir: 'green', sakit: 'orange', izin: 'biru', alpa: 'red',
};

export default function PresensiSiswa() {
  const [data, setData] = useState<RekapPresensiSiswa | null>(null);
  const [muat, setMuat] = useState(true);
  const [buka, setBuka] = useState<number | null>(null);

  useEffect(() => {
    api.get('/presensi/saya').then((r) => setData(r.data)).finally(() => setMuat(false));
  }, []);

  if (muat) return <p className="center-msg">Memuat rekap kehadiran...</p>;
  const r = data?.ringkasan;

  return (
    <div>
      <div className="page-head"><h2>Presensi Kehadiran</h2></div>

      <div className="notice info">
        <span className="ikon">📋</span>
        <div>
          Kehadiran dicatat per pertemuan. Ketika guru membuka presensi, Anda menyatakan hadir
          melalui tombol <strong>Saya Hadir</strong> pada halaman pertemuan. Siswa yang belum
          menyatakan hadir sampai presensi ditutup akan tercatat <strong>alpa</strong>.
        </div>
      </div>

      {!data || data.mapel.length === 0 ? (
        <p className="center-msg">Belum ada presensi yang dibuka guru pada periode ini.</p>
      ) : (
        <>
          <div className="stats">
            <div className="stat"><div className="num">{r?.persen_hadir ?? '-'}%</div>
              <div className="lbl">Persentase Kehadiran</div></div>
            <div className="stat"><div className="num">{r?.hadir}</div>
              <div className="lbl">Hadir dari {r?.pertemuan} pertemuan</div></div>
            <div className="stat"><div className="num">{(r?.sakit || 0) + (r?.izin || 0)}</div>
              <div className="lbl">Sakit / Izin</div></div>
            <div className="stat"><div className="num">{r?.alpa}</div>
              <div className="lbl">Alpa</div></div>
          </div>

          {data.mapel.map((m) => (
            <div className="nilai-mapel" key={m.id_kelas_mapel}>
              <div className="kepala" style={{ cursor: 'pointer' }}
                onClick={() => setBuka(buka === m.id_kelas_mapel ? null : m.id_kelas_mapel)}>
                <div>
                  <strong>{m.nama_mapel}</strong>
                  {m.kode_mapel && <span className="badge gray" style={{ marginLeft: 6 }}>{m.kode_mapel}</span>}
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    {m.nama_guru || '-'} · {m.jumlah_pertemuan} pertemuan berpresensi
                  </div>
                </div>
                <div className="rata">
                  <div className="angka">{m.persen_hadir ?? '-'}%</div>
                  <div className="lbl">
                    H{m.hadir} S{m.sakit} I{m.izin} A{m.alpa}
                    {m.belum ? ` · ${m.belum} belum` : ''}
                  </div>
                </div>
              </div>

              {buka === m.id_kelas_mapel && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th style={{ width: 70 }}>Pertemuan</th><th>Judul</th>
                        <th>Tanggal</th><th>Status Presensi</th><th>Kehadiran</th><th>Keterangan</th></tr>
                    </thead>
                    <tbody>
                      {m.pertemuan.map((p) => (
                        <tr key={p.id_pertemuan}>
                          <td>{p.nomor}</td>
                          <td>
                            <Link to={`/siswa/pertemuan/${p.id_pertemuan}`}>{p.judul}</Link>
                          </td>
                          <td className="muted">{p.tanggal || '-'}</td>
                          <td>
                            <span className={`badge ${p.status_presensi === 'dibuka' ? 'green' : 'gray'}`}>
                              {p.status_presensi === 'dibuka' ? 'Dibuka' : 'Ditutup'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${p.kehadiran ? WARNA[p.kehadiran] : 'gray'}`}>
                              {p.label}
                            </span>
                          </td>
                          <td className="muted">{p.keterangan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
