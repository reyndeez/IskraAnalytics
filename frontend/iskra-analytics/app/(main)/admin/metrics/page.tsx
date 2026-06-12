'use client'

import { metricService } from "@/app/components/services/metricService";
import { Pagination } from "@/app/components/UI/Pagination";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { ActivitySelector } from "@/app/components/UI/ActivitySelector";
import { MetricRow } from "@/app/components/UI/MetricRow"; 
import { MetricDataModal } from "@/app/components/UI/MetricDataModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Plus } from "lucide-react";

const SORT_OPTIONS = [
    { id: 'name', name: 'По названию' },
    { id: 'unit', name: 'По ед. измерения' }
];

export default function MetricsPage() {
    return(
        <Suspense fallback={<div className="text-white text-xl p-4">Загрузка...</div>}>
            <MetricsContent />
        </Suspense>
    );
}

function MetricsContent() {
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const [metricData, setMetricData] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const search = searchParams.get('search') || "";
    const sortId = searchParams.get('sortId') || "name";
    const isDescending = searchParams.get('isDescending') === 'true';
    const page = Number(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter') || "active"; 

    const loadMetrics = async () => {
        try {
            setIsLoading(true);
            const response = await metricService.findMetrics({
                search,
                sortId,
                isDescending,
                page,
                pageSize: 6,
                filter
            });
            setMetricData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, [searchParams]);

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">            
            <h1 className="text-3xl sm:text-6xl font-bold text-brand leading-tight">Панель метрик</h1>
            
            <div className="mt-6 sm:mt-10 p-4 sm:p-8 bg-brand rounded-4xl shadow-xl">
                {/* Панель фильтров: Убран overflow, чтобы выпадающие списки не обрезались */}
                <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
                    {/* Левая часть: Поиск и кнопка создания */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-initial">
                            <SearchInput />
                        </div>
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer flex items-center justify-center rounded-2xl bg-white p-3 sm:p-4 text-brand hover:scale-105 transition-transform shrink-0 shadow-md"
                            title="Добавить метрику"
                        >
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                    
                    {/* Правая часть: flex-wrap гарантирует, что если места критически мало, элементы не застрянут, при этом сохраняется полная видимость выпадающих меню */}
                    <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-2 sm:gap-4 justify-start lg:justify-end w-full lg:w-auto shrink-0">
                        <div className="flex-1 sm:flex-initial min-w-26.25 sm:min-w-35">
                            <ActivitySelector />
                        </div>
                        <div className="flex-1 sm:flex-initial min-w-28.75 sm:min-w-37.5">
                            <SortSelector sorts={SORT_OPTIONS} />                        
                        </div>
                        <div className="shrink-0">
                            <SortToggle />
                        </div>
                    </div>
                </div>

                {/* Список метрик */}
                <div className="mt-6 flex flex-col gap-3 sm:gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        metricData?.metrics.map((metric: any) => (
                            <MetricRow key={metric.id} metric={metric} onRefresh={loadMetrics} />
                        ))
                    )}
                    
                    {!isLoading && metricData?.metrics.length === 0 && (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Метрики не найдены</div>
                    )}
                </div>

                {/* Блок пагинации */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <Pagination
                        totalPages={metricData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>

            {/* Модалка создания метрики */}
            <MetricDataModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                metric={null}
                onRefresh={loadMetrics}
                mode="create"
            />
        </div>
    );
}