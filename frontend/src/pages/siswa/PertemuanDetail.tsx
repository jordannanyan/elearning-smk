import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import MateriIsi from '../../components/MateriIsi';
import KerjakanTugas from '../../components/KerjakanTugas';
import type { IsiPertemuan, Tugas } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

function LabelDeadline({ t }: { t: Tugas }) {
  const s = t.sisa_hari;
  if (s === null || s === undefined) return <span className="deadline tanpa_batas">Tanpa batas waktu</span>;
  if (s < 0) return <span className="deadline lewat">Batas waktu terlewat</span>;
  const kelas = s <= 1 ? 'kritis' : s <= 3 ? 'mendesak' : 'aman';
  return <span className={`deadline ${kelas}`}>
    ⏳ {s === 0 ? 'Berakhir hari ini' : `Sisa ${s} hari`}
  </span>;
}

export default function SiswaPertemuanDetail() {
  const { id } = useParams();
  const [data, setData] = useState<IsiPertemuan | null>(null);
  const [loading, setLoading] = useState(true);
  const [kerjakan, setKerjakan] = useState<Tugas | null>(null);
  const [balasKe, setBalasKe] = useState<number | null>(null);
  const [teksBalas, setTeksBalas] = useState('');

  async function load() {
    setLoading(true);
    const { data: d } = await api.get(`/pertemuan/${id}`);
    setData(d); setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  const terkunci = data?.pertemuan.status_periode === 'terkunci';

  async function kirimBalasan(idParent: number) {
    if (!teksBalas.trim()) return;
    try {
      await api.post('/forum', { id_pertemuan: Number(id), pesan: teksBalas, id_parent: idParent });
      setTeksBalas(''); setBalasKe(null); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal mengirim balasan'); }
  }

  if (loading) return <div className="card center-msg">Memuat...</div>;
  if (!data) return <div className="card center-msg">Pertemuan tidak ditemukan.</div>;
  const p = data.pertemuan;

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to={`/siswa/kelas/${p.id_kelas_mapel}`} className="muted" style={{ fontSize: 13 }}>
            ← Kembali ke {p.nama_mapel}
          </Link>
          <h2 style={{ marginTop: 6 }}>Pertemuan {p.nomor}: {p.judul}</h2>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            👨‍🏫 {p.nama_guru} · {p.nama_mapel} · {p.nama_kelas}
            {p.tanggal && ` · ${new Date(p.tanggal).toLocaleDateString('id-ID',
              { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </div>
          {p.deskripsi && <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>{p.deskripsi}</p>}
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>Periode ini sudah dikunci. Anda dapat membaca materi, namun tidak dapat mengumpulkan tugas lagi.</div>
        </div>
      )}

      {/* ---------------- MATERI ---------------- */}
      <div className="blok">
        <div className="kepala"><span>📄 Materi Pembelajaran</span></div>
        <div className="badan">
          {data.materi.length === 0
            ? <p className="muted">Belum ada materi pada pertemuan ini.</p>
            : data.materi.map((m) => (
              <div className="materi-item" key={m.id}><MateriIsi materi={m} /></div>
            ))}
        </div>
      </div>

      {/* ---------------- TUGAS ---------------- */}
      <div className="blok">
        <div className="kepala"><span>📝 Tugas & Kuis</span></div>
        <div className="badan">
          {data.tugas.length === 0
            ? <p className="muted">Tidak ada tugas pada pertemuan ini.</p>
            : data.tugas.map((t) => {
              const pg = t.pengumpulan;
              return (
                <div className="materi-item" key={t.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span>
                        {!!t.jumlah_soal && <span className="badge gray">{t.jumlah_soal} soal</span>}
                        <LabelDeadline t={t} />
                      </div>
                      <div className="judul">{t.judul}</div>
                      {t.deskripsi && <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>{t.deskripsi}</p>}
                      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                        Batas waktu: {fmt(t.deadline)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ marginBottom: 8 }}>
                        {pg?.skor != null ? <span className="badge green">Nilai {pg.skor}</span>
                          : pg ? <span className="badge orange">Menunggu penilaian</span>
                            : <span className="badge gray">Belum dikumpulkan</span>}
                      </div>
                      <button className="btn small" onClick={() => setKerjakan(t)}>
                        {pg?.skor != null ? 'Lihat Hasil' : pg ? 'Lihat / Perbarui' : 'Kerjakan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ---------------- FORUM ---------------- */}
      <div className="blok">
        <div className="kepala"><span>💬 Forum Diskusi Pertemuan Ini</span></div>
        <div className="badan">
          {data.diskusi.length === 0 ? (
            <p className="muted">
              Belum ada topik diskusi. Topik diskusi dibuka oleh guru pengampu; Anda dapat menanggapinya
              melalui tombol Balas apabila topik sudah tersedia.
            </p>
          ) : data.diskusi.map((d) => (
            <div className="materi-item" key={d.id}>
              <div className="judul">{d.judul}</div>
              <div style={{ marginTop: 4 }}>
                <span className="badge green">{d.nama_user}</span>
                <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(d.tgl_post)}</span>
              </div>
              <p style={{ margin: '10px 0' }}>{d.pesan}</p>

              <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14, marginLeft: 4 }}>
                {d.balasan?.map((b) => (
                  <div key={b.id} style={{ marginBottom: 10 }}>
                    <span className={`badge ${b.role === 'guru' ? 'green' : 'gray'}`}>{b.nama_user}</span>
                    <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(b.tgl_post)}</span>
                    <p style={{ marginTop: 4 }}>{b.pesan}</p>
                  </div>
                ))}

                {!terkunci && (balasKe === d.id ? (
                  <div style={{ marginTop: 8 }}>
                    <textarea placeholder="Tulis tanggapan Anda..." value={teksBalas}
                      onChange={(e) => setTeksBalas(e.target.value)} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="btn small" onClick={() => kirimBalasan(d.id)}>Kirim Balasan</button>
                      <button className="btn secondary small"
                        onClick={() => { setBalasKe(null); setTeksBalas(''); }}>Batal</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn secondary small"
                    onClick={() => { setBalasKe(d.id); setTeksBalas(''); }}>+ Balas</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {kerjakan && (
        <KerjakanTugas tugas={kerjakan} onClose={() => setKerjakan(null)}
          onSelesai={() => { setKerjakan(null); load(); }} />
      )}
    </div>
  );
}
