import { Router } from 'express';
import {
  getApplicantsForJob,
  getRecruiterDashboard
} from '../controllers/recruiter.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth, requireRole('recruiter'));
router.get('/dashboard', asyncHandler(getRecruiterDashboard));
router.get('/jobs/:id/applicants', asyncHandler(getApplicantsForJob));

export default router;
