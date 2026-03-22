import { Router } from 'express';
import {
  getAiJobRecommendations,
  scoreResumeAgainstJobs
} from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/jobs/recommendations', asyncHandler(getAiJobRecommendations));
router.post('/jobs/score-resume', asyncHandler(scoreResumeAgainstJobs));

export default router;
