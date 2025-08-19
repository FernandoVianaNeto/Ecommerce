import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true
    }
  });

  const categories = await db.query.categoryTable.findMany({});

  const newlyAddedProducts = await db.query.productTable.findMany({
    orderBy: (table, { desc }) => desc(table.createdAt),
    with: {
      variants: true
    },
  })

  return (
    <>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 lg:space-y-12">
        <div>
          <Link href="/category/acessrios">
            <Image
              src="/banner-01.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full rounded-xl"
            />
          </Link>
        </div>

        <ProductList products={products as any} title="Best Sellers" />

        <div>
          <CategorySelector categories={categories} />
        </div>

        <div>
          <Link href="/category/jaquetas-moletons">
            <Image
              src="/banner-02.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full rounded-xl"
            />
          </Link>
        </div>
        <ProductList products={newlyAddedProducts as any} title="New Products" />
      </div>
      
      <Footer />
    </>
  );
}
