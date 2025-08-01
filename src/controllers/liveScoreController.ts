// src/controllers/liveScoreController.ts
import { Request, Response } from 'express';
import { db } from '../lib/db';

export const updateScore = async (req: Request, res: Response) => {
  const { nik, score } = req.body;

  if (!nik || typeof score !== 'number') {
    res.status(400).json({ error: 'Field nik dan score harus diisi dan valid' });
  }

  try {
    const result = await db.query('UPDATE live_score SET score = $1 WHERE nik = $2', [score, nik]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Data tidak ditemukan untuk NIK tersebut' });
    }

    res.status(200).json({ message: 'Score berhasil diperbarui', updatedRows: result.rowCount });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

export const getLiveScoreList = async (req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT nik, nama, asal_sekolah, score
      FROM live_score
      WHERE is_sign_in = true
      ORDER BY score DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error mengambil live score list:', err);
    res.status(500).json({ error: 'Gagal mengambil data live score' });
  }
};