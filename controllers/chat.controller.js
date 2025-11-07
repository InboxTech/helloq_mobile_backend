const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { matchId } = req.params;
  const messages = await Message.find({ matchId }).sort('createdAt');
  res.json(messages);
};

module.exports = { getMessages };