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
                <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Shipping Information
                        </h1>
                        <p className="text-gray-600 lg:text-lg max-w-md mx-auto">
                            Select or add a shipping address for your order
                        </p>
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