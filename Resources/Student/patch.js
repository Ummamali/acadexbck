const express = require("express");

const {
  modifyProfilePicture,
} = require("../../Controller/Student/multerFileHandling");
const { getStudents } = require("../../Controller/Student/Student");
const { writeToDatabase } = require("../../utilFuncs");
const { publicFolderUrl } = require("../../config");

const router = express.Router();

// Updating the student object
router.patch(
  "/:studentId",
  modifyProfilePicture.single("newImage"),
  (req, res) => {
    const students = getStudents();
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

module.exports = router;
