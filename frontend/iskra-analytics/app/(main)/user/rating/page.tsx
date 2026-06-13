'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

import ChildSwitcher from '@/app/components/UI/ChildSwitcher';
import AddChildModal from '@/app/components/UI/AddChildModal';

import { studentService } from '@/app/components/services/studentService';
import { analyticService } from '@/app/components/services/analyticService';
import { metricService } from '@/app/components/services/metricService';

import { MetricSelector, Metric } from '@/app/components/UI/MetricSelector';
import { LeaderboardResponse } from '@/app/models/responses/leaderboardResponse';
import { t } from '@/app/components/utils/dictionaries';

interface Child {
    id: number | string;
    firstName: string;
}

export default function RatingPage() {
    return (
        <Suspense fallback={<div className="p-8 pt-48 text-gray-500 font-medium">Загрузка рейтинга...</div>}>
            <RatingContent />
        </Suspense>
    );
}

function RatingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const isAddModalOpen = searchParams.get('addClick') === 'true';
    const studentId = searchParams.get('studentId');
    const metricId = searchParams.get('metricId');

    const [children, setChildren] = useState<Child[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Инициализация данных и параметров URL
    useEffect(() => {
        const initializePage = async () => {
            try {
                const [childrenData, metricsData] = await Promise.all([
                    studentService.getChildren(),
                    metricService.getMetricsForSelector()
                ]);

                setChildren(childrenData || []);
                setMetrics(metricsData || []);

                const currentParams = new URLSearchParams(searchParams.toString());
                let shouldUpdateUrl = false;

                // Установка дефолтного студента
                if (!studentId && childrenData?.length > 0) {
                    currentParams.set('studentId', childrenData[0].id.toString());
                    shouldUpdateUrl = true;
                }

                // Установка дефолтной метрики
                if (!metricId && metricsData?.length > 0) {
                    currentParams.set('metricId', metricsData[0].id);
                    shouldUpdateUrl = true;
                }

                if (shouldUpdateUrl) {
                    router.replace(`?${currentParams.toString()}`, { scroll: false });
                } else {
                    // Если параметры уже есть, загружаем данные
                    await loadLeaderboard(studentId || childrenData?.[0]?.id.toString(), metricId || metricsData?.[0]?.id);
                }
            } catch (err) {
                console.error("Ошибка инициализации рейтинга:", err);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []); // Запускается только при монтировании

    // Реакция на смену параметров в URL
    useEffect(() => {
        if (studentId && metricId) {
            loadLeaderboard(studentId, metricId);
        }
    }, [studentId, metricId]);

    const loadLeaderboard = async (sId: string, mId: string) => {
        setLoading(true);
        try {
            const boardData = await analyticService.getLeaderboard(sId, mId);
            setLeaderboard(boardData || []);
        } catch (err) {
            console.error("Ошибка загрузки рейтинга:", err);
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">Рейтинг</h1>
                    <p className="text-xl sm:text-2xl md:text-4xl mt-2 font-medium text-brand/60">
                        Отслеживание результатов и сравнение с другими
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                        <MetricSelector metrics={metrics} />
                    </div>
                </div>

                <ChildSwitcher childrenList={children} />
            </div>

            {loading ? (
                <div className="text-muted text-2xl pl-2">Загрузка...</div>
            ) : leaderboard.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white">
                    <p className="text-brand/60 font-medium text-xl md:text-2xl text-center m-5">
                        Нет данных для отображения. Проверьте, выбраны ли спортсмен и упражнение
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl md:rounded-4xl shadow-lg overflow-hidden">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-brand text-xs sm:text-lg md:text-xl font-extrabold text-white tracking-[0.02em]">
                            <tr>
                                <th className="p-2 md:p-6 w-[15%]">Место</th>
                                <th className="p-2 md:p-6 w-[30%]">Имя</th>
                                <th className="p-2 md:p-6 w-[27%]">Рекорд</th>
                                <th className="p-2 md:p-6 w-[28%]">Последний</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((item) => (
                                <tr key={item.studentId} className="border-t-2 border-brand/10 text-xs sm:text-lg md:text-xl text-brand font-bold hover:bg-brand/5 transition-colors">
                                    <td className="p-2 md:p-6">{item.rank}</td>
                                    <td className="p-2 md:p-6 wrap-break-word">{item.studentName}</td>
                                    <td className="p-2 md:p-6">
                                        <div>{item.score} {t('units', item.unit)}</div>
                                        <div className="text-[9px] md:text-sm text-brand/50 font-normal mt-0.5">{item.createdAt}</div>
                                    </td>
                                    <td className="p-2 md:p-6">
                                        <div>{item.lastScore} {t('units', item.unit)}</div>
                                        <div className="text-[9px] md:text-sm text-brand/50 font-normal mt-0.5">{item.lastCreatedAt}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddChildModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('addClick');
                    router.replace(`?${params.toString()}`);
                }}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}