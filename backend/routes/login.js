const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const sql = 'SELECT * FROM account WHERE email = ? AND password = ? LIMIT 1';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Kirim juga role ke frontend!
    const user = { id: results[0].id, email: results[0].email, role: results[0].role };
    res.json(user); // kirim langsung user, tidak perlu { user }
  });
});

module.exports = router;