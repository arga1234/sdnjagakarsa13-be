import { Router } from 'express';
import { loginController } from '../controllers/loginMutasi';
import { cekHasilMutasi, getHasilMutasiList } from '../controllers/hasilMutasiController';
const router = Router();

router.post('/login', loginController);
router.post('/hasil-mutasi', cekHasilMutasi);
router.post('/hasil-mutasi-list', getHasilMutasiList);
export { router as MutasiRouter };
