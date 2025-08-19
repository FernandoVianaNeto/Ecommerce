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
    const { data: cart } = useCart({});

    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button size="icon">
            <ShoppingBasketIcon />
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
            {cart?.cartItems && cart.cartItems.length > 0 ? (
                <div className="space-y-4 px-3 sm:px-5 h-full">
                    <div className="flex h-full flex-col gap-8 pb-5">
                        <div className="flex h-full max-h-full flex-col gap-5 overflow-hidden">
                            <ScrollArea>
                                <div className="flex h-full flex-col gap-8">
                                    {cart.cartItems.map((item) => (
                                        <CartItem 
                                            key={item.id}
                                            id={item.id as string}
                                            productName={item.productVariant?.name as string}
                                            productVariantImageUrl={item.productVariant?.imageUrl as string}
                                            productVariantName={item.productVariant?.name as string}
                                            productVariantTotalPriceInCents={item.productVariant?.priceInCents as number}
                                            quantity={item.quantity as number}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Separator />

                            <div className="flex flex-wrap items-center justify-between text-xs font-medium gap-y-1">
                                <p className="truncate max-w-[50%]">Subtotal</p>
                                <p className="truncate text-right max-w-[50%]">{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                            </div>

                            <Separator />

                            <div className="flex flex-wrap items-center justify-between text-xs font-medium gap-y-1">
                                <p className="truncate max-w-[50%]">Shipping</p>
                                <p className="truncate text-right max-w-[50%]">Free</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between text-xs font-medium gap-y-1">
                                <p className="truncate max-w-[50%]">Total</p>
                                <p className="truncate text-right max-w-[50%]">{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                            </div>

                            <Button className="rounded-full w-full" asChild>
                                <Link href="/cart/identification">
                                    Buy now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
                    <ShoppingBasketIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm font-medium text-center">Your shopping cart is empty</p>
                    <Button asChild>
                        <Link href="/">
                            Continue shopping
                        </Link>
                    </Button>
                </div>
            )}
        </SheetContent>
        </Sheet>
    );
};

export default Cart;