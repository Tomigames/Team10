// Kunju Menon - sxm220267

// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');
// const NotificationSettingsClass = require('./BackendApi');
// const userRoutes = require('./routes/userRoutes');
// const courseRoutes = require('./routes/courseRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 🔧 Database Config
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'Biryani123',
//   database: 'gradeview',
// };

// // 🔗 Connect MySQL
// const db = mysql.createConnection(dbConfig);
// db.connect((err) => {
//   if (err) {
//     console.error('❌ Database connection failed:', err);
//   } else {
//     console.log('✅ Connected to MySQL database');
//   }
// });

// // ------------------------------------- NOTIFS ENDPOINTS ------------------------------
// // 📦 Notification Settings Manager
// const settingsManager = new NotificationSettingsClass(dbConfig);

// // 📄 Middleware to log incoming requests
// app.use((req, res, next) => {
//   console.log(`🔍 ${req.method} ${req.url}`);
//   next();
// });

// // 🚀 Ping Test
// app.post('/ping', (req, res) => res.send('pong'));

// // 🧠 Notification + GPA routes
// app.get('/api/gpa-goal', async (req, res) => {
//   try {
//     const data = await settingsManager.getGpaAlert(1);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch GPA goal settings' });
//   }
// });

// app.post('/api/gpa-goal', async (req, res) => {
//   const { goal, preference } = req.body;
//   try {
//     await settingsManager.saveGpaAlert(1, goal, preference);
//     res.json({ message: 'GPA goal saved successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save GPA goal settings' });
//   }
// });

// app.get('/api/notification-triggers', async (req, res) => {
//   try {
//     const data = await settingsManager.getNotificationTriggers(1);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch notification preferences' });
//   }
// });

// app.post('/api/notification-triggers', async (req, res) => {
//   const { lowGradeAlert, newGradeAlert, followUpAlert } = req.body;
//   try {
//     await settingsManager.saveNotificationTriggers(1, {
//       lowGradeAlert,
//       newGradeAlert,
//       followUpAlert
//     });
//     res.json({ message: 'Notification settings updated' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save notification preferences' });
//   }
// });

// // 👤 User/Course Routers
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);

// // 📚 Raw SQL Endpoints
// app.get("/", (req, res) => {
//   const userId = req.query.userId;
//   if (!userId) return res.status(400).json({ error: "User ID is required." });

//   const sql = "SELECT * FROM course WHERE UserID = ?";
//   db.query(sql, [userId], (err, data) => {
//     if (err) return res.status(500).json("Error fetching courses");
//     res.json(data);
//   });
// });

// app.get("/courses/:semester", (req, res) => {
//   const { semester } = req.params;
//   const userId = req.query.userId;
//   if (!userId) return res.status(400).json({ error: "User ID is required." });

//   const sql = "SELECT * FROM course WHERE Semester = ? AND UserID = ?";
//   db.query(sql, [semester, userId], (err, data) => {
//     if (err) return res.status(500).json("Error fetching courses by semester");
//     res.json(data);
//   });
// });

// app.get("/courses/year/:year", (req, res) => {
//   const { year } = req.params;
//   const userId = req.query.userId;
//   if (!userId) return res.status(400).json({ error: "User ID is required." });

//   const sql = "SELECT * FROM course WHERE Year = ? AND UserID = ?";
//   db.query(sql, [year, userId], (err, data) => {
//     if (err) return res.status(500).json("Error fetching courses by year");
//     res.json(data);
//   });
// });

// app.get("/assessments/:courseId", (req, res) => {
//   const { courseId } = req.params;
//   const userId = req.query.userId;
//   if (!userId) return res.status(400).json({ error: "User ID is required." });

//   const sql = `
//     SELECT a.AssessmentID, a.UserID, a.CourseID, a.WeightID, a.AssessmentName, a.IndividualGrade,
//            w.AssessmentType, w.WeightPercentage
//     FROM assessment a
//     JOIN weight w ON a.WeightID = w.WeightID
//     JOIN course c ON a.CourseID = c.CourseID
//     WHERE a.CourseID = ? AND c.UserID = ?
//     ORDER BY w.WeightID;
//   `;
//   db.query(sql, [courseId, userId], (err, data) => {
//     if (err) return res.status(500).json("Error fetching assessments");
//     res.json(data);
//   });
// });

// app.post("/course", (req, res) => {
//   const { UserId, CourseName, Instructor, Semester, Year, CreditHours } = req.body;
//   if (!UserId) return res.status(400).json({ error: "User ID is required." });

//   db.query("CALL add_course(?, ?, ?, ?, ?, ?)",
//     [UserId, CourseName, Instructor, Semester, Year, CreditHours],
//     (err) => {
//       if (err) return res.status(500).json("Error adding course");
//       res.json({ message: "Course added successfully" });
//     });
// });

// app.delete("/course/:id", (req, res) => {
//   const CourseId = parseInt(req.params.id);
//   const { UserID } = req.body;
//   if (!UserID) return res.status(400).json({ error: "User ID is required." });

//   db.query("CALL delete_course(?, ?)", [UserID, CourseId], (err) => {
//     if (err) return res.status(500).json("Error deleting course");
//     res.json({ message: "Course deleted successfully" });
//   });
// });

// app.put("/course/:id", (req, res) => {
//   const CourseId = parseInt(req.params.id);
//   const { UserID, CourseName, Instructor, Semester, Year, CreditHours } = req.body;
//   if (!UserID) return res.status(400).json({ error: "User ID is required." });

//   db.query("CALL update_course(?, ?, ?, ?, ?, ?, ?)",
//     [UserID, CourseId, CourseName, Instructor, Semester, Year, CreditHours],
//     (err) => {
//       if (err) return res.status(500).json("Error updating course");
//       res.json({ message: "Course updated successfully" });
//     });
// });
// app.get("/course/:id", (req, res) => {
//   const courseId = req.params.id;
//   const userId = req.query.userId;

//   if (!userId) return res.status(400).json({ error: "User ID is required." });

//   const sql = "SELECT * FROM course WHERE CourseID = ? AND UserID = ?";
//   db.query(sql, [courseId, userId], (err, data) => {
//     if (err) return res.status(500).json("Error fetching course");
//     if (data.length === 0) return res.status(404).json({ error: "Course not found." });
//     res.json(data[0]);
//   });
// });


// // 🛑 Error Middleware
// app.use((err, req, res, next) => {
//   console.error("❗ Unhandled Error:", err.stack);
//   res.status(500).send("Something broke!");
// });

// // 🎧 Start Server
// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// server.js
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');
const NotificationSettingsClass = require('./BackendApi');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const pool = require('./config/db');  // Import the pool from db.js

const app = express();
app.use(cors());
app.use(express.json());

// 👤 User/Course Routers
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

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

// fetch all courses for a user
app.get('/', async (req, res) => {
  const userId = parseInt(req.headers['x-user-id'], 10);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const { semester, year } = req.query;
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
    res.status(500).json({ error: 'Error fetching courses', details: err.message });
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
      'CALL add_assessment(?, ?, ?, ?, ?)',
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
      'CALL update_assessment(?, ?, ?, ?, ?)',
      [assessmentId, userId, courseId, assessmentName, individualGrade]
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
      'CALL delete_assessment(?, ?, ?)',
      [assessmentId, userId, courseId]
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
  

// ------------------------------------- NOTIFS ENDPOINTS ------------------------------
// 📦 Notification Settings Manager
const settingsManager = new NotificationSettingsClass({
  host: 'localhost',
  user: 'root',
  password: 'my$qlWorkbench2005',
  database: 'gradeview'
});

// 📄 Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// 🚀 Ping Test
app.post('/ping', (req, res) => res.send('pong'));

// 🧠 Notification + GPA routes
app.get('/api/gpa-goal', async (req, res) => {
  try {
    const data = await settingsManager.getGpaAlert(1);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GPA goal settings' });
  }
});

app.post('/api/gpa-goal', async (req, res) => {
  const { goal, preference } = req.body;
  try {
    await settingsManager.saveGpaAlert(1, goal, preference);
    res.json({ message: 'GPA goal saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save GPA goal settings' });
  }
});

app.get('/api/notification-triggers', async (req, res) => {
  try {
    const data = await settingsManager.getNotificationTriggers(1);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

app.post('/api/notification-triggers', async (req, res) => {
  const { lowGradeAlert, newGradeAlert, followUpAlert } = req.body;
  try {
    await settingsManager.saveNotificationTriggers(1, {
      lowGradeAlert,
      newGradeAlert,
      followUpAlert
    });
    res.json({ message: 'Notification settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save notification preferences' });
  }
});




app.get('/api/transcripts/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query(
      'SELECT CumulativeGPA FROM transcript WHERE UserID = ?',
      [userId]
    );
 
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }
 
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching GPA:', err);
    res.status(500).json({ error: 'Failed to fetch GPA' });
  }
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));