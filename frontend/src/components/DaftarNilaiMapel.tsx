import { useEffect, useState } from 'react';
import api from '../api/client';
import type { DaftarNilaiKelasMapel } from '../api/types';
import { labelTipe, warnaTipe } from '../utils/tugas';

// ---------------------------------------------------------------------
// Daftar nilai satu mata pelajaran.
//
// Seluruh penilaian sepanjang semester ditampilkan berurutan menurut
// pertemuan, mulai dari tugas paling awal, kuis, Ujian Tengah Semester,
// sampai Ujian Akhir Semester, beserta nilai tiap siswa pada masing
// masing penilaian dan rata-ratanya.
// ---------------------------------------------------------------------
const KKM = 75;

export default function DaftarNilaiMapel({ idKelasMapel }: { idKelasMapel: number }) {
  const [data, setData] = useState<DaftarNilaiKelasMapel | null>(null);
  const [muat, setMuat] = useState(true);

  useEffect(() => {
    setMuat(true);
    api.get(`/nilai/kelas-mapel/${idKelasMapel}`)
      .then((r) => setData(r.data))
      .finally(() => setMuat(false));
  }, [idKelasMapel]);

  if (muat) return <p className="center-msg">Memuat daftar nilai...</p>;
  if (!data) return <p className="center-msg">Daftar nilai belum dapat ditampilkan.</p>;

  const { kelas_mapel: km, tugas, siswa } = data;

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
    const angka = siswa.map((s) => s.nilai[idTugas])
      .filter((v) => v != null).map(Number);
    return angka.length
      ? Math.round((angka.reduce((a, b) => a + b, 0) / angka.length) * 10) / 10 : null;
  }

  return (
    <div className="lembar-raport">
      <div className="kepala-raport">
        <h3>DAFTAR NILAI</h3>
        <p>{km.nama_mapel} — Kelas {km.nama_kelas}</p>
        <p className="muted">
          {km.nama_guru || '-'} · Periode {km.kode_periode} · SMA Negeri 1 Karau Kuala
        </p>
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
                  title={`Pertemuan ${t.nomor_pertemuan} — ${t.judul}`}>
                  {labelTipe(t.tipe)} {t.nomor_pertemuan}
                </th>
              ))}
              <th>Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((s, i) => (
              <tr key={s.id}>
                <td className="lekat">{i + 1}</td>
                <td className="lekat nama">{s.nama}</td>
                <td className="muted">{s.nis || '-'}</td>
                {tugas.map((t) => {
                  const v = s.nilai[t.id];
                  return (
                    <td key={t.id} className={`angka-nilai ${v == null ? 'muted'
                      : Number(v) >= KKM ? 'tuntas' : 'belum'}`}>
                      {v == null ? '-' : Number(v)}
                    </td>
                  );
                })}
                <td className={`angka-nilai tebal ${s.rata_rata == null ? 'muted'
                  : s.rata_rata >= KKM ? 'tuntas' : 'belum'}`}>
                  {s.rata_rata ?? '-'}
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
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="keterangan-raport">
        <div>
          <strong>Urutan penilaian semester ini</strong>
          <ul>
            {tugas.map((t) => (
              <li key={t.id}>
                <span className={`badge ${warnaTipe(t.tipe)}`}>{labelTipe(t.tipe)}</span>{' '}
                Pertemuan {t.nomor_pertemuan} — {t.judul}
                <span className="muted"> ({t.jumlah_kumpul} terkumpul)</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Keterangan</strong>
          <ul>
            <li>Angka hijau — mencapai KKM ({KKM})</li>
            <li>Angka jingga — belum mencapai KKM</li>
            <li>Tanda “-” — belum ada nilai</li>
          </ul>
          <p className="muted" style={{ marginTop: 8 }}>
            Penilaian tersusun menurut urutan pertemuan, sehingga terbaca runut mulai dari
            tugas paling awal sampai Ujian Akhir Semester.
          </p>
        </div>
      </div>
    </div>
  );
}
