const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express()

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kansas@2309",
    database: "gradeview"
})

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database");
});

app.get("/", (req,res) => {
    const sql = "SELECT * FROM course";
    db.query(sql, (err, data) => {
        if(err) {
            console.error("SQL Error, err");
            return res.json("Error");  
        } 
        return res.json(data)
    })
})

app.post("/course", (req, res) => {
    const { UserId, CourseName, Instructor, Semester, Year, CreditHours } = req.body;
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
    const CourseId = parseInt(req.params.id); // Explicitly cast to integer
    const { UserID } = req.body;
    const userIdInt = parseInt(UserID); // Explicitly cast to integer
  
    db.query(
      "CALL delete_course(?, ?)",
      [userIdInt, CourseId],
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
  
    db.query(
      "CALL update_course(?, ?, ?, ?, ?, ?, ?)",
      [UserID, CourseId, CourseName, Instructor, Semester, Year, CreditHours],
      (err, result) => {
        if (err) {
          console.error("SQL Error:", err);
          return res.status(500).json("Error updating course");
        }
        return res.json({ message: "Course updated successfully" });
      }
    );
  });
  

app.listen(8081, ()=> {
    console.log("listening")
})
