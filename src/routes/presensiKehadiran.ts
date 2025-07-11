import express from 'express';
import { handleFormSubmit } from '../controllers/presensiController';
import { upload } from '../middlewares';

const router = express.Router();

const uploadFields = upload.fields([]);

router.post('/', uploadFields, handleFormSubmit);

export { router as presensiRoutes };
