'use client';

import { productTable, productVariantTable } from "@/db/schema";
import ProductItem from "./product-item";

interface ProductListProps {
    title: string;
    products: typeof productTable.$inferSelect & {
        variants: (typeof productVariantTable.$inferSelect)[];
    }[];
}

const ProductList = (params: ProductListProps) => {
    return (
        <div className="space-y-6 [&::-webkit-scrollbar]:hidden">
            <h3 className="text-sm font-semibold px-5">{params.title}</h3>
            <div className="px-5 flex w-full gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {
                    params.products.map((product: any) => (
                    <ProductItem 
                            key={product.id}
                            product={product}
                        />  
                    )
                )}
            </div>
        </div>
    )
}

export default ProductList;