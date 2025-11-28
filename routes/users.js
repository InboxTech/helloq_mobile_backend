const { Router } = require('express');
const { updateProfile, getProfile, createUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const {upload} = require("../middleware/upload.middleware");
const router = Router();

router.post('/user',protect, createUser);
router.get('/me', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post("/upload-photos", protect, upload.array("photos", 6), uploadPhotos);

module.exports = router;    