const { Router } = require('express');
const { updateProfile, getProfile, createUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require("../middleware/upload");
const router = Router();

router.get('/me', protect, getProfile);
router.put('/update', protect,upload, updateProfile);
router.post('/user',protect, createUser);


module.exports = router;    