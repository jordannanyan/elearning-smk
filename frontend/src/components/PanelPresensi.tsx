import { useEffect, useState } from 'react';
import api from '../api/client';
import type { PresensiPertemuan, StatusKehadiran } from '../api/types';

// ---------------------------------------------------------------------
// Panel presensi pada sebuah pertemuan.
//   Guru  : membuka presensi, menetapkan keterangan sakit/izin/alpa,
//           lalu menutup presensi.
//   Siswa : menyatakan hadir selama presensi masih dibuka.
// ---------------------------------------------------------------------
const WARNA: Record<StatusKehadiran, string> = {
  hadir: 'green', sakit: 'orange', izin: 'biru', alpa: 'red',
};
const PILIHAN: StatusKehadiran[] = ['hadir', 'sakit', 'izin', 'alpa'];

export default function PanelPresensi({ idPertemuan, peran, terkunci }: {
  idPertemuan: number;
  peran: 'guru' | 'siswa';
  terkunci?: boolean;
}) {
  const [data, setData] = useState<PresensiPertemuan | null>(null);
  const [muat, setMuat] = useState(true);
  const [sibuk, setSibuk] = useState(false);
  const [cari, setCari] = useState('');

  async function load() {
    const { data: d } = await api.get(`/pertemuan/${idPertemuan}/presensi`);
    setData(d);
    setMuat(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [idPertemuan]);

  async function jalankan(aksi: () => Promise<any>, pesanSukses?: string) {
    setSibuk(true);
    try {
      await aksi();
      if (pesanSukses) alert(pesanSukses);
      await load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Tindakan gagal dijalankan');
    } finally { setSibuk(false); }
  }

  if (muat) return <div className="blok"><div className="badan muted">Memuat presensi...</div></div>;
  if (!data) return null;

  const pr = data.presensi;
  const r = data.ringkasan;

  // ---------------- Tampilan siswa ----------------
  if (peran === 'siswa') {
    return (
      <div className="blok">
        <div className="kepala"><strong>📋 Presensi Kehadiran</strong>
          {pr && <span className={`badge ${pr.status === 'dibuka' ? 'green' : 'gray'}`}>
            {pr.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}</span>}
        </div>
        <div className="badan">
          {!pr ? (
            <p className="muted">Guru belum membuka presensi untuk pertemuan ini.</p>
          ) : (
            <>
              <div className="presensi-saya">
                <div>
                  <div className="muted" style={{ fontSize: 12.5 }}>Status kehadiran Anda</div>
                  <div className="status-besar">
                    <span className={`badge ${data.saya?.status ? WARNA[data.saya.status] : 'gray'}`}>
                      {data.saya?.label || 'Belum mengisi'}
                    </span>
                  </div>
                  {data.saya?.keterangan && (
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                      Keterangan guru: {data.saya.keterangan}
                    </div>
                  )}
                </div>
                {pr.status === 'dibuka' && data.saya?.status !== 'hadir' && !terkunci && (
                  <button className="btn" disabled={sibuk}
                    onClick={() => jalankan(() => api.post(`/presensi/${pr.id}/hadir`),
                      'Kehadiran Anda berhasil dicatat.')}>
                    ✋ Saya Hadir
                  </button>
                )}
              </div>

              <div className="rekap-presensi">
                <div><strong>{r?.hadir}</strong>Hadir</div>
                <div><strong>{r?.sakit}</strong>Sakit</div>
                <div><strong>{r?.izin}</strong>Izin</div>
                <div><strong>{r?.alpa}</strong>Alpa</div>
                <div><strong>{r?.belum}</strong>Belum Mengisi</div>
              </div>
              <p className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>
                Presensi dibuka oleh {pr.nama_guru || 'guru pengajar'}
                {pr.status === 'ditutup' && ' dan sudah ditutup'}. Apabila Anda berhalangan hadir,
                sampaikan kepada guru agar dicatat sebagai sakit atau izin.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------------- Tampilan guru ----------------
  const daftar = data.daftar.filter((d) =>
    !cari || d.nama.toLowerCase().includes(cari.toLowerCase())
    || (d.nis || '').includes(cari));

  return (
    <div className="blok">
      <div className="kepala">
        <strong>📋 Presensi Kehadiran</strong>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {pr && <span className={`badge ${pr.status === 'dibuka' ? 'green' : 'gray'}`}>
            {pr.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}</span>}
          {!terkunci && (!pr || pr.status === 'ditutup') && (
            <button className="btn small" disabled={sibuk}
              onClick={() => jalankan(() => api.post(`/pertemuan/${idPertemuan}/presensi`),
                pr ? 'Presensi dibuka kembali.' : 'Presensi berhasil dibuka.')}>
              {pr ? 'Buka Kembali' : 'Buka Presensi'}
            </button>
          )}
          {!terkunci && pr?.status === 'dibuka' && (
            <button className="btn small" disabled={sibuk}
              onClick={() => {
                if (!confirm('Tutup presensi?\n\nSiswa yang belum menyatakan hadir akan '
                  + 'tercatat alpa dan tidak dapat mengisi presensi lagi.')) return;
                jalankan(() => api.post(`/presensi/${pr.id}/tutup`));
              }}>
              Tutup Presensi
            </button>
          )}
        </div>
      </div>

      <div className="badan">
        {!pr ? (
          <p className="muted">
            Presensi belum dibuka. Tekan <strong>Buka Presensi</strong> agar siswa dapat
            menyatakan kehadirannya pada pertemuan ini.
          </p>
        ) : (
          <>
            <div className="rekap-presensi">
              <div><strong>{r?.hadir}</strong>Hadir</div>
              <div><strong>{r?.sakit}</strong>Sakit</div>
              <div><strong>{r?.izin}</strong>Izin</div>
              <div><strong>{r?.alpa}</strong>Alpa</div>
              <div><strong>{r?.belum}</strong>Belum Mengisi</div>
              <div><strong>{r?.persen_hadir}%</strong>Kehadiran</div>
            </div>

            <input placeholder="Cari nama / NIS siswa..." value={cari} style={{ margin: '12px 0' }}
              onChange={(e) => setCari(e.target.value)} />

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th style={{ width: 40 }}>No</th><th>Nama Siswa</th><th>NIS</th>
                    <th>Status</th><th>Keterangan</th></tr>
                </thead>
                <tbody>
                  {daftar.map((d, i) => (
                    <tr key={d.id_siswa}>
                      <td>{i + 1}</td>
                      <td>{d.nama}</td>
                      <td className="muted">{d.nis || '-'}</td>
                      <td>
                        {terkunci ? (
                          <span className={`badge ${d.status ? WARNA[d.status] : 'gray'}`}>{d.label}</span>
                        ) : (
                          <select className={`pilih-status ${d.status === 'hadir' ? 'aktif' : 'nonaktif'}`}
                            value={d.status || ''} disabled={sibuk}
                            onChange={(e) => jalankan(() => api.put(
                              `/presensi/${pr.id}/siswa/${d.id_siswa}`,
                              { status: e.target.value, keterangan: d.keterangan }))}>
                            {!d.status && <option value="">Belum mengisi</option>}
                            {PILIHAN.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="muted">
                        {d.keterangan || (d.dicatat_oleh === 'siswa' ? 'Diisi sendiri oleh siswa' : '-')}
                      </td>
                    </tr>
                  ))}
                  {daftar.length === 0 && (
                    <tr><td colSpan={5} className="center-msg">Tidak ada siswa yang cocok</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
