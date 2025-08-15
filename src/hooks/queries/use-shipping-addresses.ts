import { useQuery } from "@tanstack/react-query";
import { getShippingAddresses } from "@/app/actions/get-shipping-addresses";

export const shippingAddressesQueryKey = () => ["shippingAddresses"] as const;

export const useShippingAddresses = () => {
    return useQuery({
        queryKey: shippingAddressesQueryKey(),
        queryFn: () => getShippingAddresses(),
    });
};
