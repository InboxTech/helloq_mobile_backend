const { Router } = require('express');
const { updateProfile, getProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;