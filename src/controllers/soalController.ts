// src/controllers/soal.controller.ts

import { Request, Response } from 'express';
import { db } from '../lib/db'; // Gunakan koneksi DB langsung
import { encrypt } from '../utils';

interface Soal {
  id: string;
  jenis: string;
  parentId?: string;
  pertanyaan: string;
  gambar?: string;
  jawaban: string[];
  jawabanBenar: string;
}

interface ParentContent {
  id: string;
  type: 'text' | 'image';
  content: string;
}

interface SubmitPayload {
  idPeserta: string;
  detailNilai: Record<string, number>;
  totalScore: number;
  cheatCount: number;
}

export const getSoalByUjianId = async (req: Request, res: Response) => {
  const { ujianId } = req.query;

  if (!ujianId || typeof ujianId !== 'string') {
    res.status(400).json({ message: 'Parameter ujianId diperlukan' });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        s.id,
        s.parent_id,
        s.pertanyaan,
        s.gambar,
        s.jawaban,
        s.jawaban_benar,
        js.nama AS jenis
      FROM soal s
      LEFT JOIN jenis_soal js ON s.jenis_soal_id = js.id
      WHERE s.ujian_id = $1
      `,
      [ujianId]
    );

    const data: Soal[] = result.rows.map((row: any) => ({
      id: row.id,
      jenis: row.jenis || 'Tidak diketahui',
      parentId: row.parent_id || undefined,
      pertanyaan: row.pertanyaan,
      jawabanBenar: row.jawaban_benar,
      gambar: row.gambar || undefined,
      jawaban: row.jawaban,
    }));

    const encrypted = encrypt(JSON.stringify(data));
    res.status(200).json(encrypted);
  } catch (error) {
    console.error('[GET /api/soal] Error:', error);
    res.status(500).json({ message: 'Gagal mengambil data soal' });
  }
};

export const getParentContentByUjianId = async (req: Request, res: Response) => {
  const { ujianId } = req.query;

  if (!ujianId || typeof ujianId !== 'string') {
    res.status(400).json({ message: 'Parameter ujianId diperlukan' });
  }

  try {
    const result = await db.query(`SELECT id, type, content FROM parent_soal WHERE ujian_id = $1`, [
      ujianId,
    ]);

    const data: ParentContent[] = result.rows.map((row: any) => ({
      id: row.id,
      type: row.type,
      content: row.content,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('[GET /api/parent-content] Error:', error);
    res.status(500).json({ message: 'Gagal mengambil data parent content' });
  }
};

export const submitJawaban = async (req: Request, res: Response) => {
  try {
    const { idPeserta, detailNilai, totalScore, cheatCount } = req.body as SubmitPayload;

    if (
      !idPeserta ||
      !detailNilai ||
      typeof totalScore !== 'number' ||
      typeof cheatCount !== 'number'
    ) {
      res.status(400).json({ message: 'Payload tidak valid' });
    }

    const insertQuery = `
        INSERT INTO hasil_ujian_2 (id_peserta, detail_nilai, total_score, cheat_count, submitted_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;
    const insertValues = [idPeserta, JSON.stringify(detailNilai), totalScore, cheatCount];
    const insertResult = await db.query(insertQuery, insertValues);
    await db.query('UPDATE "RegistrasiMutasi" SET is_logged_in = false');
    await db.query('DELETE FROM live_score WHERE nik=$1', [idPeserta]);
    res.status(201).json({
      message: 'Jawaban berhasil disimpan',
      id: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error('❌ Gagal menyimpan jawaban:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
