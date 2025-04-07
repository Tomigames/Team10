// Farah Khalil Ahamed Munavary (ffk220001)
const express = require('express');
const cors = require('cors');
const db = require('./database/db');

const app = express();

const PORT = process.env.PORT || 3306; // local port

// middleware
app.use(cors());
app.use(express.json());

// get semesters that user has grades for
app.get('/api/semesters', (req, res) => {
    const { semester, year } = req.query;

    const sql = `SELECT DISTINCT Semester, Year AS SemYear 
        FROM course_db.course 
        ORDER BY Year DESC, FIELD(Semester, "Spring", "Summer", "Fall") DESC;`;

    db.query(sql, (err, data) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Error fetching semesters" });
        }

        return res.json(data);
    });
});

// get courses from a specific semester
app.get('/api/courses', (req, res) => {
    const { semester, year } = req.query;

    const sql = "SELECT * FROM COURSE WHERE Semester = ? AND Year = ?";

    db.query(sql, [semester, year], (err, data) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Error fetching courses" });
        }

        return res.json(data);
    });
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error: Could not complete request' });
  });  

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});