// src/routes/clinicalTrials.ts
import express from 'express';
import { 
  searchClinicalTrials, 
  getRecommendedTrials, 
  saveTrial, 
  getSavedTrials 
} from '../controllers/clinicalTrialController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/search', auth, searchClinicalTrials);
router.get('/recommended', auth, getRecommendedTrials);
router.post('/:trialId/save', auth, saveTrial);
router.get('/saved', auth, getSavedTrials);

export default router;