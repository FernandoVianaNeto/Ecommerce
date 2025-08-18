import Header from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Addresses from "./components/addresses";
import Order from "./components/order";
import Footer from "@/components/common/footer";

const Identification = async () => {
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


    const shippingAddresses = await db.query.shippingAddressTable.findMany({
        where: eq(shippingAddressTable.userId, session.user.id),
    })

    return (
        <>
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="space-y-6 lg:space-y-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Shipping Information</h1>
                        <p className="text-gray-600 mt-2 lg:text-lg">Select or add a shipping address for your order</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                            <Addresses shippingAddresses={shippingAddresses} defaultShippingAddressId={cart?.shippingAddressId}/>
                        </div>
                        
                        <div>
                            <Order />
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    )
};

export default Identification;