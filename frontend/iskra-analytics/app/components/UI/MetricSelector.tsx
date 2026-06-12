'use client'

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";

export interface Metric {
    id: string;
    name: string;
}

export function MetricSelector({ metrics }: { metrics: Metric[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeMetricId = searchParams.get('metricId') || '';

    const handleChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('metricId', id);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

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
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto sm:min-w-64"
            >
                <span className="truncate">
                    {metrics.find(m => m.id === activeMetricId)?.name || 'Выберите упражнение'}
                </span>
                <ChevronIcon isOpen={isOpen} className="w-5 h-5 shrink-0" />
            </button>

            {/* Выпадающий список */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden max-h-60 overflow-y-auto">
                    {metrics.map((m) => (
                        <div
                            key={m.id}
                            onClick={() => {
                                handleChange(m.id);
                                setIsOpen(false);
                            }}
                            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base cursor-pointer hover:bg-gray-50 transition-colors truncate ${
                                activeMetricId === m.id ? 'bg-gray-100 font-medium text-brand' : 'text-gray-700'
                            }`}
                        >
                            {m.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}