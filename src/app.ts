import express from 'express';
import cors from 'cors';
import { presensiRoutes, registrasiMutasiRoutes, registrasiRoutes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/registrasi', registrasiRoutes);
app.use('/api/registrasi-mutasi', registrasiMutasiRoutes);
app.use('/api/absensi-online', presensiRoutes); // Serve static files for presensi

export default app;
