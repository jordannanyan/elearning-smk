import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/client';
import type { User } from '../api/types';

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null!);

// ---------------------------------------------------------------------
// Sesi login dipulihkan dari localStorage. Isi localStorage diperlakukan
// sebagai data yang tidak dapat dipercaya: apabila rusak atau tidak
// lengkap (misalnya tersisa dari versi aplikasi sebelumnya), data
// tersebut dibuang dan pengguna diminta masuk kembali. Tanpa pemeriksaan
// ini, data yang cacat membuat tampilan gagal dimuat sama sekali.
// ---------------------------------------------------------------------
function sesiTersimpan(): User | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || !localStorage.getItem('token')) return null;
    const u = JSON.parse(raw);
    const sah = u && typeof u === 'object'
      && typeof u.nama === 'string' && u.nama.length > 0
      && ['admin', 'guru', 'siswa'].includes(u.role);
    return sah ? (u as User) : null;
  } catch {
    return null;
  }
}

function bersihkanSesi() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const tersimpan = sesiTersimpan();
    if (!tersimpan) bersihkanSesi();
    return tersimpan;
  });

  // Cocokkan kembali sesi dengan data di server agar akun yang sudah
  // dihapus, dinonaktifkan, atau berubah tidak menyisakan sesi usang.
  useEffect(() => {
    if (!user) return;
    api.get('/auth/me')
      .then((r) => {
        const segar = r.data?.user;
        if (segar?.nama) {
          localStorage.setItem('user', JSON.stringify(segar));
          setUser(segar);
        }
      })
      .catch(() => { bersihkanSesi(); setUser(null); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    bersihkanSesi();
    setUser(null);
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
