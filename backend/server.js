const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 6666;

const db = mysql.createConnection({
  host: "carpooling-db.mysql.database.azure.com",
  user: "adminuser",
  password: "azerty123$$",
  database: "carpooling",
  ssl: {
    rejectUnauthorized: true,
  },
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM drivers WHERE email = ? AND password = ?`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send("Error logging in");
      return;
    }

    if (results.length > 0) {
      const driver = results[0];

      const updateQuery = `UPDATE drivers SET state = 3 WHERE id = ?`;
      db.query(updateQuery, [driver.id], (updateErr, updateResults) => {
        if (updateErr) {
          res.status(500).send("Error updating driver state");
          return;
        }

        res.json({ status: "success", driverId: driver.id });
      });
    } else {
      res.json({ status: "fail" });
    }
  });
});

app.post("/logout", (req, res) => {
  const { driverId } = req.body;

  const updateStateQuery = `UPDATE drivers SET state = 2 WHERE id = ?`;

  db.query(updateStateQuery, [driverId], (updateErr) => {
    if (updateErr) {
      res.status(500).send("Error updating driver state");
      return;
    }
    res.json({ status: "success" });
  });
});

app.post("/location", (req, res) => {
  const { driverId, longitude, latitude} = req.body;

  const checkQuery = `SELECT session_id FROM driver_session WHERE driver_id = ?`;
  db.query(checkQuery, [driverId], (checkErr, results) => {
    if (checkErr) {
      res.status(500).send("Error checking session");
      return;
    }

    if (results.length > 0) {
      const updateQuery = `UPDATE driver_session SET latitude = ?, longitude = ? WHERE driver_id = ?`;
      db.query(updateQuery, [latitude, longitude, driverId], (updateErr) => {
        if (updateErr) {
          res.status(500).send("Error updating location");
          return;
        }
        res.json({ status: "success", message: "Location updated" });
      });
    } else {
      const insertQuery = `INSERT INTO driver_session (driver_id, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
      db.query(insertQuery, [driverId, latitude, longitude], (insertErr) => {
        if (insertErr) {
          res.status(500).send("Error inserting new session");
          return;
        }
        res.json({ status: "success", message: "New session created" });
      });
    }
  });
});

app.post("/remove-session", (req, res) => {
  const { driverId } = req.body;

  const deleteQuery = `DELETE FROM driver_session WHERE driver_id = ?`;
  db.query(deleteQuery, [driverId], (deleteErr) => {
    if (deleteErr) {
      res.status(500).send("Error removing session");
      return;
    }
    res.json({ status: "success", message: "Session removed successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
