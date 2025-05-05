const pool = require('../config/db');

const User = {
  // Create a new user
  async create(userData) {
    const sql = `INSERT INTO user 
                (FirstName, LastName, Email, PhoneNumber)
                VALUES (?, ?, ?, ?)`;
    const values = [
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.phone,
    ];
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  },

  // Update user details
  async update(userData) {
    const sql = `UPDATE user 
                 SET FirstName = ?, LastName = ?, PhoneNumber = ? 
                 WHERE Email = ?`;
    const values = [
      userData.first_name,
      userData.last_name,
      userData.phone,
      userData.email,
    ];
    const [result] = await pool.execute(sql, values);
    return result.affectedRows;
  },

  // 🔍 Find a user by email
  async findByEmail(email) {
    const sql = `SELECT * FROM user WHERE Email = ?`;
    const [rows] = await pool.execute(sql, [email]);
    return rows.length ? rows[0] : null;
  },
};

module.exports = User;
