const Match = require('../models/Match');

const getPotentialMatches = async (userId, preferences) => {
  const query = {
    _id: { $ne: userId },
    age: { $gte: preferences.minAge, $lte: preferences.maxAge },
    'location': {
      $near: {
        $geometry: { type: 'Point', coordinates: preferences.coords },
        $maxDistance: preferences.distance * 1000
      }
    }
  };

  return Match.find(query).limit(20);
};

module.exports = { getPotentialMatches };