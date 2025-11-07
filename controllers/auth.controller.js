const { sendOTP, verifyOTP } = require('../services/auth.service');

const sendOtp = async (req, res) => {
  try {
    await sendOTP(req.body.phone);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const token = await verifyOTP(req.body.phone, req.body.code);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp };