import { API_BASE } from '../api/client';

// ---------------------------------------------------------------------
// Penampil lampiran soal dan jawaban.
//
// Berkas gambar ditampilkan langsung agar soal yang berupa grafik,
// struktur kimia, atau pekerjaan tulisan tangan dapat dibaca tanpa
// diunduh lebih dahulu. Jenis berkas lain, terutama PDF, ditampilkan
// sebagai tautan yang terbuka pada tab baru.
// ---------------------------------------------------------------------
const EKSTENSI_GAMBAR = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export function adalahGambar(berkas: string) {
  const titik = berkas.lastIndexOf('.');
  return titik >= 0 && EKSTENSI_GAMBAR.includes(berkas.slice(titik).toLowerCase());
}

// Nama berkas disimpan dengan awalan penanda waktu, misalnya
// 1731412345678_grafik.png. Awalan itu disembunyikan dari pengguna.
export function namaAsli(berkas: string) {
  const garis = berkas.indexOf('_');
  return garis > 0 && /^\d+$/.test(berkas.slice(0, garis)) ? berkas.slice(garis + 1) : berkas;
}

export default function Lampiran({ berkas, label = 'Lampiran' }:
  { berkas?: string | null; label?: string }) {
  if (!berkas) return null;
  const url = `${API_BASE}/uploads/${berkas}`;

  if (adalahGambar(berkas)) {
    return (
      <a className="lampiran-gambar" href={url} target="_blank" rel="noreferrer"
        title="Klik untuk membuka ukuran penuh">
        <img src={url} alt={label} loading="lazy" />
      </a>
    );
  }

  return (
    <a className="lampiran-berkas" href={url} target="_blank" rel="noreferrer">
      <span aria-hidden="true">📎</span> {namaAsli(berkas)}
    </a>
  );
}
