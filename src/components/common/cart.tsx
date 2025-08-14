import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import { getCart } from "@/app/actions/get-cart";
import Image from "next/image";

const Cart = () => {
    const { data: cart, isPending: cartIsLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
    });

    return (
        <Sheet>
        <SheetTrigger>
            <Button size="icon">
            <ShoppingBasketIcon />
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <div>
                    {cartIsLoading && <div>Loading... </div>}
                    {cart?.cartItem.map((item) => {
                        return (
                            <Image 
                                src={item.productVariant?.imageUrl as string}
                                alt={item.productVariant?.name as string}
                                width={100}
                                height={100}
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