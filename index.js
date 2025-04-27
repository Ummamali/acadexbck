const express = require("express");
const fs = require("fs");
const cors = require("cors");
const uuid = require("uuid");
const path = require("path");
const { thisServerPort, publicFolderUrl } = require("./config");
const { writeToDatabase, deleteFile } = require("./utilFuncs");
const {
  uploadProfilePicture,
  modifyProfilePicture,
} = require("./Controller/Student/multerFileHandling");

// Student resource routes
const studentGet = require("./Resources/Student/get");
const studentPost = require("./Resources/Student/post");

const app = express();

// Middlewares setup
app.use((req, res, next) => {
  console.log(`Got request for ${req.originalUrl}`);
  next();
});

app.use(cors());

const studentsStr = fs.readFileSync("students.json", "utf-8");
const students = JSON.parse(studentsStr);

// Serve static files from the "public" directory
app.use(express.static("public"));

// registering the routes
app.use("/students", studentGet);
app.use("/students", studentPost);

// Updating the student object
app.patch(
  "/students/:studentId",
  modifyProfilePicture.single("newImage"),
  (req, res) => {
    const studentId = req.params.studentId;
    const reqObjDelta = JSON.parse(req.body.delta);

    if (!(studentId in students)) {
      res.status(404).json({ msg: "Not found" });
      return;
    }

    if (req.file) {
      reqObjDelta.imageSrc = publicFolderUrl(req.file.filename);
      console.log(req.file.filename);
    }

    // Now changing the internal data
    students[studentId] = { ...students[studentId], ...reqObjDelta };
    writeToDatabase(students, "students.json");

    res.json({ modified: students[studentId] });
  }
);

// Deleting a student
app.delete("/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  if (studentId in students) {
    // deleting profile picture
    const profileImgName = path.basename(students[studentId].imageSrc);
    if (profileImgName !== "defaultProfile.svg") {
      deleteFile("public", profileImgName);
    }

    // deleting record
    delete students[studentId];
    writeToDatabase(students, "students.json");

    res.json({ deletedId: studentId });
  } else {
    res.status(404).json({ msg: "Not Found" });
  }
});

// Starting the server (Commented when testing)
// app.listen(thisServerPort, () => {
//   console.log(`Server is running at http://localhost:${thisServerPort}`);
// });

module.exports = app;
