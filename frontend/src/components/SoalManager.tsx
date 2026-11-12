import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from './Modal';
import Lampiran, { namaAsli } from './Lampiran';
import type { Soal, Tugas, TipeSoal } from '../api/types';

// ---------------------------------------------------------------------
// Pengelola butir soal.
//
// Pertanyaan maupun setiap pilihan jawaban dapat disertai satu berkas
// gambar atau PDF, sehingga guru tetap dapat menyusun soal yang tidak
// dapat dituliskan sebagai teks — misalnya grafik, struktur kimia, atau
// potongan bacaan hasil pindaian. Karena itu formulirnya dikirim sebagai
// FormData, bukan JSON.
// ---------------------------------------------------------------------
const PILIHAN = ['a', 'b', 'c', 'd'] as const;
type Huruf = (typeof PILIHAN)[number];

const emptyForm = {
  pertanyaan: '', tipe: 'pilihan_ganda' as TipeSoal,
  pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '',
  jawaban_benar: 'A', bobot: 10,
};

// Berkas yang baru dipilih guru, dan penanda lampiran lama yang dihapus
type Berkas = Record<string, File | null>;
type Hapus = Record<string, boolean>;

export default function SoalManager({ tugas, onClose, readOnly = false }:
  { tugas: Tugas; onClose: () => void; readOnly?: boolean }) {
  const [rows, setRows] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState('');
  const [simpan, setSimpan] = useState(false);
  // Lampiran yang sudah tersimpan pada soal yang sedang disunting
  const [lampiranLama, setLampiranLama] = useState<Record<string, string | null>>({});
  const [berkas, setBerkas] = useState<Berkas>({});
  const [hapus, setHapus] = useState<Hapus>({});

  async function load() {
    setLoading(true);
    const { data } = await api.get(`/tugas/${tugas.id}/soal`);
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const totalBobot = rows.reduce((a, s) => a + Number(s.bobot), 0);

  function bersihkanBerkas() { setBerkas({}); setHapus({}); }

  function openAdd() {
    setEditId(null); setForm(emptyForm); setLampiranLama({});
    bersihkanBerkas(); setErr(''); setShowForm(true);
  }

  function openEdit(s: Soal) {
    setEditId(s.id);
    setForm({
      pertanyaan: s.pertanyaan || '', tipe: s.tipe,
      pilihan_a: s.pilihan_a || '', pilihan_b: s.pilihan_b || '',
      pilihan_c: s.pilihan_c || '', pilihan_d: s.pilihan_d || '',
      jawaban_benar: s.jawaban_benar || 'A', bobot: s.bobot,
    });
    setLampiranLama({
      lampiran: s.lampiran || null,
      lampiran_a: s.lampiran_a || null, lampiran_b: s.lampiran_b || null,
      lampiran_c: s.lampiran_c || null, lampiran_d: s.lampiran_d || null,
    });
    bersihkanBerkas(); setErr(''); setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');

    // Soal boleh tanpa teks pertanyaan asalkan ada lampirannya
    const adaLampiranSoal = !!berkas.lampiran
      || (!!lampiranLama.lampiran && !hapus.lampiran);
    if (!form.pertanyaan.trim() && !adaLampiranSoal) {
      setErr('Isi pertanyaan, atau unggah lampiran soal berupa gambar/PDF.');
      return;
    }
    if (form.tipe === 'pilihan_ganda') {
      const kurang = (['a', 'b'] as Huruf[]).find((k) => {
        const adaBerkas = !!berkas[`lampiran_${k}`]
          || (!!lampiranLama[`lampiran_${k}`] && !hapus[`lampiran_${k}`]);
        return !form[`pilihan_${k}`].trim() && !adaBerkas;
      });
      if (kurang) {
        setErr(`Pilihan ${kurang.toUpperCase()} wajib diisi, berupa teks maupun lampiran.`);
        return;
      }
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    Object.entries(berkas).forEach(([k, f]) => { if (f) fd.append(k, f); });
    Object.entries(hapus).forEach(([k, v]) => { if (v) fd.append(`hapus_${k}`, '1'); });

    setSimpan(true);
    try {
      if (editId) await api.put(`/soal/${editId}`, fd);
      else await api.post(`/tugas/${tugas.id}/soal`, fd);
      setShowForm(false); load();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Gagal menyimpan soal.');
    } finally { setSimpan(false); }
  }

  async function del(s: Soal) {
    if (!confirm('Hapus soal ini? Lampiran soal dan jawaban siswa ikut terhapus.')) return;
    await api.delete(`/soal/${s.id}`); load();
  }

  // Satu baris isian lampiran: pratinjau yang sudah ada, tombol hapus,
  // dan pemilih berkas baru.
  function IsianLampiran({ ruas, judul }: { ruas: string; judul: string }) {
    const lama = lampiranLama[ruas];
    const terhapus = hapus[ruas];
    const baru = berkas[ruas];
    return (
      <div className="isian-lampiran">
        <label className="muted">{judul}</label>
        {lama && !terhapus && (
          <div className="lampiran-tersimpan">
            <Lampiran berkas={lama} label={judul} />
            <button type="button" className="btn danger small"
              onClick={() => setHapus({ ...hapus, [ruas]: true })}>Hapus lampiran</button>
          </div>
        )}
        {lama && terhapus && (
          <div className="muted" style={{ fontSize: 12 }}>
            Lampiran akan dihapus saat disimpan.{' '}
            <button type="button" className="btn secondary small"
              onClick={() => setHapus({ ...hapus, [ruas]: false })}>Batalkan</button>
          </div>
        )}
        <input type="file" accept="image/*,.pdf"
          onChange={(e) => setBerkas({ ...berkas, [ruas]: e.target.files?.[0] || null })} />
        {baru && <div className="muted" style={{ fontSize: 11.5 }}>Berkas baru: {baru.name}</div>}
      </div>
    );
  }

  return (
    <Modal title={`Kelola Soal — ${tugas.judul}`} onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="muted">
          {rows.length} soal · total bobot <strong>{totalBobot}</strong>
          {totalBobot !== 100 && rows.length > 0 && <span className="badge orange" style={{ marginLeft: 6 }}>skor dinormalisasi ke 100</span>}
        </span>
        {!readOnly && <button className="btn small" onClick={openAdd}>+ Tambah Soal</button>}
      </div>

      {!readOnly && (
        <div className="notice info" style={{ marginBottom: 12 }}>
          <span className="ikon">🖼️</span>
          <div>
            Pertanyaan dan setiap pilihan jawaban dapat disertai <strong>gambar atau PDF</strong>,
            untuk soal yang tidak dapat dituliskan sebagai teks seperti grafik, struktur kimia,
            atau potongan bacaan hasil pindaian. Soal yang seluruhnya berupa gambar boleh
            dikosongkan teks pertanyaannya.
          </div>
        </div>
      )}

      {loading ? <p className="muted">Memuat...</p>
        : rows.length === 0 ? <p className="center-msg">Belum ada soal. Klik "Tambah Soal".</p>
          : rows.map((s, i) => (
            <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className={`badge ${s.tipe === 'esai' ? 'orange' : 'green'}`}>
                    {s.tipe === 'esai' ? 'Esai' : 'Pilihan Ganda'}
                  </span>
                  <span className="badge gray" style={{ marginLeft: 6 }}>bobot {s.bobot}</span>
                  {s.lampiran && (
                    <span className="badge gray" style={{ marginLeft: 6 }}>
                      📎 {namaAsli(s.lampiran)}
                    </span>
                  )}
                  <div style={{ fontWeight: 600, marginTop: 6 }}>
                    {i + 1}. {s.pertanyaan || <span className="muted">(soal berupa lampiran)</span>}
                  </div>
                  <Lampiran berkas={s.lampiran} label={`Lampiran soal ${i + 1}`} />
                  {s.tipe === 'pilihan_ganda' && (
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.7 }}>
                      {PILIHAN.map((k) => {
                        const val = (s as any)[`pilihan_${k}`];
                        const lamp = (s as any)[`lampiran_${k}`];
                        if (!val && !lamp) return null;
                        const isKey = s.jawaban_benar === k.toUpperCase();
                        return (
                          <div key={k} style={{ color: isKey ? 'var(--primary)' : undefined, fontWeight: isKey ? 700 : 400 }}>
                            {k.toUpperCase()}. {val} {isKey && '✓'}
                            <Lampiran berkas={lamp} label={`Pilihan ${k.toUpperCase()}`} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button className="btn secondary small" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn danger small" onClick={() => del(s)}>Hapus</button>
                  </div>
                )}
              </div>
            </div>
          ))}

      <div className="modal-actions"><button className="btn secondary" onClick={onClose}>Tutup</button></div>

      {showForm && (
        <Modal title={editId ? 'Edit Soal' : 'Tambah Soal'} onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            {err && <div className="error-box">{err}</div>}
            <div className="field"><label>Tipe Soal</label>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="pilihan_ganda">Pilihan Ganda (otomatis)</option>
                <option value="esai">Esai (dinilai guru)</option>
              </select></div>

            <div className="field"><label>Pertanyaan</label>
              <textarea value={form.pertanyaan}
                onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
                placeholder="Boleh dikosongkan apabila soal seluruhnya berupa gambar atau PDF" />
              <IsianLampiran ruas="lampiran" judul="Lampiran soal (gambar atau PDF)" />
            </div>

            {form.tipe === 'pilihan_ganda' && (
              <>
                {PILIHAN.map((k) => (
                  <div className="field" key={k}>
                    <label>Pilihan {k.toUpperCase()}{k === 'a' || k === 'b' ? ' *' : ''}</label>
                    <input value={form[`pilihan_${k}`]}
                      onChange={(e) => setForm({ ...form, [`pilihan_${k}`]: e.target.value })} />
                    <IsianLampiran ruas={`lampiran_${k}`}
                      judul={`Lampiran pilihan ${k.toUpperCase()}`} />
                  </div>
                ))}
                <div className="field"><label>Kunci Jawaban</label>
                  <select value={form.jawaban_benar} onChange={(e) => setForm({ ...form, jawaban_benar: e.target.value })}>
                    <option value="A">A</option><option value="B">B</option>
                    <option value="C">C</option><option value="D">D</option>
                  </select></div>
              </>
            )}

            <div className="field"><label>Bobot (poin)</label>
              <input type="number" min={1} value={form.bobot} onChange={(e) => setForm({ ...form, bobot: e.target.value })} required /></div>

            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn" disabled={simpan}>{simpan ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </Modal>
  );
}
