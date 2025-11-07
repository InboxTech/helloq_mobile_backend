const { Router } = require('express');
const { createCheckout } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.post('/checkout', protect, createCheckout);

module.exports = router;