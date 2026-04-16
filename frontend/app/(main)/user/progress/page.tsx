'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ChildSwitcher from '@/app/components/UI/ChildSwitcher';
import AddChildModal from '@/app/components/UI/AddChildModal';
import { studentService } from '@/app/components/services/studentService';
import { StudentResponse } from '@/app/models/responses/studentResponse';
import { t } from '@/app/components/utils/dictionaries';
import { ProgressChart } from '@/app/components/UI/ProgressChart';
import { ChartDataResponse } from '@/app/models/responses/chartDataResponse';
import { analyticService } from '@/app/components/services/analyticService';
import { metricService } from '@/app/components/services/metricService';
import { Metric, MetricSelector } from '@/app/components/UI/MetricSelector';
import { RecommendationResponse } from '@/app/models/responses/recommendationResponse';
import { LeaderboardResponse } from '@/app/models/responses/leaderboardResponse';

export default function ProgressPage() {
    return (
        <Suspense fallback={<div className="p-8 pt-48 text-gray-500 font-medium">Загрузка интерфейса...</div>}>
            <ProgressContent />
        </Suspense>
    );
}

function ProgressContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const isAddTriggered = searchParams.get('addClick') === 'true';
    const studentId = searchParams.get('studentId');
    const activeMetricId = searchParams.get('metricId');    

    const [children, setChildren] = useState<StudentResponse[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [chartData, setChartData] = useState<ChartDataResponse[]>([]);
    const [isChartLoading, setIsChartLoading] = useState(false);

    const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
    const [overallRating, setOverallRating] = useState<LeaderboardResponse[]>([]);
    const [isRecLoading, setIsRecLoading] = useState(false);

    const fetchChildren = async () => {
        try {
            const childrenData = await studentService.getChildren();
            setChildren(childrenData);
            
            if (!studentId && childrenData.length > 0) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set('studentId', childrenData[0].id.toString());
                router.replace(`?${newParams.toString()}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetrics = async () => {
        try {
            const data = await metricService.getMetrics();
            setMetrics(data);

            if (data.length > 0 && !activeMetricId) {
                const firstId = data[0].id;
                const params = new URLSearchParams(searchParams.toString());
                params.set('metricId', firstId);
                router.replace(`?${params.toString()}`, { scroll: false });
                return firstId;
            }
            return activeMetricId;
        } catch (err) {
            console.error("Ошибка метрик", err);
        }
    };

    const fetchAnalytics = async () => {
    if (!studentId) return;
    setIsRecLoading(true);
    try {
        const recData = await analyticService.getRecommendations(studentId);
        setRecommendations(recData);

        const ratingData = await analyticService.getRatingOverall(studentId);
        setOverallRating(ratingData);
        } catch (err) {
            console.error("Ошибка при загрузке аналитики:", err);
        } finally {
            setIsRecLoading(false);
        }
    };

    const fetchChartData = async () => {
        if (!studentId || !activeMetricId) return;
        
        setIsChartLoading(true);
        try {
            if(!activeMetricId) return;
            const data = await analyticService.getChartData(studentId, activeMetricId);
            setChartData(data);
        } catch (err) {
            console.error(err);
            setChartData([]);
        } finally {
            setIsChartLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchChartData();
            fetchAnalytics();
        }
    }, [studentId, activeMetricId]);

    useEffect(() => {
        fetchChildren();

        if (isAddTriggered) {
            setIsModalOpen(true);
            const params = new URLSearchParams(searchParams.toString());
            params.delete('addClick');
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [isAddTriggered]);

    return (
        <div className="p-8 pt-48 px-[10%] md:px-[15%] mx-auto">
            {/* Заголовок страницы */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-6xl font-bold text-[#064592]">Прогресс</h1>
                    <p className="text-[#064592]/60 text-4xl mt-2 font-medium">Мониторинг личных достижений спортсмена</p>
                </div>
                <ChildSwitcher childrenList={children} />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white/40 backdrop-blur-md rounded-4xl border border-white/40">
                    <div className="w-12 h-12 border-4 border-[#064592] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#064592] font-semibold">Загружаем данные профиля...</p>
                </div>
            ) : studentId ? (
                <div className="flex flex-col gap-8">
                    {/* ВЕРХНЯЯ СЕКЦИЯ: Карточки профиля и статуса */}
                    <section>
                        {(() => {
                            const currentStudent = children.find(c => c.id.toString() === studentId);                
                            return (
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>                        
                                    {/* Карточка-профиль спортсмена */}
                                    <div className='p-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl shadow-blue-900/5 flex flex-col justify-between min-h-60 transition-all hover:shadow-2xl hover:shadow-blue-900/10'>
                                        <div className='flex justify-between items-center mb-6'>
                                            <p className='text-xl font-extrabold text-[#064592] uppercase tracking-[0.02em]'>Карточка спортсмена</p>
                                        </div>
                                        <div className='flex flex-row items-center gap-8'>
                                            <div className='flex flex-col items-center shrink-0'>
                                                <div className='bg-[#064592] text-white w-28 h-28 rounded-4xl flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-200 uppercase'>
                                                    {currentStudent?.firstName[0]}
                                                </div>
                                                <div className='mt-4 px-4 py-1.5 bg-[#064592] rounded-xl shadow-lg shadow-blue-100'>
                                                    <p className='text-xs font-bold text-white uppercase tracking-wider'>
                                                        {currentStudent ? t('roles', currentStudent.amplua) : '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex flex-col space-y-2'>
                                                <div className='space-y-0'>
                                                    <p className='text-xl font-medium text-gray-400 -mb-1'>{currentStudent?.lastName}</p>
                                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                                        <span className="text-[#064592]">{currentStudent?.firstName}</span>
                                                    </h2>
                                                </div>
                                                
                                                <div className='flex flex-col gap-1 pt-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='w-2 h-2 rounded-full bg-[#064592]'></div>
                                                        <p className='text-xl font-bold text-gray-700 leading-tight'>
                                                            {currentStudent?.groupName || '—'}
                                                        </p>
                                                    </div>
                                                    <p className='text-xs font-medium text-gray-400 uppercase tracking-widest pl-4'>Группа обучения</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Карточка-рейтинг */}
                                    <div className='p-10 bg-linear-to-br from-[#064592] to-[#04346e] rounded-4xl shadow-2xl shadow-blue-100 flex flex-col justify-between text-white relative overflow-hidden'>
                                        {(() => {
                                            const myRating = overallRating.find(r => r.isSelectedChild);
                                            return (
                                                <>
                                                    <div className="absolute -right-10 -top-10 text-[200px] font-black opacity-10 italic select-none">
                                                        #{myRating?.rank || '?'}
                                                    </div>
                                                    <div className="relative z-10">
                                                        <p className='text-xl font-extrabold text-blue-200 uppercase tracking-[0.02em]'>Текущий статус</p>
                                                        <div className='flex items-baseline gap-4 mt-6'>
                                                            <span className='text-8xl font-black italic tracking-tighter'>
                                                                #{myRating?.rank || '—'}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className='text-2xl text-blue-200 font-medium'>в группе</span>
                                                                <span className='text-sm text-blue-300'>{myRating?.score} баллов</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    
                                </div>
                            );
                        })()}
                    </section>
                    
                    {/* СЕКЦИЯ: Графики */}
                    <section className="w-full">
                        <div className='p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl shadow-blue-900/5'>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-[#064592] uppercase tracking-[0.02em]">Динамика показателей</h3>
                                    <p className="text-lg text-[#808080] font-medium">Прогресс по ключевым упражнениям</p>
                                </div>
                                
                            <div className="flex flex-col md:flex-row items-center gap-4 scale-90 origin-right relative z-50">
                                <MetricSelector metrics={metrics} />
                            </div>
                            </div>

                            <div className="h-100 w-full mt-5">
                                {isChartLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-[#064592] rounded-full animate-spin"></div>
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ProgressChart data={chartData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full border border-dashed border-gray-200 rounded-3xl">
                                        <p className="text-[#064592]/60 font-medium text-2xl text-center">Недостаточно данных для построения графика (нужно минимум 3 записи)</p>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    </section>

                    {/* СЕКЦИЯ: Рекомендации */}
                    <section className="w-full">
                        <div className='p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl shadow-blue-900/5'>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-[#064592] uppercase tracking-[0.02em]">Зоны роста</h3>
                                    <p className="text-lg text-[#808080] font-medium">Интеллектуальные рекомендации по развитию</p>
                                </div>
                            </div>

                            <div className="w-full mt-5 space-y-6">
                                {isRecLoading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064592]"></div>
                                    </div>
                                ) : recommendations.length > 0 ? (
                                    recommendations.map((rec, index) => (
                                        <div key={index} className="
                                        group relative p-8 
                                        bg-white/70 backdrop-blur-xl
                                        rounded-4xl border border-white/40
                                        shadow-sm hover:shadow-xl hover:-translate-y-1
                                        transition-all duration-300
                                        ">

                                            <div className="grid grid-cols-[auto_1fr] gap-6 items-start">

                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-2xl font-black text-[#064592]">
                                                            {rec.name}
                                                        </h4>

                                                        <span className="px-3 py-1 bg-blue-100  text-[#064592] text-xs font-bold rounded-full">
                                                            Потенциал роста
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-500 text-lg mb-4">
                                                        Показатели можно улучшить. План действий:
                                                    </p>

                                                    <div className="relative p-5 bg-[#064592]/5 rounded-2xl border border-[#064592]/10">
                                                        <p className="text-[#064592] font-medium text-lg italic">
                                                            {rec.recommendation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 border border-dashed border-gray-200 rounded-3xl text-center text-gray-400">
                                        Данные для рекомендаций появятся после сдачи нескольких нормативов
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            ) : (
                /* Состояние, если ребенок не привязан */
                <div className="text-center p-20 bg-white/60 backdrop-blur-md rounded-4xl shadow-lg border border-white/40">
                    <p className="pb-10 text-2xl text-blue-900/40 font-medium italic">У вас пока нет привязанных детей или ребенок не выбран.</p>
                    <button 
                        className="px-5 py-3 bg-[#064592] cursor-pointer rounded-xl text-white text-2xl hover:bg-[#41479B] shadow-md hover:shadow-lg transition-all" 
                        onClick={() => setIsModalOpen(true)}
                    >
                        Привязать первого ребенка
                    </button>
                </div>
            )}

            {/* Модальное окно */}
            <AddChildModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchChildren} 
            />
        </div>
    );
}