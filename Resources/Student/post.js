const express = require("express");
const {
  uploadProfilePicture,
} = require("../../Controller/Student/multerFileHandling");
const { getStudents } = require("../../Controller/Student/Student");

const router = express.Router();

// Create (POST) a new student
router.post("/", uploadProfilePicture.single("studentImg"), (req, res) => {
  const students = getStudents();
  const reqObj = JSON.parse(req.body.studentObj);

  const newStudentId = req.newStudentId;

  let imageNewName = req.file ? req.file.filename : "defaultProfile.svg";

  // Now dealing with data
  const newStudent = {
    ...reqObj,
    imageSrc: publicFolderUrl(imageNewName),
  };

  // Inserting to database
  students[newStudentId] = newStudent;
  writeToDatabase(students, "students.json");

  res.status(201).json({ createdId: newStudentId, created: newStudent });
});

module.exports = router;
