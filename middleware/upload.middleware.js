const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadPhotos = upload.array("photos", 6);

// Convert file paths → usable URLs
const handleMultiUpload = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.photoUrls = [];
      return next();
    }

    // Convert each file → store proper format
    req.photoUrls = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      verified: false,
      isPrimary: false,
    }));

    next();
  } catch (error) {
    console.log("Upload middleware error:", error);
    return res.status(500).json({ error: "Upload processing failed" });
  }
};

module.exports = { uploadPhotos, handleMultiUpload };
