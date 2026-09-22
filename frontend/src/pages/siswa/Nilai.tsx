import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { RekapNilai } from '../../api/types';

const STATUS: Record<string, { teks: string; warna: string }> = {
  dinilai: { teks: 'Dinilai', warna: 'green' },
  menunggu_penilaian: { teks: 'Menunggu penilaian', warna: 'orange' },
  tidak_dikumpulkan: { teks: 'Tidak dikumpulkan', warna: 'red' },
  belum_dikerjakan: { teks: 'Belum dikerjakan', warna: 'gray' },
};

export default function SiswaNilai() {
  const [data, setData] = useState<RekapNilai | null>(null);
  const [pilih, setPilih] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(idPeriode?: string) {
    setLoading(true);
    const { data: d } = await api.get('/nilai/saya',
      { params: idPeriode ? { id_periode: idPeriode } : {} });
    setData(d);
    if (!pilih && d.periode) setPilih(String(d.periode.id));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function gantiPeriode(v: string) { setPilih(v); load(v); }

  if (loading) return <div className="card center-msg">Memuat...</div>;
  if (!data || !data.periode) {
    return (
      <div>
        <div className="page-head"><h2>Rekap Nilai</h2></div>
        <div className="card center-msg">Anda belum terdaftar pada kelas mana pun.</div>
      </div>
    );
  }

  const p = data.periode;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Rekap Nilai</h2>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Kelas {p.nama_kelas} · Tahun Ajaran {p.tahun_ajaran} Semester{' '}
            {p.semester === 1 ? 'Ganjil' : 'Genap'}
          </div>
        </div>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilih} onChange={(e) => gantiPeriode(e.target.value)}>
            {data.daftar_periode.map((x) => (
              <option key={x.id} value={x.id}>
                {x.kode} — {x.tahun_ajaran} {x.semester === 1 ? 'Ganjil' : 'Genap'} · Kelas {x.nama_kelas}
                {x.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {p.status === 'terkunci' && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{p.kode}</strong> telah dikunci dan nilainya bersifat final. Data ini
            ditampilkan sebagai riwayat belajar Anda.
          </div>
        </div>
      )}

      <div className="stats">
        <div className="stat"><div className="num">{data.ringkasan.jumlah_mapel}</div>
          <div className="lbl">Mata Pelajaran</div></div>
        <div className="stat"><div className="num">{data.ringkasan.jumlah_tugas}</div>
          <div className="lbl">Total Tugas</div></div>
        <div className="stat"><div className="num">{data.ringkasan.jumlah_dinilai}</div>
          <div className="lbl">Sudah Dinilai</div></div>
        <div className="stat">
          <div className="num" style={{ color: data.ringkasan.jumlah_missing ? 'var(--danger)' : undefined }}>
            {data.ringkasan.jumlah_missing}
          </div>
          <div className="lbl">Tidak Dikumpulkan</div></div>
        <div className="stat"><div className="num">{data.ringkasan.rata_rata ?? '-'}</div>
          <div className="lbl">Rata-rata Keseluruhan</div></div>
      </div>

      {data.ringkasan.jumlah_missing > 0 && (
        <div className="notice bahaya">
          <span className="ikon">⚠️</span>
          <div>
            Terdapat <strong>{data.ringkasan.jumlah_missing} tugas yang tidak Anda kumpulkan</strong>{' '}
            hingga batas waktunya berakhir. Tugas tersebut ditandai pada rincian di bawah ini.
          </div>
        </div>
      )}

      {data.mapel.length === 0
        ? <div className="card center-msg">Belum ada tugas pada periode ini.</div>
        : data.mapel.map((m) => (
          <div className="nilai-mapel" key={m.id_kelas_mapel}>
            <div className="kepala">
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.nama_mapel}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                  👨‍🏫 {m.nama_guru || '-'} · {m.jumlah_dinilai} dari {m.jumlah_tugas} tugas sudah dinilai
                  {m.jumlah_missing > 0 && (
                    <span className="badge red" style={{ marginLeft: 8 }}>
                      {m.jumlah_missing} tidak dikumpulkan
                    </span>
                  )}
                </div>
              </div>
              <div className="rata">
                <div className="angka">{m.rata_rata ?? '-'}</div>
                <div className="lbl">Rata-rata Mapel</div>
              </div>
            </div>

            <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr><th>Pertemuan</th><th>Tugas / Kuis</th><th>Tipe</th>
                    <th>Dikumpulkan</th><th>Status</th><th>Nilai</th><th>Catatan Guru</th></tr>
                </thead>
                <tbody>
                  {m.tugas.map((t) => {
                    const st = STATUS[t.status];
                    return (
                      <tr key={t.id_tugas}>
                        <td className="muted">Pertemuan {t.nomor_pertemuan}</td>
                        <td>{t.judul_tugas}</td>
                        <td><span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span></td>
                        <td className="muted">
                          {t.tgl_kumpul ? t.tgl_kumpul.slice(0, 10) : '-'}
                          {t.terlambat && <span className="badge red" style={{ marginLeft: 6 }}>Telat</span>}
                        </td>
                        <td><span className={`badge ${st.warna}`}>{st.teks}</span></td>
                        <td>{t.skor != null ? <strong>{t.skor}</strong> : <span className="muted">-</span>}</td>
                        <td className="muted" style={{ maxWidth: 260 }}>{t.catatan || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}
