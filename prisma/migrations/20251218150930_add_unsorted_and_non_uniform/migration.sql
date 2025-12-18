-- CreateTable
CREATE TABLE "UnsortedRandomizedData" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "UnsortedRandomizedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnsortedRandomizedData5K" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "UnsortedRandomizedData5K_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnsortedRandomizedData10K" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "UnsortedRandomizedData10K_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonUniformData" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "NonUniformData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonuniformData5k" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "NonuniformData5k_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonuniformData10k" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "NonuniformData10k_pkey" PRIMARY KEY ("id")
);
