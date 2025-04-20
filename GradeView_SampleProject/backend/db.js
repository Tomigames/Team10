// db.js
const mysql = require('mysql2/promise');
const config = require('./dbconfig.json');

const pool = mysql.createPool(config);

module.exports = {
  // simple parameterized query
  query: (sql, params) => pool.execute(sql, params),
  // raw connection for transactions
  getConnection: () => pool.getConnection()
};
