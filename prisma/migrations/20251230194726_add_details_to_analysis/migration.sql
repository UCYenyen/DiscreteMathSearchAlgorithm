/*
  Warnings:

  - Added the required column `fieldToSearch` to the `AnalysisResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `searchValue` to the `AnalysisResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldToSearch" AS ENUM ('NAMA', 'NIM', 'JURUSAN', 'ALAMAT');

-- AlterTable
ALTER TABLE "AnalysisResult" ADD COLUMN     "fieldToSearch" "FieldToSearch" NOT NULL,
ADD COLUMN     "searchValue" TEXT NOT NULL;
