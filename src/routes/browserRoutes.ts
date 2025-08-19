import { Router } from 'express';
import {
  bukaWeb,
  isiSelect,
  isiTeks,
  klikButton,
  tutupBrowser,
} from '../controllers/browser.controller';

const router = Router();

router.post('/buka-web', bukaWeb);
router.post('/isi-teks', isiTeks);
router.post('/tutup-browser', tutupBrowser);
router.post('/isi-select', isiSelect);
router.post('/klik-tombol', klikButton);

export { router as browserRouter };
