import { NonuniformData10k } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import error from "next/error";
export async function getNonUniformData(quantity: string) : Promise<NonuniformData10k[] | {message: string}> {
  if (quantity === "ONETHOUSAND") {
    return await prisma.nonUniformData.findMany();
  } else if (quantity === "FIVETHOUSAND") {
    return await prisma.nonuniformData5k.findMany();
  } else if (quantity === "TENTHOUSAND") {
    return await prisma.nonuniformData10k.findMany();
  }
  return {message: "data not found"};
}