const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "belendia",
  database: "node_tut",
});

module.exports = pool.promise();
