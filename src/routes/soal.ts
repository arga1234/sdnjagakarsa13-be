import { Router } from 'express';
import {
  getParentContentByUjianId,
  getSoalByUjianId,
  submitJawaban,
} from '../controllers/soalController';
const router = Router();

router.get('/', getSoalByUjianId);
router.get('/parent-content', getParentContentByUjianId);
router.post('/submit-jawaban', submitJawaban);

export { router as soalUjianRoutes };
