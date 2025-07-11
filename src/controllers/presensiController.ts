import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const handleFormSubmit = async (req: Request, res: Response) => {
  try {
    const {
      namaAnak,
      namaOrtu,
      noHp,
      statusGrup,
      tanggalAbsensi,
      statusHadir,
      keterangan,
      agreement,
    } = req.body;

    if (agreement !== 'on') {
      res.status(400).json({ message: 'Persetujuan (agreement) wajib disetujui.' });
      return;
    } else {
      // Simpan data ke Prisma
      const absensi = await prisma.absensiOnline.create({
        data: {
          namaAnak,
          namaOrtu,
          noHp,
          statusGrup,
          tanggalAbsensi: new Date(tanggalAbsensi),
          statusHadir,
          keterangan,
          agreement: true,
        },
      });

      res.status(200).json({
        message: 'Absensi berhasil disimpan',
        id: absensi.id,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan data absensi',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
};
