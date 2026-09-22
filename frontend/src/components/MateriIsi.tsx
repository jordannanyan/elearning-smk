import { API_BASE } from '../api/client';
import type { Materi } from '../api/types';

// ---------------------------------------------------------------------
// Penyaji materi sesuai jenisnya. Materi bertipe video maupun tautan
// YouTube ditampilkan langsung sebagai pemutar video sehingga siswa dapat
// menontonnya tanpa meninggalkan halaman pembelajaran.
// ---------------------------------------------------------------------

const LABEL: Record<string, { teks: string; warna: string; ikon: string }> = {
  teks: { teks: 'Uraian', warna: 'gray', ikon: '📘' },
  file: { teks: 'Berkas', warna: 'green', ikon: '📎' },
  video: { teks: 'Video', warna: 'orange', ikon: '🎬' },
  link: { teks: 'Video / Tautan', warna: 'orange', ikon: '🔗' },
};

export default function MateriIsi({ materi: m }: { materi: Materi }) {
  const lbl = LABEL[m.tipe] || LABEL.teks;
  const berkas = m.file ? `${API_BASE}/uploads/${m.file}` : null;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
        <span className={`badge ${lbl.warna}`}>{lbl.ikon} {lbl.teks}</span>
        {m.tgl_upload && (
          <span className="muted" style={{ fontSize: 11.5 }}>
            Diunggah {new Date(m.tgl_upload.replace(' ', 'T')).toLocaleDateString('id-ID',
              { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <div className="judul">{m.judul}</div>
      {m.konten && (
        <p className="muted" style={{ marginTop: 6, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{m.konten}</p>
      )}

      {m.tipe === 'file' && berkas && (
        <a className="btn small" href={berkas} target="_blank" rel="noreferrer"
          style={{ marginTop: 10 }}>⬇ Unduh Berkas</a>
      )}

      {m.tipe === 'video' && berkas && (
        <div className="video-wrap">
          <video src={berkas} controls preload="metadata" />
        </div>
      )}

      {m.tipe === 'link' && (
        m.embed_url ? (
          <div className="video-wrap">
            <iframe src={m.embed_url} title={m.judul}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        ) : (
          <a className="btn small" href={m.url || '#'} target="_blank" rel="noreferrer"
            style={{ marginTop: 10 }}>🔗 Buka Tautan</a>
        )
      )}
    </div>
  );
}
