import type { TipeTugas } from '../api/types';

// ---------------------------------------------------------------------
// Penamaan jenis penilaian dipusatkan di sini agar tampil seragam pada
// seluruh halaman: daftar tugas siswa, pengelolaan pertemuan guru,
// penilaian, rekap nilai, dan daftar nilai per mata pelajaran.
// ---------------------------------------------------------------------
const LABEL: Record<TipeTugas, string> = {
  tugas: 'Tugas', kuis: 'Kuis', uts: 'UTS', uas: 'UAS',
};

const WARNA: Record<TipeTugas, string> = {
  tugas: 'green', kuis: 'orange', uts: 'biru', uas: 'red',
};

export const labelTipe = (t: TipeTugas) => LABEL[t] || t;
export const warnaTipe = (t: TipeTugas) => WARNA[t] || 'gray';
