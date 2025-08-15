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
            <div className="px-5">
                <div>
                    <Addresses shippingAddresses={shippingAddresses} defaultShippingAddressId={cart?.shippingAddressId}/>
                </div>
                <div className="py-5">
                    <Order />
                </div>
            </div>
            <Footer />
        </>
    )
};

export default Identification;