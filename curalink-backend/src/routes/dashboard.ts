// src/routes/dashboard.ts
import express from 'express';
import { getDashboard, getFavorites } from '../controllers/dashboardController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getDashboard);
router.get('/favorites', auth, getFavorites);

export default router;