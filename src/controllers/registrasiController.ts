/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

export const handleFormSubmit = async (req: Request, res: Response) => {
  try {
    const { nama, jenisKelamin, tempatLahir, tanggalLahir, nik, kk, agreement } = req.body;
    // 1. Simpan ke DB
    const registrasi = await prisma.registrasi.create({
      data: {
        nama,
        jenisKelamin,
        tempatLahir,
        tanggalLahir,
        nik,
        kk,
        agreement: agreement === 'true',
      },
    });

    const id = registrasi.id;
    const files = req.files as Record<string, Express.Multer.File[]>;

    // 2. Rename dan pindah file
    Object.entries(files).forEach(([field, fileArray]) => {
      const file = fileArray[0]; // ambil satu saja karena maxCount: 1
      const dirPath = path.join('uploads', field);
      const newName = `${id}_${file.originalname}`;
      const newPath = path.join(dirPath, newName);

      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

      fs.renameSync(file.path, newPath);
    });

    res.status(200).json({
      message: 'Data berhasil disimpan',
      id,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan data',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
};
