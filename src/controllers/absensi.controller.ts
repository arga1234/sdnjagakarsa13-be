import { Request, Response } from 'express';
import { db } from '../lib/db';

export const getAbsensiOnline = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = [];
    const values: any[] = [];

    if (startDate && endDate) {
      conditions.push(`"createdAt" BETWEEN $${values.length + 1} AND $${values.length + 2}`);
      values.push(startDate, endDate);
    }

    let query = 'SELECT * FROM "AbsensiOnline"';
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY "createdAt" DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);

    res.json({
      page: Number(page),
      limit: Number(limit),
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching absensi:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
