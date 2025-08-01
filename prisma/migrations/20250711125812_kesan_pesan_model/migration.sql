-- CreateTable
CREATE TABLE "KesanPesan" (
    "id" TEXT NOT NULL,
    "idAcara" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kesan" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "agreement" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KesanPesan_pkey" PRIMARY KEY ("id")
);
