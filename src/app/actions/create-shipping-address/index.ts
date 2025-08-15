"use server";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createShippingAddressSchema } from "./schema";
import { revalidatePath } from "next/cache";

export const createShippingAddress = async (data: unknown) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error("unauthorized");
    }

    const validatedData = createShippingAddressSchema.parse(data);

    const newAddress = await db.insert(shippingAddressTable).values({
        userId: session.user.id,
        recipientName: validatedData.fullName,
        street: validatedData.address,
        number: validatedData.number,
        complement: validatedData.complement || null,
        neighborhood: validatedData.neighborhood,
        zipCode: validatedData.zipCode,
        email: validatedData.email,
        cpfOrCnpj: validatedData.cpf,
        city: validatedData.city,
        state: validatedData.state,
    }).returning();

    revalidatePath("/cart/identification");

    return newAddress[0];
};
