// services/auth.service.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSMS } = require('../utils/sms');
const { normalizePhone } = require('../utils/phone');

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Send OTP via SMS and store in Redis
 */
const sendOTP = async (phone) => {
  // Normalize phone: remove non-digits, prepend +1 if not international
  const normalizedPhone = phone.replace(/\D/g, '');
  const fullPhone = normalizedPhone.length === 10 ? `+91${normalizedPhone}` : `+${normalizedPhone}`;

  const otp = generateOTP();

  // Store in Redis: expire in 10 minutes (600 seconds)
  await global.redis.setex(`otp:${fullPhone}`, 600, otp);

  // Send SMS
  try {
    await sendSMS(fullPhone, `Your HelloQ verification code is ${otp}. Valid for 10 minutes.`);
    console.log(`OTP sent to ${fullPhone}: ${otp}`);
  } catch (error) {
    console.error('SMS send failed:', error.message);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

/**
 * Verify OTP and return JWT
 */
const verifyOTP = async (phone, code) => {
  const normalizedPhone = phone.replace(/\D/g, '');
  const fullPhone = normalizedPhone.length === 10 ? `+91${normalizedPhone}` : `+${normalizedPhone}`;

  // Retrieve OTP from Redis
  const storedOTP = await global.redis.get(`otp:${fullPhone}`);
  if (!storedOTP) throw new Error('Invalid or expired OTP');

  if (storedOTP !== String(code).trim()) throw new Error('Invalid or expired OTP');

  // OTP is valid → delete it
  await global.redis.del(`otp:${fullPhone}`);

  // Optional: create placeholder user if not exists
  let user = await User.findOne({ phone: fullPhone });
  if (!user) {
    user = await User.create({ phone: fullPhone, isPhoneVerified: true });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id, phone: fullPhone }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return token;
};




module.exports = { sendOTP, verifyOTP };