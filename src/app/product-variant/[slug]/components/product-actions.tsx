"use client";

import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import BuyNowButton from "./buy-now-button";

interface ProductActionsProps {
    productVariantId: string;
    session: any;
}

const ProductActions = ({ productVariantId, session }: ProductActionsProps) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h1>Quantity</h1>
                <div className="flex w-[100px] items-center border justify-between rounded-lg">
                    <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev > 0 ? prev - 1 : prev)}>
                        <Minus />
                    </Button>
                    <span>{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev + 1)}>
                        <Plus />
                    </Button>
                </div>
            </div>
            <div className="space-y-4 flex flex-col">
                <BuyNowButton productVariantId={productVariantId} quantity={quantity} redirectToLogin={!session}/>
                <AddToCartButton productVariantId={productVariantId} quantity={quantity} redirectToLogin={!session}/>
            </div>
        </div>
    )
}

export default ProductActions;