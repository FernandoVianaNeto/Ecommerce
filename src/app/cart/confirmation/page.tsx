"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/queries/use-cart";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCentsToBRL } from "@/helpers/money";
import Header from "@/components/common/header";
import CheckoutItem from "@/components/common/checkout-item";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { createCheckoutSession } from "@/app/actions/create-checkout-session";
import { loadStripe } from "@stripe/stripe-js";

const ConfirmationPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const router = useRouter();
    const { data: cart, isLoading } = useCart({});
    const { mutate: finishOrder, isPending } = useFinishOrder();

    useEffect(() => {
        if (cart && !cart.shippingAddressId) {
            router.push("/cart/identification");
        }
    }, [cart, router]);

    const handleFinishOrder = () => {
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
            throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
        }

        if (cart?.cartItems && cart.cartItems.length > 0) {
            finishOrder(
                {
                    shippingAddressId: cart.shippingAddressId!,
                    items: cart.cartItems
                        .filter(item => item.productVariantId)
                        .map(item => ({
                            productVariantId: item.productVariantId!,
                            quantity: item.quantity
                        }))
                },
                {
                    onSuccess: async (orderId: string) => {
                        try {
                            const checkoutSession = await createCheckoutSession({
                                orderId,
                            });

                            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

                            if (!stripe) {
                                toast.error("Stripe não foi carregado");
                                return;
                            }

                            const { error } = await stripe.redirectToCheckout({
                                sessionId: checkoutSession.id,
                            });

                            if (error) {
                                toast.error("Erro ao redirecionar para o checkout: " + error.message);
                            }
                        } catch (error) {
                            toast.error("Erro ao criar sessão de checkout: " + (error as Error).message);
                        }
                    },
                    onError: (error) => {
                        toast.error("Failed to finish order: " + (error as Error).message);
                    },
                }
            );
        } else {
            toast.error("No items in cart to finish order");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (
        !cart ||
        !('shippingAddress' in cart) ||
        !cart.shippingAddress
    ) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">No cart or shipping address found</div>
            </div>
        );
    }

    const cartWithRelations = cart as typeof cart & { shippingAddress: NonNullable<typeof cart.shippingAddress> };
    
    const totalPriceInCents = cartWithRelations.cartItems.reduce(
        (acc, item) => acc + (item?.productVariant?.priceInCents as number) * item.quantity,
        0,
    );

    const subtotal = formatCentsToBRL(totalPriceInCents);

    return (
        <>
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="space-y-6 lg:space-y-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Order Confirmation</h1>
                        <p className="text-gray-600 mt-2 lg:text-lg">Review your order details before confirming</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                        <div className="flex flex-col gap-6">
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg lg:text-xl">Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 lg:space-y-3">
                                    <p className="font-medium lg:text-lg">{cartWithRelations.shippingAddress.recipientName}</p>
                                    <p className="text-gray-600 lg:text-base">
                                        {cartWithRelations.shippingAddress.street}, {cartWithRelations.shippingAddress.number}
                                        {cartWithRelations.shippingAddress.complement && ` - ${cartWithRelations.shippingAddress.complement}`}
                                    </p>
                                    <p className="text-gray-600 lg:text-base">
                                        {cartWithRelations.shippingAddress.neighborhood} - {cartWithRelations.shippingAddress.city}/{cartWithRelations.shippingAddress.state}
                                    </p>
                                    <p className="text-gray-600 lg:text-base">ZIP: {cartWithRelations.shippingAddress.zipCode}</p>
                                    <p className="text-gray-600 lg:text-base">{cartWithRelations.shippingAddress.email}</p>
                                </CardContent>
                            </Card>

                            <Button
                                onClick={handleFinishOrder}
                                disabled={isPending}
                                className="rounded-full w-full"
                                size="lg"
                            >
                                {isPending ? "Processing..." : "Confirm Order"}
                            </Button>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg lg:text-xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table className="py-5">
                                    <TableBody className="py-5">
                                        <TableRow className="border-0">
                                            <TableCell className="font-medium">Subtotal</TableCell>
                                            <TableCell className="#656565">{subtotal}</TableCell>
                                        </TableRow>
                                        <TableRow className="border-0">
                                            <TableCell className="font-medium">Shipping</TableCell>
                                            <TableCell className="#656565">Free</TableCell>
                                        </TableRow>
                                        <TableRow className="border-0">
                                            <TableCell className="font-medium">Estimated Fee</TableCell>
                                            <TableCell>--</TableCell>
                                        </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Total</TableCell>
                                        <TableCell className="font-medium">{subtotal}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                                <div className="py-10">
                                    <Separator />
                                </div>

                                <div className="flex flex-col">
                                    {
                                        cart?.cartItems && cart.cartItems.map((item, index) => {
                                            const isLastItem = index === cart.cartItems.length - 1;
                                            return (
                                                <div key={item.id}>
                                                    <CheckoutItem 
                                                        id={item.id}
                                                        productName={item?.productVariant?.product?.name as string}
                                                        productVariantImageUrl={item?.productVariant?.imageUrl as string}
                                                        productVariantName={item?.productVariant?.name as string}
                                                        productVariantTotalPriceInCents={(item?.productVariant?.priceInCents as number) * item.quantity}
                                                    quantity={item.quantity}
                                                />
                                                    {cart.cartItems.length > 1 && !isLastItem && (
                                                        <div className="py-6">
                                                            <Separator />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                   
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="text-center">
                        <Image src="/illustration.svg" alt="order created successfully" height={300} width={300}/>
                        <DialogTitle className="mt-4 text-2xl">Order Created Successfully!</DialogTitle>
                        <DialogDescription>
                            Your order has been created and your cart has been cleared. 
                            You will be redirected to the payment page.
                        </DialogDescription>
                        <DialogFooter>
                            <Button 
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    router.push("/cart/payment");
                                }}
                                className="rounded-full"
                                size="lg"
                            >
                                Go to Payment
                            </Button>
                            <Button 
                                variant="outline" 
                                className="rounded-full" 
                                size="lg"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    router.push("/");
                                }}
                            >
                                Go back to store
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
       
    );
};

export default ConfirmationPage;
