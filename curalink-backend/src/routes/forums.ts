// src/routes/forums.ts
import express from 'express';
import { 
  getForums, 
  getForumPosts, 
  createPost, 
  createReply, 
  getPostReplies 
} from '../controllers/forumController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getForums);
router.get('/:forumId/posts', auth, getForumPosts);
router.post('/posts', auth, createPost);
router.post('/posts/:postId/replies', auth, createReply);
router.get('/posts/:postId/replies', auth, getPostReplies);

export default router;