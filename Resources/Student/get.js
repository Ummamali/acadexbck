const express = require("express");
const { readFromDatabase } = require("../../utilFuncs");
const { getStudents } = require("../../Controller/Student/Student");

const router = express.Router();

// GET Multiple route
router.get("/", (req, res) => {
  res.json(getStudents());
});

//GET specific route
router.get("/:stuid", (req, res) => {
  const students = getStudents();
  if (req.params.stuid in students) {
    res.json(students[req.params.stuid]);
  } else {
    res.status(404).json({ msg: "Not Found" });
  }
});

module.exports = router;
