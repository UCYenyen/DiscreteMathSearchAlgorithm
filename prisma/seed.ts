import prisma from "@/lib/prisma"
import { fakerID_ID as faker } from '@faker-js/faker'
import 'dotenv/config'

async function main() {
  const totalData = 1000
  const totalDataMahasiswa2 = 5000
  const totalDataMahasiswa3 = 10000

  const studentsData = Array.from({ length: totalData }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      'Teknik Informatika', 'Sistem Informasi', 'Teknik Sipil', 'Manajemen', 'Akuntansi'
    ]),
    alamat: faker.location.streetAddress(true),
  }))

  const studentsDataMahasiswa5K = Array.from({ length: totalDataMahasiswa2 }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      'Teknik Informatika', 'Sistem Informasi', 'Teknik Sipil', 'Manajemen', 'Akuntansi'
    ]),
    alamat: faker.location.streetAddress(true),
  }))

  const studentsDataMahasiswa10K = Array.from({ length: totalDataMahasiswa3 }).map(() => ({
    nama: faker.person.fullName(),
    nim: `2024${faker.string.numeric(8)}`,
    jurusan: faker.helpers.arrayElement([
      'Teknik Informatika', 'Sistem Informasi', 'Teknik Sipil', 'Manajemen', 'Akuntansi'
    ]),
    alamat: faker.location.streetAddress(true),
  }))
  
  console.log("Starting seed...")
  console.log("Checking database connection...")

  
  await prisma.$queryRaw`SELECT 1` // checking if the database is reachable
  console.log("Connection successful!")
  
  try {
    const result = await prisma.mahasiswa.createMany({
      data: studentsData,
      skipDuplicates: true,
    })

    const resultMahasiswa5K = await prisma.mahasiswa5K.createMany({
      data: studentsDataMahasiswa5K,
      skipDuplicates: true,
    })

    const resultMahasiswa10K = await prisma.mahasiswa10K.createMany({
      data: studentsDataMahasiswa10K,
      skipDuplicates: true,
    })
    console.log(`Success: ${result.count} records seeded.`)
    console.log(`Success: ${resultMahasiswa5K.count} records seeded.`)
    console.log(`Success: ${resultMahasiswa10K.count} records seeded.`)
  } catch (error) {
    console.error("Detailed Error:", error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })