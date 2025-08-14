import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import { getCart } from "@/app/actions/get-cart";
import CartItem from "./cart-item";

const Cart = () => {
    const { data: cart, isPending: cartIsLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
    });

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
                <div className="space-y-4 px-5">
                    {cartIsLoading && <div>Loading... </div>}
                    {cart?.cartItem.map((item) => {
                        return (
                            <CartItem 
                                key={item.id}
                                id={item.id}
                                productName={item.productVariant?.name as string}
                                productVariantImageUrl={item.productVariant?.imageUrl as string}
                                productVariantName={item.productVariant?.name as string}
                                productVariantTotalPriceInCents={item.productVariant?.priceInCents as number}
                                quantity={item.quantity as number}
                            />
                        )
                    })}
                </div>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    );
};

export default Cart;