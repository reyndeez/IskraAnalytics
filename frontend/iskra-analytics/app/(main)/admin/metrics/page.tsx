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
    <Suspense fallback={<div className="text-white">Загрузка...</div>}>
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
        <div>            
            <h1 className="text-6xl font-bold text-brand">Панель метрик</h1>
            <div className="mt-10 p-8 bg-brand rounded-4xl">
                <div className="flex flex-row justify-between">
                    {/* Левая часть: Поиск и кнопка создания */}
                    <div className="flex items-center gap-6">
                        <SearchInput />
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer flex items-center justify-center rounded-2xl bg-white p-4 text-brand hover:scale-105 transition-transform"
                            title="Добавить метрику"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                    {/* Правая часть: Селекторы и сортировка */}
                    <div className="flex items-end gap-6">
                        <ActivitySelector />
                        <SortSelector sorts={SORT_OPTIONS} />                        
                        <SortToggle />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        metricData?.metrics.map((metric: any) => (
                            <MetricRow key={metric.id} metric={metric} onRefresh={loadMetrics} />
                        ))
                    )}
                    
                    {!isLoading && metricData?.metrics.length === 0 && (
                        <div className="text-white text-center text-2xl py-10 font-medium">Метрики не найдены</div>
                    )}
                </div>

                {/* Блок пагинации */}
                <div className="flex justify-center mt-8">
                    <Pagination
                        totalPages={metricData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>

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