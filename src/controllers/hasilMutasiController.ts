import { Request, Response } from 'express';
import { db } from '../lib/db';

export const cekHasilMutasi = async (req: Request, res: Response) => {
  const { id_peserta } = req.body;

  try {
    const query = `
      SELECT 
        rm.nama,
        rm.kelas,
        hm.is_lulus
      FROM hasil_ujian hm
      LEFT JOIN "RegistrasiMutasi" rm
        ON hm.id_peserta = rm.nik
      WHERE hm.id_peserta = $1
    `;
    console.log('Executing query:', query, 'with id_peserta:', id_peserta);
    const result = await db.query(query, [id_peserta]);
    console.log('Query result:', result.rows);
    ``;
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Data tidak ditemukan' });
      return;
    }

    const data = result.rows[0];
    res.json({
      nama: data.nama,
      kelasTujuan: data.kelas,
      is_lulus: data.is_lulus,
    });
  } catch (error) {
    console.error('Error querying data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data' });
  }
};

export interface IData {
  nama: string;
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kelasTujuan: string;
  asalSekolah: string;
  rapor_smt_1: number;
  rapor_smt_2: number;
  rerata_rapor: number;
  nilai_interview: number;
  total_score: number;
  rerata_tes: number;
  bobot_rerata_rapor: number;
  bobot_rerata_tes: number;
  total: number;
  is_lulus: boolean;
}

export const getHasilMutasiList = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        rm.nik, rm.nama, rm."jenisKelamin", rm."tanggalLahir", rm."kelasTujuan", 
        rm."asalSekolah", rm.rapor_smt_1, rm.rapor_smt_2, 
        h.nilai_interview, h.total_score, h.is_lulus
      FROM hasil_ujian_2 h 
      LEFT JOIN "RegistrasiMutasi" rm ON h.id_peserta = rm.nik
    `;

    const result = await db.query(query);

    const data: IData[] = result.rows.map((row: any) => {
      const rerata_rapor = (row.rapor_smt_1 + row.rapor_smt_2) / 2;
      const rerata_tes = (parseInt(row.nilai_interview, 10) + parseInt(row.total_score, 10)) / 2;
      const bobot_rerata_rapor = parseFloat((rerata_rapor * 0.4).toFixed(2));
      const bobot_rerata_tes = parseFloat((rerata_tes * 0.6).toFixed(2));
      const total = bobot_rerata_rapor + bobot_rerata_tes;
      return {
        nama: row.nama,
        nik: row.nik,
        jenisKelamin: row.jenisKelamin,
        tanggalLahir: row.tanggalLahir,
        kelasTujuan: row.kelasTujuan,
        asalSekolah: row.asalSekolah,
        rapor_smt_1: row.rapor_smt_1,
        rapor_smt_2: row.rapor_smt_2,
        rerata_rapor,
        nilai_interview: parseInt(row.nilai_interview, 10),
        total_score: parseInt(row.total_score, 10),
        rerata_tes,
        bobot_rerata_rapor,
        bobot_rerata_tes,
        total,
        is_lulus: row.is_lulus,
      };
    });

    const sortedData = data.sort((a, b) => b.total - a.total);

    res.json(sortedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
