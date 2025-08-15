import { decreaseCartProductQuantity } from "@/app/actions/decrease-cart-product-quantity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "../queries/use-cart";

const DECREASE_PRODUCT_FROM_CART = ["decrease-cart-product"] as const;

export const useDecreaseProductFromCart = (cartItemId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: DECREASE_PRODUCT_FROM_CART,
        mutationFn: () => decreaseCartProductQuantity({ cartItemId: cartItemId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        }
    })
}