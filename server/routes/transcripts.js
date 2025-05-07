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

// New route to get full transcript data
router.get('/api/transcripts/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.execute(
      'SELECT TranscriptID, UserID, CumulativeGPA, Standing, CreditsCompleted FROM transcript WHERE UserID = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching transcript:', err);
    res.status(500).json({ error: 'Failed to fetch transcript data' });
  }
});

module.exports = router;
