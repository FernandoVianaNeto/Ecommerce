import { increaseCartProductQuantity } from "@/app/actions/increase-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "../queries/use-cart";

const INCREASE_PRODUCT_FROM_CART = ["increase-cart-product"] as const;

export const useIncreaseCartProduct = (cartItemId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: INCREASE_PRODUCT_FROM_CART,
        mutationFn: () => increaseCartProductQuantity({ cartItemId: cartItemId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        }
    });
}