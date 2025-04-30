// server.js
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

// create a connection pool (inlined config from dbconfig.json) :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'HowToView1!',
  database: 'gradeview',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  
// Helper function to get letter grade
const getLetterGrade = (numericGrade) => {
  if (numericGrade === null || numericGrade === undefined) {
    return 'N/A';
  }
  
  if (numericGrade >= 93) return 'A';
  if (numericGrade >= 90) return 'A-';
  if (numericGrade >= 87) return 'B+';
  if (numericGrade >= 83) return 'B';
  if (numericGrade >= 80) return 'B-';
  if (numericGrade >= 77) return 'C+';
  if (numericGrade >= 73) return 'C';
  if (numericGrade >= 70) return 'C-';
  if (numericGrade >= 67) return 'D+';
  if (numericGrade >= 63) return 'D';
  if (numericGrade >= 60) return 'D-';
  return 'F';
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Endpoint to generate and return a PDF transcript
app.get('/api/users/:userId/generate-transcript', async (req, res) => {
  const headerUserId = parseInt(req.headers['x-user-id'], 10);
  const paramUserId = parseInt(req.params.userId, 10);

  if (!headerUserId) return res.status(401).json({ error: 'Unauthenticated' });
  if (headerUserId !== paramUserId) return res.status(403).json({ error: 'Forbidden' });

  try {
    // Get user information
    const [userInfo] = await pool.execute(
      'SELECT UserID, FirstName, LastName FROM user WHERE UserID = ?',
      [paramUserId]
    );
    
    if (userInfo.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get credit information
    const [creditInfo] = await pool.execute(
      'SELECT CreditsCompleted FROM transcript WHERE UserID = ?',
      [paramUserId]
    );
    
    const creditsCompleted = creditInfo.length ? creditInfo[0].CreditsCompleted : 0;
    
    // Get all courses grouped by year and semester
    const [courses] = await pool.execute(
      `SELECT c.CourseID, c.CourseName, c.Instructor, c.Semester, c.Year, 
              c.CreditHours, c.OverallGrade
       FROM course c
       WHERE c.UserID = ?
       ORDER BY c.Year DESC, 
                CASE c.Semester 
                  WHEN 'Fall' THEN 1 
                  WHEN 'Summer' THEN 2 
                  WHEN 'Spring' THEN 3 
                  ELSE 4 
                END`,
      [paramUserId]
    );
    
    // Calculate GPA
    let totalQualityPoints = 0;
    let totalCreditHours = 0;
    
    courses.forEach(course => {
      if (course.OverallGrade !== null) {
        const creditHours = parseFloat(course.CreditHours);
        const grade = parseFloat(course.OverallGrade);
        
        // Convert numeric grade to quality points (A=4.0, B=3.0, etc.)
        let qualityPoints = 0;
        if (grade >= 90) qualityPoints = 4.0;
        else if (grade >= 80) qualityPoints = 3.0;
        else if (grade >= 70) qualityPoints = 2.0;
        else if (grade >= 60) qualityPoints = 1.0;
        
        totalQualityPoints += qualityPoints * creditHours;
        totalCreditHours += creditHours;
      }
    });
    
    const gpa = totalCreditHours > 0 ? (totalQualityPoints / totalCreditHours).toFixed(2) : '0.00';
    
    // Group courses by term
    const coursesByTerm = {};
    courses.forEach(course => {
      const termKey = `${course.Year}-${course.Semester}`;
      if (!coursesByTerm[termKey]) {
        coursesByTerm[termKey] = {
          year: course.Year,
          semester: course.Semester,
          courses: []
        };
      }
      coursesByTerm[termKey].courses.push(course);
    });
    
    // Convert to array and sort by year (desc) and semester
    const terms = Object.values(coursesByTerm).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      
      const semesterOrder = { 'Fall': 0, 'Summer': 1, 'Spring': 2 };
      return semesterOrder[a.semester] - semesterOrder[b.semester];
    });
    
    // Create a PDF document
    const doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      },
      size: 'letter'
    });
    
    // Create a temp file for the PDF
    const tempFilePath = path.join(os.tmpdir(), `transcript_${userInfo[0].LastName}_${userInfo[0].FirstName}_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(tempFilePath);
    
    // Pipe PDF to writable stream
    doc.pipe(writeStream);
    
    // Add university logo/name
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text("University Transcript", {
         align: 'center'
       });
    
    // Add official transcript text
    doc.moveDown()
       .fontSize(14)
       .font('Helvetica')
       .text("Official Academic Transcript", {
         align: 'center'
       });
    
    // Add current date
    const currentDate = new Date().toLocaleDateString();
    doc.fontSize(10)
       .text(`Generated on: ${currentDate}`, {
         align: 'right'
       });
    
    // Add student information
    doc.moveDown(2)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text("Student Information");
    
    doc.moveDown()
       .font('Helvetica')
       .text(`Name: ${userInfo[0].FirstName} ${userInfo[0].LastName}`)
       .text(`Student ID: ${userInfo[0].UserID}`)
    
    // Add credit summary
    doc.moveDown(1.5)
       .font('Helvetica-Bold')
       .text("Credit Summary");
    
    doc.moveDown()
       .font('Helvetica')
       .text(`Credits Completed: ${creditsCompleted}`)
       .text(`Credits Remaining: ${Math.max(0, 120 - creditsCompleted)}`)
       .text(`Graduation Requirements: 120 credits`)
       .text(`Cumulative GPA: ${gpa}`);
    
    // Add courses by term
    doc.moveDown(1.5)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text("Academic Record");
    
       terms.forEach(term => {
        // Define fixed column positions
        const colPositions = {
          course: 50,
          instructor: 175,
          credits: 275,
          grade: 350,
          letter: 390
        };
        
        // Check if we need a new page
        if (doc.y > 650) {
          doc.addPage();
        }
        
        // Add term header
        doc.moveDown()
           .font('Helvetica-Bold')
           .text(`${term.semester} ${term.year}`, 50);
        
        // Add table header
        doc.moveDown(0.5)
           .fontSize(12);
           
        doc.text('Course                         Instructor             Credits          Grade  Letter', colPositions.course, doc.y);
        
        // Add a line
        doc.moveTo(50, doc.y + 5)
           .lineTo(565, doc.y + 5)
           .stroke();
        
        doc.moveDown();
        
        // Add course rows
        doc.font('Helvetica');
        let termCredits = 0;
        let termPoints = 0;
        
        term.courses.forEach(course => {
          // Check if we need a new page
          if (doc.y > 700) {
            doc.addPage();
            // Re-add header on new page
            doc.fontSize(10)
               .font('Helvetica-Bold');
               
            doc.text('Course', colPositions.course, doc.y, { continued: true })
               .text('Instructor', colPositions.instructor, doc.y, { continued: true })
               .text('Credits', colPositions.credits, doc.y, { continued: true })
               .text('Grade', colPositions.grade, doc.y, { continued: true })
               .text('Letter', colPositions.letter, doc.y);
        
            // Add a line
            doc.moveTo(50, doc.y + 5)
               .lineTo(565, doc.y + 5)
               .stroke();
        
            doc.moveDown();
            doc.font('Helvetica');
          }

          const grade = course.OverallGrade !== null && course.OverallGrade !== undefined ? parseFloat(course.OverallGrade).toFixed(1) : 'N/A';
          const letterGrade = getLetterGrade(course.OverallGrade);
        
          const rowY = doc.y;
          doc.font('Helvetica')
             .text(course.CourseName, colPositions.course, rowY)
             .text(course.Instructor || 'TBD', colPositions.instructor, rowY)
             .text(course.CreditHours.toString(), colPositions.credits, rowY)
             .text(grade, colPositions.grade, rowY)
             .text(letterGrade, colPositions.letter, rowY);
        
          // Calculate term GPA components
          if (course.OverallGrade !== null && course.OverallGrade !== undefined) {
            const creditHours = parseFloat(course.CreditHours);
            const grade = parseFloat(course.OverallGrade);
        
            let qualityPoints = 0;
            if (grade >= 90) qualityPoints = 4.0;
            else if (grade >= 80) qualityPoints = 3.0;
            else if (grade >= 70) qualityPoints = 2.0;
            else if (grade >= 60) qualityPoints = 1.0;
        
            termPoints += qualityPoints * creditHours;
            termCredits += creditHours;
          }
        });
        
        // Add term GPA
        const termGPA = termCredits > 0 ? (termPoints / termCredits).toFixed(2) : 'N/A';
        
        doc.moveDown()
           .font('Helvetica-Bold')
           .text(`Term GPA: ${termGPA}`, { align: 'right' });
        
        doc.moveDown();
      });
    
    // Finalize the PDF
    doc.end();
    
    // Wait for PDF to be written
    writeStream.on('finish', () => {
      // Set response headers
      const filename = `transcript_${userInfo[0].LastName}_${userInfo[0].FirstName}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Stream the file to the response
      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(res);
      
      // Delete the temp file after streaming
      readStream.on('end', () => {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });
    });
  } catch (err) {
    console.error('Error generating transcript:', err);
    res.status(500).json({ error: 'Failed to generate transcript' });
  }
});

// Endpoint to fetch transcript data for a user
app.get('/api/users/:userId/transcript', async (req, res) => {
  const headerUserId = parseInt(req.headers['x-user-id'], 10);
  const paramUserId = parseInt(req.params.userId, 10);

  if (!headerUserId) return res.status(401).json({ error: 'Unauthenticated' });
  if (headerUserId !== paramUserId) return res.status(403).json({ error: 'Forbidden' });

  try {
    // Get user information
    const [userInfo] = await pool.execute(
      'SELECT UserID, FirstName, LastName FROM user WHERE UserID = ?',
      [paramUserId]
    );
    
    if (userInfo.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get credit information
    const [creditInfo] = await pool.execute(
      'SELECT CreditsCompleted FROM transcript WHERE UserID = ?',
      [paramUserId]
    );
    
    const creditsCompleted = creditInfo.length ? creditInfo[0].CreditsCompleted : 0;
    
    // Get all courses grouped by year and semester
    const [courses] = await pool.execute(
      `SELECT c.CourseID, c.CourseName, c.Instructor, c.Semester, c.Year, 
              c.CreditHours, c.OverallGrade
       FROM course c
       WHERE c.UserID = ?
       ORDER BY c.Year DESC, 
                CASE c.Semester 
                  WHEN 'Fall' THEN 1 
                  WHEN 'Summer' THEN 2 
                  WHEN 'Spring' THEN 3 
                  ELSE 4 
                END`,
      [paramUserId]
    );
    
    // Calculate GPA
    let totalQualityPoints = 0;
    let totalCreditHours = 0;
    
    courses.forEach(course => {
      if (course.OverallGrade !== null) {
        const creditHours = parseFloat(course.CreditHours);
        const grade = parseFloat(course.OverallGrade);
        
        // Convert numeric grade to quality points (A=4.0, B=3.0, etc.)
        let qualityPoints = 0;
        if (grade >= 90) qualityPoints = 4.0;
        else if (grade >= 80) qualityPoints = 3.0;
        else if (grade >= 70) qualityPoints = 2.0;
        else if (grade >= 60) qualityPoints = 1.0;
        
        totalQualityPoints += qualityPoints * creditHours;
        totalCreditHours += creditHours;
      }
    });
    
    const gpa = totalCreditHours > 0 ? (totalQualityPoints / totalCreditHours).toFixed(2) : '0.00';
    
    // Group courses by year and semester
    const coursesByTerm = {};
    courses.forEach(course => {
      const termKey = `${course.Year}-${course.Semester}`;
      if (!coursesByTerm[termKey]) {
        coursesByTerm[termKey] = {
          year: course.Year,
          semester: course.Semester,
          courses: []
        };
      }
      coursesByTerm[termKey].courses.push(course);
    });
    
    // Convert to array and sort by year (desc) and semester
    const terms = Object.values(coursesByTerm).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      
      const semesterOrder = { 'Fall': 0, 'Summer': 1, 'Spring': 2 };
      return semesterOrder[a.semester] - semesterOrder[b.semester];
    });
    
    // Build response object
    const transcriptData = {
      userInfo: userInfo[0],
      creditsCompleted,
      creditsRemaining: Math.max(0, 120 - creditsCompleted),
      gpa,
      terms
    };
    
    res.json(transcriptData);
  } catch (err) {
    console.error('Error fetching transcript:', err);
    res.status(500).json({ error: 'Failed to retrieve transcript' });
  }
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

// fetch all courses for a user
app.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required to fetch courses.' });

  try {
    const [data] = await pool.execute(
      'SELECT * FROM course WHERE UserID = ?', [userId]
    );
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
