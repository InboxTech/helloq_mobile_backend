const { Router } = require('express');
const { sendOTP, verifyOTP } = require('../services/auth.service');

const router = Router();

router.post('/otp/send', async (req, res) => {
  try {
    await sendOTP(req.body.phone);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const token = await verifyOTP(req.body.phone, req.body.code);
    console.log(token);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
    console.log(err);
  }
});

module.exports = router;