const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File statis hasil upload (materi & pengumpulan tugas)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) =>
  res.json({ app: 'E-Learning SMA Negeri 1 Karau Kuala - API', status: 'ok' }));

app.use('/api', routes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan' }));

// Error handler terpusat
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(413).json({ message: 'Ukuran file terlalu besar (maks 20MB)' });
  res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan server' });
});

module.exports = app;
