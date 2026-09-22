import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import Modal from '../../components/Modal';
import SoalManager from '../../components/SoalManager';
import MateriIsi from '../../components/MateriIsi';
import type { IsiPertemuan, Materi, TipeMateri, Tugas } from '../../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

const LABEL_TIPE: Record<TipeMateri, string> = {
  teks: 'Uraian Teks', file: 'Berkas / Dokumen', video: 'Unggah Video', link: 'Tautan Video / Web',
};

export default function GuruPertemuanDetail() {
  const { id } = useParams();
  const [data, setData] = useState<IsiPertemuan | null>(null);
  const [loading, setLoading] = useState(true);

  // Form materi
  const [showMateri, setShowMateri] = useState(false);
  const [editMateri, setEditMateri] = useState<Materi | null>(null);
  const [fm, setFm] = useState<any>({ judul: '', konten: '', tipe: 'teks', url: '' });
  const [file, setFile] = useState<File | null>(null);
  const [errMateri, setErrMateri] = useState('');

  // Form tugas
  const [showTugas, setShowTugas] = useState(false);
  const [editTugas, setEditTugas] = useState<Tugas | null>(null);
  const [ft, setFt] = useState<any>({ judul: '', deskripsi: '', deadline: '', tipe: 'tugas' });
  const [errTugas, setErrTugas] = useState('');
  const [soalUntuk, setSoalUntuk] = useState<Tugas | null>(null);

  // Forum
  const [topik, setTopik] = useState({ judul: '', pesan: '' });
  const [balasKe, setBalasKe] = useState<number | null>(null);
  const [teksBalas, setTeksBalas] = useState('');

  const terkunci = data?.pertemuan.status_periode === 'terkunci';

  async function load() {
    setLoading(true);
    const { data: d } = await api.get(`/pertemuan/${id}`);
    setData(d); setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  /* ---------------- Materi ---------------- */
  function openMateriAdd() {
    setEditMateri(null); setFm({ judul: '', konten: '', tipe: 'teks', url: '' });
    setFile(null); setErrMateri(''); setShowMateri(true);
  }
  function openMateriEdit(m: Materi) {
    setEditMateri(m);
    setFm({ judul: m.judul, konten: m.konten || '', tipe: m.tipe, url: m.url || '' });
    setFile(null); setErrMateri(''); setShowMateri(true);
  }
  async function simpanMateri(e: React.FormEvent) {
    e.preventDefault();
    setErrMateri('');
    const fd = new FormData();
    fd.append('id_pertemuan', String(id));
    fd.append('judul', fm.judul);
    fd.append('konten', fm.konten);
    fd.append('tipe', fm.tipe);
    if (fm.tipe === 'link') fd.append('url', fm.url);
    if (file) fd.append('file', file);
    try {
      if (editMateri) await api.put(`/materi/${editMateri.id}`, fd);
      else await api.post('/materi', fd);
      setShowMateri(false); load();
    } catch (e: any) { setErrMateri(e.response?.data?.message || 'Gagal menyimpan materi'); }
  }
  async function hapusMateri(m: Materi) {
    if (!confirm(`Hapus materi "${m.judul}"?`)) return;
    try { await api.delete(`/materi/${m.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  /* ---------------- Tugas ---------------- */
  function openTugasAdd() {
    setEditTugas(null); setFt({ judul: '', deskripsi: '', deadline: '', tipe: 'tugas' });
    setErrTugas(''); setShowTugas(true);
  }
  function openTugasEdit(t: Tugas) {
    setEditTugas(t);
    setFt({
      judul: t.judul, deskripsi: t.deskripsi || '', tipe: t.tipe,
      deadline: t.deadline ? t.deadline.replace(' ', 'T').slice(0, 16) : '',
    });
    setErrTugas(''); setShowTugas(true);
  }
  async function simpanTugas(e: React.FormEvent) {
    e.preventDefault();
    setErrTugas('');
    try {
      const payload = { ...ft, id_pertemuan: id, deadline: ft.deadline || null };
      if (editTugas) await api.put(`/tugas/${editTugas.id}`, payload);
      else await api.post('/tugas', payload);
      setShowTugas(false); load();
    } catch (e: any) { setErrTugas(e.response?.data?.message || 'Gagal menyimpan tugas'); }
  }
  async function hapusTugas(t: Tugas) {
    if (!confirm(`Hapus "${t.judul}" beserta soal dan pengumpulannya?`)) return;
    try { await api.delete(`/tugas/${t.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  /* ---------------- Forum ---------------- */
  async function kirimTopik(e: React.FormEvent) {
    e.preventDefault();
    if (!topik.pesan.trim() || !topik.judul.trim()) return;
    try {
      await api.post('/forum', { id_pertemuan: Number(id), ...topik });
      setTopik({ judul: '', pesan: '' }); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal mengirim topik'); }
  }
  async function kirimBalasan(idParent: number) {
    if (!teksBalas.trim()) return;
    try {
      await api.post('/forum', { id_pertemuan: Number(id), pesan: teksBalas, id_parent: idParent });
      setTeksBalas(''); setBalasKe(null); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal mengirim balasan'); }
  }
  async function hapusPesan(idPesan: number) {
    if (!confirm('Hapus pesan ini?')) return;
    try { await api.delete(`/forum/${idPesan}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  if (loading) return <div className="card center-msg">Memuat...</div>;
  if (!data) return <div className="card center-msg">Pertemuan tidak ditemukan.</div>;
  const p = data.pertemuan;

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to={`/guru/kelas/${p.id_kelas_mapel}`} className="muted" style={{ fontSize: 13 }}>
            ← Kembali ke {p.nama_mapel} ({p.nama_kelas})
          </Link>
          <h2 style={{ marginTop: 6 }}>Pertemuan {p.nomor}: {p.judul}</h2>
          {p.deskripsi && <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{p.deskripsi}</p>}
        </div>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>Periode <strong>{p.kode_periode}</strong> terkunci. Isi pertemuan ini hanya dapat dilihat.</div>
        </div>
      )}

      {/* ---------------- MATERI ---------------- */}
      <div className="blok">
        <div className="kepala">
          <span>📄 Materi Pembelajaran</span>
          <button className="btn small" onClick={openMateriAdd} disabled={terkunci}>+ Tambah Materi</button>
        </div>
        <div className="badan">
          {data.materi.length === 0
            ? <p className="muted">Belum ada materi pada pertemuan ini.</p>
            : data.materi.map((m) => (
              <div className="materi-item" key={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <MateriIsi materi={m} />
                  </div>
                  {!terkunci && (
                    <div className="row-actions" style={{ flexDirection: 'column' }}>
                      <button className="btn secondary small" onClick={() => openMateriEdit(m)}>Edit</button>
                      <button className="btn danger small" onClick={() => hapusMateri(m)}>Hapus</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ---------------- TUGAS ---------------- */}
      <div className="blok">
        <div className="kepala">
          <span>📝 Tugas & Kuis</span>
          <button className="btn small" onClick={openTugasAdd} disabled={terkunci}>+ Buat Tugas/Kuis</button>
        </div>
        <div className="badan">
          {data.tugas.length === 0
            ? <p className="muted">Belum ada tugas maupun kuis pada pertemuan ini.</p>
            : (
              <div className="table-wrap" style={{ border: 'none' }}>
                <table>
                  <thead><tr><th>Judul</th><th>Tipe</th><th>Soal</th><th>Batas Waktu</th>
                    <th>Terkumpul</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {data.tugas.map((t) => (
                      <tr key={t.id}>
                        <td>{t.judul}</td>
                        <td><span className={`badge ${t.tipe === 'kuis' ? 'orange' : 'green'}`}>{t.tipe}</span></td>
                        <td>{t.jumlah_soal ? <span className="badge gray">{t.jumlah_soal} soal</span>
                          : <span className="muted">—</span>}</td>
                        <td className="muted">{fmt(t.deadline)}</td>
                        <td>{t.jumlah_kumpul ?? 0}</td>
                        <td>
                          <div className="row-actions">
                            <button className="btn secondary small" onClick={() => setSoalUntuk(t)}>Soal</button>
                            <Link className="btn small" to="/guru/penilaian">Nilai</Link>
                            {!terkunci && <>
                              <button className="btn secondary small" onClick={() => openTugasEdit(t)}>Edit</button>
                              <button className="btn danger small" onClick={() => hapusTugas(t)}>Hapus</button>
                            </>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      {/* ---------------- FORUM DISKUSI ---------------- */}
      <div className="blok">
        <div className="kepala"><span>💬 Forum Diskusi Pertemuan Ini</span></div>
        <div className="badan">
          {!terkunci && (
            <form onSubmit={kirimTopik} style={{ marginBottom: 18 }}>
              <div className="field"><label>Buka Topik Diskusi Baru</label>
                <input placeholder="Judul topik diskusi" value={topik.judul} required
                  onChange={(e) => setTopik({ ...topik, judul: e.target.value })} /></div>
              <div className="field">
                <textarea placeholder="Tulis pertanyaan atau pengantar diskusi untuk siswa..."
                  value={topik.pesan} required
                  onChange={(e) => setTopik({ ...topik, pesan: e.target.value })} /></div>
              <button className="btn">Buka Topik</button>
              <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                Topik diskusi hanya dapat dibuka oleh guru pengampu. Siswa menanggapi melalui balasan.
              </p>
            </form>
          )}

          {data.diskusi.length === 0
            ? <p className="muted">Belum ada topik diskusi pada pertemuan ini.</p>
            : data.diskusi.map((d) => (
              <div className="materi-item" key={d.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="judul">{d.judul}</div>
                    <span className="badge green">{d.nama_user}</span>
                    <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(d.tgl_post)}</span>
                  </div>
                  {!terkunci && <button className="btn danger small"
                    onClick={() => hapusPesan(d.id)}>Hapus</button>}
                </div>
                <p style={{ margin: '10px 0' }}>{d.pesan}</p>

                <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14, marginLeft: 4 }}>
                  {d.balasan?.map((b) => (
                    <div key={b.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <span className={`badge ${b.role === 'guru' ? 'green' : 'gray'}`}>{b.nama_user}</span>
                          <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{fmt(b.tgl_post)}</span>
                        </div>
                        {!terkunci && <button className="btn danger small"
                          onClick={() => hapusPesan(b.id)}>Hapus</button>}
                      </div>
                      <p style={{ marginTop: 4 }}>{b.pesan}</p>
                    </div>
                  ))}

                  {!terkunci && (balasKe === d.id ? (
                    <div style={{ marginTop: 8 }}>
                      <textarea placeholder="Tulis balasan..." value={teksBalas}
                        onChange={(e) => setTeksBalas(e.target.value)} />
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="btn small" onClick={() => kirimBalasan(d.id)}>Balas</button>
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

      {/* ---------------- Modal materi ---------------- */}
      {showMateri && (
        <Modal title={editMateri ? 'Edit Materi' : 'Tambah Materi'} onClose={() => setShowMateri(false)}>
          <form onSubmit={simpanMateri}>
            {errMateri && <div className="error-box">{errMateri}</div>}
            <div className="field"><label>Jenis Materi</label>
              <select value={fm.tipe} onChange={(e) => setFm({ ...fm, tipe: e.target.value })}>
                {(Object.keys(LABEL_TIPE) as TipeMateri[]).map((t) => (
                  <option key={t} value={t}>{LABEL_TIPE[t]}</option>
                ))}
              </select></div>
            <div className="field"><label>Judul Materi</label>
              <input value={fm.judul} required
                onChange={(e) => setFm({ ...fm, judul: e.target.value })} /></div>
            <div className="field"><label>Uraian / Penjelasan</label>
              <textarea value={fm.konten}
                onChange={(e) => setFm({ ...fm, konten: e.target.value })} /></div>

            {fm.tipe === 'link' && (
              <div className="field"><label>Tautan Video atau Sumber Belajar</label>
                <input value={fm.url} placeholder="https://www.youtube.com/watch?v=..."
                  onChange={(e) => setFm({ ...fm, url: e.target.value })} />
                <p className="muted" style={{ fontSize: 12, marginTop: 5 }}>
                  Tautan YouTube akan ditampilkan langsung sebagai video yang dapat ditonton siswa.
                </p>
              </div>
            )}

            {(fm.tipe === 'file' || fm.tipe === 'video') && (
              <div className="field">
                <label>Unggah {fm.tipe === 'video' ? 'Video' : 'Berkas'}
                  {editMateri && <span className="muted"> (kosongkan jika tidak diubah)</span>}</label>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <p className="muted" style={{ fontSize: 12, marginTop: 5 }}>
                  {fm.tipe === 'video'
                    ? 'Format video: MP4, WEBM, MKV, MOV. Ukuran maksimum 100 MB.'
                    : 'Format dokumen: PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX, TXT, atau gambar. Maksimum 20 MB.'}
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShowMateri(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- Modal tugas ---------------- */}
      {showTugas && (
        <Modal title={editTugas ? 'Edit Tugas/Kuis' : 'Buat Tugas/Kuis'} onClose={() => setShowTugas(false)}>
          <form onSubmit={simpanTugas}>
            {errTugas && <div className="error-box">{errTugas}</div>}
            <div className="field"><label>Tipe</label>
              <select value={ft.tipe} onChange={(e) => setFt({ ...ft, tipe: e.target.value })}>
                <option value="tugas">Tugas (kumpul teks / berkas)</option>
                <option value="kuis">Kuis (soal pilihan ganda / esai)</option>
              </select></div>
            <div className="field"><label>Judul</label>
              <input value={ft.judul} required
                onChange={(e) => setFt({ ...ft, judul: e.target.value })} /></div>
            <div className="field"><label>Deskripsi / Instruksi Pengerjaan</label>
              <textarea value={ft.deskripsi}
                onChange={(e) => setFt({ ...ft, deskripsi: e.target.value })} /></div>
            <div className="field"><label>Batas Waktu Pengumpulan</label>
              <input type="datetime-local" value={ft.deadline}
                onChange={(e) => setFt({ ...ft, deadline: e.target.value })} />
              <p className="muted" style={{ fontSize: 12, marginTop: 5 }}>
                Sistem menampilkan sisa hari menuju batas waktu kepada siswa beserta penanda warna
                apabila tenggatnya sudah dekat.
              </p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShowTugas(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {soalUntuk && (
        <SoalManager tugas={soalUntuk} readOnly={!!terkunci}
          onClose={() => { setSoalUntuk(null); load(); }} />
      )}
    </div>
  );
}
