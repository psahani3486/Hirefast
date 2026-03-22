import { Router } from 'express';
import {
  addCommentToPost,
  createPost,
  getFeed,
  toggleLikePost
} from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/feed', asyncHandler(getFeed));
router.post('/', asyncHandler(createPost));
router.post('/:id/like', asyncHandler(toggleLikePost));
router.post('/:id/comments', asyncHandler(addCommentToPost));

export default router;
