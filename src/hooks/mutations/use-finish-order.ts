import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishOrder } from "@/app/actions/finish-order";
import { FinishOrderSchema } from "@/app/actions/finish-order/schema";
import { CART_QUERY_KEY } from "@/hooks/queries/use-cart";
import { shippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";

export const finishOrderMutationKey = () => ["finishOrder"] as const;

export const useFinishOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: finishOrderMutationKey(),
        mutationFn: (data: FinishOrderSchema) => finishOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: shippingAddressesQueryKey() });
        },
    });
};