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
import { Suspense, useEffect, useState } from "react";

export default function Measurements(){
    return(
        <Suspense fallback={<div className="p-8 pt-48 text-gray-500 font-medium">Загрузка рейтинга...</div>}>
            <MeasurementsContent/>
        </Suspense>
    );
}

function MeasurementsContent(){
    const searchParams= useSearchParams();
    const router = useRouter();

    const metricId = searchParams.get('metricId');
    const groupId = searchParams.get('groupId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [results, setResults] = useState<MeasurementResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!date) {
            const today = new Date().toISOString().split('T')[0];
            const params = new URLSearchParams(searchParams.toString());
            params.set('date', today);
            router.replace(`?${params.toString()}`);
        }
    }, [date, router, searchParams]);

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
                console.error("Ошибка при загрузке метрик", err);
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
                console.error("Ошибка при загрузке замеров", err);
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
        router.replace(`?${params.toString()}`, {scroll: false});
    }

    const handleSaveResult = async (studentId: string, currentValue: number, currentResultId: string | null) => {
        if(!metricId || !date) return;

        try{
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
            ))
        }catch (err){
            console.error("Не удалось сохранить замер через сервис: ", err);
        }
    }


    return(
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 ">
                <span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">Журнал замеров</h1>
                    <p className="text-brand/60 text-xl sm:text-2xl md:text-4xl mt-2 font-medium">
                        Фиксация показателей и мониторинг прогресса
                    </p>
                </span>
            </div>     
            <div className="flex flex-col rounded-3xl md:rounded-4xl bg-brand p-4 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <GroupSelector groups={groups} />                      
                    <DateSelector />
                    <MetricSelector metrics={metrics} />
                </div>

                {loading ? (
                    <div className="text-white text-2xl mt-8 pl-2">Загрузка...</div>
                ) : (
                    <div className="bg-white rounded-3xl md:rounded-4xl shadow-lg overflow-hidden mt-8">
                        {/* Контейнер для горизонтального скролла таблицы на мобилках */}
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-150 text-left table-auto">
                                <thead className="bg-white text-lg md:text-xl font-extrabold text-brand tracking-[0.02em] border-b border-brand/10">
                                    <tr>
                                        <th className="p-4 md:p-6">Имя</th>
                                        <th className="p-4 md:p-6">Фамилия</th>
                                        <th className="p-4 md:p-6">Результат</th>
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
                                            <td colSpan={3} className="p-10 text-center italic text-muted text-xl md:text-2xl">
                                                Выберите группу и метрику для отображения списка
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>       
        </div>
    );
}