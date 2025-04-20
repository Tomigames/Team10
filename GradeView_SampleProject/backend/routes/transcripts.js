// routes/transcripts.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET credit hours for a user
router.get('/users/:userId/credits', async (req, res) => {
  const headerUserId = parseInt(req.headers['x-user-id'], 10);
  const paramUserId = parseInt(req.params.userId, 10);
  
  // Check if the user is authenticated
  if (!headerUserId) return res.status(401).json({ error: 'Unauthenticated' });
  
  // Check if the user is requesting their own data
  if (headerUserId !== paramUserId) return res.status(403).json({ error: 'Forbidden' });
  
  try {
    const [rows] = await db.query(
      'SELECT CreditsCompleted FROM transcript WHERE UserID = ?',
      [paramUserId]
    );
    const completed = rows.length ? rows[0].CreditsCompleted : 0;
    const totalReq = 120; 
    res.json({
      completed,
      remaining: Math.max(0, totalReq - completed)
    });
  } catch (err) {
    console.error('Error fetching credits:', err);
    res.status(500).json({ error: 'Failed to retrieve credit information' });
  }
});

module.exports = router;
