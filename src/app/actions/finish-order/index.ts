"use server";

import { auth } from "@/lib/auth";
import { FinishOrderSchema } from "./schema";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cartItemTable, cartTable, orderItemTable, orderTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const finishOrder = async (data: FinishOrderSchema) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("unauthorized");
    }

    const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.userId, session?.user.id),
        with: {
            shippingAddress: true,
            cartItem: {
                with: {
                    productVariant: {
                        with: {
                            product: true
                        }
                    },
                }
            },
        }
    });

    if (!cart) {
        throw new Error("cart not found");
    }

    const totalPriceInCents = cart.cartItem.reduce(
        (acc, item) => acc + (item?.productVariant?.priceInCents as number) * item.quantity,
        0,
    )

    await db.transaction(async (tx) => {
        if (!cart.shippingAddress) {
            throw new Error("shipping address not found");
        }

        const [order] = await tx.insert(orderTable).values({
            userId: session.user.id,
            shippingAddressId: cart.shippingAddressId,
            recipientName: cart.shippingAddress.recipientName,
            street: cart.shippingAddress.street,
            number: cart.shippingAddress.number,
            complement: cart.shippingAddress.complement ?? null,
            neighborhood: cart.shippingAddress.neighborhood,
            zipCode: cart.shippingAddress.zipCode,
            email: cart.shippingAddress.email,
            cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
            city: cart.shippingAddress.city,
            state: cart.shippingAddress.state,
            totalPriceInCents: totalPriceInCents,
        }).returning();
    
        const orderItems = cart.cartItem
            .filter((item) => typeof item.productVariant?.priceInCents === "number")
            .map((item) => ({
                orderId: order.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                priceInCents: item.productVariant!.priceInCents,
            }));
    
        if (orderItems.length === 0) {
            throw new Error("no valid order items to insert");
        }
    
        await tx.insert(orderItemTable).values(orderItems);
        await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id))
    });

    revalidatePath("cart/identification");
    revalidatePath("cart/confirmation");
}