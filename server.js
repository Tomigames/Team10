// Brendon Nguyen, bqn230000 - Node.js - Express Server for User Settings API
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { UserSettings } = require("./BackendApi");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpass",
    database: "yourdb"
  });

  const settings = new UserSettings(db);

  app.post("/api/reset-password", async (req, res) => {
    const userId = 1; // Stub for authenticated user
    const { currentPassword, newPassword } = req.body;
    try {
      await settings.resetPassword(userId, currentPassword, newPassword);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/user-report", async (req, res) => {
    const userId = 1; // Stub for authenticated user
    const report = await settings.getUserReport(userId);
    res.json({ report });
  });

  app.listen(3001, () => console.log("Server running on port 3001"));
})();
