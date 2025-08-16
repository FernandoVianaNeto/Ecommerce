import CheckoutItem from "@/components/common/checkout-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";
import { db } from "@/db";
import { formatCentsToBRL } from "@/helpers/money";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Order = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user.id) {
        redirect("/login");
    }

    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
        with: {
            shippingAddress: true,
            cartItem: {
                with: {
                    productVariant: {
                        with: {
                            product: true
                        }
                    },
                }
            }
        }
    });

    let subtotal = "0";

    if (cart) {
        const totalInCents = cart.cartItem.reduce(
            (acc, item) => acc + (item?.productVariant?.priceInCents as number) * item.quantity,
            0,
        )

        subtotal = formatCentsToBRL(totalInCents)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your order</CardTitle>
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

                <div className="flex flex-col pt-5">
                    {
                        cart?.cartItem && cart.cartItem.map((item, index) => {
                            const isLastItem = index === cart.cartItem.length - 1;
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
                                    {cart.cartItem.length > 1 && !isLastItem && (
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
    )
}

export default Order;