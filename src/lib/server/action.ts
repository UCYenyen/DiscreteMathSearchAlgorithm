"use server";

import { getUniformData } from "@/lib/uniform";
import { getNonUniformData } from "@/lib/nonuniform";
import { getSortedData } from "@/lib/unsorted";

export async function fetchData(type: string, quantity: string) {
  let response;
  
  if (type === "UNIFORM") {
    response = await getUniformData(quantity);
  } else if (type === "NON_UNIFORM") {
    response = await getNonUniformData(quantity); 
  } else {
    response = await getSortedData(quantity);
  }

  return Array.isArray(response) ? response : [];
}