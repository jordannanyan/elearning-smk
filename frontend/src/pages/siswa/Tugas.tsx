import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import KerjakanTugas from '../../components/KerjakanTugas';
import Paginasi from '../../components/Paginasi';
import type { KelasMapel, StatusTugasSiswa, Tugas } from '../../api/types';

// ---------------------------------------------------------------------
// Tugas disajikan sebagai kartu, bukan tabel, agar mudah dibaca sekilas.
// Setiap kartu hanya menampilkan hal penting: mata pelajaran, judul, dan
// sisa waktu. Keterangan lain disembunyikan di bagian rincian.
// ---------------------------------------------------------------------

const PER_HALAMAN = 6;

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas waktu';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

function labelSisa(t: Tugas) {
  const s = t.sisa_hari;
  if (s === null || s === undefined) return { teks: 'Tanpa batas waktu', kelas: 'tanpa_batas' };
  if (s < 0) return { teks: `Lewat ${Math.abs(s)} hari`, kelas: 'lewat' };
  if (s === 0) return { teks: 'Berakhir hari ini', kelas: 'kritis' };
  return { teks: `Sisa ${s} hari`, kelas: s <= 1 ? 'kritis' : s <= 3 ? 'mendesak' : 'aman' };
}

const GRUP: { kunci: StatusTugasSiswa; judul: string; ikon: string }[] = [
  { kunci: 'belum_dikerjakan', judul: 'Belum Dikerjakan', ikon: '📌' },
  { kunci: 'terlewat', judul: 'Terlewat Batas Waktu', ikon: '⚠️' },
  { kunci: 'menunggu_penilaian', judul: 'Menunggu Penilaian Guru', ikon: '⏰' },
  { kunci: 'dinilai', judul: 'Sudah Dinilai', ikon: '✅' },
];

export default function SiswaTugas() {
  const [rows, setRows] = useState<Tugas[]>([]);
  const [kelasMapel, setKelasMapel] = useState<KelasMapel[]>([]);
  const [filterMapel, setFilterMapel] = useState('');
  const [grupAktif, setGrupAktif] = useState<StatusTugasSiswa>('belum_dikerjakan');
  const [halaman, setHalaman] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kerjakan, setKerjakan] = useState<Tugas | null>(null);
  const [rincian, setRincian] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const [t, km] = await Promise.all([
      api.get('/tugas', { params: filterMapel ? { id_kelas_mapel: filterMapel } : {} }),
      api.get('/kelas-mapel'),
    ]);
    setRows(t.data); setKelasMapel(km.data); setLoading(false);
  }
  useEffect(() => { load(); }, [filterMapel]);
  useEffect(() => { setHalaman(1); }, [grupAktif, filterMapel]);

  const perGrup = useMemo(() => {
    const hasil: Record<string, Tugas[]> = {};
    GRUP.forEach((g) => { hasil[g.kunci] = rows.filter((r) => r.status === g.kunci); });
    return hasil;
  }, [rows]);

  // Pilih otomatis kelompok pertama yang berisi data
  useEffect(() => {
    if (!loading && perGrup[grupAktif]?.length === 0) {
      const isi = GRUP.find((g) => perGrup[g.kunci]?.length > 0);
      if (isi) setGrupAktif(isi.kunci);
    }
  }, [loading, rows]);

  const daftar = perGrup[grupAktif] || [];
  const tampil = daftar.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  return (
    <div>
      <div className="page-head">
        <h2>Tugas &amp; Kuis</h2>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Mata pelajaran:</label>
          <select value={filterMapel} onChange={(e) => setFilterMapel(e.target.value)}>
            <option value="">Semua Mata Pelajaran ({rows.length} tugas)</option>
            {kelasMapel.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_mapel}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pemisahan status dibuat sebagai tab agar tiap status punya tempat sendiri */}
      <div className="tab-bar">
        {GRUP.map((g) => (
          <button key={g.kunci} className={grupAktif === g.kunci ? 'aktif' : ''}
            onClick={() => setGrupAktif(g.kunci)}>
            {g.ikon} {g.judul}
            <span className="hitung" style={{ marginLeft: 6 }}>{perGrup[g.kunci]?.length ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? <div className="card center-msg">Belum ada tugas pada periode berjalan.</div>
          : daftar.length === 0 ? (
            <div className="card center-msg">
              Tidak ada tugas pada kelompok <strong>{GRUP.find((g) => g.kunci === grupAktif)?.judul}</strong>.
            </div>
          ) : (
            <>
              {tampil.map((t) => {
                const sisa = labelSisa(t);
                const buka = rincian === t.id;
                return (
                  <div className={`kartu-tugas ${sisa.kelas}`} key={t.id}>
                    <div className="utama">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="badge green">{t.nama_mapel}</span>
                        <span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'gray'}`}>{t.tipe}</span>
                        {!!t.jumlah_soal && <span className="badge gray">{t.jumlah_soal} soal</span>}
                      </div>
                      <div className="judul">{t.judul}</div>
                      <div className="mapel">Batas waktu: {fmt(t.deadline)}</div>
                      <button className="tombol-rincian" style={{ marginTop: 6 }}
                        onClick={() => setRincian(buka ? null : t.id)}>
                        {buka ? '▴ Sembunyikan rincian' : '▾ Lihat rincian'}
                      </button>
                    </div>

                    <div className="aksi">
                      <span className={`deadline ${sisa.kelas}`}>⏳ {sisa.teks}</span>
                      {t.pengumpulan?.skor != null && (
                        <span className="badge green">Nilai {t.pengumpulan.skor}</span>
                      )}
                      <button className="btn small" onClick={() => setKerjakan(t)}>
                        {t.status === 'dinilai' ? 'Lihat Hasil'
                          : t.status === 'menunggu_penilaian' ? 'Lihat Jawaban' : 'Kerjakan'}
                      </button>
                    </div>

                    {buka && (
                      <div className="rincian">
                        <div>Guru pengajar<br /><strong>{t.nama_guru || '-'}</strong></div>
                        <div>Pertemuan<br />
                          <Link to={`/siswa/pertemuan/${t.id_pertemuan}`}>
                            <strong>Pertemuan {t.nomor_pertemuan}</strong>
                          </Link>
                        </div>
                        <div>Kelas<br /><strong>{t.nama_kelas}</strong></div>
                        <div>Dikumpulkan<br />
                          <strong>{t.pengumpulan?.tgl_kumpul
                            ? fmt(t.pengumpulan.tgl_kumpul) : 'Belum dikumpulkan'}</strong>
                          {t.pengumpulan?.terlambat
                            ? <span className="badge red" style={{ marginLeft: 6 }}>Telat</span> : null}
                        </div>
                        {t.pengumpulan?.catatan && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            Catatan guru<br /><strong>{t.pengumpulan.catatan}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <Paginasi halaman={halaman} totalData={daftar.length}
                perHalaman={PER_HALAMAN} onGanti={setHalaman} />
            </>
          )}

      {kerjakan && (
        <KerjakanTugas tugas={kerjakan} onClose={() => setKerjakan(null)}
          onSelesai={() => { setKerjakan(null); load(); }} />
      )}
    </div>
  );
}
