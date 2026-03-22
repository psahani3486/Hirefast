import { Router } from 'express';
import {
  createCompany,
  getCompanyById,
  listCompanies,
  updateMyCompany
} from '../controllers/company.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listCompanies));
router.get('/:id', asyncHandler(getCompanyById));
router.post('/', requireAuth, requireRole('recruiter'), asyncHandler(createCompany));
router.put('/:id', requireAuth, requireRole('recruiter'), asyncHandler(updateMyCompany));

export default router;
