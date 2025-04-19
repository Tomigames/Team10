// Kunju Menon - sxm22026
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// get course details from db using course id and user id
router.get('/:courseId', async (req, res) => {
  try {
    // retrieves from db
    const [rows] = await pool.execute(
      'SELECT * FROM course WHERE CourseID = ? AND UserID = ?',
      [req.params.courseId, req.query.userId]
    );
    res.json(rows[0] || {});
    // errors
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get assessments with weights from db
router.get('/:courseId/assessments', async (req, res) => {
  try {
    // retrieves from db
    const [rows] = await pool.execute(`
      SELECT a.*, w.AssessmentType, w.WeightPercentage 
      FROM assessment a
      JOIN weight w ON a.WeightID = w.WeightID
      WHERE a.UserID = ? AND a.CourseID = ?
    `, [req.query.userId, req.params.courseId]);
    res.json(rows);
    // errors
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;