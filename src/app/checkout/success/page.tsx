"use client";

import Header from "@/components/common/header";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

const CheckoutSuccessPage = () => {
    return (
        <>
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex items-center justify-center min-h-[60vh]">
                <Dialog open>
                    <DialogContent className="flex flex-col items-center gap-6 p-8 max-w-md lg:max-w-lg">
                        <Image
                            width={100}
                            height={100}
                            src="/illustration.svg"
                            alt="success-ilustration"
                        />
                        <DialogTitle className="text-xl lg:text-2xl font-bold text-center">
                            Order confirmed successfully!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground lg:text-base">
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