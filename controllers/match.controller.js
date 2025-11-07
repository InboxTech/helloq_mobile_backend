const Like = require('../models/Like');
const Match = require('../models/Match');
const { publishEvent } = require('../utils/kafka');

const likeUser = async (req, res) => {
  const { userId } = req.params;
  const fromUser = req.user._id;

  const existing = await Like.findOne({ from: fromUser, to: userId });
  if (existing) return res.status(400).json({ error: 'Already liked' });

  await Like.create({ from: fromUser, to: userId });

  const mutual = await Like.findOne({ from: userId, to: fromUser });
  if (mutual) {
    const match = await Match.create({ userA: fromUser, userB: userId });
    await publishEvent('match.events', { type: 'MATCH_CREATED', matchId: match._id });
    return res.json({ match: true, matchId: match._id });
  }

  res.json({ liked: true });
};

const getMatches = async (req, res) => {
  const userId = req.user._id;
  const matches = await Match.find({
    $or: [{ userA: userId }, { userB: userId }]
  }).populate('userA userB', 'name photos pronouns city');

  res.json(matches);
};

module.exports = { likeUser, getMatches };