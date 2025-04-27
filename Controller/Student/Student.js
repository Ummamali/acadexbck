const { readFromDatabase } = require("../../utilFuncs");

let students = null;

function getStudents() {
  if (students === null) {
    console.log("Reading flat file database students.json");
    students = readFromDatabase("students.json");
  }
  return students;
}

module.exports = { getStudents };
