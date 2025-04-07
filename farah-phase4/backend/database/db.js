// Farah Khalil Ahamed Munavary - ffk220001
const mysql = require('mysql2');
require('dotenv').config();         // load local variables

// create mysql connection
const db = mysql.createPool({
  connectionLimit: 10,              // max connections in pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
});

// connecting to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to database');
});

module.exports = db.promise();
