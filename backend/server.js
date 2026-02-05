const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use connection pool
const pool = mysql.createPool({
  host: "mysql",       // service name from docker-compose
  user: "root",
  password: "root",
  database: "todoapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Create table once
pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255)
  )
`);

// GET todos
app.get("/todos", (req, res) => {
  pool.query("SELECT * FROM todos", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ADD todo
app.post("/todos", (req, res) => {
  pool.query(
    "INSERT INTO todos (text) VALUES (?)",
    [req.body.text],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Insert failed" });
      }
      res.json({ id: result.insertId, text: req.body.text });
    }
  );
});

// ✅ Bind to all interfaces for Docker
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on 5000");
});

