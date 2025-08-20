"use server";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCart = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return {
            id: undefined,
            userId: undefined,
            shippingAddressId: undefined,
            shippingAddress: undefined,
            cartItems: [],
            totalPriceInCents: 0,
            createdAt: undefined,
            updatedAt: undefined,
        }
    }

    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
        with: {
            shippingAddress:     true,
            cartItems: {
                with: {
                    productVariant: {
                        with: {
                            product: true,
                        }
                    },
                }
            }
        }
    });

    if (!cart) {
        const [newCart] = await db.insert(cartTable).values({
            userId: session?.user.id
        }).returning();

        return { ...newCart, cartItems: [], totalPriceInCents: 0 }
    }

    return {...cart, totalPriceInCents: cart.cartItems.reduce(
        (acc, item) => acc + (item?.productVariant?.priceInCents as number) * item.quantity,
        0,
    )}
}