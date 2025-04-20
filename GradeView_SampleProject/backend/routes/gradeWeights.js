// routes/gradeWeights.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all weights for a course
router.get('/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  
  console.log(`GET /courses/${courseId}/weights - User ID: ${userId}`);
  console.log('Headers:', req.headers);
  
  if (!userId) {
    console.log('Authentication failed: Missing x-user-id header');
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    console.log(`Querying weights for UserID=${userId}, CourseID=${courseId}`);
    const [rows] = await db.query(
      `SELECT
         WeightID         AS id,
         AssessmentType   AS assessmentType,
         WeightPercentage AS currentWeight
       FROM weight
       WHERE UserID = ? AND CourseID = ?
       ORDER BY AssessmentType`,
      [userId, courseId]
    );
    
    console.log(`Found ${rows.length} weight records`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching weights:', err);
    res.status(500).json({ error: 'DB error fetching weights', details: err.message });
  }
});

// PUT updated weights (calls your stored procedure)
router.put('/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  const updates  = req.body.updates;
  
  console.log(`PUT /courses/${courseId}/weights - User ID: ${userId}`);
  console.log('Headers:', req.headers);
  console.log('Updates:', updates);
  
  if (!userId) {
    console.log('Authentication failed: Missing x-user-id header');
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  let conn;
  try {
    conn = await db.getConnection();
    console.log('Database connection established');
    
    // Compute deltas and sort updates
    const [currentWeights] = await conn.execute(
      'SELECT WeightID, WeightPercentage FROM weight WHERE UserID = ? AND CourseID = ?',
      [userId, courseId]
    );
    
    const updatesWithDelta = updates.map(u => {
      const oldWeight = currentWeights.find(w => w.WeightID === u.id)?.WeightPercentage || 0;
      return { ...u, delta: u.newWeight - Number(oldWeight) };
    });
    updatesWithDelta.sort((a, b) => a.delta - b.delta);
    const sortedUpdates = updatesWithDelta.map(({ delta, ...u }) => u);
    
    await conn.beginTransaction();
    console.log('Transaction started');

    for (const u of sortedUpdates) {
      console.log(`Updating weight ID=${u.id}, Type=${u.assessmentType}, Weight=${u.newWeight}`);
      await conn.execute(
        'CALL update_weight(?, ?, ?, ?, ?)',
        [u.id, userId, courseId, u.assessmentType, u.newWeight]
      );
    }

    await conn.commit();
    console.log('Transaction committed');
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating weights:', err);
    if (conn) { 
      await conn.rollback(); 
      console.log('Transaction rolled back');
      conn.release(); 
    }
    
    // Extract the SQL error message if it exists
    let errorMessage = 'DB error updating weights';
    if (err.message && err.message.includes('Total weight percentage cannot exceed 100%')) {
      errorMessage = 'Total weight percentage cannot exceed 100%';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ error: errorMessage, details: err.message });
  } finally {
    if (conn) {
      conn.release();
      console.log('Database connection released');
    }
  }
});

module.exports = router;
