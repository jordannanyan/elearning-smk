import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { RaportSiswa } from '../../api/types';

// ---------------------------------------------------------------------
// Raport sementara siswa: seluruh mata pelajaran yang diikutinya pada
// satu periode pembelajaran dirangkum menjadi satu lembar. Periode dapat
// diganti sehingga siswa juga dapat melihat raport pada kelas yang
// pernah diikutinya di periode sebelumnya.
// ---------------------------------------------------------------------
export default function RaportSiswaPage() {
  const [data, setData] = useState<RaportSiswa | null>(null);
  const [idPeriode, setIdPeriode] = useState('');
  const [muat, setMuat] = useState(true);

  useEffect(() => {
    setMuat(true);
    api.get('/raport/saya', { params: idPeriode ? { id_periode: idPeriode } : {} })
      .then((r) => {
        setData(r.data);
        if (!idPeriode && r.data.periode) setIdPeriode(String(r.data.periode.id_periode));
      })
      .finally(() => setMuat(false));
  }, [idPeriode]);

  if (muat && !data) return <p className="center-msg">Memuat raport...</p>;
  if (!data) return <p className="center-msg">Raport belum dapat ditampilkan.</p>;

  const r = data.ringkasan;

  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Raport Sementara</h2>
        <div className="pilih-periode">
          <select value={idPeriode} onChange={(e) => setIdPeriode(e.target.value)}>
            {data.daftar_periode.map((p) => (
              <option key={p.id_periode} value={p.id_periode}>
                {p.tahun_ajaran} {p.nama_semester} — Kelas {p.nama_kelas}
                {p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => window.print()}>🖨️ Cetak</button>
        </div>
      </div>

      <div className="notice info tanpa-cetak">
        <span className="ikon">📋</span>
        <div>
          Nilai di bawah ini merupakan <strong>rata-rata seluruh tugas dan kuis yang sudah dinilai
          guru</strong> pada tiap mata pelajaran, bukan nilai akhir semester. Nilai masih dapat
          berubah selama periode pembelajaran berjalan. Batas ketuntasan (KKM) sekolah adalah
          {' '}<strong>{data.kkm}</strong>.
        </div>
      </div>

      {!data.kelas ? <p className="center-msg">Anda belum terdaftar pada kelas mana pun.</p> : (
        <div className="lembar-raport">
          <div className="kepala-raport">
            <h3>RAPORT SEMENTARA</h3>
            <p>SMA Negeri 1 Karau Kuala</p>
            <table className="identitas-raport">
              <tbody>
                <tr>
                  <td>Nama</td><td>: {data.identitas?.nama}</td>
                  <td>Kelas</td><td>: {data.kelas.nama_kelas} (Tingkat {data.kelas.tingkat})</td>
                </tr>
                <tr>
                  <td>NIS</td><td>: {data.identitas?.nis || '-'}</td>
                  <td>Tahun Ajaran</td>
                  <td>: {data.kelas.tahun_ajaran} — Semester {data.kelas.nama_semester}</td>
                </tr>
                <tr>
                  <td>Wali Kelas</td><td>: {data.kelas.wali_kelas || '-'}</td>
                  <td>KKM</td><td>: {data.kkm}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="stats ringkas-raport">
            <div className="stat">
              <div className="num">{r?.rata_rata ?? '-'}</div>
              <div className="lbl">Rata-rata Keseluruhan</div>
            </div>
            <div className="stat">
              <div className="num">{r?.predikat.huruf}</div>
              <div className="lbl">Predikat — {r?.predikat.keterangan}</div>
            </div>
            <div className="stat">
              <div className="num">{r?.peringkat ?? '-'}</div>
              <div className="lbl">Peringkat dari {r?.jumlah_siswa} siswa</div>
            </div>
            <div className="stat">
              <div className="num">{r?.jumlah_mapel_tuntas}/{r?.jumlah_mapel_dinilai}</div>
              <div className="lbl">Mata Pelajaran Tuntas</div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="tabel-raport">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Guru Pengajar</th>
                  <th>Tugas Dinilai</th>
                  <th>Nilai</th>
                  <th>Predikat</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data.mapel.map((m, i) => (
                  <tr key={m.id_kelas_mapel}>
                    <td>{i + 1}</td>
                    <td>
                      {m.nama_mapel}
                      {m.kode_mapel && <span className="badge gray" style={{ marginLeft: 6 }}>{m.kode_mapel}</span>}
                    </td>
                    <td className="muted">{m.nama_guru || '-'}</td>
                    <td className="tengah muted">{m.jumlah_dinilai} dari {m.jumlah_tugas}</td>
                    <td className={`angka-nilai tebal ${m.rata_rata == null ? 'muted'
                      : m.rata_rata >= data.kkm ? 'tuntas' : 'belum'}`}>
                      {m.rata_rata ?? '-'}
                    </td>
                    <td className="tengah">
                      <span className={`badge ${m.predikat.huruf === '-' ? 'gray' : 'green'}`}>
                        {m.predikat.huruf}
                      </span>
                    </td>
                    <td className="muted">
                      {m.rata_rata == null ? 'Belum ada nilai'
                        : m.tuntas ? `Tuntas — ${m.predikat.keterangan}`
                          : 'Belum mencapai KKM'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="keterangan-raport">
            <div>
              <strong>Predikat</strong>
              <ul>
                <li>A — Sangat Baik (90–100)</li>
                <li>B — Baik (80–89)</li>
                <li>C — Cukup (70–79)</li>
                <li>D — Perlu Bimbingan (di bawah 70)</li>
              </ul>
            </div>
            <div>
              <strong>Catatan</strong>
              <p className="muted">
                Mata pelajaran yang belum memiliki nilai berarti belum ada tugas atau kuis yang
                dinilai oleh guru pada periode ini. Rincian nilai tiap tugas dapat dilihat pada
                menu <strong>Nilai</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
