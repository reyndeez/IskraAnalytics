'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutGrid, Users, School, Sigma, LogOut, X } from "lucide-react";

const tabs = [
    { label: "Группы", href: "/admin/groups", icon: <LayoutGrid size={24} /> },
    { label: "Пользователи", href: "/admin/users", icon: <Users size={24} /> },
    { label: "Студенты", href: "/admin/students", icon: <School size={24} /> },
    { label: "Метрики", href: "/admin/metrics", icon: <Sigma size={24} /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Слушаем глобальное событие клика по кнопке из Navbar на мобилках
    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggle-admin-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
    }, []);

    // Закрываем сайдбар при переходе на другую вкладку админки
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        window.location.href = '/';
    };

    return (
        <>
            {/* Затемнение заднего фона на мобилках при открытом сайдбаре */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-140 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed left-0 top-0 h-screen w-80 bg-white border-r border-gray-100 p-8 flex flex-col z-150
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0
            `}>
                {/* Кнопка закрытия для мобилок внутри сайдбара */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 lg:hidden p-2 text-gray-400 hover:text-brand rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Верхняя часть */}
                <div className="mb-10 pt-4 lg:pt-0">
                    <h1 className="text-2xl font-black text-brand">Админ панель</h1>
                    <p className="text-gray-400">Система управления</p>
                </div>

                {/* Основная навигация */}
                <nav className="space-y-3 flex-1 overflow-y-auto">
                    {tabs.map(tab => {
                        const isActive = pathname === tab.href;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-brand text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-brand'
                                }`}
                            >
                                {tab.icon}
                                <span className="text-lg font-semibold">{tab.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Нижняя часть: Кнопки действий */}
                <div className="pt-6 border-t border-gray-100 space-y-2 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all cursor-pointer font-semibold"
                    >
                        <LogOut size={24} />
                        <span className="text-lg font-semibold">Выйти</span>
                    </button>
                </div>
            </aside>
        </>
    );
}