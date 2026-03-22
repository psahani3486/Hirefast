import { Router } from 'express';
import { getMyAnalytics } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/me', asyncHandler(getMyAnalytics));

export default router;
