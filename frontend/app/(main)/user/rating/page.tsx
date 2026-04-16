'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

import ChildSwitcher from '@/app/components//UI/ChildSwitcher';
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

    const loadAllData = async () => {
        try {
            setLoading(true);

            const [childrenData, metricsData] = await Promise.all([
                studentService.getChildren(),
                metricService.getMetrics()
            ]);

            setChildren(childrenData);
            setMetrics(metricsData);

            let currentStudentId = studentId;
            let currentMetricId = metricId;

            const params = new URLSearchParams(searchParams.toString());

            if (!currentStudentId && childrenData.length > 0)

            if (
                currentStudentId !== studentId ||
                currentMetricId !== metricId
            ) {
                router.replace(`?${params.toString()}`);
                return;
            }

            if (!currentStudentId || !currentMetricId) return;

            const boardData = await analyticService.getLeaderboard(
                currentStudentId,
                currentMetricId
            );

            setLeaderboard(boardData || []);

        } catch (err) {
            console.error("Ошибка:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, [studentId, metricId]);

    return (
        <div className="p-8 pt-48 px-[10%] md:px-[15%] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-6xl font-bold text-[#064592]">Рейтинг</h1>
                    <p className="text-[#064592]/60 text-4xl mt-2 font-medium">
                        Отслеживание результатов и сравнение с другими
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                        <MetricSelector metrics={metrics} />
                    </div>
                </div>

                <ChildSwitcher childrenList={children} />
            </div>

            {/* ТАБЛИЦА */}
            {loading ? (
                <div className="text-[#808080] text-2xl">Загрузка...</div>
            ) : leaderboard.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white">
                    <p className="text-[#064592]/60 font-medium text-2xl text-center m-5">
                        Нет данных для отображения.<br />
                        Выберите спортсмена и упражнение
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-4xl shadow-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#064592] text-xl font-extrabold text-white tracking-[0.02em]">
                            <tr>
                                <th className="p-6">Место</th>
                                <th className="p-6">Имя</th>
                                <th className="p-6">Результат</th>
                                <th className='p-6'>Дата рекорда</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((item) => (
                                <tr
                                    key={item.studentId}
                                    className="border-t-2 border-[#064592] text-xl text-[#064592] font-bold"
                                >
                                    <td className="p-6">{item.rank}</td>
                                    <td className="p-6">{item.studentName}</td>
                                    <td className="p-6">
                                        {item.score} {t('units', item.unit)}
                                    </td>
                                    <td className="p-6">{item.createdAt}</td>
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
                onSuccess={loadAllData}
            />
        </div>
    );
}