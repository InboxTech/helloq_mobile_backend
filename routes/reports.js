const { Router } = require('express');
const { submitReport } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', protect, submitReport);

module.exports = router;