'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, School, Sigma, Palette, LogOut, Home } from "lucide-react";

const tabs = [
    { label: "Группы", href: "/admin/groups", icon: <LayoutGrid size={24} /> },
    { label: "Пользователи", href: "/admin/users", icon: <Users size={24} /> },
    { label: "Студенты", href: "/admin/students", icon: <School size={24} /> },
    { label: "Метрики", href: "/admin/metrics", icon: <Sigma size={24} /> },
    { label: "Роли", href: "/admin/roles", icon: <Palette size={24} /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-gray-100 p-8 flex flex-col">
            {/* Верхняя часть*/}
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#064592]">Админ панель</h1>
                <p className="text-gray-400">Система управления</p>
            </div>

            {/* Основная навигация */}
            <nav className="space-y-3 flex-1">
                {tabs.map(tab => {
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-[#064592] text-white shadow-lg shadow-blue-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#064592]'
                            }`}
                        >
                            {tab.icon}
                            <span className="text-lg font-semibold">{tab.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Нижняя часть: Кнопки действий */}
            <div className="pt-6 border-t border-gray-100 space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                    <LogOut size={24} />
                    <span className="text-lg font-semibold">Выйти</span>
                </button>
            </div>
        </aside>
    );
}