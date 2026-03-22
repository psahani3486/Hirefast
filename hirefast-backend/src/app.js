import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import profileRoutes from './routes/profile.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import companyRoutes from './routes/company.routes.js';
import messageRoutes from './routes/message.routes.js';
import searchRoutes from './routes/search.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import realtimeRoutes from './routes/realtime.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
  })
);
app.use(express.json());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiLimiter);

app.get('/', (_req, res) => {
  res.json({
    name: 'HireFast API',
    status: 'ok',
    docsHint: 'Use /api/* endpoints'
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/realtime', realtimeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
