// utils/mockRedis.js
const cache = new Map();
const expirations = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, { expiresAt }] of expirations.entries()) {
    if (expiresAt <= now) {
      cache.delete(key);
      expirations.delete(key);
    }
  }
}, 1000);

module.exports = {
  get: async (key) => cache.get(key) ?? null,
  set: async (key, val) => {
    cache.set(key, val);
    return 'OK';
  },
  setex: async (key, seconds, val) => {
    cache.set(key, val);
    expirations.set(key, { expiresAt: Date.now() + seconds * 1000 });
    return 'OK';
  },
  del: async (key) => {
    cache.delete(key);
    expirations.delete(key);
    return 1;
  }
};