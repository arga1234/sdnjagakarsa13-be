import express from 'express';
import { handleFormSubmit } from '../controllers/registrasiMutasiController';
import { upload } from '../middlewares';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'rapor', maxCount: 5 },
  { name: 'kartuKeluarga', maxCount: 1 },
  { name: 'pasFoto', maxCount: 1 },
]);

router.post('/', uploadFields, handleFormSubmit);

export { router as registrasiMutasiRoutes };
