"use client";

import { addProductToCart } from "@/app/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
    productVariantId: string;
    quantity: number;
    redirectToLogin?: boolean;
}

const BuyNowButton = ({ productVariantId, quantity, redirectToLogin }: BuyNowButtonProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ["addProductToCart"],
        mutationFn: () => addProductToCart({
            productVariantId,
            quantity,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Product added to cart");
        }
    })  
    return (
        <Button 
            className="rounded-full" 
            size="lg"
            disabled={isPending}
            variant="outline"
            onClick={() => {
                if (redirectToLogin) {
                    router.push("/authentication");
                } else {
                    mutate();
                    router.push("/cart/identification");
                }
            }}
        >
            { isPending && <Loader2 className="animate-spin" />}
            Buy now
        </Button>
    )
}

export default BuyNowButton;