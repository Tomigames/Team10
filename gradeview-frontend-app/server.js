const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // <-- Your MySQL username
  password: "yourpassword", // <-- Your MySQL password
  database: "gradeview"   // <-- Your database name
});

// Test connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// API endpoint to get user profile
app.get("/api/getUserProfile", (req, res) => {
  const query = "SELECT * FROM user WHERE UserID = 1"; // Change if you need another user
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
