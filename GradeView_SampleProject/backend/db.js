// db.js
const mysql = require('mysql2/promise');
const config = require('./dbconfig.json');
const pool = mysql.createPool(config);

module.exports = {
  // run a parameterized query
  query: (sql, params) => pool.execute(sql, params),
  // get a raw connection for transactions
  getConnection: () => pool.getConnection()
};
