// utils/sms.js
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SID;

const sendSMS = async (phone, message) => {
  // Fallback to messaging if Verify not set
  if (!VERIFY_SERVICE_SID) {
    return client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
  }

  // Use Verify for OTP
  return client.verify.v2.services(VERIFY_SERVICE_SID)
    .verifications
    .create({ to: phone, channel: 'sms' });
};

const verifyOTP = async (phone, code) => {
  if (!VERIFY_SERVICE_SID) throw new Error('Verify not configured');

  const result = await client.verify.v2.services(VERIFY_SERVICE_SID)
    .verificationChecks
    .create({ to: phone, code });

  if (result.status !== 'approved') {
    throw new Error('Invalid OTP');
  }
  return true;
};

module.exports = { sendSMS, verifyOTP };