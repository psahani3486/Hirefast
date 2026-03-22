import { Router } from 'express';
import { globalSearch } from '../controllers/search.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/global', asyncHandler(globalSearch));

export default router;
