-- CreateTable
CREATE TABLE "Registrasi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "kk" TEXT NOT NULL,
    "agreement" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
