import z from "zod";

export const finishOrderSchema = z.object({
    shippingAddressId: z.string(),
    items: z.array(
        z.object({
            productVariantId: z.string().uuid(),
            quantity: z.number(),
        })
    )
})

export type FinishOrderSchema = z.infer<typeof finishOrderSchema>;