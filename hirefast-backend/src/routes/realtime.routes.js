import { Router } from 'express';
import { streamNotifications } from '../controllers/realtime.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/notifications/stream', asyncHandler(streamNotifications));

export default router;
