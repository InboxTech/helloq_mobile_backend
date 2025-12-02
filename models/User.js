const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, sparse: true },
  name: String,

  pronouns: [String],
  identities: [String],
  interests: [String],
  intentions: [String],

  bio: String,
  photos: [{ url: String, verified: Boolean, isPrimary: Boolean }],
  age: Number,
  city: String,

  location: { type: { type: String, enum: ['Point'] }, coordinates: [Number] },

  // NEW PRIVACY FIELDS  
  privacy: {
    cityOnly: { type: Boolean, default: true },
    hideAge: { type: Boolean, default: false },
    hideDistance: { type: Boolean, default: false },
    verifiedOnly: { type: Boolean, default: true },
  },

  verified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },

  // NEW: phone verification flag
  isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });


userSchema.index({ location: '2dsphere' });

module.exports = model('User', userSchema);