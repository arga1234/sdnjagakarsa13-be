// src/routes/checkinRoute.ts
import { Router } from 'express';
import {
  checkIn,
  checkInV2,
  confirmCheckIn,
  validateCheckIn,
} from '../controllers/checkinController';

const router = Router();

router.post('/masuk', checkIn);
router.post('/', checkInV2);
router.post('/validate', validateCheckIn);
router.post('/konfirmasi', confirmCheckIn);

export { router as checkinRoute };
