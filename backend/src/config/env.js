// Memuat variabel .env dari root folder backend secara ABSOLUT,
// sehingga tidak bergantung pada direktori kerja saat server dijalankan.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
