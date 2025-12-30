/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Mahasiswa10K` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Mahasiswa10K` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Mahasiswa5K` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Mahasiswa5K` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `NonUniformData` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `NonuniformData10k` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `NonuniformData5k` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `UnsortedRandomizedData` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `UnsortedRandomizedData10K` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `UnsortedRandomizedData5K` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nim]` on the table `NonUniformData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `NonuniformData10k` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `NonuniformData5k` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `UnsortedRandomizedData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `UnsortedRandomizedData10K` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `UnsortedRandomizedData5K` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat` to the `NonUniformData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `NonUniformData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `NonUniformData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `NonUniformData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `NonuniformData10k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `NonuniformData10k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `NonuniformData10k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `NonuniformData10k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `NonuniformData5k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `NonuniformData5k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `NonuniformData5k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `NonuniformData5k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `UnsortedRandomizedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `UnsortedRandomizedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `UnsortedRandomizedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `UnsortedRandomizedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `UnsortedRandomizedData10K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `UnsortedRandomizedData10K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `UnsortedRandomizedData10K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `UnsortedRandomizedData10K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `UnsortedRandomizedData5K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `UnsortedRandomizedData5K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `UnsortedRandomizedData5K` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `UnsortedRandomizedData5K` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Mahasiswa10K" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Mahasiswa5K" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "NonUniformData" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NonuniformData10k" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NonuniformData5k" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnsortedRandomizedData" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnsortedRandomizedData10K" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnsortedRandomizedData5K" DROP COLUMN "value",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NonUniformData_nim_key" ON "NonUniformData"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "NonuniformData10k_nim_key" ON "NonuniformData10k"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "NonuniformData5k_nim_key" ON "NonuniformData5k"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "UnsortedRandomizedData_nim_key" ON "UnsortedRandomizedData"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "UnsortedRandomizedData10K_nim_key" ON "UnsortedRandomizedData10K"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "UnsortedRandomizedData5K_nim_key" ON "UnsortedRandomizedData5K"("nim");
