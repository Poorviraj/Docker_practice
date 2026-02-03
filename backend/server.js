const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "mysql",      // container name
    user: "root",
    password: "root",
    database: "todoapp"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");

    db.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255)
    )
  `);
});

app.get("/todos", (req, res) => {
    db.query("SELECT * FROM todos", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post("/todos", (req, res) => {
    db.query(
        "INSERT INTO todos (text) VALUES (?)",
        [req.body.text],
        (err, result) => {
            if (err) throw err;
            res.json({ id: result.insertId, text: req.body.text });
        }
    );
});

app.listen(5000, () => console.log("Server running on 5000"));