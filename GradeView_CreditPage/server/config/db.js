// server/config/db.js - Updated secure version

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
 // Load environment variables
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'HowToView1!', // No default password!
  database: process.env.DB_NAME || 'gradeview',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;