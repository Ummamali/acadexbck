const express = require("express");
const { getStudents } = require("../../Controller/Student/Student");
const { deleteFile, writeToDatabase } = require("../../utilFuncs");
const path = require("path");

const router = express.Router();

// Deleting a student
router.delete("/:studentId", (req, res) => {
  const students = getStudents();
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
    res.status(405).json({ msg: "Not Found" });
  }
});

module.exports = router;
