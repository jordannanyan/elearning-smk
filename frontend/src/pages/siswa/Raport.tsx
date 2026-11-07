import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import type { RaportSiswa } from '../../api/types';

// ---------------------------------------------------------------------
// Raport sementara siswa: seluruh mata pelajaran yang diikutinya pada
// satu periode pembelajaran dirangkum menjadi satu lembar.
//
// Angka pada kolom nilai adalah NILAI AKHIR, yaitu jumlah nilai tiap
// penilaian (tugas, kuis, UTS, UAS) dikalikan bobotnya dibagi seluruh
// bobot penilaian, bukan rata-rata. Penilaian yang belum dinilai
// dihitung nol sehingga nilai akhir baru mencapai angka sebenarnya
// setelah seluruh penilaian selesai. Status menerangkan tercapai atau
// tidaknya KKM, sedangkan predikat menerangkan mutu capaiannya.
// ---------------------------------------------------------------------
export default function RaportSiswaPage() {
  const [data, setData] = useState<RaportSiswa | null>(null);
  const [idPeriode, setIdPeriode] = useState('');
  const [cariMapel, setCariMapel] = useState('');
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState('');
  // Dinaikkan untuk memuat ulang data tanpa menyegarkan seluruh halaman
  const [muatUlang, setMuatUlang] = useState(0);

  useEffect(() => {
    setMuat(true);
    setGalat('');
    api.get('/raport/saya', { params: idPeriode ? { id_periode: idPeriode } : {} })
      .then((r) => {
        setData(r.data);
        if (!idPeriode && r.data.periode) setIdPeriode(String(r.data.periode.id_periode));
      })
      .catch((e) => setGalat(e.response?.data?.message
        || 'Data raport gagal dimuat. Periksa sambungan Anda, lalu coba lagi.'))
      .finally(() => setMuat(false));
  }, [idPeriode, muatUlang]);

  const tampil = useMemo(
    () => (data?.mapel || []).filter((m) => !cariMapel
      || String(m.id_kelas_mapel) === cariMapel),
    [data, cariMapel],
  );

  if (muat && !data) return <p className="center-msg">Memuat raport...</p>;

  // Kegagalan memuat dibedakan dari keadaan "belum ada data", dan selalu
  // disertai tombol coba lagi supaya halaman tidak tersangkut ketika
  // sambungan ke server sempat terputus.
  if (!data) {
    return (
      <div>
        <div className="page-head"><h2>Raport Sementara</h2></div>
        <div className="notice bahaya">
          <span className="ikon">⚠️</span>
          <div style={{ flex: 1 }}>{galat || 'Raport belum dapat ditampilkan.'}</div>
          <button className="btn small" onClick={() => setMuatUlang((n) => n + 1)}>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const r = data.ringkasan;

  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Raport Sementara</h2>
        <div className="pilih-periode">
          <select value={idPeriode} onChange={(e) => { setIdPeriode(e.target.value); setCariMapel(''); }}>
            {data.daftar_periode.map((p) => (
              <option key={p.id_periode} value={p.id_periode}>
                {p.tahun_ajaran} {p.nama_semester} — Kelas {p.nama_kelas}
                {p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
          <select value={cariMapel} onChange={(e) => setCariMapel(e.target.value)}
            style={{ minWidth: 220 }}>
            <option value="">Semua Mata Pelajaran ({data.mapel.length})</option>
            {data.mapel.map((m) => (
              <option key={m.id_kelas_mapel} value={m.id_kelas_mapel}>{m.nama_mapel}</option>
            ))}
          </select>
          <button className="btn" onClick={() => window.print()}>🖨️ Cetak</button>
        </div>
      </div>

      <div className="notice info tanpa-cetak">
        <span className="ikon">📋</span>
        <div>
          <strong>Nilai akhir</strong> dihitung dari seluruh penilaian pada mata pelajaran
          tersebut — tugas, kuis, Ujian Tengah Semester, dan Ujian Akhir Semester — yang
          masing-masing dikalikan bobotnya, bukan dirata-ratakan. Penilaian yang{' '}
          <strong>belum dinilai dihitung nol</strong>, sehingga nilai akhir akan naik seiring
          bertambahnya penilaian yang Anda selesaikan. Batas ketuntasan (KKM) sekolah adalah{' '}
          <strong>{data.kkm}</strong>.
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
              <div className="num">{r?.nilai_akhir ?? '-'}</div>
              <div className="lbl">Nilai Akhir Keseluruhan</div>
            </div>
            <div className="stat">
              <div className="num">{r?.predikat.huruf}</div>
              <div className="lbl">Predikat — {r?.predikat.keterangan}</div>
            </div>
            <div className="stat">
              <div className="num" style={{ fontSize: 19 }}>
                <span className={`badge ${r?.ketuntasan.tuntas === null ? 'gray'
                  : r?.ketuntasan.tuntas ? 'green' : 'orange'}`}>
                  {r?.ketuntasan.label}
                </span>
              </div>
              <div className="lbl">Status terhadap KKM {data.kkm}</div>
            </div>
            <div className="stat">
              <div className="num">{r?.peringkat ?? '-'}</div>
              <div className="lbl">Peringkat dari {r?.jumlah_siswa} siswa</div>
            </div>
            <div className="stat">
              <div className="num">{r?.jumlah_mapel_tuntas}/{r?.jumlah_mapel_dinilai}</div>
              <div className="lbl">
                Mata pelajaran tuntas, dari {r?.jumlah_mapel_dinilai} yang sudah dinilai
                {' '}(seluruhnya {r?.jumlah_mapel} mata pelajaran)
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="tabel-raport">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>No</th>
                  <th>Mata Pelajaran</th>
                  <th>Guru Pengajar</th>
                  <th>Penilaian Dinilai</th>
                  <th>Capaian Dinilai</th>
                  <th>Nilai Akhir</th>
                  <th>Predikat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((m, i) => (
                  <tr key={m.id_kelas_mapel}>
                    <td>{i + 1}</td>
                    <td>
                      {m.nama_mapel}
                      {m.kode_mapel && <span className="badge gray" style={{ marginLeft: 6 }}>{m.kode_mapel}</span>}
                    </td>
                    <td className="muted">{m.nama_guru || '-'}</td>
                    <td className="tengah muted">
                      {m.jumlah_dinilai} dari {m.jumlah_penilaian} penilaian
                      {m.jumlah_penilaian > 0 && (
                        <><br /><span style={{ fontSize: 11 }}>
                          bobot terhitung {m.bobot_dinilai}% dari {m.total_bobot}%
                        </span></>
                      )}
                    </td>
                    <td className="angka-nilai muted"
                      title="Mutu pekerjaan yang sudah dinilai saja, tanpa memperhitungkan
                        penilaian yang belum ada">
                      {m.nilai_sementara ?? '-'}
                    </td>
                    <td className={`angka-nilai tebal ${m.nilai_akhir == null ? 'muted'
                      : m.nilai_akhir >= data.kkm ? 'tuntas' : 'belum'}`}>
                      {m.nilai_akhir ?? '-'}
                    </td>
                    <td className="tengah">
                      <span className={`badge ${m.predikat.huruf === '-' ? 'gray' : 'green'}`}
                        title={m.predikat.keterangan}>
                        {m.predikat.huruf}
                      </span>
                    </td>
                    <td className="tengah">
                      <span className={`badge ${m.ketuntasan.tuntas === null ? 'gray'
                        : m.ketuntasan.tuntas ? 'green' : 'orange'}`}>
                        {m.ketuntasan.label}
                      </span>
                    </td>
                  </tr>
                ))}
                {tampil.length === 0 && (
                  <tr><td colSpan={8} className="center-msg">
                    Tidak ada mata pelajaran yang dipilih.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="keterangan-raport">
            <div>
              <strong>Status ketuntasan</strong>
              <ul>
                <li><span className="badge green">Tuntas</span> nilai akhir ≥ {data.kkm} (KKM)</li>
                <li><span className="badge orange">Belum Tuntas</span> nilai akhir &lt; {data.kkm}</li>
                <li><span className="badge gray">Belum dinilai</span> belum ada penilaian yang
                  dinilai guru pada mata pelajaran tersebut</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>
                <strong>Nilai Akhir Keseluruhan</strong> di atas dirata-ratakan dari nilai akhir
                mata pelajaran yang <em>sudah dinilai</em> saja, sehingga angkanya masih akan
                bergerak selama penilaian pada mata pelajaran lain belum masuk.{' '}
                Mata pelajaran yang Anda ikuti pada periode ini berjumlah{' '}
                <strong>{r?.jumlah_mapel}</strong>; sudah dinilai{' '}
                <strong>{r?.jumlah_mapel_dinilai}</strong>, di antaranya{' '}
                <strong>{r?.jumlah_mapel_tuntas}</strong> tuntas dan{' '}
                <strong>{r?.jumlah_mapel_belum_tuntas}</strong> belum tuntas. Penilaiannya sudah
                lengkap pada <strong>{r?.jumlah_mapel_lengkap}</strong> mata pelajaran.
              </p>
              <strong style={{ display: 'block', marginTop: 10 }}>Cara nilai akhir dihitung</strong>
              <p className="muted">
                Nilai setiap penilaian dikalikan bobotnya, lalu seluruhnya dijumlahkan dan dibagi
                jumlah bobot penilaian pada mata pelajaran tersebut. <strong>Penilaian yang belum
                dinilai dihitung nol.</strong> Contohnya, bila Anda baru mengikuti UTS berbobot
                25% dengan nilai 90 dan UAS berbobot 30% dengan nilai 80, sedangkan tugas-tugas
                berbobot 45% belum dinilai, maka nilai akhirnya adalah (90&times;25 +
                80&times;30) &divide; 100 = <strong>46,5</strong>, bukan 84,5. Nilai akhir akan
                naik dengan sendirinya setiap kali ada penilaian baru yang dinilai guru.
              </p>
              <p className="muted" style={{ marginTop: 8 }}>
                Pembaginya adalah jumlah bobot penilaian yang <em>sudah dibuat guru</em> pada mata
                pelajaran tersebut, sebagaimana tertulis pada kolom Penilaian Dinilai. Angka itu
                menjadi 100% setelah guru selesai menyusun seluruh penilaian satu semester.
              </p>
              <p className="muted" style={{ marginTop: 8 }}>
                Kolom <strong>Capaian Dinilai</strong> menunjukkan mutu pekerjaan pada penilaian
                yang <em>sudah dinilai</em> saja. Angka itu hanya gambaran kemampuan, bukan nilai
                raport. Ketika seluruh penilaian selesai dinilai, keduanya bernilai sama.
              </p>
            </div>
            <div>
              <strong>Predikat capaian</strong>
              <ul>
                <li><span className="badge green">A</span> Sangat Baik — nilai 90–100</li>
                <li><span className="badge green">B</span> Baik — nilai 80–89</li>
                <li><span className="badge green">C</span> Cukup — nilai 70–79</li>
                <li><span className="badge green">D</span> Perlu Bimbingan — nilai di bawah 70</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>
                Predikat menerangkan <strong>mutu capaian</strong>, status menerangkan{' '}
                <strong>tercapai atau tidaknya KKM</strong>. Keduanya dapat berbeda: nilai 72
                berpredikat C (Cukup) namun berstatus Belum Tuntas karena masih di bawah KKM{' '}
                {data.kkm}. Rincian nilai tiap penilaian dapat dilihat pada menu{' '}
                <strong>Nilai</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
