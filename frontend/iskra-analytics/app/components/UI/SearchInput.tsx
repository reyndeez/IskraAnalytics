'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchIcon } from "./Icons";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }

        params.set('page', '1');

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div 
                onClick={handleSearch}
                className="p-2 bg-white rounded-2xl shadow-xl cursor-pointer shrink-0"
            >
                <SearchIcon className="w-6 h-6 sm:w-9 sm:h-9 text-brand" />
            </div>

            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Поиск"
                className="p-2 sm:p-3 w-full sm:w-auto shadow-xl text-brand text-base sm:text-xl font-medium bg-white rounded-2xl focus:outline-none"
            />
        </div>
    );
}