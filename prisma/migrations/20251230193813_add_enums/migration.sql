-- CreateEnum
CREATE TYPE "Algorithm" AS ENUM ('LINEAR_SEARCH', 'BINARY_SEARCH', 'INTERPOLATION_SEARCH');

-- CreateEnum
CREATE TYPE "Datatype" AS ENUM ('UNIFORM', 'NONUNIFORM', 'UNSORTED');

-- CreateEnum
CREATE TYPE "DatasetSize" AS ENUM ('SIZE_1K', 'SIZE_5K', 'SIZE_10K');

-- AlterTable
ALTER TABLE "Mahasiswa" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_1K';

-- AlterTable
ALTER TABLE "Mahasiswa10K" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_10K';

-- AlterTable
ALTER TABLE "Mahasiswa5K" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_5K';

-- AlterTable
ALTER TABLE "NonUniformData" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_1K';

-- AlterTable
ALTER TABLE "NonuniformData10k" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_10K';

-- AlterTable
ALTER TABLE "NonuniformData5k" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_5K';

-- AlterTable
ALTER TABLE "UnsortedRandomizedData" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_1K';

-- AlterTable
ALTER TABLE "UnsortedRandomizedData10K" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_10K';

-- AlterTable
ALTER TABLE "UnsortedRandomizedData5K" ADD COLUMN     "size" "DatasetSize" NOT NULL DEFAULT 'SIZE_5K';

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "iterations" INTEGER NOT NULL,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "executionTimeMs" DOUBLE PRECISION NOT NULL,
    "startSearchAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endSearchAt" TIMESTAMP(3) NOT NULL,
    "datatype" "Datatype" NOT NULL,
    "algorithm" "Algorithm" NOT NULL,
    "datasetSize" "DatasetSize" NOT NULL,
    "refrenceDataset" TEXT NOT NULL,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);
