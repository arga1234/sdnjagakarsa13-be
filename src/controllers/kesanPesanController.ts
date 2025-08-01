import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const handleFormSubmit = async (req: Request, res: Response) => {
  try {
    const { idAcara, nama, kesan, pesan, rating, agreement } = req.body;

    if (agreement !== 'on') {
      res.status(400).json({ message: 'Persetujuan (agreement) wajib disetujui.' });
      return;
    } else {
      // Simpan data ke Prisma
      const absensi = await prisma.kesanPesan.create({
        data: {
          idAcara,
          nama,
          kesan,
          pesan,
          rating,
          agreement: true,
        },
      });

      res.status(200).json({
        message: 'Kesan pesan berhasil disimpan',
        id: absensi.id,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan data kesan pesan',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { sort = 'all', rating, page = '1', limit = '5', idAcara } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 5;
    const skip = (pageNumber - 1) * pageSize;

    const where: any = {
      idAcara,
    };

    if (rating) where.rating = rating;

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };

    if (sort === 'terlama') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'terbaru') {
      // both 'all' and 'terbaru' default to newest first
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'populer') {
      orderBy = { likedBy: 'desc' };
    }

    const feedbacks = await prisma.kesanPesan.findMany({
      where: { ...where },
      orderBy,
      skip,
      take: pageSize,
    });

    const total = await prisma.kesanPesan.count({ where });

    res.json({
      feedbacks,
      meta: {
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likeOrDislikeFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // 'like' or 'dislike'

  if (!['like', 'dislike'].includes(action)) {
    res.status(400).json({ error: 'Invalid action. Use "like" or "dislike".' });
  }

  try {
    if (action === 'like') {
      const updated = await prisma.kesanPesan.update({
        where: { id },
        data: { likedBy: { increment: 1 } },
        select: { likedBy: true },
      });
      res.status(200).json({ likedBy: updated.likedBy });
    } else {
      const record = await prisma.kesanPesan.findUnique({
        where: { id },
        select: { likedBy: true },
      });
      const current = record?.likedBy ?? 0;
      const newCount = Math.max(current - 1, 0);
      // Update to new count
      const updated = await prisma.kesanPesan.update({
        where: { id },
        data: { likedBy: newCount },
        select: { likedBy: true },
      });
      res.status(200).json({ likedBy: updated.likedBy });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update feedback.' });
  }
};
