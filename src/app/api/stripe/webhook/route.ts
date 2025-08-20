import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
    api: {
      bodyParser: false,
    },
  };

  export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return new Response("Stripe secret key or webhook secret is not set", { status: 500 });
    }
  
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }
  
    const rawBody = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-07-30.basil" });
  
    let event: Stripe.Event;
  
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  
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
  