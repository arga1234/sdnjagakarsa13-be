// src/controllers/checkinController.ts
import { Request, Response } from 'express';
import { db } from '../lib/db';

interface IData {
  no_peserta: string;
  id_acara: string;
  check_in_time: string;
}

export const checkIn = async (req: Request, res: Response) => {
  const { nik } = req.body;

  if (!nik) {
    res.status(400).json({ error: 'NIK wajib diisi' });
    return;
  }

  try {
    // 1. Cek apakah NIK sudah ada
    const checkQuery = 'SELECT id FROM siswa WHERE nik = $1';
    const checkResult = await db.query(checkQuery, [nik]);

    if (checkResult.rows.length > 0) {
      // Jika ditemukan, update kolom agama
      const { agama } = req.body;
      const siswaId = checkResult.rows[0].id;

      if (agama) {
        const updateQuery = 'UPDATE siswa SET agama = $1 WHERE id = $2';
        await db.query(updateQuery, [agama, siswaId]);
      }

      res.status(200).json({ id: siswaId });
      return;
    }

    // Jika tidak ditemukan, validasi dan insert data baru
    const { id_kelas, nama, gender, agama } = req.body;

    if (!id_kelas || !nama || !gender || !agama) {
      res
        .status(400)
        .json({ error: 'id_kelas, nama, gender, dan agama wajib diisi untuk data baru' });
      return;
    }

    const insertQuery = `
      INSERT INTO siswa (nik, nama, id_kelas, gender, agama)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const insertResult = await db.query(insertQuery, [nik, nama, id_kelas, gender, agama]);

    res.status(201).json({ id: insertResult.rows[0].id });
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

export const checkInV2 = async (req: Request, res: Response) => {
  try {
    const { no_peserta, id_acara } = req.body;
    if (!no_peserta && !id_acara) {
      res.status(400).send({
        success: false,
        message: 'NIK dan ID Acara harus diisi',
      });
      return;
    }

    const query = `INSERT INTO check_in(no_peserta, id_acara)
                  VALUES ($1, $2)
                  RETURNING no_peserta, id_acara`;

    const queryResult = await db.query(query, [no_peserta, id_acara]);
    res.status(201).json({ success: true, no_peserta: queryResult.rows[0].no_peserta, id_acara });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
    return;
  }
};

export const validateCheckIn = async (req: Request, res: Response) => {
  try {
    // Sekarang tiap item data juga mengandung check_in_time: string | Date
    const { data }: { data: Array<IData & { check_in_time: string }> } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      res.status(400).json({ success: false, message: 'Data kosong atau tidak valid' });
      return;
    }

    // ============================================================
    // 1) Buat tuples (no_peserta, id_acara, check_in_time)
    // ============================================================
    const values: string[] = [];
    const params: any[] = [];

    data.forEach(({ no_peserta, id_acara, check_in_time }, i) => {
      const base = i * 3; // 3 param per record
      values.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
      params.push(no_peserta, id_acara, check_in_time);
    });

    // ============================================================
    // 2) UPDATE dengan menggunakan FROM (VALUES ...)
    // ============================================================
    const updateQuery = `
      UPDATE check_in AS c
      SET
        is_valid = TRUE,
        check_in_time = v.check_in_time
      FROM (
        VALUES
          ${values.join(',\n          ')}
      ) AS v(no_peserta, id_acara, check_in_time)
      WHERE
        c.no_peserta = v.no_peserta
        AND c.id_acara = v.id_acara::uuid
    `;

    await db.query(updateQuery, params);

    // ============================================================
    // 3) Kembalikan response
    // ============================================================

    // Cari yang berhasil (optional, karena kita tahu semua yang ada di data di-update)
    const validated = data.map((d) => d.no_peserta);

    // Cari yang tidak ditemukan di tabel
    // (jika ingin deteksi, kamu bisa jalankan SELECT sebelum UPDATE)

    res.status(200).json({
      success: true,
      message: 'Validasi selesai',
      validated,
    });
    return;
  } catch (error) {
    console.error('Validate check-in error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

export const confirmCheckIn = async (req: Request, res: Response) => {
  try {
    const { no_peserta, id_acara } = req.body;
    const query = 'SELECT * FROM check_in WHERE no_peserta = $1 AND id_acara = $2';
    const queryRes = await db.query(query, [no_peserta, id_acara]);
    if (queryRes.rows[0].is_valid) {
      res.status(200).send({ success: true, message: 'Konfirmasi checkin berhasil' });
      return;
    }
    res.status(401).send({
      success: false,
      message: 'Konfirmasi checkin gagal, karena kamu belum scan ke petugas',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};
