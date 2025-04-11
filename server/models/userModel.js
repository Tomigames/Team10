// Kunju Menon - sxm22026

// import db.js
const pool = require('../config/db');
const User = {
    // insert the user profile into database
  async create(userData) {
    const sql = `INSERT INTO user 
                (FirstName, LastName, Email, PhoneNumber)
                VALUES (?, ?, ?, ?)`;
    // extract the user data to sql values
    const values = [
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.phone,
    ];

    // add to db and return new user id
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  }
};

module.exports = User;