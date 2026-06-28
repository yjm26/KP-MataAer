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

// GET semua surat keluar
router.get('/', (req, res) => {
  db.query('SELECT * FROM surat_keluar', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST surat keluar baru (dengan lampiran)
router.post('/', upload.single('lampiran'), (req, res) => {
  const {
    nomorSurat,
    tujuan,
    nomorAgenda,
    tanggalSurat,
    tanggalKeluar,
    ringkasan,
    kodeKlasifikasi,
    keterangan
  } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO surat_keluar
    (nomor_surat, tujuan, nomor_agenda, tanggal_surat, tanggal_keluar, ringkasan, kode_klasifikasi, keterangan, lampiran)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    nomorSurat, tujuan, nomorAgenda, tanggalSurat, tanggalKeluar,
    ringkasan, kodeKlasifikasi, keterangan, lampiran
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Nomor surat sudah ada" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Surat keluar berhasil ditambahkan" });
  });
});

// DELETE surat keluar berdasarkan nomor surat
router.delete('/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'DELETE FROM surat_keluar WHERE nomor_surat = ?',
    [nomor_surat],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
      res.json({ message: 'Surat keluar berhasil dihapus' });
    }
  );
});

// UPDATE surat keluar berdasarkan nomor_surat
router.put('/:nomor_surat', upload.single('lampiran'), (req, res) => {
  const { nomor_surat } = req.params;
  const {
    tujuan,
    nomorAgenda,
    tanggalSurat,
    tanggalKeluar,
    ringkasan,
    kodeKlasifikasi,
    keterangan
  } = req.body;
  const lampiran = req.file ? req.file.filename : null;

  const sql = `
    UPDATE surat_keluar SET
      tujuan = ?,
      nomor_agenda = ?,
      tanggal_surat = ?,
      tanggal_keluar = ?,
      ringkasan = ?,
      kode_klasifikasi = ?,
      keterangan = ?${lampiran ? ', lampiran = ?' : ''}
    WHERE nomor_surat = ?
  `;
  const params = [
    tujuan,
    nomorAgenda,
    tanggalSurat,
    tanggalKeluar,
    ringkasan,
    kodeKlasifikasi,
    keterangan,
    ...(lampiran ? [lampiran] : []),
    nomor_surat
  ];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
    res.json({ message: 'Surat keluar berhasil diupdate' });
  });
});

// GET surat keluar berdasarkan nomor_surat
router.get('/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'SELECT * FROM surat_keluar WHERE nomor_surat = ?',
    [nomor_surat],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Surat tidak ditemukan' });
      res.json(results[0]);
    }
  );
});

// DOWNLOAD lampiran surat keluar
router.get('/lampiran/:nomor_surat', (req, res) => {
  const { nomor_surat } = req.params;
  db.query(
    'SELECT lampiran FROM surat_keluar WHERE nomor_surat = ?',
    [nomor_surat],
    (err, results) => {
      if (err || results.length === 0) return res.status(404).send('Lampiran tidak ditemukan');
      const { lampiran } = results[0];
      const filePath = path.join(__dirname, '../uploads', lampiran);
      res.download(filePath, lampiran);
    }
  );
});

module.exports = router;