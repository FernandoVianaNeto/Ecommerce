"use client";

import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CheckoutSuccessPage = () => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 bg-background">
                <div className="bg-card shadow-lg rounded-2xl flex flex-col items-center gap-8 px-8 py-10 max-w-md w-full">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-green-100 rounded-full p-4 flex items-center justify-center">
                            <Image
                                width={200}
                                height={200}
                                src="/illustration.svg"
                                alt="success-illustration"
                                className="rounded-full"
                            />
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold text-center text-green-700">
                            Order confirmed!
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center text-muted-foreground text-base gap-2">
                        <p>
                            Your payment was processed successfully and your order is being prepared.
                        </p>
                        <p>
                            You will receive an email with the details soon.
                        </p>
                    </div>
                    <Button
                        className="w-full mt-4 rounded-full text-base font-semibold"
                        disabled={isRedirecting}
                        onClick={() => {
                            setIsRedirecting(true);
                            window.location.href = "/";
                        }}
                    >
                        {isRedirecting ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                "Back to home"
                            </>
                        ) : (
                            "Back to home"
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CheckoutSuccessPage;