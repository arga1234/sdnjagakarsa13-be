// src/routes/liveScoreRoutes.ts
import express from 'express';
import { updateScore, getLiveScoreList } from '../controllers/liveScoreController';

const router = express.Router();

router.post('/update-score', updateScore);
router.get('/list', getLiveScoreList); // ⬅️ Tambahkan ini

export { router as liveScoreRoutes };
