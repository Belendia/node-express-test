// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "belendia",
//   database: "node_tut",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_tut", "root", "belendia", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
