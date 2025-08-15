import { formatCentsToBRL } from "@/helpers/money";
import Image from "next/image";

interface CheckoutItemProps {
    id: string;
    productName: string;
    productVariantName: string;
    productVariantImageUrl: string;
    productVariantTotalPriceInCents: number;
    quantity: number;
}

const CheckoutItem = ({
    id,
    productName,
    productVariantName,
    productVariantImageUrl,
    productVariantTotalPriceInCents,
    quantity
}: CheckoutItemProps) => {
    const totalItemPrice = formatCentsToBRL(productVariantTotalPriceInCents);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image 
                    src={productVariantImageUrl}
                    alt={productVariantName}
                    width={78}
                    height={78}
                    className="rounded-2xl"
                />
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">
                        {productName}
                    </p>
                    <div className="flex flex-col">
                        <p className="text-muted-foreground text-xs font-medium">
                            {productVariantName}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium">
                            {quantity}
                        </p>
                    </div>
                   
                    <p className="text-sm font-semibold">
                        {totalItemPrice}
                    </p>
                    
                </div>
               
            </div>
        </div>
    );
}

export default CheckoutItem;