const mysql = require("mysql2");
require("dotenv").config();
//MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise();

pool.getConnection()
    .then(() => console.log("? Connected to MySQL"))
    .catch(err => console.error("? DB Connection Error:", err));

module.exports = pool;
