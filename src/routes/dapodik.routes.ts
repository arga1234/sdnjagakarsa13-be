import { Router } from 'express';
import { createBiodataDapodik } from '../controllers/biodataDapodik.controller';
import { upload } from '../middlewares';

const router = Router();
const uploadFields = upload.fields([
  { name: 'dokumen_kkFile', maxCount: 1 },
  { name: 'dokumen_akteFile', maxCount: 1 },
  { name: 'dokumen_foto', maxCount: 1 },
]);

router.post('/create-peserta-didik', uploadFields, createBiodataDapodik);

export { router as dapodikRoute };
