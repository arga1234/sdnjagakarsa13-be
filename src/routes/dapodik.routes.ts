import { Router } from 'express';
import {
  createBiodataDapodik,
  getBiodataDapodikByNik,
  updateBiodataDapodikByNik,
} from '../controllers/biodataDapodik.controller';
import { upload } from '../middlewares';

const router = Router();
const uploadFields = upload.fields([
  { name: 'dokumen_kkFile', maxCount: 1 },
  { name: 'dokumen_akteFile', maxCount: 1 },
  { name: 'dokumen_foto', maxCount: 1 },
]);

router.post('/create-peserta-didik', uploadFields, createBiodataDapodik);
router.post('/update-peserta-didik/:murid_nik', uploadFields, updateBiodataDapodikByNik);
router.get('/get-biodata-dapodik/:murid_nik', getBiodataDapodikByNik);

export { router as dapodikRoute };
