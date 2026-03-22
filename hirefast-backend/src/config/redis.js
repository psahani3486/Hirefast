import { createClient } from 'redis';

let redisClient = null;
let redisEnabled = false;

export const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('REDIS_URL not set, cache disabled');
    return;
  }

  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (error) => {
    console.warn('Redis error:', error.message);
  });

  try {
    await redisClient.connect();
    redisEnabled = true;
    console.log('Redis connected');
  } catch (error) {
    console.warn('Redis unavailable, cache disabled:', error.message);
    redisEnabled = false;
    redisClient = null;
  }
};

export const cacheService = {
  isEnabled() {
    return redisEnabled && redisClient;
  },
  async get(key) {
    if (!this.isEnabled()) return null;
    return redisClient.get(key);
  },
  async setEx(key, ttl, value) {
    if (!this.isEnabled()) return;
    await redisClient.setEx(key, ttl, value);
  },
  async delByPrefix(prefix) {
    if (!this.isEnabled()) return;

    const keys = [];
    for await (const key of redisClient.scanIterator({ MATCH: `${prefix}*` })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
};
