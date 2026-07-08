import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from './Modal';
import type { Soal, Tugas, TipeSoal } from '../api/types';

const emptyForm = {
  pertanyaan: '', tipe: 'pilihan_ganda' as TipeSoal,
  pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '',
  jawaban_benar: 'A', bobot: 10,
};

export default function SoalManager({ tugas, onClose }: { tugas: Tugas; onClose: () => void }) {
  const [rows, setRows] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await api.get(`/tugas/${tugas.id}/soal`);
    setRows(data); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const totalBobot = rows.reduce((a, s) => a + Number(s.bobot), 0);

  function openAdd() { setEditId(null); setForm(emptyForm); setErr(''); setShowForm(true); }
  function openEdit(s: Soal) {
    setEditId(s.id);
    setForm({
      pertanyaan: s.pertanyaan, tipe: s.tipe,
      pilihan_a: s.pilihan_a || '', pilihan_b: s.pilihan_b || '',
      pilihan_c: s.pilihan_c || '', pilihan_d: s.pilihan_d || '',
      jawaban_benar: s.jawaban_benar || 'A', bobot: s.bobot,
    });
    setErr(''); setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      if (editId) await api.put(`/soal/${editId}`, form);
      else await api.post(`/tugas/${tugas.id}/soal`, form);
      setShowForm(false); load();
    } catch (e: any) { setErr(e.response?.data?.message || 'Gagal menyimpan'); }
  }

  async function del(s: Soal) {
    if (!confirm('Hapus soal ini?')) return;
    await api.delete(`/soal/${s.id}`); load();
  }

  return (
    <Modal title={`Kelola Soal — ${tugas.judul}`} onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="muted">
          {rows.length} soal · total bobot <strong>{totalBobot}</strong>
          {totalBobot !== 100 && rows.length > 0 && <span className="badge orange" style={{ marginLeft: 6 }}>skor dinormalisasi ke 100</span>}
        </span>
        <button className="btn small" onClick={openAdd}>+ Tambah Soal</button>
      </div>

      {loading ? <p className="muted">Memuat...</p>
        : rows.length === 0 ? <p className="center-msg">Belum ada soal. Klik "Tambah Soal".</p>
          : rows.map((s, i) => (
            <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span className={`badge ${s.tipe === 'esai' ? 'orange' : 'green'}`}>
                    {s.tipe === 'esai' ? 'Esai' : 'Pilihan Ganda'}
                  </span>
                  <span className="badge gray" style={{ marginLeft: 6 }}>bobot {s.bobot}</span>
                  <div style={{ fontWeight: 600, marginTop: 6 }}>{i + 1}. {s.pertanyaan}</div>
                  {s.tipe === 'pilihan_ganda' && (
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.7 }}>
                      {(['a', 'b', 'c', 'd'] as const).map((k) => {
                        const val = (s as any)[`pilihan_${k}`];
                        if (!val) return null;
                        const isKey = s.jawaban_benar === k.toUpperCase();
                        return <div key={k} style={{ color: isKey ? 'var(--primary)' : undefined, fontWeight: isKey ? 700 : 400 }}>
                          {k.toUpperCase()}. {val} {isKey && '✓'}
                        </div>;
                      })}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button className="btn secondary small" onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn danger small" onClick={() => del(s)}>Hapus</button>
                </div>
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
              <textarea value={form.pertanyaan} onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })} required /></div>

            {form.tipe === 'pilihan_ganda' && (
              <>
                {(['a', 'b', 'c', 'd'] as const).map((k) => (
                  <div className="field" key={k}><label>Pilihan {k.toUpperCase()}{k === 'a' || k === 'b' ? ' *' : ''}</label>
                    <input value={form[`pilihan_${k}`]} onChange={(e) => setForm({ ...form, [`pilihan_${k}`]: e.target.value })}
                      {...(k === 'a' || k === 'b' ? { required: true } : {})} /></div>
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
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </Modal>
  );
}
