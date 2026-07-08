import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../api/types';

interface MenuItem { to: string; label: string; icon: string; }

const MENUS: Record<Role, MenuItem[]> = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/guru', label: 'Data Guru', icon: '👨‍🏫' },
    { to: '/admin/siswa', label: 'Data Siswa', icon: '🎓' },
    { to: '/admin/kelas', label: 'Data Kelas', icon: '🏫' },
    { to: '/admin/mapel', label: 'Mata Pelajaran', icon: '📚' },
  ],
  guru: [
    { to: '/guru', label: 'Dashboard', icon: '📊' },
    { to: '/guru/materi', label: 'Materi', icon: '📄' },
    { to: '/guru/tugas', label: 'Tugas & Kuis', icon: '📝' },
    { to: '/guru/forum', label: 'Forum Diskusi', icon: '💬' },
  ],
  siswa: [
    { to: '/siswa', label: 'Dashboard', icon: '📊' },
    { to: '/siswa/materi', label: 'Materi', icon: '📄' },
    { to: '/siswa/tugas', label: 'Tugas & Kuis', icon: '📝' },
    { to: '/siswa/nilai', label: 'Nilai', icon: '⭐' },
    { to: '/siswa/forum', label: 'Forum Diskusi', icon: '💬' },
  ],
};

const ROLE_LABEL: Record<Role, string> = { admin: 'Administrator', guru: 'Guru', siswa: 'Siswa' };

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const menus = MENUS[user.role];

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">E-Learning<br />SMA Negeri 1 Karau Kuala</div>
        <nav onClick={() => setOpen(false)}>
          {menus.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === `/${user.role}`}>
              <span>{m.icon}</span> {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="foot">{ROLE_LABEL[user.role]}</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn secondary small menu-toggle" onClick={() => setOpen((o) => !o)}>☰</button>
            <span className="title">Sistem E-Learning</span>
          </div>
          <div className="user">
            <div className="avatar">{user.nama.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user.nama}</div>
              <div className="muted" style={{ fontSize: 11 }}>{ROLE_LABEL[user.role]}</div>
            </div>
            <button className="btn secondary small" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
