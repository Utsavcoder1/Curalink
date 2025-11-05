// src/routes/experts.ts
import express from 'express';
import { 
  searchExperts, 
  getRecommendedExperts, 
  saveExpert, 
  requestMeeting, 
  nudgeExpert 
} from '../controllers/expertController';
import { auth } from '../middleware/auth';

const router = express.Router();

// For patients - finding health experts
router.get('/search', auth, searchExperts);
router.get('/recommended', auth, getRecommendedExperts);
router.post('/:expertId/save', auth, saveExpert);
router.post('/:expertId/request-meeting', auth, requestMeeting);
router.post('/:expertId/nudge', auth, nudgeExpert);

export default router;