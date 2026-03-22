import { Router } from 'express';
import {
  discoverProfiles,
  getMyProfile,
  getProfileByUserId,
  upsertMyProfile
} from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/me', asyncHandler(getMyProfile));
router.put('/me', asyncHandler(upsertMyProfile));
router.get('/discover', asyncHandler(discoverProfiles));
router.get('/:userId', asyncHandler(getProfileByUserId));

export default router;
