import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartShippingAddress } from "@/app/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/app/actions/update-cart-shipping-address/schema";
import { shippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";
import { CART_QUERY_KEY } from "@/hooks/queries/use-cart";

export const updateCartShippingAddressMutationKey = () => ["updateCartShippingAddress"] as const;

export const useUpdateCartShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: updateCartShippingAddressMutationKey(),
        mutationFn: (data: UpdateCartShippingAddressSchema) => updateCartShippingAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: shippingAddressesQueryKey() });
            if (typeof CART_QUERY_KEY === "function") {
                queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY as any });
            } else {
                queryClient.invalidateQueries({ queryKey: ["cart"] });
            }
        },
    });
};

