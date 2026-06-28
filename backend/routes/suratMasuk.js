const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Simpan dengan timestamp + nama asli (biar unik)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET semua surat masuk
router.get('/', (req, res) => {
  db.query('SELECT * FROM surat_masuk', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST surat masuk baru (dengan lampiran)
router.post('/', upload.single('lampiran'), (req, res) => {
  const {
    nomorSurat,
    pengirim,
    nomorAgenda,
    tanggalSurat,
    tanggalDiterima,
    ringkasan,
    kodeKlasifikasi,
    keterangan
  } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  // Simpan ke database
  const sql = `
    INSERT INTO surat_masuk
    (nomor_surat, pengirim, nomor_agenda, tanggal_surat, tanggal_diterima, ringkasan, kode_klasifikasi, keterangan, lampiran)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    nomorSurat, pengirim, nomorAgenda, tanggalSurat, tanggalDiterima,
    ringkasan, kodeKlasifikasi, keterangan, lampiran
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Jika nomor surat sudah ada
        return res.status(400).json({ error: "Nomor surat sudah ada" });
      }
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Surat masuk berhasil ditambahkan" });
  });
});

// DELETE surat masuk berdasarkan nomor surat
router.delete('/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'DELETE FROM surat_masuk WHERE nomor_surat = ?',
    [nomor_surat],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
      res.json({ message: 'Surat masuk berhasil dihapus' });
    }
  );
});

// UPDATE surat masuk berdasarkan nomor_surat
router.put('/:nomor_surat', upload.single('lampiran'), (req, res) => {
  const { nomor_surat } = req.params;
  const {
    pengirim,
    nomorAgenda,
    tanggalSurat,
    tanggalDiterima,
    ringkasan,
    kodeKlasifikasi,
    keterangan
  } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  const sql = `
    UPDATE surat_masuk SET
      pengirim = ?,
      nomor_agenda = ?,
      tanggal_surat = ?,
      tanggal_diterima = ?,
      ringkasan = ?,
      kode_klasifikasi = ?,
      keterangan = ?${lampiran ? ', lampiran = ?' : ''}
    WHERE nomor_surat = ?
  `;
  const params = [
    pengirim,
    nomorAgenda,
    tanggalSurat,
    tanggalDiterima,
    ringkasan,
    kodeKlasifikasi,
    keterangan,
    ...(lampiran ? [lampiran] : []),
    nomor_surat
  ];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
    res.json({ message: 'Surat masuk berhasil diupdate' });
  });
});

// Route khusus, letakkan di atas
router.get('/search', (req, res) => { /* ... */ });
router.get('/special', (req, res) => { /* ... */ });

// Route dinamis, letakkan di bawah
// GET surat masuk berdasarkan nomor_surat
router.get('/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'SELECT * FROM surat_masuk WHERE nomor_surat = ?',
    [nomor_surat],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
      res.json(results[0]);
    }
  );
});

// DOWNLOAD lampiran surat
router.get('/lampiran/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'SELECT lampiran FROM surat_masuk WHERE nomor_surat = ?',
    [nomor_surat],
    (err, results) => {
      if (err || results.length === 0) return res.status(404).send('Lampiran tidak ditemukan');
      const { lampiran } = results[0];
      const filePath = path.join(__dirname, '../uploads', lampiran);
      res.download(filePath, lampiran); // pakai nama file di server
    }
  );
});

module.exports = router;