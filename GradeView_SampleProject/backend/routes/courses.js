// routes/courses.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/courses', async (req, res) => {
  // userId passed in HTTP header for privacy
  const userId = parseInt(req.headers['x-user-id'], 10);
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

  try {
    const [rows] = await db.query(
      `SELECT CourseID AS id, CourseName AS name
         FROM courses
        WHERE UserID = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error fetching courses' });
  }
});

// GET /api/courses/:courseId (fetch metadata)
router.get('/courses/:courseId', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

  try {
    const [rows] = await db.query(
      `SELECT CourseID AS id, CourseName AS name
         FROM courses
        WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error fetching course' });
  }
});

module.exports = router;
