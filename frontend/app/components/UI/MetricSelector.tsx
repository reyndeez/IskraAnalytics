import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

    const activeMetric = metrics.find(m => m.id === activeMetricId);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    

const [isOpen, setIsOpen] = useState(false);

return (
    <div className="relative" ref={dropdownRef}>
        
        {/* Кнопка */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors min-w-64"
        >
            <span>
                {metrics.find(m => m.id === activeMetricId)?.name || 'Выберите упражнение'}
            </span>

            {/* стрелка */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
                <path d="m6 9 6 6 6-6"/>
            </svg>
        </button>

        {/* Выпадающий список */}
        {isOpen && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden">
                {metrics.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => {
                            handleChange(m.id);
                            setIsOpen(false);
                        }}
                        className={`px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                            activeMetricId === m.id ? 'bg-gray-100 font-medium' : ''
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