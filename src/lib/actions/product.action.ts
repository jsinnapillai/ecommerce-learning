"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { Product } from "@/types";

// get Latest Products

export async function getLatestProducts() : Promise<Product[]> {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}


export const getProductBySlug = async (slug: string) : Promise<Product | null> => {
  return  await prisma.product.findFirst({
    where: {
      slug,
    },
  });
   

}