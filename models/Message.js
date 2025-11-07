const { Schema, model } = require('mongoose');

module.exports = model('Message', new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  type: { type: String, enum: ['TEXT', 'IMAGE', 'VOICE', 'GIF'] },
  nsfw: { type: Boolean, default: false },
  blurred: { type: Boolean, default: true },
  toxicityScore: Number,
}, { timestamps: true }));