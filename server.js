require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const { Kafka } = require('kafkajs');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payments');

// Middleware
const { protect } = require('./middleware/auth.middleware');
const { uploadPhoto, handleUpload } = require('./middleware/upload.middleware');
const errorHandler = require('./middleware/error.middleware');

// Sockets & Kafka
const { setupSocket } = require('./sockets/chat');
const { startKafkaConsumers } = require('./utils/kafka');

// DB
const connectDB = require('./config/db');

const mockRedis = require('./utils/mockRedis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// === MIDDLEWARE ===
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// === PROTECTED UPLOAD ROUTE ===
app.post('/upload', protect, uploadPhoto, handleUpload, (req, res) => {
  if (!req.file?.url) {
    return res.status(400).json({ error: 'Upload failed' });
  }
  res.json({ url: req.file.url });
});

// === ERROR HANDLER (MUST BE LAST) ===
app.use(errorHandler);

// === DATABASE ===
connectDB();

// === REDIS (optional, fallback to memory if not available) ===
(async () => {
  try {
    global.redis = mockRedis;
    // global.redis = createClient({
    //   url: process.env.REDIS_URL || 'redis://localhost:6379'
    // });
    // await redis.connect();
    // console.log('✅ Redis connected');
  } catch (err) {
    console.warn('⚠️ Redis not running – using in-memory cache');
    const cache = new Map();
    global.redis = {
      get: async (key) => cache.get(key),
      set: async (key, val) => cache.set(key, val)
    };
  }
})();

// === KAFKA (optional, safe fallback) ===
// (async () => {
//   try {
//     global.kafka = new Kafka({
//       clientId: 'helloq-backend',
//       brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
//     });

//     global.producer = kafka.producer();
//     await producer.connect();
//     console.log('✅ Kafka producer connected');

//     // Try to start consumers, ignore errors
//     try {
//       startKafkaConsumers();
//     } catch {
//       console.warn('⚠️ Kafka consumers skipped');
//     }

//   } catch (err) {
//     console.warn('⚠️ Kafka not running – continuing without it');
//     global.producer = {
//       send: async () => console.log('Mock Kafka send() called'),
//     };
//   }
// })();

// === SOCKET.IO ===
setupSocket(io);

// === START SERVER ===
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
