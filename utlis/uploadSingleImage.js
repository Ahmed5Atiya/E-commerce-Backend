const multer = require("multer");

exports.uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();
  const filterFile = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(ApiError.create("allowed  for only images ", 400, "fail"), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: filterFile });

  return upload.single(fieldName);
};
