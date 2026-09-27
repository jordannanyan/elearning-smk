import { Component, ErrorInfo, ReactNode } from 'react';

// ---------------------------------------------------------------------
// Penangkap galat tampilan. Tanpa komponen ini, satu kesalahan saat
// merender akan membuat seluruh halaman menjadi kosong (layar putih)
// tanpa keterangan apa pun. Dengan komponen ini pengguna tetap melihat
// pesan yang jelas beserta cara memulihkannya.
// ---------------------------------------------------------------------
interface Props { children: ReactNode }
interface State { galat: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { galat: null };

  static getDerivedStateFromError(galat: Error): State {
    return { galat };
  }

  componentDidCatch(galat: Error, info: ErrorInfo) {
    console.error('Terjadi kesalahan pada tampilan:', galat, info.componentStack);
  }

  mulaiUlangSesi = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch { /* penyimpanan peramban tidak tersedia */ }
    window.location.href = '/login';
  };

  render() {
    if (!this.state.galat) return this.props.children;

    return (
      <div className="login-wrap">
        <div className="login-card" style={{ maxWidth: 520 }}>
          <h1>Terjadi Kesalahan</h1>
          <p className="sub">Halaman tidak dapat ditampilkan</p>

          <div className="notice bahaya" style={{ marginBottom: 16 }}>
            <span className="ikon">⚠️</span>
            <div>
              Sistem mengalami kendala saat menampilkan halaman ini. Silakan muat ulang halaman.
              Apabila kendala berlanjut, keluar dari sesi lalu masuk kembali.
            </div>
          </div>

          <details style={{ marginBottom: 16 }}>
            <summary className="muted" style={{ cursor: 'pointer', fontSize: 13 }}>
              Rincian teknis
            </summary>
            <pre style={{
              background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 6,
              padding: 10, marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap',
              maxHeight: 180, overflowY: 'auto',
            }}>{this.state.galat.message}</pre>
          </details>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => window.location.reload()}>Muat Ulang Halaman</button>
            <button className="btn secondary" style={{ flex: 1, justifyContent: 'center' }}
              onClick={this.mulaiUlangSesi}>Keluar &amp; Masuk Lagi</button>
          </div>
        </div>
      </div>
    );
  }
}
