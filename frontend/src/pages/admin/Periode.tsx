import { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import type { Periode } from '../../api/types';

const LABEL_STATUS: Record<string, { teks: string; warna: string }> = {
  draft: { teks: 'Draft', warna: 'gray' },
  aktif: { teks: 'Aktif', warna: 'green' },
  terkunci: { teks: 'Terkunci', warna: 'orange' },
};

function fmtTanggal(t?: string | null) {
  if (!t) return '-';
  return new Date(t.replace(' ', 'T')).toLocaleDateString('id-ID',
    { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminPeriode() {
  const [rows, setRows] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Periode | null>(null);
  const [form, setForm] = useState<any>({ tahun_ajaran: '', semester: 1, tgl_mulai: '', tgl_selesai: '' });
  const [err, setErr] = useState('');
  const [pesan, setPesan] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get('/periode');
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    const tahun = new Date().getFullYear();
    setEdit(null);
    setForm({ tahun_ajaran: `${tahun}/${tahun + 1}`, semester: 1, tgl_mulai: '', tgl_selesai: '' });
    setErr(''); setShow(true);
  }
  function openEdit(p: Periode) {
    setEdit(p);
    setForm({
      tahun_ajaran: p.tahun_ajaran, semester: p.semester,
      tgl_mulai: p.tgl_mulai || '', tgl_selesai: p.tgl_selesai || '',
    });
    setErr(''); setShow(true);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const payload = { ...form, semester: Number(form.semester) };
      const { data } = edit
        ? await api.put(`/periode/${edit.id}`, payload)
        : await api.post('/periode', payload);
      setShow(false); setPesan(data.message); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan periode'); }
  }

  async function aksi(p: Periode, jenis: 'aktifkan' | 'kunci' | 'buka-kunci') {
    const konfirmasi: Record<string, string> = {
      aktifkan: `Aktifkan periode ${p.kode}? Periode aktif sebelumnya akan dikembalikan ke status draft.`,
      kunci: `Kunci periode ${p.kode}?\n\nSeluruh data pada periode ini akan menjadi HANYA-BACA: `
        + 'guru tidak dapat lagi mengubah materi, tugas, maupun nilai, dan siswa tidak dapat '
        + 'mengumpulkan tugas. Semua data tetap dapat dilihat sebagai arsip.',
      'buka-kunci': `Buka kunci periode ${p.kode}? Periode akan kembali ke status draft sehingga `
        + 'dapat diaktifkan lagi, misalnya untuk keperluan koreksi nilai.',
    };
    if (!confirm(konfirmasi[jenis])) return;
    try {
      const { data } = await api.post(`/periode/${p.id}/${jenis}`);
      setPesan(data.message); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal memproses periode'); }
  }

  async function hapus(p: Periode) {
    if (!confirm(`Hapus periode ${p.kode}?`)) return;
    try {
      const { data } = await api.delete(`/periode/${p.id}`);
      setPesan(data.message); load();
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus periode'); }
  }

  return (
    <div>
      <div className="page-head">
        <h2>Periode Pembelajaran</h2>
        <button className="btn" onClick={openAdd}>+ Tambah Periode</button>
      </div>

      <div className="notice info">
        <span className="ikon">ℹ️</span>
        <div>
          Periode pembelajaran menggabungkan tahun ajaran dan semester, misalnya <strong>2026/1</strong> untuk
          Tahun Ajaran 2025/2026 semester ganjil. Hanya boleh ada <strong>satu periode aktif</strong>; seluruh
          kelas, materi, tugas, dan nilai yang dibuat akan tercatat pada periode tersebut. Apabila periode
          telah selesai, administrator dapat <strong>mengunci</strong> periode sehingga seluruh datanya menjadi
          hanya-baca dan tersimpan sebagai arsip.
        </div>
      </div>

      {pesan && (
        <div className="notice kunci">
          <span className="ikon">✅</span>
          <div style={{ flex: 1 }}>{pesan}</div>
          <button className="btn secondary small" onClick={() => setPesan('')}>Tutup</button>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kode</th><th>Tahun Ajaran</th><th>Semester</th><th>Mulai</th><th>Selesai</th>
              <th>Kelas</th><th>Status</th><th>Keterangan Kunci</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={9} className="center-msg">Memuat...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={9} className="center-msg">Belum ada periode pembelajaran</td></tr>
                : rows.map((p) => {
                  const st = LABEL_STATUS[p.status];
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.kode}</strong></td>
                      <td>{p.tahun_ajaran}</td>
                      <td>{p.nama_semester}</td>
                      <td className="muted">{fmtTanggal(p.tgl_mulai)}</td>
                      <td className="muted">{fmtTanggal(p.tgl_selesai)}</td>
                      <td>{p.jumlah_kelas}</td>
                      <td><span className={`badge ${st.warna}`}>{st.teks}</span></td>
                      <td className="muted" style={{ fontSize: 12 }}>
                        {p.status === 'terkunci' && p.nama_pengunci
                          ? <>Dikunci oleh {p.nama_pengunci}<br />{fmtTanggal(p.tgl_dikunci)}</>
                          : '-'}
                      </td>
                      <td>
                        <div className="row-actions">
                          {p.status === 'draft' && (
                            <button className="btn small" onClick={() => aksi(p, 'aktifkan')}>Aktifkan</button>
                          )}
                          {p.status === 'aktif' && (
                            <button className="btn small" onClick={() => aksi(p, 'kunci')}>🔒 Kunci</button>
                          )}
                          {p.status === 'terkunci' && (
                            <button className="btn secondary small" onClick={() => aksi(p, 'buka-kunci')}>
                              🔓 Buka Kunci
                            </button>
                          )}
                          {p.status !== 'terkunci' && (
                            <button className="btn secondary small" onClick={() => openEdit(p)}>Edit</button>
                          )}
                          {p.status === 'draft' && (p.jumlah_kelas ?? 0) === 0 && (
                            <button className="btn danger small" onClick={() => hapus(p)}>Hapus</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title={edit ? `Edit Periode ${edit.kode}` : 'Tambah Periode Pembelajaran'}
          onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field">
              <label>Tahun Ajaran</label>
              <input value={form.tahun_ajaran} placeholder="Contoh: 2025/2026" required
                onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })} />
            </div>
            <div className="field">
              <label>Semester</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                <option value={1}>1 - Ganjil</option>
                <option value={2}>2 - Genap</option>
              </select>
            </div>
            <div className="field">
              <label>Tanggal Mulai</label>
              <input type="date" value={form.tgl_mulai}
                onChange={(e) => setForm({ ...form, tgl_mulai: e.target.value })} />
            </div>
            <div className="field">
              <label>Tanggal Selesai</label>
              <input type="date" value={form.tgl_selesai}
                onChange={(e) => setForm({ ...form, tgl_selesai: e.target.value })} />
            </div>
            <p className="muted" style={{ fontSize: 12 }}>
              Kode periode dibentuk otomatis dari tahun ajaran dan semester, misalnya 2025/2026 semester
              ganjil menjadi <strong>2026/1</strong>. Periode baru berstatus draft dan perlu diaktifkan
              terlebih dahulu sebelum dapat digunakan.
            </p>
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
