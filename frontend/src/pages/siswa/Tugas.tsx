import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import KerjakanTugas from '../../components/KerjakanTugas';
import type { KelasMapel, StatusTugasSiswa, Tugas } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

function LabelDeadline({ t }: { t: Tugas }) {
  const s = t.sisa_hari;
  if (s === null || s === undefined) return <span className="deadline tanpa_batas">Tanpa batas</span>;
  if (s < 0) return <span className="deadline lewat">Lewat {Math.abs(s)} hari</span>;
  const kelas = s <= 1 ? 'kritis' : s <= 3 ? 'mendesak' : 'aman';
  return <span className={`deadline ${kelas}`}>
    {s === 0 ? '⏳ Hari ini' : `⏳ ${s} hari lagi`}
  </span>;
}

// Tugas dikelompokkan berdasarkan status agar tidak tercampur menjadi satu daftar panjang
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
  const [loading, setLoading] = useState(true);
  const [kerjakan, setKerjakan] = useState<Tugas | null>(null);

  async function load() {
    setLoading(true);
    const [t, km] = await Promise.all([
      api.get('/tugas', { params: filterMapel ? { id_kelas_mapel: filterMapel } : {} }),
      api.get('/kelas-mapel'),
    ]);
    setRows(t.data); setKelasMapel(km.data); setLoading(false);
  }
  useEffect(() => { load(); }, [filterMapel]);

  const grup = useMemo(() => {
    const hasil: Record<string, Tugas[]> = {};
    GRUP.forEach((g) => { hasil[g.kunci] = rows.filter((r) => r.status === g.kunci); });
    return hasil;
  }, [rows]);

  return (
    <div>
      <div className="page-head">
        <h2>Tugas & Kuis</h2>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Mata pelajaran:</label>
          <select value={filterMapel} onChange={(e) => setFilterMapel(e.target.value)}>
            <option value="">Semua Mata Pelajaran</option>
            {kelasMapel.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_mapel}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? <div className="card center-msg">Belum ada tugas pada periode berjalan.</div>
          : GRUP.map((g) => {
            const daftar = grup[g.kunci];
            if (!daftar.length) return null;
            return (
              <div className="grup-tugas" key={g.kunci}>
                <h3>{g.ikon} {g.judul} <span className="hitung">{daftar.length}</span></h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Judul</th><th>Mata Pelajaran</th><th>Guru</th><th>Pertemuan</th>
                        <th>Tipe</th><th>Batas Waktu</th><th>Sisa Waktu</th><th>Nilai</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                      {daftar.map((t) => (
                        <tr key={t.id}>
                          <td>
                            {t.judul}
                            {!!t.jumlah_soal && (
                              <span className="badge gray" style={{ marginLeft: 6 }}>{t.jumlah_soal} soal</span>
                            )}
                          </td>
                          <td>
                            <Link to={`/siswa/kelas/${t.id_kelas_mapel}`}>{t.nama_mapel}</Link>
                          </td>
                          <td className="muted">{t.nama_guru || '-'}</td>
                          <td>
                            <Link to={`/siswa/pertemuan/${t.id_pertemuan}`}>
                              Pertemuan {t.nomor_pertemuan}
                            </Link>
                          </td>
                          <td>
                            <span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span>
                          </td>
                          <td className="muted">{fmt(t.deadline)}</td>
                          <td><LabelDeadline t={t} /></td>
                          <td>{t.pengumpulan?.skor != null
                            ? <strong>{t.pengumpulan.skor}</strong>
                            : <span className="muted">-</span>}</td>
                          <td>
                            <button className="btn small" onClick={() => setKerjakan(t)}>
                              {t.status === 'dinilai' ? 'Lihat Hasil'
                                : t.status === 'menunggu_penilaian' ? 'Lihat'
                                  : 'Kerjakan'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

      {kerjakan && (
        <KerjakanTugas tugas={kerjakan} onClose={() => setKerjakan(null)}
          onSelesai={() => { setKerjakan(null); load(); }} />
      )}
    </div>
  );
}
