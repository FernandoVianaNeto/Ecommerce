"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { removeProductFromCartSchema, RemoveProductFromCartSchema } from "./schema";
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const removeProductFromCart = async (data: RemoveProductFromCartSchema) => {
    removeProductFromCartSchema.parse(data);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("unauthorized");
    }

    const cartItem = await db.query.cartItemTable.findFirst({
        where: (cartItem, { eq }) => 
            eq(cartItem.id, data.cartItemId),
        with: {
            cart: true,
        },
    });

    if (!cartItem) {
        throw new Error("Product variant not found in cart")
    }

    const cartDoesNotBelongToUser = cartItem?.cart.userId !== session?.user.id;

    if (cartDoesNotBelongToUser) {
        throw new Error("unauthorized");
    }

    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id))
}       