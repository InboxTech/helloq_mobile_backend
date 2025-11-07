const multer = require('multer');
const { uploadToS3 } = require('../utils/s3');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadPhoto = upload.single('photo');

const handleUpload = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await uploadToS3(req.file);
    req.file.url = result.Location;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = { uploadPhoto, handleUpload };