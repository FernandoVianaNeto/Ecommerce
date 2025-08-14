import Image from "next/image";
import { Button } from "../ui/button";
import { Minus, Plus, TrashIcon } from "lucide-react";
import { formatCentsToBRL } from "@/helpers/money";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProductFromCart } from "@/app/actions/remove-cart-product";
import { toast } from "sonner";

interface CartItemProps {
    id: string;
    productName: string;
    productVariantName: string;
    productVariantImageUrl: string;
    productVariantTotalPriceInCents: number;
    quantity: number;
}

const CartItem = ({
    id,
    productName,
    productVariantName,
    productVariantImageUrl,
    productVariantTotalPriceInCents,
    quantity
}: CartItemProps) => {
    const queryClient = useQueryClient();

    const removeProductFromCartMutation = useMutation({
        mutationKey: ["remove-cart-product"],
        mutationFn: () => removeProductFromCart({ cartItemId: id }),
        onSuccess: () => {
            toast.success("Product removed successfully");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: () => {
            toast.error("Error on product deletion")
        }
    })

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image 
                    src={productVariantImageUrl}
                    alt={productVariantName}
                    width={78}
                    height={78}
                />
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">
                        {productName}
                    </p>
                    <p className="text-muted-foreground text-xs font-medium">
                        {productVariantName}
                    </p>
                    <div className="flex w-[100px] items-center border justify-between rounded-lg p-1">
                        <Button variant="outline" className="h-6 w-6" size="icon">
                            <Minus />
                        </Button>
                        <p>{quantity}</p>
                        <Button variant="outline" className="h-6 w-6" size="icon">
                            <Plus />
                    </Button>
                </div>
                </div>
               
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <Button variant="outline" size="icon" onClick={() => removeProductFromCartMutation.mutate()}><TrashIcon /></Button>
                <p className="text-sm font-bold">
                    {formatCentsToBRL(productVariantTotalPriceInCents)}
                </p>
            </div>
        </div>
    );
}

export default CartItem;