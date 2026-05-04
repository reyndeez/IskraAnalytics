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
        <div className="flex items-center gap-4">
            <div 
                onClick={handleSearch}
                className="p-2 bg-white rounded-2xl shadow-xl cursor-pointer"
            >
                <SearchIcon className="w-9 h-9 text-brand" />
            </div>

            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Поиск"
                className="p-3 shadow-xl text-brand text-xl font-medium bg-white rounded-2xl"
            />
        </div>
    );
}