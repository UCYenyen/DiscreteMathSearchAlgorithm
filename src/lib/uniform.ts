import { Mahasiswa } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getUniformData(quantity: string) : Promise<Mahasiswa[] | {message: string}> {
  if (quantity === "ONETHOUSAND") {
    return await prisma.mahasiswa.findMany();
  } else if (quantity === "FIVETHOUSAND") {
    return await prisma.mahasiswa5K.findMany();
  } else if (quantity === "TENTHOUSAND") {
    return await prisma.mahasiswa10K.findMany();
  }
  return {message: "data not found"};
}



