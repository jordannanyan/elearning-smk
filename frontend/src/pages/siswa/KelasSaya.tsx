import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import type { KelasMapel, Periode } from '../../api/types';

function sisaHari(deadline?: string | null) {
  if (!deadline) return null;
  const selisih = new Date(deadline.replace(' ', 'T')).getTime() - Date.now();
  return Math.ceil(selisih / 86400000);
}

export default function SiswaKelasSaya() {
  const [rows, setRows] = useState<KelasMapel[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilih, setPilih] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const id = pilih || (aktif ? String(aktif.id) : '');
    if (!pilih && id) setPilih(id);
    const { data } = await api.get('/kelas-mapel', { params: { id_periode: id } });
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilih]);

  const periodeTerpilih = periode.find((p) => String(p.id) === String(pilih));
  const terkunci = periodeTerpilih?.status === 'terkunci';
  const namaKelas = rows[0]?.nama_kelas;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2>Kelas Saya</h2>
          {namaKelas && <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Kelas {namaKelas} · Periode {periodeTerpilih?.kode}
          </div>}
        </div>
        <div className="pilih-periode">
          <label style={{ fontWeight: 600, fontSize: 13 }}>Periode:</label>
          <select value={pilih} onChange={(e) => setPilih(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
                {p.status === 'aktif' ? ' (berjalan)' : p.status === 'terkunci' ? ' (arsip)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{periodeTerpilih?.kode}</strong> sudah berakhir dan dikunci. Anda tetap dapat
            membuka kembali seluruh materi dan nilai pada periode ini sebagai riwayat belajar.
          </div>
        </div>
      )}

      {loading ? <div className="card center-msg">Memuat...</div>
        : rows.length === 0 ? (
          <div className="card center-msg">
            Anda belum terdaftar pada kelas mana pun di periode ini.<br />
            Hubungi administrator sekolah.
          </div>
        ) : (
          <div className="kartu-grid">
            {rows.map((r) => {
              const sisa = sisaHari(r.deadline_terdekat);
              return (
                <Link className="polos" to={`/siswa/kelas/${r.id}`} key={r.id}>
                  <div className={`kartu-mapel ${terkunci ? 'terkunci' : ''}`}>
                    <div>
                      <h3>{r.nama_mapel}</h3>
                      <div className="guru">👨‍🏫 {r.nama_guru || 'Guru belum ditentukan'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge gray">{r.kode_mapel}</span>
                      {r.kelompok && <span className="badge green">{r.kelompok}</span>}
                    </div>
                    <div className="angka">
                      <div><strong>{r.jumlah_pertemuan}</strong>Pertemuan</div>
                      <div><strong>{r.jumlah_materi}</strong>Materi</div>
                      <div><strong>{r.jumlah_tugas}</strong>Tugas</div>
                    </div>
                    <div className="kaki">
                      {sisa !== null ? (
                        <span className={`deadline ${sisa <= 1 ? 'kritis' : sisa <= 3 ? 'mendesak' : 'aman'}`}>
                          ⏳ Tugas terdekat {sisa <= 0 ? 'hari ini' : `${sisa} hari lagi`}
                        </span>
                      ) : (
                        <span className="muted" style={{ fontSize: 12 }}>Tidak ada tugas mendatang</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
    </div>
  );
}
