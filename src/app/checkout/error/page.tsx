"use client";

import Header from "@/components/common/header";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const CheckoutErrorPage = () => {
    return (
        <>
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex items-center justify-center min-h-[60vh]">
                <Dialog open>
                    <DialogContent className="flex flex-col items-center gap-6 p-8 max-w-md lg:max-w-lg">
                        <DialogTitle className="text-xl lg:text-2xl font-bold text-center">
                            Error on payment!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground lg:text-base">
                            We were unable to process your payment. Please try again.<br />
                            If the problem persists, please contact support.
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
        </>
       
    );
};

export default CheckoutErrorPage;