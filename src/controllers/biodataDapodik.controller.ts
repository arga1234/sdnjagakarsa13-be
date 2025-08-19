import { Request, Response } from 'express';
import { db } from '../lib/db';
import { updateListImagePath } from '../utils/updateListImagePath';

export const createBiodataDapodik = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
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

export const getBiodataDapodikByNik = async (req: Request, res: Response) => {
  const muridNik = req.params.murid_nik;
  const tglLahirMurid = req.query.tglLahirMurid as string;
  const thnLahirIbu = req.query.thnLahirIbu as string;

  if (!muridNik) {
    res.status(400).send({ success: false, message: 'Parameter murid_nik diperlukan' });
    return;
  }

  if (!tglLahirMurid || !thnLahirIbu) {
    res
      .status(400)
      .send({ success: false, message: 'Parameter tglLahirMurid dan thnLahirIbu diperlukan' });
    return;
  }

  try {
    const query = `
  SELECT 
    id,
    murid_nama, murid_nisn, murid_kk, murid_nik, murid_kewarganegaraan,
    murid_tempatlahir, murid_tanggallahir, murid_jeniskelamin, murid_agama,
    ayah_nama, ayah_nik, ayah_tahunlahir, ayah_pendidikan, ayah_pekerjaan, ayah_penghasilan,
    ibu_nama, ibu_nik, ibu_tahunlahir, ibu_pendidikan, ibu_pekerjaan, ibu_penghasilan,
    wali_nama, wali_nik, wali_tahunlahir, wali_pendidikan, wali_pekerjaan, wali_penghasilan,
    kontak_telprumah, kontak_phonenumber, kontak_email,
    dokumen_foto, dokumen_kkfile, dokumen_aktefile,
    created_at, murid_noregistrasiakta, murid_berkebutuhankhusus, murid_wali,
    murid_alamatjalan, murid_rt, murid_rw, murid_dusun, murid_desakelurahan, murid_kodepos,
    murid_tempattinggal, murid_modatransportasi, murid_anakkeberapa, murid_penerimakpspkh,
    murid_punyakip, murid_tetapmenerimapip,
    ayah_kebutuhankhusus, ibu_kebutuhankhusus, wali_kebutuhankhusus,
    murid_lintang, murid_bujur, murid_berhakmenerimapip, murid_alasanmenolakpip,
    murid_alasanberhakpip, murid_kewarganegaraanlainnya,
    periodik_tinggibadan, periodik_beratbadan, periodik_lingkarkepala,
    periodik_jarakrumahjauh, periodik_jarakrumah, periodik_waktujam,
    periodik_waktumenit, periodik_jumlahsaudara
  FROM biodata_siswa_dapodik
  WHERE murid_nik = $1
  LIMIT 1;
`;

    const result = await db.query(query, [muridNik]);

    if (result.rowCount === 0) {
      res.status(404).send({ success: false, message: 'Siswa tidak ditemukan' });
      return;
    }

    const row = result.rows[0];

    // 1️⃣ Cek tanggal lahir murid (format YYYY-MM-DD)
    if (row.murid_tanggallahir !== tglLahirMurid) {
      res.status(400).send({ success: false, message: 'Tanggal lahir murid tidak cocok' });
      return;
    }

    // 2️⃣ Cek tahun lahir ibu (pakai includes atau regex)
    const ibuTahunStr = String(row.ibu_tahunlahir || '');
    if (!ibuTahunStr.includes(thnLahirIbu)) {
      res.status(400).send({ success: false, message: 'Tahun lahir ibu tidak cocok' });
      return;
    }

    // Grouping prefix
    const grouped: any = {
      murid: {},
      ayah: {},
      ibu: {},
      wali: {},
      kontak: {},
      periodik: {}, // ✅ Tambahan grouping periodik
    };
    const plain: any = {};

    for (const key in row) {
      if (key.startsWith('murid_')) {
        grouped.murid[key.replace('murid_', '')] = row[key];
      } else if (key.startsWith('ayah_')) {
        grouped.ayah[key.replace('ayah_', '')] = row[key];
      } else if (key.startsWith('ibu_')) {
        grouped.ibu[key.replace('ibu_', '')] = row[key];
      } else if (key.startsWith('wali_')) {
        grouped.wali[key.replace('wali_', '')] = row[key];
      } else if (key.startsWith('kontak_')) {
        grouped.kontak[key.replace('kontak_', '')] = row[key];
      } else if (key.startsWith('periodik_')) {
        // ✅ Grouping periodik
        grouped.periodik[key.replace('periodik_', '')] = row[key];
      } else {
        plain[key] = row[key];
      }
    }

    const responseObj = { ...plain, ...grouped };
    res.send({ success: true, data: responseObj });
  } catch (err) {
    console.error('getSiswaByNik error:', err);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const updateBiodataDapodikByNik = async (req: Request, res: Response) => {
  try {
    const muridNik = req.params.murid_nik;

    if (!muridNik) {
      res.status(400).json({ success: false, message: 'Parameter murid_nik diperlukan' });
    }

    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({ success: false, message: 'Tidak ada data untuk diupdate' });
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    // Generate bagian SET query secara dinamis
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    console.log(setClause);
    const queryUpdate = `
      UPDATE biodata_siswa_dapodik
      SET ${setClause}
      WHERE murid_nik = $${keys.length + 1}
      RETURNING *
    `;
    console.log(queryUpdate, [...values, muridNik]);

    const response = await db.query(queryUpdate, [...values, muridNik]);

    if (response.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }

    const authorId = response.rows[0].id;

    // ✅ Update file kalau ada upload
    if (req.files && Object.keys(req.files).length > 0) {
      const listImage = updateListImagePath(
        authorId,
        req.files as Record<string, Express.Multer.File[]>
      );

      const filedName = {
        foto: 'dokumen_foto',
        kk: 'dokumen_kkFile',
        akte: 'dokumen_akteFile',
      };

      const queryUpdateFile = `
        UPDATE biodata_siswa_dapodik
        SET 
          ${filedName.foto} = $1,
          ${filedName.akte} = $2,
          ${filedName.kk} = $3
        WHERE id = $4
        RETURNING *
      `;

      await db.query(queryUpdateFile, [
        listImage.find((el) => el.field === filedName.foto)?.filePath,
        listImage.find((el) => el.field === filedName.akte)?.filePath,
        listImage.find((el) => el.field === filedName.kk)?.filePath,
        authorId,
      ]);
    }

    res.status(200).json({ success: true, data: response.rows[0] });
  } catch (error) {
    console.error('updateBiodataDapodikByNik error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
