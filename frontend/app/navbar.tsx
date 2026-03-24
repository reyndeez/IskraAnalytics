"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Navbar() {
    const pathName = usePathname();
    const isHome = pathName === "/";

    const navStyles = isHome
        ? "bg-transparent backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200"
        : "bg-white border-b border-gray-100 shadow-sm";

        const[authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${navStyles}`}>
            <div className="py-6 flex justify-between items-center gap-2 px-[5%] md:px-[10%]">
                {/* ЛОГОТИП */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                    src="/logo.png"
                    alt="Логотип Искра Льда"
                    width={130}
                    height={86}
                    priority
                    className="object-contain"/>
                </Link>
                {/* МЕНЮ */}
                <nav className="flex gap-8 items-center font-medium">
                    {isHome ? (
                        <>
                        <button 
                        className="text-[#064592] cursor-pointer font-medium text-xl hover:text-[#41479B] border border-transparent px-4 py-2 hover:border-[#41479B] hover:rounded-xl transition-all duration-200"
                        onClick={() => setAuthMode('register')}
                        >
                            Зарегистрироваться
                        </button>
                        <button 
                        className="px-4 py-2 bg-[#064592] cursor-pointer rounded-xl text-white font-medium text-xl hover:bg-[#41479B] shadow-md hover:shadow-lg" 
                        onClick={() => setAuthMode('login')}
                        >
                            Войти
                        </button>
                        </>
                    ) : (
                        <>
                            {/* 
                            ДОПИСАТЬ КОД ДЛЯ ДРУГИХ СТРАНИЦ
                            <Link href="/students" className=""></Link> */}
                        </>
                    )
                }
                </nav>
            </div>
            <AuthModal
            isOpen={authMode !== null}
            onClose={() => setAuthMode(null)}
            initialTab={authMode || 'login'}
            />
        </header>
    )
}