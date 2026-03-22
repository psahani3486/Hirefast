import { Router } from 'express';
import {
  getMyConnections,
  removeConnection,
  respondToConnectionRequest,
  sendConnectionRequest
} from '../controllers/connection.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/me', asyncHandler(getMyConnections));
router.post('/request', asyncHandler(sendConnectionRequest));
router.patch('/:id/respond', asyncHandler(respondToConnectionRequest));
router.delete('/:id', asyncHandler(removeConnection));

export default router;
