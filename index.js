const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
  console.log(`Got request for ${req.originalUrl}`);
  next();
});

app.use(cors());
const port = 5500;

const studentsStr = fs.readFileSync("students.json", "utf-8");
const students = JSON.parse(studentsStr);

// Serve static files from the "public" directory
app.use(express.static("public"));

// Get route
app.get("/students", (req, res) => {
  res.json(students);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
