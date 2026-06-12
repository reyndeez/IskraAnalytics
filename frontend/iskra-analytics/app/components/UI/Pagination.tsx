'use client'

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage} : PaginationProps){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            router.replace(createPageUrl(newPage), { scroll: false });
        }
    };

    if (totalPages <= 1) return null;

    return(
        <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 justify-center sm:justify-start">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 bg-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
            >
                <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
            </button>

            <div className="flex items-center gap-2 select-none">
                <span className="text-white text-xl sm:text-2xl font-bold">
                    {currentPage} / {totalPages}
                </span>
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 bg-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
            >
                <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
            </button>
        </div>
    );
}