/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const tmpPath = 'uploads/tmp';
    if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath, { recursive: true });
    cb(null, tmpPath);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.size > 1024 * 1024) {
    return cb(new Error('File lebih dari 1MB'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter,
});
