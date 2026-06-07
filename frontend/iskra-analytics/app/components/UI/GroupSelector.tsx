'use client'

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";

// Интерфейс для группы
export interface Group {
    id: string;
    name: string;
}

export function GroupSelector({ groups }: { groups: Group[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Теперь смотрим именно groupId
    const activeGroupId = searchParams.get('groupId') || '';

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('groupId', id); // Устанавливаем groupId в URL
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Кнопка */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors min-w-64"
            >
                <span>
                    {groups.find(g => g.id === activeGroupId)?.name || 'Выберите группу'}
                </span>
                <ChevronIcon isOpen={isOpen}/>
            </button>

            {/* Выпадающий список */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden">
                    {groups.length > 0 ? (
                        groups.map((g) => (
                            <div
                                key={g.id}
                                onClick={() => {
                                    handleChange(g.id);
                                    setIsOpen(false);
                                }}
                                className={`px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    activeGroupId === g.id ? 'bg-gray-100 font-medium' : ''
                                }`}
                            >
                                {g.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-3 text-muted">Группы не найдены</div>
                    )}
                </div>
            )}
        </div>
    );
}