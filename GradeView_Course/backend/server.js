// server.js
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// create a connection pool (inlined config from dbconfig.json) :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Biryani123',
  database: 'gradeview',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- transcripts endpoint (credits) :contentReference[oaicite:6]{index=6}&#8203;:contentReference[oaicite:7]{index=7} ---
app.get('/api/users/:userId/credits', async (req, res) => {
  const headerUserId = parseInt(req.headers['x-user-id'], 10);
  const paramUserId  = parseInt(req.params.userId, 10);

  if (!headerUserId) return res.status(401).json({ error: 'Unauthenticated' });
  if (headerUserId !== paramUserId) return res.status(403).json({ error: 'Forbidden' });

  try {
    const [rows] = await pool.execute(
      'SELECT CreditsCompleted FROM transcript WHERE UserID = ?',
      [paramUserId]
    );
    const completed = rows.length ? rows[0].CreditsCompleted : 0;
    const totalReq  = 120;
    res.json({ completed, remaining: Math.max(0, totalReq - completed) });
  } catch (err) {
    console.error('Error fetching credits:', err);
    res.status(500).json({ error: 'Failed to retrieve credit information' });
  }
});

// --- grade‐weights endpoints :contentReference[oaicite:8]{index=8}&#8203;:contentReference[oaicite:9]{index=9} ---
app.get('/api/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  try {
    const [rows] = await pool.execute(
      `SELECT 
         WeightID         AS id,
         AssessmentType   AS assessmentType,
         WeightPercentage AS currentWeight
       FROM weight
       WHERE UserID = ? AND CourseID = ?
       ORDER BY AssessmentType`,
      [userId, courseId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching weights:', err);
    res.status(500).json({ error: 'DB error fetching weights', details: err.message });
  }
});

app.put('/api/courses/:courseId/weights', async (req, res) => {
  const userId   = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  const updates  = req.body.updates;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [currentWeights] = await conn.execute(
      'SELECT WeightID, WeightPercentage FROM weight WHERE UserID = ? AND CourseID = ?',
      [userId, courseId]
    );

    const updatesWithDelta = updates.map(u => {
      const oldW = currentWeights.find(w => w.id === u.id)?.WeightPercentage || 0;
      return { ...u, delta: u.newWeight - Number(oldW) };
    }).sort((a, b) => a.delta - b.delta);

    await conn.beginTransaction();
    for (const { id, assessmentType, newWeight } of updatesWithDelta) {
      await conn.execute(
        'CALL update_weight(?, ?, ?, ?, ?)',
        [id, userId, courseId, assessmentType, newWeight]
      );
    }
    await conn.commit();
    
    // Recalculate the course grade after updating weights
    const newGrade = await recalculateCourseGrade(courseId, userId);
    
    res.json({ success: true, grade: newGrade });
  } catch (err) {
    console.error('Error updating weights:', err);
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    let message = 'DB error updating weights';
    if (err.message.includes('Total weight percentage cannot exceed 100%')) {
      message = 'Total weight percentage cannot exceed 100%';
    }
    res.status(500).json({ error: message, details: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// --- all your other course‐and‐assessment endpoints (from the larger server.js) :contentReference[oaicite:10]{index=10}&#8203;:contentReference[oaicite:11]{index=11} ---

// fetch courses for a user
app.get('/', async (req, res) => {
  const { semester, year, userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID is required to fetch courses.' });

  try {
    let sql = 'SELECT * FROM course WHERE UserID = ?';
    const params = [userId];

    if (semester && semester !== 'All') {
      sql += ' AND Semester = ?';
      params.push(semester);
    }

    if (year && year !== 'All') {
      sql += ' AND Year = ?';
      params.push(year);
    }

    const [data] = await pool.execute(sql, params);

    res.json(data);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json('Error fetching courses');
  }
});

// fetch courses by semester
app.get('/courses/:semester', async (req, res) => {
  const semester = req.params.semester;
  const userId   = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required to fetch courses by semester.' });

  try {
    const [data] = await pool.execute(
      'SELECT * FROM course WHERE Semester = ? AND UserID = ?', [semester, userId]
    );
    res.json(data);
  } catch (err) {
    console.error('Error fetching courses by semester:', err);
    res.status(500).json('Error fetching courses by semester');
  }
});

// fetch courses by year
app.get('/courses/year/:year', async (req, res) => {
  const year   = req.params.year;
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required to fetch courses by year.' });

  try {
    const [data] = await pool.execute(
      'SELECT * FROM course WHERE Year = ? AND UserID = ?', [year, userId]
    );
    res.json(data);
  } catch (err) {
    console.error('Error fetching courses by year:', err);
    res.status(500).json('Error fetching courses by year');
  }
});

// fetch assessments for a course
app.get('/api/courses/:courseId/assessments', async (req, res) => {
  const courseId = req.params.courseId;
  const userId = parseInt(req.headers['x-user-id'], 10);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    const [data] = await pool.execute(
      `SELECT a.AssessmentID, a.UserID, a.CourseID, a.WeightID,
              a.AssessmentName, a.IndividualGrade,
              w.AssessmentType, w.WeightPercentage
       FROM assessment a
       JOIN weight w ON a.WeightID = w.WeightID
       JOIN course c ON a.CourseID = c.CourseID
       WHERE a.CourseID = ? AND c.UserID = ?
       ORDER BY w.WeightID`,
      [courseId, userId]
    );
    res.json(data);
  } catch (err) {
    console.error('Error fetching assessments:', err);
    res.status(500).json({ error: 'Error fetching assessments', details: err.message });
  }
});

// Function to calculate the overall grade for a course
async function recalculateCourseGrade(courseId, userId) {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Get all weights for the course
    const [weights] = await conn.execute(
      'SELECT WeightID, WeightPercentage FROM weight WHERE UserID = ? AND CourseID = ?',
      [userId, courseId]
    );
    
    // Get all assessments for the course
    const [assessments] = await conn.execute(
      'SELECT AssessmentID, WeightID, IndividualGrade FROM assessment WHERE UserID = ? AND CourseID = ?',
      [userId, courseId]
    );
    
    // Group assessments by weight
    const assessmentsByWeight = {};
    assessments.forEach(assessment => {
      if (!assessmentsByWeight[assessment.WeightID]) {
        assessmentsByWeight[assessment.WeightID] = [];
      }
      assessmentsByWeight[assessment.WeightID].push(assessment);
    });
    
    // Calculate weighted average
    let totalWeightedGrade = 0;
    let totalWeight = 0;
    
    for (const weight of weights) {
      const weightAssessments = assessmentsByWeight[weight.WeightID] || [];
      let sectionTotal = 0;
      let sectionCount = 0;
      
      for (const assessment of weightAssessments) {
        if (assessment.IndividualGrade !== null) {
          sectionTotal += parseFloat(assessment.IndividualGrade);
          sectionCount++;
        }
      }
      
      const sectionAverage = sectionCount > 0 ? sectionTotal / sectionCount : 0;
      const weightPercentage = parseFloat(weight.WeightPercentage) || 0;
      
      totalWeightedGrade += sectionAverage * (weightPercentage / 100);
      totalWeight += weightPercentage;
    }
    
    // Calculate final grade
    const finalGrade = totalWeight > 0 ? totalWeightedGrade : 0;
    
    // Update the course grade
    await conn.execute(
      'UPDATE course SET OverallGrade = ? WHERE CourseID = ? AND UserID = ?',
      [finalGrade, courseId, userId]
    );
    
    return finalGrade;
  } catch (err) {
    console.error('Error recalculating course grade:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Add assessment endpoint
app.post('/api/courses/:courseId/assessments', async (req, res) => {
  const userId = parseInt(req.headers['x-user-id'], 10);
  const courseId = parseInt(req.params.courseId, 10);
  const { weightId, assessmentName, individualGrade } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Insert the assessment
    await conn.execute(
      'INSERT INTO assessment (UserID, CourseID, WeightID, AssessmentName, IndividualGrade) VALUES (?, ?, ?, ?, ?)',
      [userId, courseId, weightId, assessmentName, individualGrade]
    );
    
    // Recalculate the course grade
    const newGrade = await recalculateCourseGrade(courseId, userId);
    
    res.json({ success: true, grade: newGrade });
  } catch (err) {
    console.error('Error adding assessment:', err);
    res.status(500).json({ error: 'Failed to add assessment' });
  } finally {
    if (conn) conn.release();
  }
});

// Update assessment endpoint
app.put('/api/assessments/:assessmentId', async (req, res) => {
  const userId = parseInt(req.headers['x-user-id'], 10);
  const assessmentId = parseInt(req.params.assessmentId, 10);
  const { assessmentName, individualGrade } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Get the course ID for this assessment
    const [assessments] = await conn.execute(
      'SELECT CourseID FROM assessment WHERE AssessmentID = ? AND UserID = ?',
      [assessmentId, userId]
    );
    
    if (assessments.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    const courseId = assessments[0].CourseID;
    
    // Update the assessment
    await conn.execute(
      'UPDATE assessment SET AssessmentName = ?, IndividualGrade = ? WHERE AssessmentID = ? AND UserID = ?',
      [assessmentName, individualGrade, assessmentId, userId]
    );
    
    // Recalculate the course grade
    const newGrade = await recalculateCourseGrade(courseId, userId);
    
    res.json({ success: true, grade: newGrade });
  } catch (err) {
    console.error('Error updating assessment:', err);
    res.status(500).json({ error: 'Failed to update assessment' });
  } finally {
    if (conn) conn.release();
  }
});

// Delete assessment endpoint
app.delete('/api/assessments/:assessmentId', async (req, res) => {
  const userId = parseInt(req.headers['x-user-id'], 10);
  const assessmentId = parseInt(req.params.assessmentId, 10);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Get the course ID for this assessment
    const [assessments] = await conn.execute(
      'SELECT CourseID FROM assessment WHERE AssessmentID = ? AND UserID = ?',
      [assessmentId, userId]
    );
    
    if (assessments.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    const courseId = assessments[0].CourseID;
    
    // Delete the assessment
    await conn.execute(
      'DELETE FROM assessment WHERE AssessmentID = ? AND UserID = ?',
      [assessmentId, userId]
    );
    
    // Recalculate the course grade
    const newGrade = await recalculateCourseGrade(courseId, userId);
    
    res.json({ success: true, grade: newGrade });
  } catch (err) {
    console.error('Error deleting assessment:', err);
    res.status(500).json({ error: 'Failed to delete assessment' });
  } finally {
    if (conn) conn.release();
  }
});

// add a new course
app.post('/course', async (req, res) => {
  const { UserId, CourseName, Instructor, Semester, Year, CreditHours } = req.body;
  if (!UserId) return res.status(400).json({ error: 'User ID is required to add a course.' });

  try {
    await pool.execute(
      'CALL add_course(?, ?, ?, ?, ?, ?)',
      [UserId, CourseName, Instructor, Semester, Year, CreditHours]
    );
    res.json({ message: 'Course added successfully' });
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json('Error adding course');
  }
});

// update a course
app.put('/course/:id', async (req, res) => {
  const CourseId = parseInt(req.params.id);
  const { UserID, CourseName, Instructor, Semester, Year, CreditHours } = req.body;
  if (!UserID) return res.status(400).json({ error: 'User ID is required to update a course.' });

  try {
    await pool.execute(
      'CALL update_course(?, ?, ?, ?, ?, ?, ?)',
      [UserID, CourseId, CourseName, Instructor, Semester, Year, CreditHours]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json('Error updating course');
  }
});

// delete a course
app.delete('/course/:id', async (req, res) => {
  const CourseId = parseInt(req.params.id);
  const { UserID } = req.body;
  if (!UserID) return res.status(400).json({ error: 'User ID is required to delete a course.' });

  try {
    await pool.execute(
      'CALL delete_course(?, ?)',
      [UserID, CourseId]
    );
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json('Error deleting course');
  }
});

// fetch single course details
app.get('/course/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId   = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required to fetch course details.' });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM course WHERE CourseID = ? AND UserID = ?',
      [courseId, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course not found or does not belong to this user.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching course details:', err);
    res.status(500).json('Error fetching course details');
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
