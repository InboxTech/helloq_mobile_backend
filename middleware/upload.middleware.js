const multer = require('multer');
const { uploadToS3 } = require('../utils/s3');

// Memory storage for S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MULTIPLE PHOTOS middleware
const uploadPhotos = upload.array("photos", 6);

// MULTIPLE UPLOAD handler for S3
const handleMultiUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const uploaded = [];

    for (const file of req.files) {
      const result = await uploadToS3(file);
      uploaded.push(result.Location);
    }

    req.photoUrls = uploaded; // pass to controller
    next();
  } catch (err) {
    console.log("S3 Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadPhotos, handleMultiUpload };
