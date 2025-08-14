import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import VariantsSelector from "./components/variants-selector";

interface ProductVariantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  
  const productVariant = await db.query.productVariantTable.findFirst({
      where: eq(productVariantTable.slug, slug),
      with: {
        product: {
          with: {
            variants: true,
          }
        },
      }
  });

  if (!productVariant) {
      notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    }
  });

  return (
    <div>
      <Header />
      <div className="flex flex-col space-y-6 px-5">
        <div className="relative h-[380px] w-full">
          <Image 
            src={productVariant.imageUrl}
            alt={productVariant.name}
            fill
            className="object-cover"
          />
        </div>

        <VariantsSelector variants={productVariant.product.variants} variantSelected={slug}/>

        <div className="px-5"></div>

        <h3 className="text-lg font-semibold">{productVariant.product.name}</h3>

        <h3 className="text-muted-foreground text-sm">{productVariant.name}</h3>

        <h3 className="text-muted-foreground text-sm">{formatCentsToBRL(productVariant.priceInCents)}</h3>

        <div className="px-5"></div>

        <div className="space-y-4 flex flex-col">
          <Button className="rounded-full" size="lg" variant="outline">Buy now</Button>
          <Button className="rounded-full" size="lg">Add to cart</Button>
        </div>

        <div className="">{productVariant.product.description}</div>
        
      </div>

      <div>
          <ProductList 
            title="You may like"
            products={likelyProducts as any}
          />
        </div>
    </div>
  );
}

export default ProductVariantPage;