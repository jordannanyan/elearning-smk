export type Role = 'admin' | 'guru' | 'siswa';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
}

export interface UserRow extends User {
  aktif: number;
  nip?: string;
  mapel?: string;
  nis?: string;
  id_kelas?: number | null;
  nama_kelas?: string;
}

export interface Kelas {
  id: number;
  nama_kelas: string;
  tingkat: string;
  tahun_ajaran: string;
  jumlah_siswa?: number;
}

export interface Mapel {
  id: number;
  nama: string;
  kode?: string;
  deskripsi?: string;
  id_guru?: number | null;
  nama_guru?: string;
}

export interface Materi {
  id: number;
  id_mapel: number;
  judul: string;
  konten?: string;
  file?: string;
  tgl_upload: string;
  nama_mapel?: string;
}

export interface Pengumpulan {
  id: number;
  tgl_kumpul: string;
  terlambat: number;
  skor?: number | null;
}

export interface Tugas {
  id: number;
  id_mapel: number;
  judul: string;
  deskripsi?: string;
  deadline?: string | null;
  tipe: 'tugas' | 'kuis';
  nama_mapel?: string;
  jumlah_kumpul?: number;
  jumlah_soal?: number;
  pengumpulan?: Pengumpulan | null;
}

export type TipeSoal = 'pilihan_ganda' | 'esai';

export interface Soal {
  id: number;
  id_tugas?: number;
  pertanyaan: string;
  tipe: TipeSoal;
  pilihan_a?: string | null;
  pilihan_b?: string | null;
  pilihan_c?: string | null;
  pilihan_d?: string | null;
  jawaban_benar?: string | null;
  bobot: number;
  urutan?: number;
}

// Soal + jawaban siswa (untuk halaman kerjakan/review siswa)
export interface SoalKerjakan extends Soal {
  jawaban?: {
    pilihan?: string | null;
    jawaban_teks?: string | null;
    benar?: number | null;
    skor?: number | null;
  } | null;
}

export interface KerjakanResponse {
  tugas: { id: number; judul: string; deskripsi?: string; deadline?: string | null; tipe: string };
  berbasis_soal: boolean;
  sudah_kumpul: boolean;
  graded: boolean;
  total_skor: number | null;
  soal: SoalKerjakan[];
}

// Detail pengumpulan untuk penilaian guru
export interface SoalPenilaian extends Soal {
  pilihan?: string | null;
  jawaban_teks?: string | null;
  benar?: number | null;
  skor_didapat?: number | null;
}

export interface PengumpulanRow {
  id: number;
  id_siswa: number;
  nama_siswa: string;
  nis?: string;
  file?: string;
  jawaban?: string;
  tgl_kumpul: string;
  terlambat: number;
  id_nilai?: number | null;
  skor?: number | null;
  catatan?: string;
  esai_belum_dinilai?: number;
}

export interface NilaiRow {
  judul_tugas: string;
  tipe: string;
  nama_mapel: string;
  tgl_kumpul: string;
  terlambat: number;
  skor?: number | null;
  catatan?: string;
  tgl_penilaian?: string | null;
}

export interface ForumPost {
  id: number;
  id_mapel: number;
  id_user: number;
  judul?: string;
  pesan: string;
  id_parent?: number | null;
  tgl_post: string;
  nama_user: string;
  role: Role;
  balasan?: ForumPost[];
}
