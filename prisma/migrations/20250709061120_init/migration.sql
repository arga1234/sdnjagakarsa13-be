-- CreateTable
CREATE TABLE "Registrasi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "kk" TEXT NOT NULL,
    "agreement" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrasiMutasi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "kk" TEXT NOT NULL,
    "kelasTujuan" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "agreement" BOOLEAN NOT NULL,
    "asalSekolah" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrasiMutasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCollection" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "ImageCollection_pkey" PRIMARY KEY ("id")
);
