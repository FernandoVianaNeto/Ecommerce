"use server";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getShippingAddresses = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error("unauthorized");
    }

    const addresses = await db.query.shippingAddressTable.findMany({
        where: (address, { eq }) => eq(address.userId, session.user.id),
        orderBy: (address, { desc }) => [desc(address.createdAt)]
    });

    return addresses;
};
