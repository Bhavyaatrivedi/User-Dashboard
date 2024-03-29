const util = require("util");
const multer = require("multer");
const maxSize = 10* 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array('files', 6); 

let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
