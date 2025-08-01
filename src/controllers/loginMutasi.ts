import { Request, Response } from 'express';
import { db } from '../lib';

/**
 * POST /api/login
 * Body: { username: string, password: string }
 */
export async function loginController(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username dan password wajib diisi' });
    return;
  }

  try {
    const result = await db.query('SELECT * FROM "RegistrasiMutasi" WHERE nik = $1 LIMIT 1;', [
      username,
    ]);

    const user = result.rows[0] as {
      id: string;
      nama: string;
      kelasTujuan: string;
      ujian_id: string;
      password: string;
      is_logged_in: boolean;
      asal_sekolah: string;
      jenis_kelamin: string;
      nik: string;
    };

    if (!user) {
      res.status(401).json({ error: 'User tidak ditemukan' });
      return;
    }

    if (user.is_logged_in && user.nik !== '123456') {
      res.status(403).json({ error: 'User sudah login di sesi lain' });
      return;
    }

    if (password !== user.password) {
      res.status(401).json({ error: 'Password salah' });
      return;
    }

    // Update status login di RegistrasiMutasi
    await db.query('UPDATE "RegistrasiMutasi" SET "is_logged_in" = true WHERE nik = $1', [
      username,
    ]);

    // Insert data baru ke live_score
    await db.query(
      `INSERT INTO "live_score" (nik, nama, asal_sekolah, kelas_tujuan, jenis_kelamin, score, is_sign_in)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        username,
        user.nama,
        user.asal_sekolah,
        user.kelasTujuan,
        user.jenis_kelamin,
        0, // default score
        true, // is_sign_in
      ]
    );

    res.json({
      message: 'Login berhasil 🎉',
      data: {
        id: user.id,
        nama: user.nama,
        kelasTujuan: user.kelasTujuan,
        ujian_id: user.ujian_id,
      },
    });
    return;
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
    return;
  }
}
