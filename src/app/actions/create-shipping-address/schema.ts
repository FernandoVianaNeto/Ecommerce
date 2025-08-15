import { z } from "zod";

export const createShippingAddressSchema = z.object({
    email: z.string().email("Invalid email"),
    fullName: z.string().min(1, "Full name is required"),
    cpf: z.string().min(11, "CPF must have at least 11 digits"),
    zipCode: z.string().min(8, "ZIP code must have at least 8 digits"),
    address: z.string().min(1, "Address is required"),
    number: z.string().min(1, "Number is required"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Neighborhood is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required").max(2, "State must be 2 characters"),
});

export type CreateShippingAddressSchema = z.infer<typeof createShippingAddressSchema>;
