import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../api/types';

// ---------------------------------------------------------------------
// Akun saya.
//
// Halaman ini dapat dibuka oleh seluruh pengguna sistem, baik
// administrator, guru, maupun siswa, untuk melihat identitas akunnya
// dan mengubah kata sandinya sendiri. Kata sandi lama wajib diisikan
// kembali sebagai pemastian bahwa yang mengubah memang pemilik akun,
// dan pemeriksaannya dilakukan di sisi server.
// ---------------------------------------------------------------------
const LABEL_PERAN: Record<Role, string> = {
  admin: 'Administrator', guru: 'Guru', siswa: 'Siswa',
};

const PANJANG_MINIMAL = 6;

export default function Akun() {
  const { user } = useAuth();
  const [lama, setLama] = useState('');
  const [baru, setBaru] = useState('');
  const [ulangi, setUlangi] = useState('');
  const [tampak, setTampak] = useState(false);
  const [galat, setGalat] = useState('');
  const [pesan, setPesan] = useState('');
  const [proses, setProses] = useState(false);

  if (!user) return null;

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setGalat('');
    setPesan('');

    // Pemeriksaan di sisi tampilan, agar pengguna segera memperoleh
    // keterangan tanpa menunggu jawaban server.
    if (baru.length < PANJANG_MINIMAL) {
      setGalat(`Kata sandi baru minimal ${PANJANG_MINIMAL} karakter.`);
      return;
    }
    if (baru !== ulangi) {
      setGalat('Ulangan kata sandi baru tidak sama dengan kata sandi baru.');
      return;
    }
    if (baru === lama) {
      setGalat('Kata sandi baru harus berbeda dengan kata sandi lama.');
      return;
    }

    setProses(true);
    try {
      await api.put('/auth/password', { passwordLama: lama, passwordBaru: baru });
      setPesan('Kata sandi berhasil diubah. Gunakan kata sandi baru pada login berikutnya.');
      setLama(''); setBaru(''); setUlangi('');
    } catch (e: any) {
      setGalat(e.response?.data?.message
        || 'Kata sandi gagal diubah. Periksa sambungan Anda, lalu coba lagi.');
    } finally {
      setProses(false);
    }
  }

  return (
    <div>
      <div className="page-head"><h2>Akun Saya</h2></div>

      <div className="akun-grid">
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Identitas Akun</h3>
          <dl className="daftar-identitas">
            <div><dt>Nama</dt><dd>{user.nama}</dd></div>
            <div><dt>Surel</dt><dd>{user.email}</dd></div>
            <div><dt>Peran</dt><dd>{LABEL_PERAN[user.role]}</dd></div>
          </dl>
          <div className="notice info" style={{ marginTop: 14, marginBottom: 0 }}>
            <span className="ikon">ℹ️</span>
            <div>
              Nama dan surel akun hanya dapat diubah oleh administrator sekolah. Apabila
              terdapat kekeliruan penulisan, sampaikan kepada administrator.
            </div>
          </div>
        </div>

        <form className="card" onSubmit={simpan}>
          <h3 style={{ marginBottom: 12 }}>Ubah Kata Sandi</h3>

          {galat && <div className="notice bahaya"><span className="ikon">⚠️</span><div>{galat}</div></div>}
          {pesan && <div className="notice info"><span className="ikon">✅</span><div>{pesan}</div></div>}

          <div className="field">
            <label>Kata Sandi Lama</label>
            <input type={tampak ? 'text' : 'password'} value={lama}
              onChange={(e) => setLama(e.target.value)}
              autoComplete="current-password"
              placeholder="Kata sandi yang dipakai sekarang" required />
          </div>
          <div className="field">
            <label>Kata Sandi Baru</label>
            <input type={tampak ? 'text' : 'password'} value={baru}
              onChange={(e) => setBaru(e.target.value)}
              autoComplete="new-password" placeholder={`Minimal ${PANJANG_MINIMAL} karakter`}
              minLength={PANJANG_MINIMAL} required />
            <small className="muted">Minimal {PANJANG_MINIMAL} karakter.</small>
          </div>
          <div className="field">
            <label>Ulangi Kata Sandi Baru</label>
            <input type={tampak ? 'text' : 'password'} value={ulangi}
              onChange={(e) => setUlangi(e.target.value)}
              autoComplete="new-password" placeholder="Ketik ulang kata sandi baru"
              minLength={PANJANG_MINIMAL} required />
          </div>

          <label className="pilih-tampak">
            <input type="checkbox" checked={tampak}
              onChange={(e) => setTampak(e.target.checked)} />
            Tampilkan kata sandi
          </label>

          <button className="btn" disabled={proses} style={{ marginTop: 14 }}>
            {proses ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}
