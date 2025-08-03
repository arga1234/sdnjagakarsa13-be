import { Request, Response } from 'express';
import { db } from '../lib/db';
import { updateListImagePath } from '../utils/updateListImagePath';

export const createBiodataDapodik = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const data = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholder = keys.map((el, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO biodata_siswa_dapodik(${keys.join(', ')}) VALUES(${placeholder}) RETURNING *`;
    console.log(placeholder, values);
    const response = await db.query(query, values);
    const authorId = response.rows[0].id;
    const listImage = updateListImagePath(
      authorId,
      req.files as Record<string, Express.Multer.File[]>
    );
    const filedName = {
      foto: 'dokumen_foto',
      kk: 'dokumen_kkFile',
      akte: 'dokumen_akteFile',
    };

    const queryUpdate = `
      UPDATE biodata_siswa_dapodik
      SET 
        ${filedName.foto} = $1,
        ${filedName.akte} = $2,
        ${filedName.kk} = $3
      WHERE id = $4
      RETURNING *
    `;

    await db.query(queryUpdate, [
      listImage.find((el) => el.field === filedName.foto)?.filePath,
      listImage.find((el) => el.field === filedName.akte)?.filePath,
      listImage.find((el) => el.field === filedName.kk)?.filePath,
      authorId,
    ]);
    res.status(201).json({ success: true, data: response.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: 'Internal server error' });
  }
};
