export type Role = 'admin' | 'guru' | 'siswa';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
}

/* ---------- Periode pembelajaran ---------- */
export type StatusPeriode = 'draft' | 'aktif' | 'terkunci';

export interface Periode {
  id: number;
  kode: string;               // contoh: 2026/1
  tahun_ajaran: string;       // contoh: 2025/2026
  semester: number;           // 1 = ganjil, 2 = genap
  nama_semester?: string;
  label?: string;
  tgl_mulai?: string | null;
  tgl_selesai?: string | null;
  status: StatusPeriode;
  dikunci_oleh?: number | null;
  tgl_dikunci?: string | null;
  nama_pengunci?: string | null;
  jumlah_kelas?: number;
  jumlah_pengampuan?: number;
}

/* ---------- Pengguna ---------- */
export interface UserRow extends User {
  aktif: number;
  nip?: string;
  nis?: string;
  guru_id?: number;
  siswa_id?: number;
  kelas_aktif?: string | null;
  jumlah_pengampuan?: number;
  wali_kelas?: string | null;
}

/* ---------- Kelas & mata pelajaran ---------- */
export interface Kelas {
  id: number;
  id_periode: number;
  nama_kelas: string;
  tingkat: string;
  id_wali?: number | null;
  nama_wali?: string | null;
  nip_wali?: string | null;
  kode_periode?: string;
  tahun_ajaran?: string;
  semester?: number;
  status_periode?: StatusPeriode;
  jumlah_siswa?: number;
  jumlah_mapel?: number;
}

export interface Mapel {
  id: number;
  nama: string;
  kode?: string;
  kelompok?: string;
  deskripsi?: string;
  aktif: number;
  jumlah_kelas?: number;
  jumlah_guru?: number;
  tingkat_diajarkan?: string | null;
}

export interface KelasMapel {
  id: number;
  id_kelas: number;
  id_mapel: number;
  id_guru?: number | null;
  nama_mapel: string;
  kode_mapel?: string;
  kelompok?: string;
  nama_kelas: string;
  tingkat: string;
  id_periode: number;
  kode_periode: string;
  tahun_ajaran: string;
  semester: number;
  status_periode: StatusPeriode;
  nama_guru?: string | null;
  jumlah_pertemuan: number;
  jumlah_materi: number;
  jumlah_tugas: number;
  jumlah_siswa: number;
  deadline_terdekat?: string | null;
}

export interface AnggotaKelas {
  id_anggota: number;
  id_siswa: number;
  nama: string;
  email: string;
  nis?: string;
  aktif: number;
}

/* ---------- Pertemuan & materi ---------- */
export interface Pertemuan {
  id: number;
  id_kelas_mapel: number;
  nomor: number;
  judul: string;
  deskripsi?: string | null;
  tanggal?: string | null;
  created_at?: string;
  jumlah_materi?: number;
  jumlah_tugas?: number;
  jumlah_diskusi?: number;
}

export type TipeMateri = 'teks' | 'file' | 'video' | 'link';

export interface Materi {
  id: number;
  id_pertemuan: number;
  judul: string;
  konten?: string | null;
  tipe: TipeMateri;
  file?: string | null;
  url?: string | null;
  embed_url?: string | null;
  tgl_upload?: string;
  nomor_pertemuan?: number;
  judul_pertemuan?: string;
  nama_mapel?: string;
  nama_kelas?: string;
  nama_guru?: string;
}

/* ---------- Tugas & kuis ---------- */
export type TipeTugas = 'tugas' | 'kuis';
export type Urgensi = 'lewat' | 'kritis' | 'mendesak' | 'aman' | 'tanpa_batas';
export type StatusTugasSiswa =
  | 'belum_dikerjakan' | 'menunggu_penilaian' | 'dinilai' | 'terlewat';

export interface PengumpulanSingkat {
  id: number;
  tgl_kumpul: string;
  terlambat: number;
  skor: number | null;
  catatan?: string | null;
}

export interface Tugas {
  id: number;
  id_pertemuan: number;
  judul: string;
  deskripsi?: string | null;
  deadline?: string | null;
  tipe: TipeTugas;
  nomor_pertemuan?: number;
  judul_pertemuan?: string;
  id_kelas_mapel?: number;
  nama_mapel?: string;
  nama_kelas?: string;
  tingkat?: string;
  kode_periode?: string;
  status_periode?: StatusPeriode;
  nama_guru?: string | null;
  jumlah_soal?: number;
  jumlah_kumpul?: number;
  sisa_hari?: number | null;
  urgensi?: Urgensi;
  pengumpulan?: PengumpulanSingkat | null;
  status?: StatusTugasSiswa;
}

export type TipeSoal = 'pilihan_ganda' | 'esai';

export interface Soal {
  id: number;
  id_tugas: number;
  pertanyaan: string;
  tipe: TipeSoal;
  pilihan_a?: string | null;
  pilihan_b?: string | null;
  pilihan_c?: string | null;
  pilihan_d?: string | null;
  jawaban_benar?: string | null;
  bobot: number;
  urutan: number;
}

export interface SoalKerjakan {
  id: number;
  pertanyaan: string;
  tipe: TipeSoal;
  bobot: number;
  pilihan_a?: string | null;
  pilihan_b?: string | null;
  pilihan_c?: string | null;
  pilihan_d?: string | null;
  jawaban_benar?: string;
  jawaban?: { pilihan?: string | null; jawaban_teks?: string | null; benar?: number; skor?: number } | null;
}

export interface KerjakanResponse {
  tugas: Tugas;
  periode_terkunci: boolean;
  kode_periode: string;
  berbasis_soal: boolean;
  sudah_kumpul: boolean;
  pengumpulan: { id: number; jawaban?: string | null; file?: string | null } | null;
  graded: boolean;
  total_skor: number | null;
  soal: SoalKerjakan[];
}

export type StatusPengumpulan =
  | 'belum_mengumpulkan' | 'terkumpul' | 'perlu_nilai_esai' | 'dinilai';

export interface PengumpulanRow {
  id: number | null;
  id_siswa: number;
  nama_siswa: string;
  nis?: string;
  file?: string | null;
  jawaban?: string | null;
  tgl_kumpul?: string | null;
  terlambat?: number;
  skor?: number | null;
  catatan?: string | null;
  esai_belum_dinilai?: number;
  status: StatusPengumpulan;
}

export interface SoalPenilaian extends Soal {
  pilihan?: string | null;
  jawaban_teks?: string | null;
  benar?: number | null;
  skor_didapat?: number | null;
}

/* ---------- Forum diskusi ---------- */
export interface ForumPost {
  id: number;
  id_pertemuan: number;
  id_user: number;
  judul?: string | null;
  pesan: string;
  id_parent?: number | null;
  tgl_post: string;
  nama_user: string;
  role: Role;
  balasan?: ForumPost[];
}

export interface IsiPertemuan {
  pertemuan: Pertemuan & {
    nama_mapel: string; nama_kelas: string; tingkat: string;
    kode_periode: string; status_periode: StatusPeriode; nama_guru?: string | null;
  };
  materi: Materi[];
  tugas: Tugas[];
  diskusi: ForumPost[];
}

/* ---------- Rekap nilai ---------- */
export interface NilaiTugas {
  id_tugas: number;
  judul_tugas: string;
  tipe: TipeTugas;
  nomor_pertemuan: number;
  deadline?: string | null;
  tgl_kumpul?: string | null;
  terlambat: boolean;
  skor: number | null;
  catatan?: string | null;
  status: 'dinilai' | 'menunggu_penilaian' | 'tidak_dikumpulkan' | 'belum_dikerjakan';
}

export interface NilaiMapel {
  id_kelas_mapel: number;
  nama_mapel: string;
  kode_mapel?: string;
  nama_guru?: string | null;
  nama_kelas: string;
  tugas: NilaiTugas[];
  jumlah_tugas: number;
  jumlah_dinilai: number;
  jumlah_missing: number;
  rata_rata: number | null;
}

export interface RekapNilai {
  periode: (Periode & { nama_kelas?: string; tingkat?: string }) | null;
  daftar_periode: (Periode & { nama_kelas?: string; tingkat?: string })[];
  mapel: NilaiMapel[];
  ringkasan: {
    jumlah_mapel: number; jumlah_tugas: number; jumlah_dinilai: number;
    jumlah_missing: number; rata_rata: number | null;
  };
}

/* ---------- Dashboard ---------- */
export interface Dashboard {
  role: Role;
  periode: Periode | null;
  [key: string]: any;
}

/* ---------- Raport sementara ---------- */
export interface Predikat { huruf: string; keterangan: string; }

export interface KelasRaport {
  id: number; nama_kelas: string; tingkat: string;
  kode: string; tahun_ajaran: string; semester: number; nama_semester: string;
  status_periode: StatusPeriode;
  wali_kelas: boolean;
  jumlah_siswa: number; jumlah_mapel: number;
  mapel_diajar: string | null;
}

export interface MapelRaport {
  id_kelas_mapel: number; nama_mapel: string; kode_mapel: string | null;
  kelompok: string | null; nama_guru: string | null; jumlah_tugas: number;
}

export interface RaportKelas {
  kelas: {
    id: number; nama_kelas: string; tingkat: string; kode: string;
    tahun_ajaran: string; semester: number; nama_semester: string;
    status_periode: StatusPeriode; wali_kelas: string | null;
  };
  mapel: MapelRaport[];
  siswa: {
    id_siswa: number; nama: string; nis: string | null;
    nilai: Record<number, { rata_rata: number | null; jumlah_dinilai: number }>;
    jumlah_mapel_dinilai: number; jumlah_mapel_tuntas: number;
    rata_rata: number | null; predikat: Predikat; peringkat: number | null;
  }[];
  kkm: number;
}

export interface RaportSiswa {
  identitas: { nama: string; nis: string | null } | null;
  daftar_periode: {
    id_periode: number; kode: string; tahun_ajaran: string; semester: number;
    nama_semester: string; status: StatusPeriode;
    id_kelas: number; nama_kelas: string; tingkat: string;
  }[];
  periode?: { id_periode: number };
  kelas: RaportKelas['kelas'] | null;
  mapel: (MapelRaport & {
    jumlah_dinilai: number; rata_rata: number | null;
    predikat: Predikat; tuntas: boolean | null;
  })[];
  ringkasan: {
    rata_rata: number | null; predikat: Predikat; peringkat: number | null;
    jumlah_siswa: number; jumlah_mapel: number;
    jumlah_mapel_dinilai: number; jumlah_mapel_tuntas: number;
  } | null;
  kkm: number;
}

/* ---------- Jadwal mata pelajaran ---------- */
export interface JamPelajaran {
  kelompok?: 'umum' | 'jumat';
  urutan?: number;
  jenis: 'pelajaran' | 'istirahat' | 'jumatan';
  jam_ke: number | null;
  mulai: string;
  selesai: string;
}

export interface SlotJadwal {
  id: number;
  id_kelas?: number;
  nama_kelas?: string;
  tingkat?: string;
  hari: number;
  nama_hari?: string;
  jam_ke: number;
  kode: string | null;
  huruf_mapel?: string | null;
  nama_mapel: string | null;
  kegiatan: string | null;
  id_guru?: number | null;
  nama_guru?: string | null;
  kode_jadwal?: number | null;   // nomor kode guru pada jadwal resmi
}

export interface InfoPeriodeJadwal {
  id: number; kode: string; tahun_ajaran: string; semester: number;
  status: StatusPeriode; nama_semester: string;
}

export interface JadwalSekolah {
  periode: InfoPeriodeJadwal | null;
  sekolah: string;
  kelas: { id: number; nama_kelas: string; tingkat: string }[];
  hari: string[];
  jam: { umum: JamPelajaran[]; jumat: JamPelajaran[] };
  slot: SlotJadwal[];
  kode_guru: { nomor: number; nama: string }[];
  kode_mapel: { kode: string; nama: string }[];
}

export interface JadwalSaya {
  periode: InfoPeriodeJadwal | null;
  milik: {
    jenis: 'kelas' | 'guru'; nama: string; tingkat?: string;
    wali_kelas?: string | null; kode_jadwal?: number | null; jumlah_jam?: number;
  } | null;
  hari: string[];
  jam: { umum: JamPelajaran[]; jumat: JamPelajaran[] };
  slot: SlotJadwal[];
}

/* ---------- Presensi (daftar hadir) ---------- */
export type StatusKehadiran = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface BarisPresensi {
  id_siswa: number; nama: string; nis: string | null;
  status: StatusKehadiran | null; label: string;
  keterangan: string | null;
  dicatat_oleh: 'siswa' | 'guru' | null;
  waktu: string | null;
}

export interface RingkasanPresensi {
  hadir: number; sakit: number; izin: number; alpa: number;
  belum: number; total: number; persen_hadir: number;
}

export interface PresensiPertemuan {
  pertemuan: {
    id: number; nomor: number; judul: string; tanggal: string | null;
    nama_mapel: string; nama_kelas: string; kode_periode: string; status_periode: StatusPeriode;
  };
  presensi: {
    id: number; status: 'dibuka' | 'ditutup'; tanggal: string;
    catatan: string | null; nama_guru: string | null;
    tgl_buka: string; tgl_tutup: string | null;
  } | null;
  daftar: BarisPresensi[];
  ringkasan: RingkasanPresensi | null;
  saya: BarisPresensi | null;
}

export interface RekapPresensiSiswa {
  mapel: {
    id_kelas_mapel: number; nama_mapel: string; kode_mapel: string | null;
    nama_guru: string | null; nama_kelas: string;
    jumlah_pertemuan: number; persen_hadir: number | null;
    hadir: number; sakit: number; izin: number; alpa: number; belum: number;
    pertemuan: {
      id_pertemuan: number; nomor: number; judul: string; tanggal: string | null;
      status_presensi: 'dibuka' | 'ditutup'; id_presensi: number;
      kehadiran: StatusKehadiran | null; label: string; keterangan: string | null;
    }[];
  }[];
  ringkasan: {
    hadir: number; sakit: number; izin: number; alpa: number;
    belum: number; pertemuan: number; persen_hadir: number | null;
  } | null;
}

export interface RekapPresensiKelas {
  kelas_mapel: { id_kelas: number; nama_kelas: string; nama_mapel: string };
  pertemuan: {
    id: number; nomor: number; judul: string;
    id_presensi: number | null; status: 'dibuka' | 'ditutup' | null; tanggal: string | null;
  }[];
  siswa: {
    id_siswa: number; nama: string; nis: string | null;
    kehadiran: Record<number, StatusKehadiran | null>;
    hadir: number; sakit: number; izin: number; alpa: number;
    persen_hadir: number | null;
  }[];
}
