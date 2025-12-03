const { Router } = require('express');
const { sendOTP, verifyOTP } = require('../services/auth.service');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = Router();

// ─── Send OTP or login directly for existing users ───
router.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;

    // Normalize phone
    const normalizedPhone = phone.replace(/\D/g, '');
    const fullPhone = normalizedPhone.length === 10 ? `+91${normalizedPhone}` : `+${normalizedPhone}`;

    // Check if user exists
    const user = await User.findOne({ phone: fullPhone });

    if (user) {
      // Existing user → generate JWT and skip OTP
      const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token, existingUser: true });
    }

    // New user → send OTP
    await sendOTP(phone);
    res.json({ success: true, existingUser: false });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Verify OTP for new users ───
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const token = await verifyOTP(phone, code);
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

module.exports = router;
