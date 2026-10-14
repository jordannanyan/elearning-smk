import { useEffect, useState } from 'react';
import api from '../../api/client';
import DaftarNilaiMapel from '../../components/DaftarNilaiMapel';
import type { KelasMapel, Periode } from '../../api/types';

// ---------------------------------------------------------------------
// Raport sementara guru, disusun per mata pelajaran.
//
// Guru memilih salah satu mata pelajaran yang diampunya, lalu melihat
// nilai seluruh siswa pada mata pelajaran tersebut. Penilaiannya tampil
// berurutan menurut pertemuan, mulai dari tugas paling awal, kuis,
// Ujian Tengah Semester, sampai Ujian Akhir Semester.
//
// Disebut sementara karena nilainya dihitung dari penilaian yang sudah
// masuk sampai saat halaman dibuka, bukan nilai akhir semester.
// ---------------------------------------------------------------------
export default function RaportGuru() {
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilihPeriode, setPilihPeriode] = useState('');
  const [daftar, setDaftar] = useState<KelasMapel[]>([]);
  const [pilih, setPilih] = useState<KelasMapel | null>(null);
  const [muat, setMuat] = useState(true);

  useEffect(() => {
    api.get('/periode').then((r) => {
      setPeriode(r.data);
      const aktif = r.data.find((p: Periode) => p.status === 'aktif') || r.data[0];
      if (aktif) setPilihPeriode(String(aktif.id));
    });
  }, []);

  useEffect(() => {
    if (!pilihPeriode) return;
    setMuat(true);
    setPilih(null);
    api.get('/kelas-mapel', { params: { id_periode: pilihPeriode, semua: 1 } })
      .then((r) => setDaftar(r.data))
      .finally(() => setMuat(false));
  }, [pilihPeriode]);

  // ----- Daftar mata pelajaran yang diampu -----
  if (!pilih) {
    return (
      <div>
        <div className="page-head">
          <h2>Raport Sementara</h2>
          <div className="pilih-periode">
            <select value={pilihPeriode} onChange={(e) => setPilihPeriode(e.target.value)}>
              {periode.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                  {p.status === 'terkunci' ? ' (arsip)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="notice info">
          <span className="ikon">📋</span>
          <div>
            Pilih mata pelajaran untuk melihat <strong>nilai seluruh siswa</strong> pada mata
            pelajaran tersebut. Penilaian ditampilkan berurutan menurut pertemuan, mulai dari
            tugas paling awal, kuis, <strong>Ujian Tengah Semester</strong>, sampai{' '}
            <strong>Ujian Akhir Semester</strong>. Nilai bersifat sementara dan masih berubah
            selama periode pembelajaran berjalan.
          </div>
        </div>

        {muat ? <p className="center-msg">Memuat...</p>
          : daftar.length === 0
            ? <p className="center-msg">Anda belum mengampu mata pelajaran pada periode ini.</p>
            : (
              <div className="kartu-grid">
                {daftar.map((km) => (
                  <article className="kartu-ringkas" key={km.id}>
                    <div>
                      <span className="badge gray">{km.kode_mapel || '-'}</span>{' '}
                      <span className={`badge ${km.status_periode === 'aktif' ? 'green' : 'gray'}`}>
                        {km.kode_periode}
                      </span>
                    </div>
                    <h3>{km.nama_mapel}</h3>
                    <div className="sub">🏫 Kelas {km.nama_kelas} · Tingkat {km.tingkat}</div>
                    <div className="angka-baris">
                      <div><strong>{km.jumlah_siswa ?? '-'}</strong>Siswa</div>
                      <div><strong>{km.jumlah_pertemuan ?? '-'}</strong>Pertemuan</div>
                    </div>
                    <div className="kaki">
                      <button className="btn small" onClick={() => setPilih(km)}>
                        Lihat Nilai Siswa
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
      </div>
    );
  }

  // ----- Nilai siswa pada satu mata pelajaran -----
  return (
    <div>
      <div className="page-head tanpa-cetak">
        <h2>Raport Sementara</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn secondary" onClick={() => setPilih(null)}>
            ← Pilih Mata Pelajaran Lain
          </button>
          <button className="btn" onClick={() => window.print()}>🖨️ Cetak</button>
        </div>
      </div>

      <DaftarNilaiMapel idKelasMapel={pilih.id} />
    </div>
  );
}
