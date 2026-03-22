import { Router } from 'express';
import {
  getRecommendations,
  getSimpleSuggestedConnections
} from '../controllers/recommendation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(getRecommendations));
router.get('/connections', asyncHandler(getSimpleSuggestedConnections));

export default router;
