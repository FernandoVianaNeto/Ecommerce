import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartShippingAddress } from "@/app/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/app/actions/update-cart-shipping-address/schema";
import { shippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";
import { cartQueryKey } from "@/hooks/queries/use-cart";

export const updateCartShippingAddressMutationKey = () => ["updateCartShippingAddress"] as const;

export const useUpdateCartShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: updateCartShippingAddressMutationKey(),
        mutationFn: (data: UpdateCartShippingAddressSchema) => updateCartShippingAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: shippingAddressesQueryKey() });
            if (typeof cartQueryKey === "function") {
                // invalidate cart if project exposes a query key helper
                // fall back to generic key used elsewhere
                queryClient.invalidateQueries({ queryKey: cartQueryKey() as any });
            } else {
                queryClient.invalidateQueries({ queryKey: ["cart"] });
            }
        },
    });
};

