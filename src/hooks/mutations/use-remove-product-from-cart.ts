import { removeProductFromCart } from "@/app/actions/remove-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CART_QUERY_KEY } from "../queries/use-cart";

const REMOVE_PRODUCT_FROM_CART = ["remove-cart-product"] as const;

export const useRemoveProductFromCartMutation = (cartItemId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: REMOVE_PRODUCT_FROM_CART,
        mutationFn: () => removeProductFromCart({ cartItemId: cartItemId }),
        onSuccess: () => {
            toast.success("Product removed successfully");
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        },
        onError: () => {
            toast.error("Error on product deletion")
        }
    })
}
