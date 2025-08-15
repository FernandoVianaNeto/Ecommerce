import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import CartItem from "./cart-item";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";
import Link from "next/link";

const Cart = () => {
    const { data: cart } = useCart();

    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button size="icon">
            <ShoppingBasketIcon />
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-5 h-full">
                <div className="flex h-full flex-col gap-8 pb-5">
                    <div className="flex h-full max-h-full flex-col gap-5 overflow-hidden">
                        <ScrollArea>
                            <div className="flex h-full flex-col gap-8">
                                {cart?.cartItem.map((item) => {
                                    return (
                                        <CartItem 
                                            key={item.id}
                                            id={item.id as string}
                                            productName={item.productVariant?.name as string}
                                            productVariantImageUrl={item.productVariant?.imageUrl as string}
                                            productVariantName={item.productVariant?.name as string}
                                            productVariantTotalPriceInCents={item.productVariant?.priceInCents as number}
                                            quantity={item.quantity as number}
                                        />
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>

                    {cart?.cartItem?.length as number > 0 && (
                        <div className="flex flex-col gap-4">
                            <Separator />

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Subtotal</p>
                                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Shipping</p>
                                <p>Free</p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Total</p>
                                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                            </div>

                            <Button className="rounded-full" asChild>
                                <Link href="/cart/identification">
                                    Buy now
                                </Link>
                            </Button>
                        </div>
                    )}  
                </div>
            </div>
        </SheetContent>
        </Sheet>
    );
};

export default Cart;