import { useQuery } from "@tanstack/react-query";
import { getShippingAddresses } from "@/app/actions/get-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const shippingAddressesQueryKey = () => ["shippingAddresses"] as const;

export const useShippingAddresses = (params: {
    initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
    return useQuery({
        queryKey: shippingAddressesQueryKey(),
        queryFn: () => getShippingAddresses(),
        initialData: params?.initialData,
    });
};
