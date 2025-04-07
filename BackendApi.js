// Brendon Nguyen, bqn230000 - Node.js - User Authentication and Report Service Class
const bcrypt = require("bcrypt");

class UserSettings {
  constructor(db) {
    this.db = db;
  }

  // Reset the user's password securely
  async resetPassword(userId, currentPass, newPass) {
    const [rows] = await this.db.execute("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPass, rows[0].password);
    if (!isMatch) throw new Error("Current password incorrect");

    const hashedNew = await bcrypt.hash(newPass, 10);
    await this.db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNew, userId]);
  }

  // Generate and return a user's GPA alert report
  async getUserReport(userId) {
    const [rows] = await this.db.execute("SELECT * FROM gpa_alerts WHERE user_id = ?", [userId]);
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = { UserSettings };
