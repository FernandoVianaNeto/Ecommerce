import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import VariantsSelector from "./components/variants-selector";
import ProductActions from "./components/product-actions";
import Footer from "@/components/common/footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface ProductVariantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  });

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          <div className="space-y-6">
            <div className="relative w-full h-[380px] sm:h-[420px] md:h-[500px] lg:h-[600px] xl:h-[700px] max-w-2xl lg:max-w-none mx-auto">
              <Image 
                src={productVariant.imageUrl}
                alt={productVariant.name}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 lg:space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-semibold">{productVariant.product.name}</h3>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-muted-foreground text-base lg:text-lg">{productVariant.name}</h3>
                <h3 className="text-2xl lg:text-3xl font-bold text-primary">
                  {formatCentsToBRL(productVariant.priceInCents)}
                </h3>
              </div>

              <div className="text-sm lg:text-base leading-relaxed">
                {productVariant.product.description}
              </div>
            </div>

            <VariantsSelector variants={productVariant.product.variants} variantSelected={slug}/>
            
            <ProductActions productVariantId={productVariant.id} session={session?.user}/>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16">
        <ProductList 
          title="You may like"
          products={likelyProducts as any}
        />
      </div>

      <div className="pt-5 lg:pt-8">
        <Footer />
      </div>
    </div>
  );
}

export default ProductVariantPage;