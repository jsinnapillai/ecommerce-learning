"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { it } from "node:test";
import { Prisma } from "@prisma/client";

// Calculate Cart Prices
const calcPrice = (items: CartItem[]) => {
  const ItemsPrice = round2(
      items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty),
        0
      )
    ),
    shippingPrice = round2(ItemsPrice > 100 ? 0 : 100),
    taxPrice = round2(0.15 * ItemsPrice),
    totalPrice = round2(ItemsPrice + taxPrice + shippingPrice);
  return {
    itemsPrice: ItemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for Cart Cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // GET session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get Cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    //   console.log({"item":item,"product":product,"cart":cart})

    //  console.log( calcPrice([item]))

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new Cart Object

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to Database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate Produt page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} Item add to cart`,
      };
    } else {
      // Check if item is already in cart
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existingItem) {
        // Check stock
        if (product.stock < existingItem.qty + 1) {
          throw new Error("Not Enough Stock");
        }
        // Increase the item quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existingItem.qty + 1;
      }
      // if Item not existi
      else {
        // Check Stock
        if (product.stock < 1) throw new Error("Stock not found");

        // add Item to the cart items
        cart.items.push(item);
      }
      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existingItem ? "Updated in" : "Item add to"
        } cart`,
      };
    }
    // TESTING
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Item add to cart",
    };
  }
  console.log(data);
}

export async function getMyCart() {
  // Check for Cart Cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart Session not found");

  // GET session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromcart(productId: string) {
  try {
    // Check for Cart Cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // Get user Cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not Found");

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item Not Found");

    // Check if only one in qty
    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find(
        (x) => x.productId === exist.productId
      )!.qty = exist.qty - 1;
    }
    // Save to database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name}  was removed from Cart`,
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: `${error}  Error While error removing the cart `,
    };
  }
}
