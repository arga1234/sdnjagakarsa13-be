-- CreateTable
CREATE TABLE "AbsensiOnline" (
    "id" TEXT NOT NULL,
    "namaAnak" TEXT NOT NULL,
    "namaOrtu" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "statusGrup" TEXT NOT NULL,
    "tanggalAbsensi" TIMESTAMP(3) NOT NULL,
    "statusHadir" TEXT NOT NULL,
    "keterangan" TEXT,
    "agreement" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbsensiOnline_pkey" PRIMARY KEY ("id")
);
