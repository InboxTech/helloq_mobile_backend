const { Schema, model } = require('mongoose');

module.exports = model('Like', new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  superLike: { type: Boolean, default: false },
}, { timestamps: true }));