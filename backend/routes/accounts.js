const express = require('express');
const router = express.Router();
const db = require('../db'); // koneksi database

// GET semua akun
router.get('/', (req, res) => {
  db.query('SELECT * FROM account', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST tambah akun
router.post('/', (req, res) => {
  const { email, password, role } = req.body;
  db.query(
    'INSERT INTO account (email, password, role) VALUES (?, ?, ?)',
    [email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// DELETE akun
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM account WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

module.exports = router;