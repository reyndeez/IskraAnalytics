'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import { jwtDecode } from "jwt-decode";
import { Menu, X, ChevronDown, CircleUserRound, LayoutIcon } from "lucide-react";

type Role = 'Admin' | 'Coach' | 'User';

interface User {
    name: string;
    role: Role;
}

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
};

export default function Navbar() {
    const pathName = usePathname();
    const isHome = pathName === "/";
    const isAdminRoute = pathName?.startsWith('/admin');
    const navStyles = "bg-transparent backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200";

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathName]);

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
                const normalizedRole = rawRole?.toLowerCase();

                const firstName = decoded["FirstName"] || decoded["firstName"] || "";
                const lastName = decoded["LastName"] || decoded["lastName"] || "";

                const shortName = lastName 
                    ? `${firstName} ${lastName.charAt(0).toUpperCase()}.` 
                    : firstName || "Пользователь";

                let mappedRole: Role = 'User';
                if (normalizedRole === 'admin') mappedRole = 'Admin';
                else if (normalizedRole === 'coach') mappedRole = 'Coach';

                setUser({ name: shortName, role: mappedRole });
            } catch (error) {
                console.error("Invalid token", error);
                document.cookie = "token=; path=/; max-age=0";
                document.cookie = "role=; path=/; max-age=0";
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [pathName]); 

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'required') {
            setAuthMode('login');
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [pathName]); 

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const tabsByRole: Record<Role, {label: string; href: string}[]> = {
        Coach: [
            {label: "Мои группы", href: "/coach/my-groups"},
            {label: "Журнал", href: "/coach/measurements"},
            // {label: "Аналитика", href: "/coach/analytics"},
        ],
        User: [
            {label: "Прогресс", href: "/user/progress"},
            {label: "Рейтинг", href: "/user/rating"},
            // {label: "Календарь", href: "/user/calendar"},        
        ],
        Admin: [
            {label: "Панель администратора", href: "/admin/groups"}
        ]
    };

    const userTabs = user ? (tabsByRole[user.role] || []) : [];
    const isActiveTab = (href: string) => pathName === href;

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        setUser(null);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        window.location.href = '/';
    };

    const toggleAdminSidebar = () => {
        window.dispatchEvent(new Event('toggle-admin-sidebar'));
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${navStyles}`}>
            <div className="flex justify-between items-center gap-2 px-[5%] md:px-[10%]">
                
                <div className="flex items-center gap-4 py-4 md:py-6">
                    {isAdminRoute && (
                        <button 
                            onClick={toggleAdminSidebar}
                            className="lg:hidden p-2 text-brand hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <LayoutIcon size={28} />
                        </button>
                    )}

                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image 
                            src="/logo.png" 
                            alt="Логотип Искра Льда" 
                            width={130} 
                            height={86} 
                            priority 
                            className="object-contain w-25 h-16.5 sm:w-32.5 sm:h-21.5" 
                        />
                    </Link>
                </div>
                {user && userTabs.length > 0 && (
                    <nav className="hidden lg:flex gap-4 items-stretch self-stretch">
                        {userTabs.map(tab => {
                            const isActive = isActiveTab(tab.href);
                            return (
                                <Link 
                                    key={tab.href} 
                                    href={tab.href} 
                                    className={`
                                        relative px-4 flex items-center text-2xl font-medium transition-all duration-200
                                        ${isActive ? 'text-brand' : 'text-muted hover:text-brand hover:bg-blue-50/40'}
                                    `}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-brand rounded-t-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* БЛОК АВТОРИЗАЦИИ / ПРОФИЛЯ */}
                <div className="hidden lg:flex gap-8 items-center font-medium py-4 md:py-6">
                    {!user && isHome && (
                        <>
                            <button className="text-brand cursor-pointer text-2xl hover:text-[#41479B] border border-transparent px-4 py-2 hover:border-[#41479B] hover:rounded-xl transition-all duration-200" onClick={() => setAuthMode('register')}>
                                Зарегистрироваться
                            </button>
                            <button className="px-4 py-2 bg-brand cursor-pointer rounded-xl text-white text-2xl hover:bg-[#41479B] shadow-md hover:shadow-lg transition-all" onClick={() => setAuthMode('login')}>
                                Войти
                            </button>
                        </>
                    )}

                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="cursor-pointer flex items-center gap-4 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                <CircleUserRound size={48} className="text-black" strokeWidth={1.5} />
                                <div className="text-left hidden sm:block">
                                    <p className="text-xl font-medium text-gray-900 leading-tight">{user.name}</p>
                                    <p className="text-xl text-gray-500 leading-tight">{user.role === 'User' ? 'родитель' : user.role.toLowerCase()}</p>
                                </div>
                                <ChevronDown size={32} className={`text-black transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 px-2 z-50">
                                    {/* <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                        Профиль
                                    </Link> */}
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xl text-red-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* БУРГЕР ДЛЯ МОБИЛОК */}
                <div className="lg:hidden flex items-center py-4">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-brand hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                    >
                        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* МЕНЮ ДЛЯ МОБИЛОК */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-[5%] space-y-6 z-40 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {user && userTabs.length > 0 && (
                        <nav className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Навигация</p>
                            {userTabs.map(tab => {
                                const isActive = isActiveTab(tab.href);
                                return (
                                    <Link 
                                        key={tab.href} 
                                        href={tab.href} 
                                        className={`px-4 py-3 text-xl font-medium rounded-xl transition-all ${
                                            isActive ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-2">
                                    <CircleUserRound size={40} className="text-brand shrink-0" />
                                    <div>
                                        <p className="text-xl font-medium text-gray-900">{user.name}</p>
                                        <p className="text-base text-gray-500">{user.role === 'User' ? 'родитель' : user.role.toLowerCase()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link href="/profile" className="block text-center px-4 py-3 text-xl font-medium text-gray-700 bg-gray-50 rounded-xl">
                                        Профиль
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-center px-4 py-3 text-xl font-medium text-white bg-red-500 rounded-xl cursor-pointer">
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            isHome && (
                                <div className="flex flex-col gap-3">
                                    <button className="w-full py-3.5 text-center font-medium text-brand text-xl border border-brand rounded-xl" onClick={() => { setAuthMode('register'); setIsMobileMenuOpen(false); }}>
                                        Зарегистрироваться
                                    </button>
                                    <button className="w-full py-3.5 text-center font-medium bg-brand text-white text-xl rounded-xl shadow-md" onClick={() => { setAuthMode('login'); setIsMobileMenuOpen(false); }}>
                                        Войти
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <AuthModal isOpen={authMode !== null} onClose={() => setAuthMode(null)} initialTab={authMode || 'login'} />
        </header>
    )
}