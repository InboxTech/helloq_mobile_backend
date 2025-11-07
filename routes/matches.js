const { Router } = require('express');
const { likeUser, getMatches } = require('../controllers/match.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.post('/like/:userId', protect, likeUser);
router.get('/', protect, getMatches);

module.exports = router;