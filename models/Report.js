const { Schema, model } = require('mongoose');

module.exports = model('Report', new Schema({
  reporter: { type: Schema.Types.ObjectId, ref: 'User' },
  reported: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, enum: ['HARASSMENT', 'IMPERSONATION', 'SPAM', 'UNDERAGE', 'DOXXING', 'ILLEGAL'] },
  evidence: String,
  severity: { type: Number, min: 0, max: 4 },
  status: { type: String, enum: ['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'], default: 'PENDING' },
  reviewedAt: Date,
}, { timestamps: true }));