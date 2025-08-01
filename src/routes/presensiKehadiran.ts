import express from 'express';
import { handleFormSubmit } from '../controllers/presensiController';
import { upload } from '../middlewares';
import { getAbsensiOnline } from '../controllers/absensi.controller';

const router = express.Router();

const uploadFields = upload.fields([]);

router.post('/', uploadFields, handleFormSubmit);
router.get('/absensi', getAbsensiOnline);

export { router as presensiRoutes };
