"use client";

import { addProductToCart } from "@/app/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
    productVariantId: string;
    quantity: number;
}

const AddToCartButton = ({ productVariantId, quantity }: AddToCartButtonProps) => {
    const queryClient = useQueryClient()

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
            onClick={() => mutate()}
        >
            { isPending && <Loader2 className="animate-spin" />}
            Add to cart
        </Button>
    )
}

export default AddToCartButton;