const multer = require("multer");
const path = require("path");
const { deletePossibleFiles } = require("./utilFuncs");
const uuid = require("uuid");

// For saving the profile picture for first time
function profileDestination(req, file, cb) {
  cb(null, path.join(__dirname, "public"));
}

const storage = multer.diskStorage({
  destination: profileDestination,
  filename: (req, file, cb) => {
    const newStudentId = uuid.v4().replace(/-/g, "");
    const ext = path.extname(req.file.originalname);
    req.newStudentId = newStudentId;
    cb(null, newStudentId + ext);
  },
});

// for changing profile picture
const modifyingProfileStorage = multer.diskStorage({
  destination: profileDestination,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const studentId = req.params.studentId;
    deletePossibleFiles(studentId, path.join(__dirname, "public"));
    cb(null, studentId + ext);
  },
});

const uploadProfilePicture = multer({ storage: storage });
const modifyProfilePicture = multer({ storage: modifyingProfileStorage });

module.exports = { uploadProfilePicture, modifyProfilePicture };
