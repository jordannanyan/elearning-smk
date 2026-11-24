import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { labelTipe, warnaTipe } from '../utils/tugas';
import type { DaftarNilaiKelasMapel, TipeTugas } from '../api/types';

// ---------------------------------------------------------------------
// Rekap nilai satu mata pelajaran.
//
// Tabel ini memiliki dua tampilan:
//
//   Ringkas (bawaan) — satu kolom untuk setiap JENIS penilaian. Seluruh
//     tugas digabung menjadi satu kolom, begitu pula kuis, UTS, dan UAS,
//     beserta jumlah bobot kelompoknya. Tampilan ini dipakai sebagai
//     bawaan karena mata pelajaran dengan latihan mingguan dapat memiliki
//     puluhan penilaian, sehingga tabelnya terlalu lebar untuk dibaca
//     maupun dicetak.
//
//   Rinci — satu kolom untuk setiap penilaian, berurutan menurut
//     pertemuan, seperti tampilan sebelumnya.
//
// Angka pada kolom terakhir adalah NILAI AKHIR, yaitu jumlah nilai tiap
// penilaian dikalikan bobotnya, bukan rata-rata biasa. Pembaginya adalah
// seluruh bobot penilaian, sehingga penilaian yang belum dinilai tidak
// menyumbang nilai sama sekali.
//
// Nilai kolom kelompok dihitung dengan rumus yang sama, hanya terbatas
// pada anggota kelompoknya. Karena itu nilai akhir tetap sama persis
// dengan gabungan berbobot seluruh kolom kelompok, dan guru dapat
// memeriksa perhitungannya langsung dari tampilan ringkas.
// ---------------------------------------------------------------------
const angka = (v: string | number | null | undefined) =>
  (v === null || v === undefined ? null : Number(v));

const bulat2 = (v: number) => Math.round(v * 100) / 100;

// Urutan tetap penyajian kelompok, mengikuti urutan lazim pada raport.
const URUTAN: TipeTugas[] = ['tugas', 'kuis', 'uts', 'uas'];

interface Kelompok {
  tipe: TipeTugas;
  bobot: number;       // jumlah bobot seluruh anggota kelompok
  jumlah: number;      // banyaknya penilaian di dalam kelompok
  judul: string[];     // untuk keterangan saat kursor diarahkan
}

export default function DaftarNilaiMapel({ idKelasMapel }: { idKelasMapel: number }) {
  const [data, setData] = useState<DaftarNilaiKelasMapel | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [muatUlang, setMuatUlang] = useState(0);
  // Pencarian siswa menurut nama atau NIS, diletakkan di bawah rekap
  const [cari, setCari] = useState('');
  // false = kolom digabung per jenis penilaian, true = satu kolom per penilaian
  const [rinci, setRinci] = useState(false);

  useEffect(() => {
    setMuat(true);
    setGalat('');
    api.get(`/nilai/kelas-mapel/${idKelasMapel}`)
      .then((r) => setData(r.data))
      .catch((e) => setGalat(e.response?.data?.message
        || 'Rekap nilai gagal dimuat. Periksa sambungan Anda, lalu coba lagi.'))
      .finally(() => setMuat(false));
  }, [idKelasMapel, muatUlang]);

  // Daftar siswa hasil pencarian. Dihitung sebelum seluruh keadaan
  // berhenti awal di bawah, karena hook tidak boleh dipanggil bersyarat.
  const tampil = useMemo(() => {
    const semua = data?.siswa || [];
    const kunci = cari.trim().toLowerCase();
    if (!kunci) return semua;
    return semua.filter((x) => x.nama.toLowerCase().includes(kunci)
      || (x.nis || '').toLowerCase().includes(kunci));
  }, [data, cari]);

  // Pengelompokan penilaian menurut jenisnya. Sama seperti useMemo di
  // atas, hook ini harus berada sebelum seluruh keadaan berhenti awal.
  const kelompok = useMemo<Kelompok[]>(() => {
    const peta = new Map<TipeTugas, Kelompok>();
    for (const t of data?.tugas || []) {
      const k = peta.get(t.tipe)
        || { tipe: t.tipe, bobot: 0, jumlah: 0, judul: [] };
      k.bobot += Number(t.bobot || 0);
      k.jumlah += 1;
      k.judul.push(`Pertemuan ${t.nomor_pertemuan} — ${t.judul} `
        + `(${Number(t.bobot)}%)`);
      peta.set(t.tipe, k);
    }
    return URUTAN.filter((t) => peta.has(t)).map((t) => {
      const k = peta.get(t) as Kelompok;
      return { ...k, bobot: bulat2(k.bobot) };
    });
  }, [data]);

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

  // Banyaknya kolom penilaian, berbeda menurut tampilan yang dipilih.
  const jumlahKolom = rinci ? tugas.length : kelompok.length;

  // Rata-rata kelas tetap dihitung dari seluruh siswa, bukan hanya yang
  // sedang tampil, supaya pembandingnya tidak berubah saat mencari.
  function rataKelas(idTugas: number) {
    const nilai = siswa.map((s) => angka(s.nilai[idTugas])).filter((v): v is number => v != null);
    return nilai.length
      ? Math.round((nilai.reduce((a, b) => a + b, 0) / nilai.length) * 10) / 10 : null;
  }

  type Siswa = (typeof siswa)[number];

  // Nilai gabungan satu kelompok penilaian untuk seorang siswa.
  //
  // Rumusnya sengaja dibuat sama dengan rumus nilai akhir, hanya
  // terbatas pada anggota kelompok: penilaian yang belum dinilai
  // dihitung nol, tetapi bobotnya tetap masuk pembagi. Dengan begitu
  //
  //     nilai akhir = jumlah(nilai kelompok x bobot kelompok)
  //                   / jumlah seluruh bobot
  //
  // sehingga angka pada tampilan ringkas dapat ditelusuri guru tanpa
  // perlu membuka tampilan rinci.
  function nilaiKelompok(s: Siswa, k: Kelompok) {
    let berbobot = 0;
    let totalBobot = 0;
    let jumlahSkor = 0;
    let dinilai = 0;
    for (const t of tugas) {
      if (t.tipe !== k.tipe) continue;
      const b = Number(t.bobot || 0);
      const v = angka(s.nilai[t.id]);
      totalBobot += b;
      if (v != null) { dinilai += 1; berbobot += v * b; jumlahSkor += v; }
    }
    // Sama seperti sel penilaian tunggal, kelompok yang sama sekali
    // belum dinilai ditampilkan sebagai tanda hubung, bukan nol.
    if (dinilai === 0) return { nilai: null, dinilai, jumlah: k.jumlah };
    const nilai = totalBobot > 0
      ? berbobot / totalBobot
      : jumlahSkor / dinilai;
    return { nilai: bulat2(nilai), dinilai, jumlah: k.jumlah };
  }

  function rataKelasKelompok(k: Kelompok) {
    const nilai = siswa
      .map((s) => nilaiKelompok(s, k).nilai)
      .filter((v): v is number => v != null);
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
          )}{' '}
          Penilaian yang <strong>belum dinilai dihitung nol</strong> pada nilai akhir, sehingga
          nilai akhir siswa baru mencapai angka sebenarnya setelah seluruh penilaiannya selesai
          dinilai.
        </div>
      </div>

      <div className="cari-siswa tanpa-cetak">
        <input type="search" value={cari} onChange={(e) => setCari(e.target.value)}
          placeholder="Cari siswa menurut nama atau NIS..." aria-label="Cari siswa" />
        <span className="muted">
          {cari.trim()
            ? `${tampil.length} dari ${siswa.length} siswa`
            : `${siswa.length} siswa`}
        </span>
        {cari.trim() && (
          <button className="btn secondary small" onClick={() => setCari('')}>Bersihkan</button>
        )}
        <button className="btn secondary small atur-kolom"
          onClick={() => setRinci((v) => !v)}
          title={rinci
            ? 'Gabungkan kolom penilaian menurut jenisnya'
            : 'Tampilkan satu kolom untuk setiap penilaian'}>
          {rinci
            ? `⊟ Gabungkan per jenis (${kelompok.length} kolom)`
            : `⊞ Rincikan tiap penilaian (${tugas.length} kolom)`}
        </button>
      </div>

      <div className="table-wrap">
        <table className="tabel-raport">
          <thead>
            <tr>
              <th className="lekat">No</th>
              <th className="lekat nama">Nama Siswa</th>
              <th>NIS</th>
              {rinci
                ? tugas.map((t) => (
                  <th key={t.id} className="tegak"
                    title={`Pertemuan ${t.nomor_pertemuan} — ${t.judul} `
                      + `(bobot ${Number(t.bobot)}%)`}>
                    {labelTipe(t.tipe)} {t.nomor_pertemuan} · {Number(t.bobot)}%
                  </th>
                ))
                : kelompok.map((k) => (
                  <th key={k.tipe} className="kolom-kelompok"
                    title={`${k.jumlah} penilaian digabung, jumlah bobot `
                      + `${k.bobot}%:\n${k.judul.join('\n')}`}>
                    <span className="nama-kelompok">{labelTipe(k.tipe)}</span>
                    <span className="rinci-kelompok">
                      {k.jumlah > 1 ? `${k.jumlah} penilaian · ` : ''}{k.bobot}%
                    </span>
                  </th>
                ))}
              <th>Nilai Akhir</th>
              <th>Predikat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tampil.map((s) => (
              <tr key={s.id}>
                <td className="lekat">{siswa.indexOf(s) + 1}</td>
                <td className="lekat nama">{s.nama}</td>
                <td className="muted">{s.nis || '-'}</td>
                {rinci
                  ? tugas.map((t) => {
                    const v = angka(s.nilai[t.id]);
                    return (
                      <td key={t.id} className={`angka-nilai ${v == null ? 'muted'
                        : v >= kkm ? 'tuntas' : 'belum'}`}>
                        {v ?? '-'}
                      </td>
                    );
                  })
                  : kelompok.map((k) => {
                    const g = nilaiKelompok(s, k);
                    const utuh = g.dinilai === g.jumlah;
                    return (
                      <td key={k.tipe} className={`angka-nilai ${g.nilai == null ? 'muted'
                        : g.nilai >= kkm ? 'tuntas' : 'belum'}`}
                      title={g.nilai == null
                        ? `Belum ada ${labelTipe(k.tipe)} yang dinilai`
                        : `${g.dinilai} dari ${g.jumlah} penilaian sudah dinilai`}>
                        {g.nilai ?? '-'}
                        {g.nilai != null && !utuh && (
                          <small className="sisa-bobot">
                            {g.dinilai}/{g.jumlah} dinilai
                          </small>
                        )}
                      </td>
                    );
                  })}
                <td className={`angka-nilai tebal ${s.nilai_akhir == null ? 'muted'
                  : s.nilai_akhir >= kkm ? 'tuntas' : 'belum'}`}
                title={s.nilai_akhir == null ? 'Belum ada penilaian yang dinilai'
                  : `${s.bobot_dinilai}% dari ${s.total_bobot}% bobot sudah dinilai`}>
                  {s.nilai_akhir ?? '-'}
                  {s.nilai_akhir != null && !s.lengkap && (
                    <small className="sisa-bobot">{s.bobot_dinilai}% dinilai</small>
                  )}
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
            {tampil.length === 0 && (
              <tr>
                <td className="lekat" />
                <td className="lekat nama" colSpan={2}>
                  <span className="muted">Tidak ada siswa yang cocok.</span>
                </td>
                <td colSpan={jumlahKolom + 3} />
              </tr>
            )}
            <tr className="baris-rata">
              <td className="lekat" />
              <td className="lekat nama"><strong>Rata-rata kelas</strong></td>
              <td />
              {rinci
                ? tugas.map((t) => (
                  <td key={t.id} className="angka-nilai tebal">{rataKelas(t.id) ?? '-'}</td>
                ))
                : kelompok.map((k) => (
                  <td key={k.tipe} className="angka-nilai tebal">
                    {rataKelasKelompok(k) ?? '-'}
                  </td>
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
              dibagi seluruh bobot penilaian, bukan rata-rata.</li>
            {!rinci && (
              <li>Kolom <strong>{kelompok.map((k) => labelTipe(k.tipe)).join(', ')}</strong>{' '}
                adalah nilai gabungan seluruh penilaian sejenis, dihitung dengan rumus yang
                sama. Nilai akhir sama dengan gabungan berbobot kolom-kolom tersebut:{' '}
                {kelompok.map((k, i) => (
                  <span key={k.tipe}>
                    {i > 0 ? ' + ' : ''}
                    <strong>{labelTipe(k.tipe)}</strong>×{k.bobot}%
                  </span>
                ))}, dibagi {bobot.total}%.</li>
            )}
            <li>Penilaian yang <strong>belum dinilai dihitung nol</strong>. Siswa yang hanya
              mengikuti sebagian penilaian karena itu belum dapat memperoleh nilai akhir tinggi,
              meskipun nilai pada penilaian yang diikutinya besar.</li>
            <li>Angka kecil di bawah nilai akhir menunjukkan berapa persen bobot yang sudah
              dinilai. Nilai akhir menjadi final setelah angka tersebut mencapai
              {' '}<strong>{bobot.total}%</strong>.</li>
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
