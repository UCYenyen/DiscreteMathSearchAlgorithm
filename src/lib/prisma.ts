import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL,
});

const prismaClientSingleton = () => {
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prismaGlobal: undefined | PrismaClientExtended
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma