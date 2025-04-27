const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const { deletePossibleFiles } = require("../../utilFuncs");

// For saving the profile picture for first time
function profileDestination(req, file, cb) {
  cb(null, path.join(__dirname, "..", "..", "public"));
}

const storage = multer.diskStorage({
  destination: profileDestination,
  filename: (req, file, cb) => {
    cb(null, req.newStudentId + path.extname(file.originalname));
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
