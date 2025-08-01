import express from 'express';
import {
  getFeedbacks,
  handleFormSubmit,
  likeOrDislikeFeedback,
} from '../controllers/kesanPesanController';
import { upload } from '../middlewares';

const router = express.Router();

const uploadFields = upload.fields([]);

router.post('/', uploadFields, handleFormSubmit);
router.get('/daftar', getFeedbacks);
router.post('/like/:id', uploadFields, likeOrDislikeFeedback);

export { router as kesanPesanRoutes };
