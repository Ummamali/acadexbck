const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const uuid = require("uuid");
const path = require("path");
const { thisServerPort, publicFolderUrl } = require("./config");
const { json } = require("stream/consumers");

const app = express();

// Middlewares setup
app.use((req, res, next) => {
  console.log(`Got request for ${req.originalUrl}`);
  next();
});

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public"));
  },
  filename: function (req, file, cb) {
    // Temporary name, we’ll rename it later using the generated ID
    cb(null, "temp-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const studentsStr = fs.readFileSync("students.json", "utf-8");
const students = JSON.parse(studentsStr);

// Serve static files from the "public" directory
app.use(express.static("public"));

// -------------- Student Resource
// GET Multiple route
app.get("/students", (req, res) => {
  res.json(students);
});

//GET specific route
app.get("/students/:stuid", (req, res) => {
  if (req.params.stuid in students) {
    res.json(students[req.params.stuid]);
  } else {
    res.status(404).json({ msg: "Not Found" });
  }
});

// Create (POST) a new student
app.post("/students", upload.single("studentImg"), (req, res) => {
  const reqObj = JSON.parse(req.body.studentObj);

  const newStudentId = uuid.v4().replace(/-/g, "");

  // Dealing with image first
  const ext = path.extname(req.file.originalname);
  const imageNewName = `${newStudentId}${ext}`;
  const newPath = path.join(__dirname, "public", imageNewName);

  fs.renameSync(req.file.path, newPath);

  // Now dealing with data
  const newStudent = {
    ...reqObj,
    imageSrc: publicFolderUrl(imageNewName),
  };

  // Inserting
  students[newStudentId] = newStudent;
  fs.writeFileSync(
    path.join(__dirname, "students.json"),
    JSON.stringify(students)
  );

  res.json({ msg: "Good" });
});

// Start the server
app.listen(thisServerPort, () => {
  console.log(`Server is running at http://localhost:${thisServerPort}`);
});
