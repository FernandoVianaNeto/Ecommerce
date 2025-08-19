'use client';

import Image from "next/image";
import { Button } from "../ui/button";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import Cart from "./cart";
import { Separator } from "../ui/separator";

const Header = () => {
    const { data: session } = authClient.useSession();

    return (
        <header className="flex items-center justify-between p-5">
            <Link href="/">
                <Image src="/logo.svg" alt="bewear logo" className="h-8 w-auto" width={100} height={26.14}/>
            </Link>

            <div className="flex item center gap-4">
                <Cart />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                Menu
                            </SheetTitle>
                        </SheetHeader>
                        <div className="p-5">
                            { session?.user ? (
                                <>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={session?.user?.image ?? ""} />
                                                <AvatarFallback>
                                                    {session?.user?.name?.split(" ")?.[0]?.[0]}
                                                    {session?.user?.name?.split(" ")?.[1]?.[0]}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-semibold">{session?.user?.name}</h3>
                                                <span className="text-muted-foreground block text-xs">
                                                    {session?.user?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">Hello! Sign-in</h2>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/authentication">
                                            <LogInIcon />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="px-5">
                            <Separator className="my-4" />
                        </div>

                        <div className="px-5 flex flex-col gap-3 text-muted-foreground text-sm">
                            <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className="text-muted-foreground" stroke="currentColor">
                                    <path d="M10 14.3333V9.00001C10 8.8232 9.92976 8.65363 9.80474 8.5286C9.67971 8.40358 9.51014 8.33334 9.33333 8.33334H6.66667C6.48986 8.33334 6.32029 8.40358 6.19526 8.5286C6.07024 8.65363 6 8.8232 6 9.00001V14.3333M2 7.00001C1.99995 6.80605 2.04222 6.61442 2.12386 6.43849C2.20549 6.26255 2.32453 6.10654 2.47267 5.98134L7.13933 1.98201C7.37999 1.77861 7.6849 1.66702 8 1.66702C8.3151 1.66702 8.62001 1.77861 8.86067 1.98201L13.5273 5.98134C13.6755 6.10654 13.7945 6.26255 13.8761 6.43849C13.9578 6.61442 14 6.80605 14 7.00001V13C14 13.3536 13.8595 13.6928 13.6095 13.9428C13.3594 14.1929 13.0203 14.3333 12.6667 14.3333H3.33333C2.97971 14.3333 2.64057 14.1929 2.39052 13.9428C2.14048 13.6928 2 13.3536 2 13V7.00001Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Home
                            </Link>

                            <Link href="/orders" className="flex items-center gap-2 text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className="text-muted-foreground" stroke="currentColor">
                                    <path d="M9.33325 12.3333V4.33333C9.33325 3.97971 9.19278 3.64057 8.94273 3.39052C8.69268 3.14048 8.35354 3 7.99992 3H2.66659C2.31296 3 1.97382 3.14048 1.72378 3.39052C1.47373 3.64057 1.33325 3.97971 1.33325 4.33333V11.6667C1.33325 11.8435 1.40349 12.013 1.52851 12.1381C1.65354 12.2631 1.82311 12.3333 1.99992 12.3333H3.33325M3.33325 12.3333C3.33325 13.0697 3.93021 13.6667 4.66659 13.6667C5.40296 13.6667 5.99992 13.0697 5.99992 12.3333M3.33325 12.3333C3.33325 11.597 3.93021 11 4.66659 11C5.40296 11 5.99992 11.597 5.99992 12.3333M9.99992 12.3333H5.99992M9.99992 12.3333C9.99992 13.0697 10.5969 13.6667 11.3333 13.6667C12.0696 13.6667 12.6666 13.0697 12.6666 12.3333M9.99992 12.3333C9.99992 11.597 10.5969 11 11.3333 11C12.0696 11 12.6666 11.597 12.6666 12.3333M12.6666 12.3333H13.9999C14.1767 12.3333 14.3463 12.2631 14.4713 12.1381C14.5963 12.013 14.6666 11.8435 14.6666 11.6667V9.23333C14.6663 9.08204 14.6146 8.93534 14.5199 8.81733L12.1999 5.91733C12.1376 5.83925 12.0585 5.77619 11.9685 5.7328C11.8784 5.68941 11.7798 5.66681 11.6799 5.66667H9.33325" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                My Orders
                            </Link>

                            <Link href="/cart/identification" className="flex items-center gap-2 text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className="text-muted-foreground" stroke="currentColor">
                                    <path d="M10.6667 6.99999C10.6667 7.70723 10.3857 8.38551 9.88562 8.88561C9.38552 9.3857 8.70724 9.66666 8 9.66666C7.29276 9.66666 6.61448 9.3857 6.11438 8.88561C5.61428 8.38551 5.33333 7.70723 5.33333 6.99999M2.06867 4.35599H13.9313M2.26667 3.97799C2.09357 4.20878 2 4.4895 2 4.77799V13.6667C2 14.0203 2.14048 14.3594 2.39052 14.6095C2.64057 14.8595 2.97971 15 3.33333 15H12.6667C13.0203 15 13.3594 14.8595 13.6095 14.6095C13.8595 14.3594 14 14.0203 14 13.6667V4.77799C14 4.4895 13.9064 4.20878 13.7333 3.97799L12.4 2.19999C12.2758 2.0344 12.1148 1.89999 11.9296 1.80742C11.7445 1.71485 11.5403 1.66666 11.3333 1.66666H4.66667C4.45967 1.66666 4.25552 1.71485 4.07038 1.80742C3.88524 1.89999 3.7242 2.0344 3.6 2.19999L2.26667 3.97799Z" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Shopping Cart
                            </Link>
                        </div>

                        <div className="px-5">
                            <Separator className="my-4" />
                        </div>

                        <div className="px-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <LogOutIcon className="w-4 h-4 text-destructive" />
                                <span className="font-medium text-destructive">Sair</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="px-3 py-1.5"
                                onClick={() => authClient.signOut()}
                            >
                                Sair
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default Header;