import { Router } from 'express';
import {
  listConversations,
  listThreadMessages,
  sendMessage,
  unreadMessageCount
} from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/conversations', asyncHandler(listConversations));
router.get('/unread-count', asyncHandler(unreadMessageCount));
router.get('/:userId', asyncHandler(listThreadMessages));
router.post('/:userId', asyncHandler(sendMessage));

export default router;
