const express = require("express");
const uuid = require("uuid");
const {
  uploadProfilePicture,
} = require("../../Controller/Student/multerFileHandling");
const { getStudents } = require("../../Controller/Student/Student");
const { publicFolderUrl } = require("../../config");
const { writeToDatabase } = require("../../utilFuncs");

const router = express.Router();

// Create (POST) a new student
router.post(
  "/",
  (req, res, next) => {
    req.newStudentId = uuid.v4().replace(/-/g, "");
    next();
  },
  uploadProfilePicture.single("studentImg"),
  (req, res) => {
    const students = getStudents();
    const reqObj = JSON.parse(req.body.studentObj);

    const newStudentId = req.newStudentId;

    const imageNewName = req.file ? req.file.filename : "defaultProfile.svg";

    // Now dealing with data
    const newStudent = {
      ...reqObj,
      imageSrc: publicFolderUrl(imageNewName),
    };

    // Inserting to database
    students[newStudentId] = newStudent;
    writeToDatabase(students, "students.json");

    res.status(201).json({ createdId: newStudentId, created: newStudent });
  }
);

module.exports = router;
