export interface IRawSoal {
  nomorSoal: number;
  pertanyaanText: string;
  pertanyaanImage?: string; // single image
  pilihanJawabanText?: string[];
  pilihanJawabanImage?: string[];
}

export interface IDocRequestPayload {
  dokumen: Express.Multer.File; // file PDF atau .docx
  jawaban: { noSoal: number; jawaban: string }[];
}
