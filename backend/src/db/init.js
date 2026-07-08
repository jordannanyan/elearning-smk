// Menjalankan schema.sql untuk membuat database & seluruh tabel.
// Jalankan: npm run db:init
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  // Koneksi tanpa memilih database dulu (schema.sql yang membuat DB-nya)
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Menjalankan schema.sql ...');
  await conn.query(sql);
  console.log('[OK] Database & tabel berhasil dibuat.');
  await conn.end();
}

main().catch((err) => {
  console.error('Gagal init database:', err.message);
  process.exit(1);
});
