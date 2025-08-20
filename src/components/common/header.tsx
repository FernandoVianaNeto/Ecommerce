'use client';

import Image from "next/image";
import Link from "next/link";
import Cart from "./cart";
import HeaderMenu from "./header-menu";

const Header = () => {
    return (
        <header className="flex items-center justify-between p-5">
            <Link href="/">
                <Image src="/logo.svg" alt="bewear logo" className="h-8 w-auto" width={100} height={26.14}/>
            </Link>

            <div className="flex item center gap-4">
                <Cart />
                <HeaderMenu />
            </div>
        </header>
    )
}

export default Header;