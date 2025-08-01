import express from 'express';
import { handleFormSubmit } from '../controllers/registrasiController';
import { upload } from '../middlewares';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'ijazahTk', maxCount: 1 },
  { name: 'akte', maxCount: 1 },
  { name: 'kartuKeluarga', maxCount: 1 },
  { name: 'pasFoto', maxCount: 1 },
]);

router.post('/login', uploadFields, handleFormSubmit);

export { router as registrasiRoutes };
