// routes/gradeWeights.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET weights
router.get('/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

  try {
    const [rows] = await db.query(
      `SELECT
         WeightID           AS id,
         AssessmentType     AS assessmentType,
         WeightPercentage   AS currentWeight
       FROM weight
       WHERE UserID = ? AND CourseID = ?
       ORDER BY AssessmentType`,
      [userId, courseId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error fetching weights' });
  }
});

// PUT updates
router.put('/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  const updates  = req.body.updates;
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    for (const u of updates) {
      await conn.execute(
        'CALL update_weight(?, ?, ?, ?, ?)',
        [u.id, userId, courseId, u.assessmentType, u.newWeight]
      );
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (conn) { await conn.rollback(); conn.release(); }
    res.status(500).json({ error: 'DB error updating weights' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
