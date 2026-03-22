import { cacheService } from '../config/redis.js';

export const cache = (ttlSeconds = 60) => async (req, res, next) => {
  const key = req.originalUrl;

  const cached = await cacheService.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cacheService.setEx(key, ttlSeconds, JSON.stringify(body)).catch(() => {});
    return originalJson(body);
  };

  next();
};
