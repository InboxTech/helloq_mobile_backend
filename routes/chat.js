const { Router } = require('express');
const { getMessages } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.get('/:matchId', protect, getMessages);

module.exports = router;