import { Router } from 'express';
import { getAbsensiOnline } from '../controllers/absensi.controller';

const router = Router();

router.get('/list', getAbsensiOnline);

export default router;
