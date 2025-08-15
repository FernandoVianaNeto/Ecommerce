import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShippingAddress } from "@/app/actions/create-shipping-address";
import { CreateShippingAddressSchema } from "@/app/actions/create-shipping-address/schema";
import { shippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";

export const createShippingAddressMutationKey = () => ["createShippingAddress"] as const;

export const useCreateShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: createShippingAddressMutationKey(),
        mutationFn: (data: CreateShippingAddressSchema) => createShippingAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: shippingAddressesQueryKey() });
        },
    });
};
