import express from 'express';
import cors from 'cors';
import {
  checkinRoute,
  dapodikRoute,
  kesanPesanRoutes,
  MutasiRouter,
  presensiRoutes,
  registrasiMutasiRoutes,
  registrasiRoutes,
  soalUjianRoutes,
} from './routes';
import { liveScoreRoutes } from './routes/liveScoreRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/registrasi', registrasiRoutes);
app.use('/api/registrasi-mutasi', registrasiMutasiRoutes);
app.use('/api/absensi-online', presensiRoutes);
app.use('/api/kesan-pesan', kesanPesanRoutes);
app.use('/api/mutasi', MutasiRouter);
app.use('/api/soal', soalUjianRoutes);
app.use('/api/live-score', liveScoreRoutes);
app.use('/api/checkin', checkinRoute);
app.use('/api/dapodik', dapodikRoute);
export default app;
