const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
};
module.exports = { normalizePhone };