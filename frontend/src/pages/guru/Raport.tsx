import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { KelasRaport, RaportKelas } from '../../api/types';

// ---------------------------------------------------------------------
// Raport sementara per kelas.
//
// Disebut sementara karena nilainya dihitung dari tugas dan kuis yang
// sudah dinilai sampai saat halaman dibuka, bukan nilai akhir semester.
// Guru dapat membuka kelas yang diajarnya maupun kelas yang diwalikannya,
// sehingga wali kelas dapat memantau seluruh mata pelajaran kelasnya.
// ---------------------------------------------------------------------
export default function RaportGuru() {
  const [kelas, setKelas] = useState<KelasRaport[]>([]);
  const [pilih, setPilih] = useState<number | null>(null);
  const [data, setData] = useState<RaportKelas | null>(null);
  const [muat, setMuat] = useState(true);
  const [muatRaport, setMuatRaport] = useState(false);

  useEffect(() => {
    api.get('/raport/kelas').then((r) => {
      setKelas(r.data);
      setMuat(false);
    });
  }, []);

  useEffect(() => {
    if (!pilih) return;
    setMuatRaport(true);
    api.get(`/raport/kelas/${pilih}`)
      .then((r) => setData(r.data))
      .finally(() => setMuatRaport(false));
  }, [pilih]);

  function warnaNilai(n: number | null, kkm: number) {
    if (n == null) return 'muted';
    return n >= kkm ? 'tuntas' : 'belum';
  }

  // ----- Daftar kelas -----
  if (!pilih) {
    return (
      <div>
        <div className="page-head">
          <h2>Raport Sementara</h2>
        </div>

        <div className="notice info">
          <span className="ikon">📋</span>
          <div>
            Raport sementara merangkum nilai <strong>seluruh tugas dan kuis yang sudah dinilai</strong>
            {' '}sampai saat ini menjadi nilai rata-rata per mata pelajaran. Nilai ini bersifat
            sementara dan akan terus berubah selama periode pembelajaran masih berjalan. Pilih kelas
            untuk melihat raport seluruh siswanya.
          </div>
        </div>

        {muat ? <p className="center-msg">Memuat...</p>
          : kelas.length === 0
            ? <p className="center-msg">Anda belum ditugaskan mengajar atau menjadi wali kelas.</p>
            : (
              <div className="kartu-grid">
                {kelas.map((k) => (
                  <article className="kartu-ringkas" key={k.id}>
                    <div>
                      <span className={`badge ${k.status_periode === 'aktif' ? 'green' : 'gray'}`}>
                        {k.kode} · {k.nama_semester}
                      </span>
                      {k.wali_kelas && <span className="badge biru" style={{ marginLeft: 6 }}>👤 Wali Kelas</span>}
                    </div>
                    <h3>Kelas {k.nama_kelas}</h3>
                    <div className="sub">
                      {k.mapel_diajar
                        ? <>Anda mengajar: {k.mapel_diajar}</>
                        : <>Anda wali kelas ini</>}
                    </div>
                    <div className="angka-baris">
                      <div><strong>{k.jumlah_siswa}</strong>Siswa</div>
                      <div><strong>{k.jumlah_mapel}</strong>Mata Pelajaran</div>
                    </div>
                    <div className="kaki">
                      <button className="btn small" onClick={() => setPilih(k.id)}>
                        Lihat Raport Sementara
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
      </div>
    );
  }

  // ----- Raport satu kelas -----
  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Raport Sementara</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn secondary" onClick={() => { setPilih(null); setData(null); }}>
            ← Pilih Kelas Lain
          </button>
          <button className="btn" onClick={() => window.print()} disabled={!data}>🖨️ Cetak</button>
        </div>
      </div>

      {muatRaport || !data ? <p className="center-msg">Memuat raport...</p> : (
        <div className="lembar-raport">
          <div className="kepala-raport">
            <h3>RAPORT SEMENTARA</h3>
            <p>SMA Negeri 1 Karau Kuala</p>
            <table className="identitas-raport">
              <tbody>
                <tr>
                  <td>Kelas</td><td>: {data.kelas.nama_kelas} (Tingkat {data.kelas.tingkat})</td>
                  <td>Tahun Ajaran</td><td>: {data.kelas.tahun_ajaran}</td>
                </tr>
                <tr>
                  <td>Wali Kelas</td><td>: {data.kelas.wali_kelas || '-'}</td>
                  <td>Semester</td>
                  <td>: {data.kelas.nama_semester} ({data.kelas.kode})</td>
                </tr>
                <tr>
                  <td>Jumlah Siswa</td><td>: {data.siswa.length} siswa</td>
                  <td>KKM</td><td>: {data.kkm}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-wrap">
            <table className="tabel-raport">
              <thead>
                <tr>
                  <th className="lekat">No</th>
                  <th className="lekat nama">Nama Siswa</th>
                  <th>NIS</th>
                  {data.mapel.map((m) => (
                    <th key={m.id_kelas_mapel} className="tegak" title={`${m.nama_mapel} — ${m.nama_guru || 'belum ada guru'}`}>
                      {m.kode_mapel || m.nama_mapel}
                    </th>
                  ))}
                  <th>Rata-rata</th><th>Predikat</th><th>Peringkat</th>
                </tr>
              </thead>
              <tbody>
                {data.siswa.map((s, i) => (
                  <tr key={s.id_siswa}>
                    <td className="lekat">{i + 1}</td>
                    <td className="lekat nama">{s.nama}</td>
                    <td className="muted">{s.nis || '-'}</td>
                    {data.mapel.map((m) => {
                      const n = s.nilai[m.id_kelas_mapel];
                      const v = n ? n.rata_rata : null;
                      return (
                        <td key={m.id_kelas_mapel} className={`angka-nilai ${warnaNilai(v, data.kkm)}`}>
                          {v ?? '-'}
                        </td>
                      );
                    })}
                    <td className={`angka-nilai tebal ${warnaNilai(s.rata_rata, data.kkm)}`}>
                      {s.rata_rata ?? '-'}
                    </td>
                    <td className="tengah">
                      <span className={`badge ${s.predikat.huruf === '-' ? 'gray' : 'green'}`}>
                        {s.predikat.huruf}
                      </span>
                    </td>
                    <td className="tengah">{s.peringkat ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="keterangan-raport">
            <div>
              <strong>Keterangan kode mata pelajaran</strong>
              <ul>
                {data.mapel.map((m) => (
                  <li key={m.id_kelas_mapel}>
                    <span className="badge gray">{m.kode_mapel || '-'}</span> {m.nama_mapel}
                    <span className="muted"> — {m.nama_guru || 'belum ada guru'}
                      {' '}({m.jumlah_tugas} tugas)</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Predikat</strong>
              <ul>
                <li>A — Sangat Baik (90–100)</li>
                <li>B — Baik (80–89)</li>
                <li>C — Cukup (70–79)</li>
                <li>D — Perlu Bimbingan (di bawah 70)</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>
                Tanda “-” berarti belum ada tugas yang dinilai pada mata pelajaran tersebut.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
