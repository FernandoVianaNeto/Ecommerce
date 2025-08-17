"use server";

import { db } from "@/db";
import { CreateCheckoutSessionSchema, createCheckoutSessionSchema } from "./schema";
import { eq } from "drizzle-orm";
import { orderItemTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";

export const createCheckoutSession = async (data: CreateCheckoutSessionSchema) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { orderId } = createCheckoutSessionSchema.parse(data);

    const orderItems = await db.query.orderItemTable.findMany({
        where: eq(orderItemTable.orderId, orderId),
        with: {
            productVariant: {
                with: {
                    product: true,
                },
            },
        }
    });

    if (orderItems.length === 0) {
        throw new Error("No items in order");
    }

    const order = await db.query.orderTable.findFirst({
        where: eq(orderTable.id, data.orderId),
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.userId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        metadata: {
            orderId: data.orderId,
        },
        line_items: orderItems.map((item) => {
            return {
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: `${item?.productVariant?.product.name as string} - ${item?.productVariant?.name as string}`,
                        description: item?.productVariant?.product.description as string,
                        images: [item?.productVariant?.imageUrl as string],
                    },
                    unit_amount: item?.productVariant?.priceInCents,
                },
                quantity: item.quantity,
            }
        })
    });

    return checkoutSession;
}