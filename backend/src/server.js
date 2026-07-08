const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await pool.query('SELECT 1'); // uji koneksi DB
    console.log('[OK] Terhubung ke database MySQL');
  } catch (err) {
    console.error('[WARN] Gagal koneksi database:', err.message);
    console.error('       Pastikan MySQL berjalan & jalankan: npm run db:init && npm run db:seed');
  }
  app.listen(PORT, () => console.log(`[OK] Server berjalan di http://localhost:${PORT}`));
})();
