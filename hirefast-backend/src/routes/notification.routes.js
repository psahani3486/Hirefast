import { Router } from 'express';
import {
  listMyNotifications,
  markNotificationRead
} from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/me', asyncHandler(listMyNotifications));
router.patch('/:id/read', asyncHandler(markNotificationRead));

export default router;
