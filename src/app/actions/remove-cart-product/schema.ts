import { z } from "zod";

export const removeProductFromCartSchema = z.object({
    cartItemId: z.string().uuid(),
})

export type RemoveProductFromCartSchema = z.infer<typeof removeProductFromCartSchema>;