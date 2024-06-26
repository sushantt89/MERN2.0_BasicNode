const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedFileTypes.includes(file.mimetype)) {
      cb(new Error("Unsupported File Format!"));
      return;
    }

    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});
module.exports = {
  upload,
  multer,
};
