import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
    orderId: z.string().uuid(),
});

export type CreateCheckoutSessionSchema = z.infer<typeof createCheckoutSessionSchema>;