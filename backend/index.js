const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Serve folder uploads secara statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pengarsipan',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database!');
});

// Export db jika perlu diakses di routes
module.exports = db;

// Import routes
const suratMasukRoutes = require('./routes/suratMasuk');
const loginRoutes = require('./routes/login');
const suratKeluarRouter = require('./routes/suratKeluar');
const refrensiRouter = require('./routes/refrensi');
const chartRouter = require('./routes/chart');
const accountsRouter = require('./routes/accounts');

app.use('/api/surat-masuk', suratMasukRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/surat-keluar', suratKeluarRouter);
app.use('/api/refrensi', refrensiRouter);
app.use('/api/chart', chartRouter);
app.use('/api/accounts', accountsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
