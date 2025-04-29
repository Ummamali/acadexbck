const fs = require("fs");
const path = require("path");

function writeToDatabase(obj, fileName) {
  fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(obj));
}

function readFromDatabase(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, relativePath), "utf-8")
  );
}

function deleteFile(...steps) {
  let filePath = __dirname;
  for (const step of steps) {
    filePath = path.join(filePath, step);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
function deletePossibleFiles(
  basename,
  directoryPath,
  possibleExtensions = imageExtensions
) {
  // gets a basename and possible extensions. deletes all possible filename with name+extension
  possibleExtensions.forEach((otherExt) => {
    const otherFilePath = path.join(directoryPath, basename + otherExt);
    if (fs.existsSync(otherFilePath)) {
      fs.unlinkSync(otherFilePath); // Delete the old file
    }
  });
}

module.exports = {
  writeToDatabase,
  deleteFile,
  deletePossibleFiles,
  readFromDatabase,
};
