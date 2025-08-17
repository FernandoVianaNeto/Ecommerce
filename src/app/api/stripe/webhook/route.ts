import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: NextRequest) => {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new Response("Stripe secret key or webhook secret is not set", { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return new Response("No signature", { status: 400 });
    }

    const text = await request.text();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const event = stripe.webhooks.constructEvent(text, signature, process.env.STRIPE_WEBHOOK_SECRET as string);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;

        if (!orderId) {
            return new Response("No order ID", { status: 400 });
        }

        await db.update(orderTable).set({ status: "paid" }).where(eq(orderTable.id, orderId));
    }

    return NextResponse.json({ received: true }, { status: 200 });
}