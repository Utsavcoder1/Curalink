// src/routes/publications.ts
import express from 'express';
import { 
  searchPublications, 
  getRecommendedPublications, 
  savePublication, 
  getSavedPublications 
} from '../controllers/publicationController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/search', auth, searchPublications);
router.get('/recommended', auth, getRecommendedPublications);
router.post('/:publicationId/save', auth, savePublication);
router.get('/saved', auth, getSavedPublications);
export default router;