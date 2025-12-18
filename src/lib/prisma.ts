import { PrismaClient } from '@/generated/prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prismaClientSingleton = () => {
  // Menambahkan extension .withAccelerate()
  return new PrismaClient({ adapter })
}

// Menyesuaikan tipe global agar sesuai dengan client yang sudah di-extend
type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prismaGlobal: undefined | PrismaClientExtended
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma