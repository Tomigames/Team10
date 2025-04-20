// routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('../db');
const router  = express.Router();

// POST /api/auth/signup
router.post('/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [username, hash]
    );
    res.json({ userId: result.insertId, username });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [rows] = await db.query(
      'SELECT UserID AS id, password FROM user WHERE username = ?',
      [username]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ userId: user.id, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
