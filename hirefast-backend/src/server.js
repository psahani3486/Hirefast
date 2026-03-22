import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
