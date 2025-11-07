const Report = require('../models/Report');

const submitReport = async (req, res) => {
  const { reportedId, reason, evidence } = req.body;
  const report = await Report.create({
    reporter: req.user._id,
    reported: reportedId,
    reason,
    evidence,
    severity: 1
  });
  res.json({ success: true, report });
};

module.exports = { submitReport };