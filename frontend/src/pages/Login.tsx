import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) { nav(`/${user.role}`, { replace: true }); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const masuk = await login(email, password);
      nav(`/${masuk.role}`, { replace: true });
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Gagal login. Periksa koneksi server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>Sistem E-Learning</h1>
        <p className="sub">SMA Negeri 1 Karau Kuala</p>

        {err && <div className="error-box">{err}</div>}

        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@smakk.sch.id" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required />
        </div>
        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="tautan-beranda"><Link to="/">← Kembali ke halaman depan sekolah</Link></p>
      </form>
    </div>
  );
}
