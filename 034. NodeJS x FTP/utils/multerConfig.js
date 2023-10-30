const multer = require("multer");
const path = require("path");
const rootDir = require("./path").rootDir;
const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(rootDir, "public", "uploads"));
  },
  filename(req, file, cb) {
    let date = new Date();
    date = date.toISOString().replace(/:/g, "_").replace(/\./, "");
    cb(null, date + file.originalname);
  },
});
module.exports = diskStorage;
