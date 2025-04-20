const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kansas@2309",
  database: "gradeview"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

app.get("/", (req, res) => {
  const userId = req.query.userId;
  let sql = "SELECT * FROM course";
  const params = [];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required to fetch courses." });
  }

  sql += " WHERE UserID = ?";
  params.push(userId);

  db.query(sql, params, (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Error fetching courses");
    }
    return res.json(data);
  });
});

// Endpoint to fetch courses by semester for a specific user
app.get("/courses/:semester", (req, res) => {
  const semester = req.params.semester;
  const userId = req.query.userId;
  let sql = "SELECT * FROM course WHERE Semester = ?";
  const params = [semester];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required to fetch courses by semester." });
  }

  sql += " AND UserID = ?";
  params.push(userId);

  db.query(sql, params, (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Error fetching courses by semester");
    }
    return res.json(data);
  });
});

// Endpoint to fetch courses by year for a specific user
app.get("/courses/year/:year", (req, res) => {
  const year = req.params.year;
  const userId = req.query.userId;
  let sql = "SELECT * FROM course WHERE Year = ?";
  const params = [year];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required to fetch courses by year." });
  }

  sql += " AND UserID = ?";
  params.push(userId);

  db.query(sql, params, (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Error fetching courses by year");
    }
    return res.json(data);
  });
});

// New endpoint to fetch assessments for a course belonging to a specific user
app.get("/assessments/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.query.userId; // Assuming you might want to verify user ownership of the course

  if (!userId) {
    return res.status(400).json({ error: "User ID is required to fetch assessments." });
  }

  const sql = `
    SELECT
      a.AssessmentID,
      a.UserID,
      a.CourseID,
      a.WeightID,
      a.AssessmentName,
      a.IndividualGrade,
      w.AssessmentType,
      w.WeightPercentage
    FROM assessment a
    JOIN weight w ON a.WeightID = w.WeightID
    JOIN course c ON a.CourseID = c.CourseID
    WHERE a.CourseID = ? AND c.UserID = ?
    ORDER BY w.WeightID;
  `;
  db.query(sql, [courseId, userId], (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Error fetching assessments");
    }
    return res.json(data);
  });
});

app.post("/course", (req, res) => {
  const { UserId, CourseName, Instructor, Semester, Year, CreditHours } = req.body;

  if (!UserId) {
    return res.status(400).json({ error: "User ID is required to add a course." });
  }

  db.query(
    "CALL add_course(?, ?, ?, ?, ?, ?)",
    [UserId, CourseName, Instructor, Semester, Year, CreditHours],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Error adding course");
      }
      return res.json({ message: "Course added successfully" });
    }
  );
});

app.delete("/course/:id", (req, res) => {
  const CourseId = parseInt(req.params.id);
  const { UserID } = req.body;

  if (!UserID) {
    return res.status(400).json({ error: "User ID is required to delete a course." });
  }

  db.query(
    "CALL delete_course(?, ?)",
    [parseInt(UserID), CourseId],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Error deleting course");
      }
      return res.json({ message: "Course deleted successfully" });
    }
  );
});

app.put("/course/:id", (req, res) => {
  const CourseId = parseInt(req.params.id);
  const {
    UserID,
    CourseName,
    Instructor,
    Semester,
    Year,
    CreditHours,
  } = req.body;

  if (!UserID) {
    return res.status(400).json({ error: "User ID is required to update a course." });
  }

  db.query(
    "CALL update_course(?, ?, ?, ?, ?, ?, ?)",
    [parseInt(UserID), CourseId, CourseName, Instructor, Semester, Year, CreditHours],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Error updating course");
      }
      return res.json({ message: "Course updated successfully" });
    }
  );
});

// Endpoint to fetch a single course by ID (for editing), ensuring user ownership
app.get("/course/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required to fetch course details." });
  }

  const sql = "SELECT * FROM course WHERE CourseID = ? AND UserID = ?";
  db.query(sql, [courseId, userId], (err, data) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Error fetching course details");
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Course not found or does not belong to this user." });
    }
    return res.json(data[0]); // Assuming only one course will match the ID
  });
});

app.listen(8081, () => {
  console.log("listening");
});