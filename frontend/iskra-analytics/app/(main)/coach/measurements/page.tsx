'use client'

import { groupService } from "@/app/components/services/groupService";
import { metricService } from "@/app/components/services/metricService";
import { resultService } from "@/app/components/services/resultService";
import { DateSelector } from "@/app/components/UI/DateSelector";
import { Group, GroupSelector } from "@/app/components/UI/GroupSelector";
import { Metric, MetricSelector } from "@/app/components/UI/MetricSelector";
import { TableRow } from "@/app/components/UI/TableRow";
import { MeasurementResponse } from "@/app/models/responses/measurementResponse";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// Главный компонент-обертка со строгой Suspense-границей для Next.js
export default function Measurements() {
    return (
        <Suspense fallback={<div className="p-8 pt-48 text-brand/60 font-medium text-center text-2xl animate-pulse">Загрузка журнала...</div>}>
            <MeasurementsParamsWrapper />
        </Suspense>
    );
}

// Промежуточный безопасный слой для извлечения параметров
function MeasurementsParamsWrapper() {
    const searchParams = useSearchParams();
    
    const metricId = searchParams.get('metricId');
    const groupId = searchParams.get('groupId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    return (
        <MeasurementsContent 
            metricId={metricId} 
            groupId={groupId} 
            date={date} 
            searchParams={searchParams} 
        />
    );
}

interface MeasurementsContentProps {
    metricId: string | null;
    groupId: string | null;
    date: string;
    searchParams: ReturnType<typeof useSearchParams>;
}

function MeasurementsContent({ metricId, groupId, date, searchParams }: MeasurementsContentProps) {
    const router = useRouter();

    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [results, setResults] = useState<MeasurementResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [metricsData, groupsData] = await Promise.all([
                    metricService.getMetricsForSelector(),
                    groupService.getGroupsForCoach()
                ]);
                setMetrics(metricsData);
                setGroups(groupsData);
            } catch (err) {
                console.error("Ошибка при загрузке метрик тренера:", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const loadTableData = async () => {
            if (!metricId || !groupId || !date) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await resultService.getResultsForMeasurement(groupId, metricId, date);
                setResults(data);
            } catch (err) {
                console.error("Ошибка при загрузке замеров:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        loadTableData();
    }, [metricId, groupId, date]);

    const handleInputFocus = (studentId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('studentId', studentId);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSaveResult = async (studentId: string, currentValue: number, currentResultId: string | null) => {
        if (!metricId || !date) return;

        try {
            const newResultId = await resultService.upsertResult({
                resultId: currentResultId,
                studentId,
                metricId,
                date,
                value: currentValue
            });

            setResults(prev => prev.map(res => 
                res.student.id === studentId
                ? { ...res, resultId: newResultId, value: currentValue }
                : res
            ));
        } catch (err) {
            console.error("Не удалось сохранить замер:", err);
        }
    };

    return (
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">Журнал замеров</h1>
                    <p className="text-brand/60 text-xl sm:text-2xl md:text-3xl mt-2 font-medium">
                        Фиксация показателей и мониторинг прогресса
                    </p>
                </div>
            </div>     
            
            <div className="flex flex-col rounded-3xl md:rounded-4xl bg-brand p-4 sm:p-8">
                <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-between gap-4 w-full">
                    <div className="w-full md:w-auto">
                        <GroupSelector groups={groups} />                      
                    </div>
                    <div className="w-full md:w-auto">
                        <DateSelector />
                    </div>
                    <div className="w-full md:w-auto">
                        <MetricSelector metrics={metrics} />
                    </div>
                </div>

                {loading ? (
                    <div className="text-white/60 text-xl md:text-2xl mt-8 pl-2 animate-pulse">Синхронизация данных таблицы...</div>
                ) : (
                    <div className="bg-white rounded-3xl md:rounded-4xl shadow-lg overflow-hidden mt-8 w-full max-w-full">
                        <table className="w-full text-left table-fixed border-collapse">
                            <thead className="bg-white text-base sm:text-lg md:text-xl font-extrabold text-brand tracking-[0.02em] border-b border-brand/10">
                                <tr>
                                    <th className="py-4 px-2 sm:p-6 w-[35%] md:w-auto">Имя</th>
                                    <th className="py-4 px-2 sm:p-6 w-[40%] md:w-auto">Фамилия</th>
                                    <th className="py-4 pr-3 pl-1 sm:p-6 w-20 sm:w-32 text-right">Результат</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? (
                                    results.map((res) => (
                                        <TableRow
                                            key={res.student.id} 
                                            res={res} 
                                            onFocus={handleInputFocus}
                                            onSave={handleSaveResult}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-10 text-center italic text-brand/40 text-xl md:text-2xl font-medium">
                                            Выберите группу и метрику для отображения списка воспитанников
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>       
        </div>
    );
}