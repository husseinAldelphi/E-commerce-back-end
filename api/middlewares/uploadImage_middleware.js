const multer = require("multer");
const ApiError = require("../utils/api_error");

exports.uploadSingleImage = (fileFeild) => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new ApiError("Invalid file type you must provide an image", 400),
        false
      );
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fileFeild);
};
