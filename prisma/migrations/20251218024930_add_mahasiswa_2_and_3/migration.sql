-- CreateTable
CREATE TABLE "Mahasiswa5K" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa5K_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahasiswa10K" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa10K_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa5K_nim_key" ON "Mahasiswa5K"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa10K_nim_key" ON "Mahasiswa10K"("nim");
