'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutGrid, Users, School, Sigma, LogOut, X, Menu } from "lucide-react";

const tabs = [
    { label: "Группы", href: "/admin/groups", icon: <LayoutGrid size={24} /> },
    { label: "Пользователи", href: "/admin/users", icon: <Users size={24} /> },
    { label: "Студенты", href: "/admin/students", icon: <School size={24} /> },
    { label: "Метрики", href: "/admin/metrics", icon: <Sigma size={24} /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Дополнительный вызов из глобального события (на всякий случай, если в навбаре нажмут)
    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggle-admin-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
    }, []);

    // Закрываем при смене страницы
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
            {/* Собственная кнопка вызова, которая встанет на мобилках аккуратно в левый угол поверх навбара */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`fixed top-4 left-[5%] z-50 lg:hidden p-2 text-brand hover:bg-gray-100 rounded-xl transition-all active:scale-95 ${
                    isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            >
                <Menu size={32} />
            </button>

            {/* Задний фон-затемнение (оверлей) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-55 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Сам Сайдбар */}
            <aside className={`
                fixed left-0 top-0 h-screen bg-white flex flex-col z-60
                transition-transform duration-300 ease-in-out p-6 md:p-8 box-border
                
                /* Мобильные стили: шторка слева, не на весь экран (чтобы не было проблем с шириной) */
                w-[85vw] max-w-90 border-r border-gray-100 shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                
                /* Десктопные стили: стационарная панель */
                lg:w-80 lg:max-w-none lg:shadow-none lg:translate-x-0
            `}>
                
                {/* Шапка сайдбара с заголовком и крестиком на одной линии */}
                <div className="flex items-start justify-between gap-4 mb-8 lg:mb-10 min-w-0 pt-2 lg:pt-0">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-black text-brand truncate">Админ панель</h1>
                        <p className="text-gray-400 text-sm truncate">Система управления</p>
                    </div>
                    
                    {/* Крестик закрытия — теперь он внутри флекса и жестко привязан к контенту */}
                    <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-brand rounded-xl hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Навигация */}
                <nav className="space-y-2 lg:space-y-3 flex-1 overflow-y-auto pr-1 min-w-0">
                    {tabs.map(tab => {
                        const isActive = pathname === tab.href;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 min-w-0 ${
                                    isActive
                                        ? 'bg-brand text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-brand'
                                }`}
                            >
                                <div className="shrink-0">{tab.icon}</div>
                                <span className="text-lg font-semibold truncate">{tab.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Нижняя кнопка */}
                <div className="pt-4 lg:pt-6 border-t border-gray-100 space-y-2 shrink-0 pb-8 lg:pb-0 min-w-0">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all cursor-pointer font-semibold min-w-0"
                    >
                        <div className="shrink-0"><LogOut size={24} /></div>
                        <span className="text-lg font-semibold truncate">Выйти</span>
                    </button>
                </div>
            </aside>
        </>
    );
}