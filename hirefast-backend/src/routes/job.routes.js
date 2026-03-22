import { Router } from 'express';
import {
  applyToJob,
  createJob,
  deleteMyJob,
  getJobById,
  getSavedJobs,
  listJobs,
  listMyPostedJobs,
  updateMyJob,
  saveJob
} from '../controllers/job.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { cache } from '../middleware/cache.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', cache(60), asyncHandler(listJobs));
router.get('/me/saved', requireAuth, requireRole('candidate'), asyncHandler(getSavedJobs));
router.get('/me/posted', requireAuth, requireRole('recruiter'), asyncHandler(listMyPostedJobs));
router.get('/:id', cache(60), asyncHandler(getJobById));
router.post('/', requireAuth, requireRole('recruiter'), asyncHandler(createJob));
router.put('/:id', requireAuth, requireRole('recruiter'), asyncHandler(updateMyJob));
router.delete('/:id', requireAuth, requireRole('recruiter'), asyncHandler(deleteMyJob));
router.post('/:id/apply', requireAuth, requireRole('candidate'), asyncHandler(applyToJob));
router.post('/:id/save', requireAuth, requireRole('candidate'), asyncHandler(saveJob));

export default router;
