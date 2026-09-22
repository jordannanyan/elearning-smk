import { useEffect, useState } from 'react';
import api, { API_BASE } from '../api/client';
import Modal from './Modal';
import type { KerjakanResponse, SoalKerjakan, Tugas } from '../api/types';

function fmt(dt?: string | null) {
  if (!dt) return 'Tanpa batas';
  return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID',
    { dateStyle: 'medium', timeStyle: 'short' });
}

// ---------------------------------------------------------------------
// Dialog pengerjaan tugas maupun kuis oleh siswa.
//   - Kuis berbasis soal  : pilihan ganda dikoreksi otomatis sistem
//   - Tugas biasa         : jawaban teks dan/atau berkas lampiran
// Setelah dinilai, kunci jawaban dan hasil koreksi ikut ditampilkan.
// ---------------------------------------------------------------------
export default function KerjakanTugas({ tugas, onClose, onSelesai }:
  { tugas: Tugas; onClose: () => void; onSelesai: () => void }) {
  const [data, setData] = useState<KerjakanResponse | null>(null);
  const [ans, setAns] = useState<Record<number, { pilihan?: string; jawaban_teks?: string }>>({});
  const [teks, setTeks] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: d } = await api.get(`/tugas/${tugas.id}/kerjakan`);
      setData(d);
      setTeks(d.pengumpulan?.jawaban || '');
      const awal: Record<number, any> = {};
      d.soal.forEach((s: SoalKerjakan) => {
        awal[s.id] = { pilihan: s.jawaban?.pilihan || '', jawaban_teks: s.jawaban?.jawaban_teks || '' };
      });
      setAns(awal);
    })();
  }, [tugas.id]);

  async function kirim() {
    if (!data) return;
    setErr(''); setSaving(true);
    try {
      if (data.berbasis_soal) {
        const jawaban = data.soal.map((s) => ({
          id_soal: s.id,
          pilihan: ans[s.id]?.pilihan || null,
          jawaban_teks: ans[s.id]?.jawaban_teks || null,
        }));
        await api.post(`/tugas/${tugas.id}/submit`, { jawaban });
      } else {
        const fd = new FormData();
        fd.append('jawaban', teks);
        if (file) fd.append('file', file);
        await api.post(`/tugas/${tugas.id}/submit`, fd);
      }
      onSelesai();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Gagal mengumpulkan tugas');
    } finally { setSaving(false); }
  }

  if (!data) return <Modal title={tugas.judul} onClose={onClose}><p className="muted">Memuat...</p></Modal>;

  const graded = data.graded;
  const terkunci = data.periode_terkunci;
  const bolehKirim = !graded && !terkunci;

  return (
    <Modal title={data.tugas.judul} onClose={onClose}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        <span className="badge green">{data.tugas.nama_mapel}</span>
        {data.tugas.nama_guru && <span className="badge gray">👨‍🏫 {data.tugas.nama_guru}</span>}
        <span className="badge gray">Pertemuan {data.tugas.nomor_pertemuan}</span>
      </div>

      <p className="muted" style={{ marginBottom: 6, whiteSpace: 'pre-wrap' }}>
        {data.tugas.deskripsi || 'Tidak ada instruksi khusus.'}
      </p>
      <p className="muted" style={{ fontSize: 12 }}>Batas waktu: {fmt(data.tugas.deadline)}</p>

      {terkunci && (
        <div className="notice kunci" style={{ marginTop: 12, marginBottom: 0 }}>
          <span className="ikon">🔒</span>
          <div>Periode {data.kode_periode} sudah dikunci sehingga tugas ini tidak dapat dikumpulkan lagi.</div>
        </div>
      )}

      {graded && (
        <div className="notice info" style={{ marginTop: 12, marginBottom: 0 }}>
          <span className="ikon">⭐</span>
          <div>Nilai akhir Anda: <strong style={{ fontSize: 17 }}>{data.total_skor}</strong></div>
        </div>
      )}

      {err && <div className="error-box" style={{ marginTop: 12 }}>{err}</div>}

      {/* ---------- Kuis berbasis soal ---------- */}
      {data.berbasis_soal ? (
        <div style={{ marginTop: 14 }}>
          {data.soal.map((s, i) => {
            const a = ans[s.id] || {};
            const jw = s.jawaban;
            return (
              <div key={s.id} style={{
                border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span className={`badge ${s.tipe === 'esai' ? 'orange' : 'green'}`}>
                    {s.tipe === 'esai' ? 'Esai' : 'PG'}
                  </span>
                  <span className="badge gray">bobot {s.bobot}</span>
                  {graded && s.tipe === 'pilihan_ganda' && (jw?.benar === 1
                    ? <span className="badge green">Benar</span>
                    : <span className="badge red">Salah</span>)}
                  {graded && s.tipe === 'esai' &&
                    <span className="badge gray">skor {jw?.skor ?? 0}/{s.bobot}</span>}
                </div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{i + 1}. {s.pertanyaan}</div>

                {s.tipe === 'pilihan_ganda' ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {(['A', 'B', 'C', 'D'] as const).map((k) => {
                      const val = (s as any)[`pilihan_${k.toLowerCase()}`];
                      if (!val) return null;
                      const isKunci = graded && s.jawaban_benar === k;
                      const dipilih = a.pilihan === k;
                      return (
                        <label key={k} style={{
                          display: 'flex', gap: 8, alignItems: 'center', padding: '7px 10px',
                          border: '1px solid', borderColor: isKunci ? 'var(--primary)' : 'var(--border)',
                          borderRadius: 6, cursor: bolehKirim ? 'pointer' : 'default',
                          background: isKunci ? 'var(--primary-light)' : dipilih ? '#f0f4ff' : '#fff',
                        }}>
                          <input type="radio" name={`s${s.id}`} style={{ width: 'auto' }}
                            checked={dipilih} disabled={!bolehKirim}
                            onChange={() => setAns({ ...ans, [s.id]: { ...a, pilihan: k } })} />
                          <span><strong>{k}.</strong> {val}</span>
                          {isKunci && <span className="badge green" style={{ marginLeft: 'auto' }}>Kunci</span>}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  bolehKirim ? (
                    <textarea placeholder="Tulis jawaban esai Anda..." value={a.jawaban_teks || ''}
                      onChange={(e) => setAns({ ...ans, [s.id]: { ...a, jawaban_teks: e.target.value } })} />
                  ) : (
                    <div style={{
                      background: '#f9fafb', borderRadius: 6, padding: 8,
                      fontSize: 13, whiteSpace: 'pre-wrap',
                    }}>{jw?.jawaban_teks || <span className="muted">(belum dijawab)</span>}</div>
                  )
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ---------- Tugas biasa ---------- */
        <div style={{ marginTop: 14 }}>
          {bolehKirim ? (
            <>
              <div className="field"><label>Jawaban (teks)</label>
                <textarea value={teks} placeholder="Tulis jawaban Anda di sini..."
                  onChange={(e) => setTeks(e.target.value)} /></div>
              <div className="field"><label>Lampiran Berkas (opsional)</label>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <p className="muted" style={{ fontSize: 12, marginTop: 5 }}>
                  Format dokumen atau gambar, ukuran maksimum 20 MB.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="field"><label>Jawaban Anda</label>
                <div style={{
                  background: '#f9fafb', borderRadius: 6, padding: 10,
                  fontSize: 13, whiteSpace: 'pre-wrap',
                }}>{data.pengumpulan?.jawaban || <span className="muted">(tidak ada jawaban teks)</span>}</div>
              </div>
              {data.pengumpulan?.file && (
                <a className="btn secondary small" target="_blank" rel="noreferrer"
                  href={`${API_BASE}/uploads/${data.pengumpulan.file}`}>⬇ Unduh Berkas Jawaban</a>
              )}
            </>
          )}
        </div>
      )}

      <div className="modal-actions">
        <button className="btn secondary" onClick={onClose}>Tutup</button>
        {bolehKirim && (
          <button className="btn" onClick={kirim} disabled={saving}>
            {saving ? 'Mengirim...' : 'Kumpulkan'}
          </button>
        )}
      </div>
    </Modal>
  );
}
