const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware');
const {uploadPhotos, handleMultiUpload} = require("../middleware/upload.middleware");
const { createUser, getProfile, updateProfile, uploadPhotosController,updatePrivacySettings } = require('../controllers/user.controller');
const upload = require("../middleware/upload");
const router = Router();

router.post('/user',protect, createUser);
router.get('/me', protect, getProfile);
router.put('/update', protect,upload, updateProfile);
router.post(
  "/upload-photos",
  protect,
  uploadPhotos,
  handleMultiUpload,
  uploadPhotosController
);
router.put("/privacy", protect, updatePrivacySettings);

module.exports = router;    