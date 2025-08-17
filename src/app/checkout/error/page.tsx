"use client";

import Header from "@/components/common/header";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const CheckoutErrorPage = () => {
    return (
        <>
            <Header />
            <div className="flex items-center justify-center">
                <Dialog open>
                    <DialogContent className="flex flex-col items-center gap-6 p-8 max-w-md">
                        <DialogTitle className="text-2xl font-bold text-center">
                            Error on payment!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
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