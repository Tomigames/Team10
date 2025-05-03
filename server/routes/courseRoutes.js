// Kunju Menon - sxm22026
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// get course details from db using course id and user id
router.get('/:courseId', async (req, res) => {
  try {
    const userId = parseInt(req.headers['x-user-id'], 10);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    // retrieves from db
    const [rows] = await pool.execute(
      'SELECT * FROM course WHERE CourseID = ? AND UserID = ?',
      [req.params.courseId, userId]
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
    const userId = parseInt(req.headers['x-user-id'], 10);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    // retrieves from db
    const [rows] = await pool.execute(`
      SELECT a.*, w.AssessmentType, w.WeightPercentage 
      FROM assessment a
      JOIN weight w ON a.WeightID = w.WeightID
      WHERE a.UserID = ? AND a.CourseID = ?
    `, [userId, req.params.courseId]);
    res.json(rows);
    // errors
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new weight (calls stored procedure add_weight)
router.post('/:courseId/weights', async (req, res) => {
  try {
    const userId = parseInt(req.headers['x-user-id'], 10);
    const courseId = parseInt(req.params.courseId, 10);
    const { assessmentType, weightPercentage } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    // Call the stored procedure
    await pool.execute(
      'CALL add_weight(?, ?, ?, ?)',
      [userId, courseId, assessmentType, weightPercentage]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding weight:', err);
    res.status(500).json({ error: 'DB error adding weight', details: err.message });
  }
});

// Delete a weight (calls stored procedure delete_weight)
router.delete('/:courseId/weights', async (req, res) => {
  try {
    const userId = parseInt(req.headers['x-user-id'], 10);
    const courseId = parseInt(req.params.courseId, 10);
    const { assessmentType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    await pool.execute(
      'CALL delete_weight(?, ?, ?)',
      [userId, courseId, assessmentType]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting weight:', err);
    res.status(500).json({ error: 'DB error deleting weight', details: err.message });
  }
});

module.exports = router;