'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import { jwtDecode } from "jwt-decode";

type Role = 'Admin' | 'coach' | 'user';

interface User {
    name: string;
    role: Role;
}

export default function Navbar() {
    const pathName = usePathname();

    const isHome = pathName === "/";
    const navStyles = isHome
        ? "bg-transparent backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200"
        : "bg-transparent backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200";

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                
                const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
                const normalizedRole = rawRole?.toLowerCase();

                const firstName = decoded["FirstName"] || "";
                const lastName = decoded["LastName"] || "";

                const shortName = lastName 
                    ? `${firstName} ${lastName.charAt(0).toUpperCase()}.` 
                    : firstName || "Пользователь";

                let mappedRole: Role = 'user';
                if (normalizedRole === 'admin') mappedRole = 'Admin';
                else if (normalizedRole === 'coach') mappedRole = 'coach';

                setUser({ 
                    name: shortName, 
                    role: mappedRole 
                });
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    const tabsByRole: Record<Exclude<Role, 'Admin'>, {label: string; href: string}[]> = {
    coach: [
        {label: "Список групп", href: "/coach/groups"},
        {label: "Мои группы", href: "/coach/my-groups"},
        {label: "Журнал", href: "/coach/journal"},
        {label: "Аналитика", href: "/coach/analytics"},
    ],
    user: [
        {label: "Прогресс", href: "/user/progress"},
        {label: "Рейтинг", href: "/user/rating"},
        {label: "Календарь", href: "/user/calendar"},        
        ],
    };

    const userTabs = (user && user.role !== 'Admin') ? tabsByRole[user.role as keyof typeof tabsByRole] : [];
    const isActiveTab = (href: string) => pathName === href;

        const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsProfileOpen(false);
        window.location.href = '/';
    };

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

                {/* СЕРЕДИНА: вкладки по ролям */}
                {user && (
                    <nav className="flex gap-4 items-end">
                    {userTabs.map(tab => {
                        const isActive = isActiveTab(tab.href);
                        
                        return (
                            <Link 
                                key={tab.href} 
                                href={tab.href} 
                                className={`
                                    relative px-4 text-2xl font-medium transition-all duration-200 rounded-t-lg
                                    ${isActive 
                                        ? 'text-[#064592]' 
                                        : 'text-[#808080] hover:text-[#064592] hover:bg-blue-50/40'
                                    }
                                `}
                            >
                                {tab.label}
                                {/* Полоска активной вкладки */}
                                {isActive && (
                                    <span className="absolute top-19 bottom-0 left-0 right-0 h-1.5 bg-[#064592] rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
                )}


                {/* ПРАВАЯ ЧАСТЬ: кнопки входа/профиль */}
                <div className="flex gap-8 items-center font-medium">
                    {!user && isHome && (
                        <>
                        <button 
                        className="text-[#064592] cursor-pointer  text-2xl hover:text-[#41479B] border border-transparent px-4 py-2 hover:border-[#41479B] hover:rounded-xl transition-all duration-200"
                        onClick={() => setAuthMode('register')}
                        >
                            Зарегистрироваться
                        </button>
                        <button 
                        className="px-4 py-2 bg-[#064592] cursor-pointer rounded-xl text-white  text-2xl hover:bg-[#41479B] shadow-md hover:shadow-lg" 
                        onClick={() => setAuthMode('login')}
                        >
                            Войти
                        </button>
                        </>
                    )}

                    {user && (
                        <div className="relative flex gap-4 rounded-xl" ref={dropdownRef} >
                            {/* Кнопка профиля */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="cursor-pointer flex items-center gap-4 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                            >
                                {/* Иконка пользователя */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round">
                                    <path d="M17.925 20.056a6 6 0 0 0-11.851.001"/>
                                    <circle cx="12" cy="11" r="4"/>
                                    <circle cx="12" cy="12" r="10"/>
                                </svg>
                                
                                {/* Имя и роль */}
                                <div className="text-left hidden sm:block">
                                    <p className="text-xl font-medium text-gray-900 leading-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-xl text-gray-500 leading-tight">
                                        {user.role === 'user' ? 'родитель' : user.role}
                                    </p>
                                </div>
                                
                                {/* Стрелка */}
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                width="32" 
                                height="32" 
                                viewBox="0 0 24 24" fill="none" 
                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                className={`lucide lucide-chevron-down-icon lucide-chevron-down ${isProfileOpen ? 'rotate-180' : ''} `}>
                                <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </button>

                            {/* Выпадающее меню */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 px-2 z-50">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Профиль
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-xl text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AuthModal
            isOpen={authMode !== null}
            onClose={() => setAuthMode(null)}
            initialTab={authMode || 'login'}
            />
        </header>
    )
}