"use client";

import Header from "@/components/common/header";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

const CheckoutSuccessPage = () => {
    return (
        <>
            <Header />
            <div className="flex items-center justify-center">
                <Dialog open>
                    <DialogContent className="flex flex-col items-center gap-6 p-8 max-w-md">
                        <Image
                            width={100}
                            height={100}
                            src="/illustration.svg"
                            alt="success-ilustration"
                        />
                        <DialogTitle className="text-2xl font-bold text-center">
                            Order confirmed successfully!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Your payment has been processed and your order is being prepared.<br />
                            You will receive an email with the details soon.
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
        </>
       
    );
};

export default CheckoutSuccessPage;