import { productVariantTable } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";

interface VariantSelectorProps {
    variantSelected: string;
    variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantsSelector = ({ variants, variantSelected}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {
        variants.map((variant) => (
            <Link className={variantSelected === variant.slug ? 'border-primary border-2 rounded-xl' : ''} href={`/product-variant/${variant.slug}`} key={variant.id}>
                <Image 
                    src={variant.imageUrl} 
                    alt={variant.name} 
                    width={68} 
                    height={68} 
                    className="rounded-xl"
                />
            </Link>
        ))
      }
    </div>
  );
};

export default VariantsSelector;