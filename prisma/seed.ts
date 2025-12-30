import prisma from "@/lib/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";
import "dotenv/config";

async function main() {
  const totalData = 1000;
  const totalData5K = 5000;
  const totalData10K = 10000;

  const generateUniform = (len: number) =>
    Array.from({ length: len }).map((_, i) => ({
      nama: faker.person.fullName(),
      nim: (202400000000 + i).toString(),
      jurusan: faker.helpers.arrayElement([
        "Teknik Informatika",
        "Sistem Informasi",
        "Manajemen",
      ]),
      alamat: faker.location.streetAddress(true),
    }));

  const generateUnsorted = (len: number) => {
    const nims = Array.from({ length: len }).map(() =>
      faker.number.int({ min: 10000000, max: 99999999 }).toString()
    );

    return nims.map((nim) => ({
      nama: faker.person.fullName(),
      nim: `2024${nim}`,
      jurusan: faker.helpers.arrayElement([
        "Teknik Sipil",
        "Akuntansi",
        "Teknik Informatika",
      ]),
      alamat: faker.location.streetAddress(true),
    }));
  };

  const generateNonUniform = (len: number) => {
    const dominantData = {
      nama: "Reze",
      nim: "202411111111",
      jurusan: "Teknik Informatika",
      alamat: "Jl. Dominan No. 1",
    };

    const extraDataOptions = [
      {
        nama: "User Dua",
        nim: "202422222222",
        jurusan: "Sistem Informasi",
        alamat: "Alamat Dua",
      },
      {
        nama: "User Lima Puluh",
        nim: "202450505050",
        jurusan: "Manajemen",
        alamat: "Alamat 50",
      },
      {
        nama: "User Seratus",
        nim: "202499999999",
        jurusan: "Akuntansi",
        alamat: "Alamat 100",
      },
    ];

    return Array.from({ length: len }).map(() => {
      const rand = Math.random();
      if (rand < 0.9) {
        return { ...dominantData };
      } else {
        return faker.helpers.arrayElement(extraDataOptions);
      }
    });
  };

  console.log("Starting seed...");

  try {
    // Seeding Uniform
    await prisma.mahasiswa.createMany({ data: generateUniform(totalData) });
    await prisma.mahasiswa5K.createMany({ data: generateUniform(totalData5K) });
    await prisma.mahasiswa10K.createMany({
      data: generateUniform(totalData10K),
    });

    // Seeding Unsorted (NIM Lompat-lompat)
    await prisma.unsortedRandomizedData.createMany({
      data: generateUnsorted(totalData),
    });
    await prisma.unsortedRandomizedData5K.createMany({
      data: generateUnsorted(totalData5K),
    });
    await prisma.unsortedRandomizedData10K.createMany({
      data: generateUnsorted(totalData10K),
    });

    // Seeding Non-Uniform (90% Identik)
    await prisma.nonUniformData.createMany({
      data: generateNonUniform(totalData),
    });
    await prisma.nonuniformData5k.createMany({
      data: generateNonUniform(totalData5K),
    });
    await prisma.nonuniformData10k.createMany({
      data: generateNonUniform(totalData10K),
    });

    console.log("Seed successful!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
