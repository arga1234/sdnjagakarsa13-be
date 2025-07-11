export interface RegistrasiForm {
  nama: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  kk: string;
  agreement: boolean;
}

export interface ImageDetail {
  authorId: string;
  fileName: string;
  filePath: string;
}
