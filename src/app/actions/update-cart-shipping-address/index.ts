"use server";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateCartShippingAddressSchema } from "./schema";
import { eq } from "drizzle-orm";

export const updateCartShippingAddress = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        throw new Error("unauthorized");
    }

    const { shippingAddressId } = updateCartShippingAddressSchema.parse(data);

    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });

    if (!cart) {
        throw new Error("cart not found");
    }

    await db
        .update(cartTable)
        .set({ shippingAddressId })
        .where(eq(cartTable.id, cart.id));

    return { ok: true } as const;
};
