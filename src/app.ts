import express from 'express';
import cors from 'cors';
import { registrasiRoutes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/registrasi', registrasiRoutes);

export default app;
