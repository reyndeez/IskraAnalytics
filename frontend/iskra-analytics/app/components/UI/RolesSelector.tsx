'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";
import { t } from "../utils/dictionaries";

interface Role {
    id: string;
    name: string;
}

interface RoleSelectorProps {
    roles: Role[];
}

export function RoleSelector({roles}: RoleSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeRoleId = searchParams.get('roleId') || '';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleRoleChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (id) {
            params.set('roleId', id);
        } else {
            params.delete('roleId');
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

    const activeRole = roles.find(r => r.id === activeRoleId);
    const buttonText = activeRole? t('roles', activeRole.name) : 'Все роли';

    return(
        <div className="relative text-brand text-base sm:text-xl font-medium" ref={dropdownRef}>
            {/* Кнопка-переключатель */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 bg-white rounded-2xl shadow-sm min-w-32 sm:min-w-50"
            >
                <span className="truncate">{buttonText}</span>
                <ChevronIcon isOpen={isOpen} className="w-5 h-5 sm:w-7 sm:h-7 text-brand shrink-0"/>
            </button>
            
            {/* Выпадающее меню */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
                    {roles.map((role)=>(
                        <div 
                            key={role.id}
                            onClick={() => handleRoleChange(role.id)}
                            className={`px-3 sm:px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors truncate ${
                                activeRoleId === role.id ? 'bg-brand/10 text-brand font-medium' : 'text-muted/70'
                            }`}
                        >
                            {t('roles', role.name)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}