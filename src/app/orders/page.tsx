import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/common/header";
import { Separator } from "@radix-ui/react-separator";

const Orders = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/authentication");
    }

    const orders = await db.query.orderTable.findMany({
        where: eq(orderTable.userId, session?.user?.id),
        with: {
            orderItems: {
                with: {
                    productVariant: {
                        with: {
                            product: true
                        }
                    }
                }
            }
        }
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
            case "paid":
                return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
            case "canceled":
                return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Canceled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            My Orders
                        </h1>
                        <p className="text-gray-600 lg:text-lg max-w-md mx-auto">
                            Track and manage all your purchases in one place
                        </p>
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className="text-center text-muted-foreground text-lg">You haven't made any orders yet.</div>
                    ) : (
                        <div className="space-y-6">
                            {orders
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((order) => (
                                    <Card key={order.id} className="shadow-lg">
                                        <CardHeader className="pb-4">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                                                        <Image
                                                            src={item.productVariant?.imageUrl as string}
                                                            alt={item.productVariant?.name as string}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover rounded-xl bg-gray-100"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{item.productVariant?.product.name}</div>
                                                            <div className="text-sm text-muted-foreground">{item.productVariant?.name}</div>
                                                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                                        </div>
                                                        <div className="font-semibold text-primary">
                                                            {Intl.NumberFormat("en-US", {
                                                                style: "currency",
                                                                currency: "USD",
                                                            }).format((item.productVariant?.priceInCents as number) * item.quantity / 100)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Orders;