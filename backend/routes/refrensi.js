const express = require("express");
const router = express.Router();
const db = require("../db"); // Pastikan file db.js sudah ada dan terhubung ke database

// GET semua klasifikasi
router.get("/", (req, res) => {
  const query = `
    SELECT 
      r.id, 
      r.klasifikasi,
      (
        (SELECT COUNT(*) FROM surat_masuk s WHERE s.kode_klasifikasi = r.klasifikasi) +
        (SELECT COUNT(*) FROM surat_keluar sk WHERE sk.kode_klasifikasi = r.klasifikasi) 
      ) AS total_surat
    FROM refrensi r
    ORDER BY r.id ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST tambah klasifikasi baru
router.post("/", (req, res) => {
  const { klasifikasi } = req.body;
  if (!klasifikasi) return res.status(400).json({ error: "Klasifikasi wajib diisi" });

  const query = "INSERT INTO refrensi (klasifikasi) VALUES (?)";
  db.query(query, [klasifikasi], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, klasifikasi, total_surat: 0 });
  });
});

// PUT update total_surat (misal untuk increment)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { total_surat } = req.body;
  const query = "UPDATE refrensi SET total_surat = ? WHERE id = ?";
  db.query(query, [total_surat, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE klasifikasi
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM refrensi WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;