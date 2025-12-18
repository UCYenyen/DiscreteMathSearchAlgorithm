import prisma from "@/lib/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";
import "dotenv/config";

async function main() {
  // data uniform
  const totalData = 1000;
  const totalDataMahasiswa2 = 5000;
  const totalDataMahasiswa3 = 10000;

  const studentsData = Array.from({ length: totalData }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      "Teknik Informatika",
      "Sistem Informasi",
      "Teknik Sipil",
      "Manajemen",
      "Akuntansi",
    ]),
    alamat: faker.location.streetAddress(true),
  }));

  const studentsDataMahasiswa5K = Array.from({
    length: totalDataMahasiswa2,
  }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      "Teknik Informatika",
      "Sistem Informasi",
      "Teknik Sipil",
      "Manajemen",
      "Akuntansi",
    ]),
    alamat: faker.location.streetAddress(true),
  }));

  const studentsDataMahasiswa10K = Array.from({
    length: totalDataMahasiswa3,
  }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      "Teknik Informatika",
      "Sistem Informasi",
      "Teknik Sipil",
      "Manajemen",
      "Akuntansi",
    ]),
    alamat: faker.location.streetAddress(true),
  }));

  // unsorted randomized data

  const unsortedRandomizedData = Array.from({ length: totalData }).map(() => ({
    value: faker.number.int({ min: 1, max: 10000 }),
  }));

  const unsortedRandomizedData5k = Array.from({
    length: totalDataMahasiswa2,
  }).map(() => ({
    value: faker.number.int({ min: 1, max: 10000 }),
  }));

  const unsortedRandomizedData10k = Array.from({
    length: totalDataMahasiswa3,
  }).map(() => ({
    value: faker.number.int({ min: 1, max: 10000 }),
  }));

  // Non Uniform Data
  const nonUniformData = Array.from({ length: totalData }).map(() => {
    const rand = Math.random();
    if (rand < 0.9) {
      return { value: 1 };
    } else {
      return { value: faker.helpers.arrayElement([2, 50, 100]) };
    }
  });

  const nonUniformData5k = Array.from({ length: totalDataMahasiswa2 }).map(() => {
    const rand = Math.random();
    if (rand < 0.9) {
      return { value: 1 };
    } else {
      return { value: faker.helpers.arrayElement([2, 50, 100]) };
    }
  });

  const nonUniformData10k = Array.from({ length: totalDataMahasiswa3 }).map(() => {
    const rand = Math.random();
    if (rand < 0.9) {
      return { value: 1 };
    } else {
      return { value: faker.helpers.arrayElement([2, 50, 100]) };
    }
  });
  console.log("Starting seed...");
  console.log("Checking database connection...");

  await prisma.$queryRaw`SELECT 1`; // checking if the database is reachable
  console.log("Connection successful!");

  try {
    const result = await prisma.mahasiswa.createMany({
      data: studentsData,
      skipDuplicates: true,
    });

    const resultMahasiswa5K = await prisma.mahasiswa5K.createMany({
      data: studentsDataMahasiswa5K,
      skipDuplicates: true,
    });

    const resultMahasiswa10K = await prisma.mahasiswa10K.createMany({
      data: studentsDataMahasiswa10K,
      skipDuplicates: true,
    });
    console.log(`Success: ${result.count} records seeded.`);
    console.log(`Success: ${resultMahasiswa5K.count} records seeded.`);
    console.log(`Success: ${resultMahasiswa10K.count} records seeded.`);

    const unsortedResult = await prisma.unsortedRandomizedData.createMany({
      data: unsortedRandomizedData,
    });

    const unsortedResult5k = await prisma.unsortedRandomizedData5K.createMany({
      data: unsortedRandomizedData5k,
    });

    const unsortedResult10k = await prisma.unsortedRandomizedData10K.createMany({
      data: unsortedRandomizedData10k,
    });

    console.log(`Success: ${unsortedResult.count} unsorted records seeded.`);
    console.log(`Success: ${unsortedResult5k.count} unsorted 5k records seeded.`);
    console.log(`Success: ${unsortedResult10k.count} unsorted 10k records seeded.`);

    const nonUniformResult = await prisma.nonUniformData.createMany({
      data: nonUniformData,
    });

    const nonUniformResult5k = await prisma.nonuniformData5k.createMany({
      data: nonUniformData5k,
    });

    const nonUniformResult10k = await prisma.nonuniformData10k.createMany({
      data: nonUniformData10k,
    });

    console.log(`Success: ${nonUniformResult.count} non-uniform records seeded.`);
    console.log(`Success: ${nonUniformResult5k.count} non-uniform 5k records seeded.`);
    console.log(`Success: ${nonUniformResult10k.count} non-uniform 10k records seeded.`);
  } catch (error) {
    console.error("Detailed Error:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
