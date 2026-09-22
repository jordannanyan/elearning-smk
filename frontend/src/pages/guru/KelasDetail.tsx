import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { KelasMapel, Pertemuan } from '../../api/types';

export default function GuruKelasDetail() {
  const { id } = useParams();
  const [km, setKm] = useState<KelasMapel | null>(null);
  const [rows, setRows] = useState<Pertemuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Pertemuan | null>(null);
  const [form, setForm] = useState<any>({ judul: '', deskripsi: '', tanggal: '' });
  const [err, setErr] = useState('');

  const terkunci = km?.status_periode === 'terkunci';

  async function load() {
    setLoading(true);
    const [k, p] = await Promise.all([
      api.get(`/kelas-mapel/${id}`),
      api.get(`/kelas-mapel/${id}/pertemuan`),
    ]);
    setKm(k.data); setRows(p.data); setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  function openAdd() {
    setEdit(null);
    setForm({ judul: '', deskripsi: '', tanggal: new Date().toISOString().slice(0, 10) });
    setErr(''); setShow(true);
  }
  function openEdit(p: Pertemuan) {
    setEdit(p);
    setForm({ judul: p.judul, deskripsi: p.deskripsi || '', tanggal: p.tanggal || '' });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/pertemuan/${edit.id}`, form);
      else await api.post(`/kelas-mapel/${id}/pertemuan`, form);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan pertemuan'); }
  }

  async function hapus(p: Pertemuan) {
    if (!confirm(`Hapus Pertemuan ${p.nomor} "${p.judul}"?\n\n`
      + 'Seluruh materi, tugas, dan diskusi di dalamnya ikut terhapus.')) return;
    try { await api.delete(`/pertemuan/${p.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  if (loading) return <div className="card center-msg">Memuat...</div>;
  if (!km) return <div className="card center-msg">Kelas mata pelajaran tidak ditemukan.</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to="/guru/kelas" className="muted" style={{ fontSize: 13 }}>← Kembali ke Kelas Saya</Link>
          <h2 style={{ marginTop: 6 }}>{km.nama_mapel}</h2>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            🏫 {km.nama_kelas} · Tingkat {km.tingkat} · {km.jumlah_siswa} siswa ·
            Periode {km.kode_periode} ({km.tahun_ajaran} {km.semester === 1 ? 'Ganjil' : 'Genap'})
          </div>
        </div>
        <button className="btn" onClick={openAdd} disabled={terkunci}>+ Tambah Pertemuan</button>
      </div>

      {terkunci && (
        <div className="notice kunci">
          <span className="ikon">🔒</span>
          <div>
            Periode <strong>{km.kode_periode}</strong> telah dikunci administrator. Seluruh isi kelas ini
            hanya dapat dilihat sebagai arsip dan tidak dapat diubah.
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="card center-msg">
          Belum ada pertemuan.<br />
          {!terkunci && 'Mulai dengan menambahkan Pertemuan 1, lalu isi materi, tugas, dan forum diskusinya.'}
        </div>
      ) : rows.map((p) => (
        <div className="pertemuan-item" key={p.id}>
          <div className="nomor"><small>PERTEMUAN</small>{p.nomor}</div>
          <div className="isi">
            <h3>{p.judul}</h3>
            {p.deskripsi && <p className="muted" style={{ fontSize: 13 }}>{p.deskripsi}</p>}
            <div className="meta">
              <span className="badge gray">📄 {p.jumlah_materi} materi</span>
              <span className="badge green">📝 {p.jumlah_tugas} tugas</span>
              <span className="badge orange">💬 {p.jumlah_diskusi} diskusi</span>
              {p.tanggal && <span className="muted" style={{ fontSize: 12, alignSelf: 'center' }}>
                {new Date(p.tanggal).toLocaleDateString('id-ID',
                  { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>}
            </div>
          </div>
          <div className="row-actions" style={{ flexDirection: 'column' }}>
            <Link className="btn small" to={`/guru/pertemuan/${p.id}`}>Kelola Isi</Link>
            {!terkunci && <>
              <button className="btn secondary small" onClick={() => openEdit(p)}>Edit</button>
              <button className="btn danger small" onClick={() => hapus(p)}>Hapus</button>
            </>}
          </div>
        </div>
      ))}

      {show && (
        <Modal title={edit ? `Edit Pertemuan ${edit.nomor}` : `Tambah Pertemuan ${rows.length + 1}`}
          onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Judul Pertemuan</label>
              <input value={form.judul} required placeholder="Contoh: Persamaan Linear Satu Variabel"
                onChange={(e) => setForm({ ...form, judul: e.target.value })} /></div>
            <div className="field"><label>Deskripsi / Capaian Pembelajaran</label>
              <textarea value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
            <div className="field"><label>Tanggal Pertemuan</label>
              <input type="date" value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
            {!edit && <p className="muted" style={{ fontSize: 12 }}>
              Nomor pertemuan diisi otomatis berurutan. Setelah tersimpan, klik <strong>Kelola Isi</strong>{' '}
              untuk menambahkan materi (teks, file, video, atau tautan), tugas, dan forum diskusi.
            </p>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
