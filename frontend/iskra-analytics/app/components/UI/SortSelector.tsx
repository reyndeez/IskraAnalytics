'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";
import { t } from "../utils/dictionaries";

interface Sort {
    id: string;
    name: string;
}

interface SortSelectorProps {
    sorts: Sort[];
}

export function SortSelector({sorts}: SortSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeSortId = searchParams.get('sortId') || '';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (id) {
            params.set('sortId', id);
        } else {
            params.delete('sortId');
        }

        params.set('page', '1');
        router.replace(`?${params.toString()}`, {scroll: false})

        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const activeSort = sorts.find(s => s.id === activeSortId);
    const buttonText = activeSort? activeSort.name : 'Сортировка';

    return(
        <div className="relative text-brand text-base sm:text-xl font-medium" ref={dropdownRef}>
            {/* Кнопка-переключатель */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 bg-white rounded-2xl shadow-sm min-w-36 sm:min-w-50"
            >
                <span>{buttonText}</span>
                <ChevronIcon isOpen={isOpen} className="w-5 h-5 sm:w-7 sm:h-7 text-brand"/>
            </button>
            
            {/* Выпадающее меню */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
                    {sorts.map((role)=>(
                        <div 
                            key={role.id}
                            onClick={() => handleSortChange(role.id)}
                            className={`px-3 sm:px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                                activeSortId === role.id ? 'bg-brand/10 text-brand font-medium' : 'text-muted/70'
                            }`}
                        >
                            {t('sorts', role.name)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}