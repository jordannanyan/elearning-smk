import { useEffect, useState } from 'react';
import api from '../api/client';
import { labelTipe, warnaTipe } from '../utils/tugas';
import type { DaftarNilaiKelasMapel } from '../api/types';

// ---------------------------------------------------------------------
// Rekap nilai satu mata pelajaran.
//
// Seluruh penilaian sepanjang semester ditampilkan berurutan menurut
// pertemuan, mulai dari tugas paling awal, kuis, Ujian Tengah Semester,
// sampai Ujian Akhir Semester, beserta bobot masing-masing.
//
// Angka pada kolom terakhir adalah NILAI AKHIR, yaitu jumlah nilai tiap
// penilaian dikalikan bobotnya, bukan rata-rata biasa.
// ---------------------------------------------------------------------
const angka = (v: string | number | null | undefined) =>
  (v === null || v === undefined ? null : Number(v));

export default function DaftarNilaiMapel({ idKelasMapel }: { idKelasMapel: number }) {
  const [data, setData] = useState<DaftarNilaiKelasMapel | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [muatUlang, setMuatUlang] = useState(0);

  useEffect(() => {
    setMuat(true);
    setGalat('');
    api.get(`/nilai/kelas-mapel/${idKelasMapel}`)
      .then((r) => setData(r.data))
      .catch((e) => setGalat(e.response?.data?.message
        || 'Rekap nilai gagal dimuat. Periksa sambungan Anda, lalu coba lagi.'))
      .finally(() => setMuat(false));
  }, [idKelasMapel, muatUlang]);

  if (muat) return <p className="center-msg">Memuat rekap nilai...</p>;

  // Kegagalan memuat dibedakan dari keadaan "belum ada data", dan selalu
  // disertai tombol coba lagi supaya halaman tidak tersangkut.
  if (!data) {
    return (
      <div className="notice bahaya">
        <span className="ikon">⚠️</span>
        <div style={{ flex: 1 }}>{galat || 'Rekap nilai belum dapat ditampilkan.'}</div>
        <button className="btn small" onClick={() => setMuatUlang((n) => n + 1)}>Coba Lagi</button>
      </div>
    );
  }

  const { kelas_mapel: km, tugas, siswa, kkm, bobot } = data;

  if (tugas.length === 0) {
    return (
      <div className="card center-msg">
        Belum ada penilaian pada mata pelajaran ini. Tugas, kuis, UTS, dan UAS yang dibuat
        pada setiap pertemuan akan muncul di sini secara berurutan.
      </div>
    );
  }

  // Rata-rata kelas tiap penilaian, sebagai pembanding capaian siswa
  function rataKelas(idTugas: number) {
    const nilai = siswa.map((s) => angka(s.nilai[idTugas])).filter((v): v is number => v != null);
    return nilai.length
      ? Math.round((nilai.reduce((a, b) => a + b, 0) / nilai.length) * 10) / 10 : null;
  }

  return (
    <div className="lembar-raport">
      <div className="kepala-raport">
        <h3>REKAP NILAI</h3>
        <p>{km.nama_mapel} — Kelas {km.nama_kelas}</p>
        <p className="muted">
          {km.nama_guru || '-'} · Periode {km.kode_periode} · SMA Negeri 1 Karau Kuala
        </p>
      </div>

      <div className={`notice ${bobot.lengkap ? 'info' : 'kunci'} tanpa-cetak`}>
        <span className="ikon">{bobot.lengkap ? '⚖️' : '⚠️'}</span>
        <div>
          {bobot.lengkap ? (
            <>Bobot seluruh penilaian berjumlah <strong>100%</strong>. Nilai akhir dihitung
              menurut bobot masing-masing penilaian.</>
          ) : (
            <>Bobot seluruh penilaian baru berjumlah <strong>{bobot.total}%</strong>, masih
              kurang <strong>{bobot.sisa}%</strong> dari 100%. Lengkapi bobot tiap penilaian
              melalui menu pertemuan agar nilai akhir terhitung utuh.</>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="tabel-raport">
          <thead>
            <tr>
              <th className="lekat">No</th>
              <th className="lekat nama">Nama Siswa</th>
              <th>NIS</th>
              {tugas.map((t) => (
                <th key={t.id} className="tegak"
                  title={`Pertemuan ${t.nomor_pertemuan} — ${t.judul} (bobot ${Number(t.bobot)}%)`}>
                  {labelTipe(t.tipe)} {t.nomor_pertemuan} · {Number(t.bobot)}%
                </th>
              ))}
              <th>Nilai Akhir</th>
              <th>Predikat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((s, i) => (
              <tr key={s.id}>
                <td className="lekat">{i + 1}</td>
                <td className="lekat nama">{s.nama}</td>
                <td className="muted">{s.nis || '-'}</td>
                {tugas.map((t) => {
                  const v = angka(s.nilai[t.id]);
                  return (
                    <td key={t.id} className={`angka-nilai ${v == null ? 'muted'
                      : v >= kkm ? 'tuntas' : 'belum'}`}>
                      {v ?? '-'}
                    </td>
                  );
                })}
                <td className={`angka-nilai tebal ${s.nilai_akhir == null ? 'muted'
                  : s.nilai_akhir >= kkm ? 'tuntas' : 'belum'}`}>
                  {s.nilai_akhir ?? '-'}
                </td>
                <td className="tengah">
                  <span className={`badge ${s.predikat.huruf === '-' ? 'gray' : 'green'}`}
                    title={s.predikat.keterangan}>
                    {s.predikat.huruf}
                  </span>
                </td>
                <td className="tengah">
                  <span className={`badge ${s.ketuntasan.tuntas === null ? 'gray'
                    : s.ketuntasan.tuntas ? 'green' : 'orange'}`}>
                    {s.ketuntasan.label}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="baris-rata">
              <td className="lekat" />
              <td className="lekat nama"><strong>Rata-rata kelas</strong></td>
              <td />
              {tugas.map((t) => (
                <td key={t.id} className="angka-nilai tebal">{rataKelas(t.id) ?? '-'}</td>
              ))}
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="keterangan-raport">
        <div>
          <strong>Urutan dan bobot penilaian semester ini</strong>
          <ul>
            {tugas.map((t) => (
              <li key={t.id}>
                <span className={`badge ${warnaTipe(t.tipe)}`}>{labelTipe(t.tipe)}</span>{' '}
                Pertemuan {t.nomor_pertemuan} — {t.judul}
                <span className="muted"> · bobot <strong>{Number(t.bobot)}%</strong>
                  {' '}· {t.jumlah_kumpul} terkumpul</span>
              </li>
            ))}
            <li style={{ marginTop: 6 }}>
              <strong>Jumlah bobot: {bobot.total}%</strong>
              {!bobot.lengkap && <span className="muted"> (kurang {bobot.sisa}% dari 100%)</span>}
            </li>
          </ul>
        </div>
        <div>
          <strong>Keterangan nilai</strong>
          <ul>
            <li><strong>Nilai akhir</strong> = jumlah nilai tiap penilaian dikalikan bobotnya,
              bukan rata-rata.</li>
            <li><span className="badge green">Tuntas</span> nilai akhir ≥ {kkm} (KKM)</li>
            <li><span className="badge orange">Belum Tuntas</span> nilai akhir &lt; {kkm}</li>
            <li><span className="badge gray">Belum dinilai</span> belum ada penilaian yang dinilai</li>
          </ul>
          <strong style={{ display: 'block', marginTop: 10 }}>Predikat</strong>
          <ul>
            <li><span className="badge green">A</span> Sangat Baik — nilai 90–100</li>
            <li><span className="badge green">B</span> Baik — nilai 80–89</li>
            <li><span className="badge green">C</span> Cukup — nilai 70–79</li>
            <li><span className="badge green">D</span> Perlu Bimbingan — nilai di bawah 70</li>
          </ul>
          <p className="muted" style={{ marginTop: 8 }}>
            Predikat menerangkan mutu capaian, sedangkan status menerangkan tercapai atau
            tidaknya KKM. Keduanya dapat berbeda: nilai 72 berpredikat <strong>C (Cukup)</strong>
            {' '}namun berstatus <strong>Belum Tuntas</strong> karena di bawah KKM {kkm}.
          </p>
        </div>
      </div>
    </div>
  );
}
