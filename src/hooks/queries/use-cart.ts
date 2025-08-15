import { getCart } from "@/app/actions/get-cart"
import { useQuery } from "@tanstack/react-query"

type CartData = Awaited<ReturnType<typeof getCart>>;

export const cartQueryKey = () => ["cart"] as const;

export const useCart = (params: {
    initialData?: Awaited<ReturnType<typeof getCart>>;
}) => {
    return useQuery({
        queryKey: cartQueryKey(),
        queryFn: () => getCart(),
        initialData: params?.initialData,
      });
}