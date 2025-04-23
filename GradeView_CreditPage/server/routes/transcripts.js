// routes/transcripts.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/api/users/:userId/credits', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.execute(
      'SELECT CreditsCompleted FROM transcript WHERE UserID = ?',
      [userId]
    );
    const completed = rows.length ? rows[0].CreditsCompleted : 0;
    const required = 120;
    res.json({
      completed,
      remaining: Math.max(0, required - completed)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve credit information' });
  }
});

module.exports = router;
