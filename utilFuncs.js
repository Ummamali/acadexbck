const fs = require("fs");
const path = require("path");

function writeToDatabase(obj, fileName) {
  fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(obj));
}

function deleteFile(...steps) {
  let filePath = __dirname;
  for (const step of steps) {
    filePath = path.join(filePath, step);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("File deleted.");
  }
}

module.exports = { writeToDatabase, deleteFile };
