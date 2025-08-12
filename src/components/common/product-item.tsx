'use client';

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import Image from "next/image";
import Link from "next/link";

interface ProductItemProps {
    product: typeof productTable.$inferSelect & {
        variants: (typeof productVariantTable.$inferSelect)[];
    };
}

const ProductItem = (params: ProductItemProps) => {
    const firstVariant = params.product.variants[0];

    return (
        <Link className="flex flex-col gap-4" href="/">
            <Image 
                src={firstVariant.imageUrl}
                alt={firstVariant.name}
                width={150}
                height={150}
                className="rounded-3xl"
            />

            <div className="flex flex-col max-w-[150px] gap-1">
                <p className="truncate text-sm font-medium">{params.product.name}</p>
                <p className="truncate text-sm text-muted-foreground font-medium">{params.product.description}</p>
                <p className="truncate text-sm font-semibold">{formatCentsToBRL(firstVariant.priceInCents)}</p>
            </div>
        </Link>
    )
}

export default ProductItem;