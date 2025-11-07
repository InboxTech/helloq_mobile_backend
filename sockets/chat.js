const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const { moderateText, moderateImage } = require('../services/moderation.service');

const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinMatch', (matchId) => {
      socket.join(`match_${matchId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { matchId, content, type } = data;
      let nsfw = false;
      let toxicityScore = 0;

      if (type === 'TEXT') {
        toxicityScore = await moderateText(content);
        if (toxicityScore > 0.7) {
          socket.emit('toxicityWarning', { message: 'Edit?' });
          return;
        }
      }

      if (type === 'IMAGE') {
        nsfw = await moderateImage(content);
      }

      const message = await Message.create({
        matchId, senderId: socket.data.user.userId,
        content, type, nsfw, toxicityScore
      });

      io.to(`match_${matchId}`).emit('newMessage', message);
    });
  });
};

module.exports = { setupSocket };