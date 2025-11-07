const { Schema, model } = require('mongoose');

module.exports = model('Match', new Schema({
  userA: { type: Schema.Types.ObjectId, ref: 'User' },
  userB: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'active'], default: 'active' },
}, { timestamps: true }));