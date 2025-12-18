import { UnsortedRandomizedData } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
export async function getSortedData(quantity: string) : Promise<UnsortedRandomizedData[] | {message: string}> {
  if (quantity === "ONETHOUSAND") {
    return await prisma.unsortedRandomizedData.findMany();
  } else if (quantity === "FIVETHOUSAND") {
    return await prisma.unsortedRandomizedData5K.findMany();
  } else if (quantity === "TENTHOUSAND") {
    return await prisma.unsortedRandomizedData10K.findMany();
  }
  return {message: "data not found"};
}
