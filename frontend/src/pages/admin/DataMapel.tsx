import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import Paginasi from '../../components/Paginasi';
import type { Mapel, Periode } from '../../api/types';

const KELOMPOK = ['Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa', 'Muatan Lokal'];
const PER_HALAMAN = 10;

interface RincianKelas {
  id_jadwal: number; id_kelas: number; nama_kelas: string; tingkat: string;
  kode_periode: string; status_periode: string; nama_guru: string;
  jumlah_siswa: number; jumlah_pertemuan: number;
}

export default function DataMapel() {
  const [rows, setRows] = useState<Mapel[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);
  const [pilihPeriode, setPilihPeriode] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [halaman, setHalaman] = useState(1);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Mapel | null>(null);
  const [form, setForm] = useState<any>({ nama: '', kode: '', kelompok: 'Wajib', deskripsi: '' });
  const [err, setErr] = useState('');

  // Dialog rincian: mata pelajaran ini diajarkan di kelas mana & oleh siapa
  const [detail, setDetail] = useState<Mapel | null>(null);
  const [rincian, setRincian] = useState<RincianKelas[]>([]);
  const [muatRincian, setMuatRincian] = useState(false);

  async function load() {
    setLoading(true);
    const p = await api.get('/periode');
    setPeriode(p.data);
    const aktif = p.data.find((x: Periode) => x.status === 'aktif') || p.data[0];
    const id = pilihPeriode || (aktif ? String(aktif.id) : '');
    if (!pilihPeriode && id) setPilihPeriode(id);
    const { data } = await api.get('/mapel', { params: id ? { id_periode: id } : {} });
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, [pilihPeriode]);
  useEffect(() => { setHalaman(1); }, [filter]);

  const tersaring = useMemo(
    () => (filter ? rows.filter((r) => r.kelompok === filter) : rows), [rows, filter]);
  const tampil = tersaring.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  function openAdd() {
    setEdit(null); setForm({ nama: '', kode: '', kelompok: 'Wajib', deskripsi: '' });
    setErr(''); setShow(true);
  }
  function openEdit(r: Mapel) {
    setEdit(r);
    setForm({ nama: r.nama, kode: r.kode || '', kelompok: r.kelompok || 'Wajib', deskripsi: r.deskripsi || '' });
    setErr(''); setShow(true);
  }
  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (edit) await api.put(`/mapel/${edit.id}`, form);
      else await api.post('/mapel', form);
      setShow(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }
  async function ubahStatus(r: Mapel) {
    const jadiAktif = !r.aktif;
    if (!confirm(jadiAktif
      ? `Aktifkan kembali mata pelajaran ${r.nama}?`
      : `Nonaktifkan mata pelajaran ${r.nama}?\n\nMata pelajaran tidak dapat lagi dipilih saat `
        + 'menyusun mata pelajaran kelas, namun data yang sudah berjalan tetap tersimpan.')) return;
    await api.put(`/mapel/${r.id}/status`, { aktif: jadiAktif });
    load();
  }
  async function hapus(r: Mapel) {
    if (!confirm(`Hapus mata pelajaran ${r.nama}?`)) return;
    try { await api.delete(`/mapel/${r.id}`); load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  }

  async function bukaDetail(r: Mapel) {
    setDetail(r); setMuatRincian(true); setRincian([]);
    const { data } = await api.get(`/mapel/${r.id}/detail`, { params: { id_periode: pilihPeriode } });
    setRincian(data.kelas); setMuatRincian(false);
  }

  return (
    <div>
      <div className="page-head">
        <h2>Mata Pelajaran</h2>
        <div className="pilih-periode">
          <select value={pilihPeriode} onChange={(e) => setPilihPeriode(e.target.value)}>
            {periode.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} — {p.tahun_ajaran} {p.nama_semester}
              </option>
            ))}
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">Semua Kelompok ({rows.length})</option>
            {KELOMPOK.map((k) => (
              <option key={k} value={k}>{k} ({rows.filter((r) => r.kelompok === k).length})</option>
            ))}
          </select>
          <button className="btn" onClick={openAdd}>+ Tambah Mapel</button>
        </div>
      </div>

      <div className="notice info">
        <span className="ikon">📚</span>
        <div>
          Kolom <strong>Diajarkan di Kelas</strong> menunjukkan pada tingkat kelas mana mata pelajaran
          tersebut diajarkan pada periode terpilih. Klik <strong>Lihat Kelas</strong> untuk melihat
          rinciannya: kelas mana saja dan siapa guru yang mengajar di tiap kelas. Penugasan gurunya
          sendiri diatur melalui menu <strong>Data Kelas</strong>.
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nama Mata Pelajaran</th><th>Kode</th><th>Kelompok</th>
              <th>Diajarkan di Kelas</th><th>Jumlah Guru</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="center-msg">Memuat...</td></tr>
              : tampil.length === 0 ? <tr><td colSpan={7} className="center-msg">Tidak ada data</td></tr>
                : tampil.map((r) => (
                  <tr key={r.id} style={{ opacity: r.aktif ? 1 : .6 }}>
                    <td>{r.nama}</td>
                    <td><span className="badge gray">{r.kode || '-'}</span></td>
                    <td className="muted">{r.kelompok || '-'}</td>
                    <td>
                      {r.tingkat_diajarkan
                        ? <>
                          {r.tingkat_diajarkan.split(', ').map((t) => (
                            <span className="badge green" key={t} style={{ marginRight: 4 }}>
                              Kelas {t}
                            </span>
                          ))}
                          <span className="muted" style={{ fontSize: 12 }}>
                            {' '}({r.jumlah_kelas} kelas)
                          </span>
                        </>
                        : <span className="muted">Belum diajarkan</span>}
                    </td>
                    <td>{r.jumlah_guru || 0} guru</td>
                    <td>{r.aktif ? <span className="badge green">Aktif</span>
                      : <span className="badge gray">Nonaktif</span>}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn small" onClick={() => bukaDetail(r)}>Lihat Kelas</button>
                        <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                        <button className={`btn small ${r.aktif ? 'secondary' : ''}`}
                          onClick={() => ubahStatus(r)}>{r.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
                        {!r.jumlah_kelas && (
                          <button className="btn danger small" onClick={() => hapus(r)}>Hapus</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Paginasi halaman={halaman} totalData={tersaring.length}
        perHalaman={PER_HALAMAN} onGanti={setHalaman} />

      {show && (
        <Modal title={edit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} onClose={() => setShow(false)}>
          <form onSubmit={simpan}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Nama Mata Pelajaran</label>
              <input value={form.nama} required
                onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="field"><label>Kode</label>
              <input value={form.kode} placeholder="Contoh: MTK-W"
                onChange={(e) => setForm({ ...form, kode: e.target.value })} /></div>
            <div className="field"><label>Kelompok</label>
              <select value={form.kelompok}
                onChange={(e) => setForm({ ...form, kelompok: e.target.value })}>
                {KELOMPOK.map((k) => <option key={k}>{k}</option>)}
              </select></div>
            <div className="field"><label>Deskripsi</label>
              <textarea value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShow(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`${detail.nama} — Diajarkan di Kelas`} onClose={() => setDetail(null)}>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            Kelompok {detail.kelompok} · Kode {detail.kode} · Periode{' '}
            {periode.find((p) => String(p.id) === String(pilihPeriode))?.kode}
          </p>

          {muatRincian ? <p className="muted">Memuat...</p>
            : rincian.length === 0 ? (
              <p className="center-msg">
                Mata pelajaran ini belum diajarkan di kelas mana pun pada periode ini.<br />
                Tambahkan melalui menu Data Kelas.
              </p>
            ) : (
              <div className="rincian-list">
                {rincian.map((k) => (
                  <div className="rincian-item" key={k.id_jadwal}>
                    <div className="kiri">
                      <div className="nama">🏫 {k.nama_kelas}</div>
                      <div className="ket">
                        Tingkat {k.tingkat} · {k.jumlah_siswa} siswa · {k.jumlah_pertemuan} pertemuan
                      </div>
                    </div>
                    <span className={`badge ${k.nama_guru === 'Belum ditentukan' ? 'orange' : 'green'}`}>
                      👨‍🏫 {k.nama_guru}
                    </span>
                  </div>
                ))}
              </div>
            )}

          <div className="modal-actions">
            <button className="btn secondary" onClick={() => setDetail(null)}>Tutup</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
