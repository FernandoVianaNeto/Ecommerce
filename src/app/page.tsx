import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import Image from "next/image";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true
    }
  });

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image 
            src="/banner-01.png" 
            width={0} 
            height={0} 
            className="w-full height-auto" alt="banner-01" 
            sizes="100vw"
          />
        </div>

        <ProductList title="Best Sellers" products={products as any}/> 
        <div className="px-5">
          <Image 
            src="/banner-02.png" 
            width={0} 
            height={0} 
            className="w-full height-auto" alt="banner-01" 
            sizes="100vw"
          />
        </div>

        
      </div>
    </>
  );
}
