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
        <Suspense fallback={<div className="p-4 sm:p-8 pt-32 md:pt-48 text-gray-500 font-medium text-center">Загрузка интерфейса...</div>}>
            <ProgressContent />
        </Suspense>
    );
}

function ProgressContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

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

    const fetchAnalytics = async (id: string) => {
        setIsRecLoading(true);
        try {
            const recData = await analyticService.getRecommendations(id);
            setRecommendations(recData);

            const ratingData = await analyticService.getRatingOverall(id);
            setOverallRating(ratingData);
        } catch (err) {
            console.error("Ошибка при загрузке аналитики:", err);
        } finally {
            setIsRecLoading(false);
        }
    };

    const fetchChartData = async (id: string, metricId: string) => {
        setIsChartLoading(true);
        try {
            const data = await analyticService.getChartData(id, metricId);
            setChartData(data);
        } catch (err) {
            console.error(err);
            setChartData([]);
        } finally {
            setIsChartLoading(false);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                const [childrenData, metricsData] = await Promise.all([
                    studentService.getChildren(),
                    metricService.getMetricsForSelector()
                ]);

                setChildren(childrenData);
                setMetrics(metricsData);

                const currentParams = new URLSearchParams(window.location.search);
                let shouldUpdateUrl = false;

                if (!currentParams.get('studentId') && childrenData.length > 0) {
                    currentParams.set('studentId', childrenData[0].id.toString());
                    shouldUpdateUrl = true;
                }

                if (!currentParams.get('metricId') && metricsData.length > 0) {
                    currentParams.set('metricId', metricsData[0].id);
                    shouldUpdateUrl = true;
                }

                if (currentParams.get('addClick') === 'true') {
                    setIsModalOpen(true);          
                    currentParams.delete('addClick'); 
                    shouldUpdateUrl = true;
                }

                if (shouldUpdateUrl) {
                    router.replace(`?${currentParams.toString()}`, { scroll: false });
                }
            } catch (err) {
                console.error("Ошибка при инициализации страницы прогресса:", err);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchAnalytics(studentId);
        }
    }, [studentId]);

    useEffect(() => {
        if (studentId && activeMetricId) {
            fetchChartData(studentId, activeMetricId);
        }
    }, [studentId, activeMetricId]);

    return (
        <div className="p-4 sm:p-8 pt-28 md:pt-48 px-4 sm:px-[10%] md:px-[15%] mx-auto">
            {/* Заголовок страницы */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-brand">Прогресс</h1>
                    <p className="text-brand/60 text-lg sm:text-2xl md:text-4xl font-medium leading-tight mt-2">Мониторинг личных достижений спортсмена</p>
                </div>
                <div className="w-full md:w-auto">
                    <ChildSwitcher childrenList={children} />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white/40 backdrop-blur-md rounded-3xl md:rounded-4xl border border-white/40">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-brand font-semibold text-sm sm:text-base">Загружаем данные профиля...</p>
                </div>
            ) : studentId ? (
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* КАРТОЧКИ */}
                    <section>
                        {(() => {
                            const currentStudent = children.find(c => c.id.toString() === studentId);                
                            return (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">                        
                                    {/* Карточка спортсмена */}
                                    <div className="p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-3xl md:rounded-4xl border border-white/40 shadow-xl shadow-blue-900/5 flex flex-col justify-between min-h-60 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
                                        <div className="flex justify-between items-center mb-6">
                                            <p className="text-lg md:text-xl font-extrabold text-brand uppercase tracking-wider">Карточка спортсмена</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="bg-brand text-white w-24 h-24 md:w-28 md:h-28 rounded-3xl md:rounded-4xl flex items-center justify-center text-3xl md:text-4xl font-black shadow-xl shadow-blue-200 uppercase">
                                                    {currentStudent?.firstName[0]}
                                                </div>
                                                <div className="mt-3 md:mt-4 px-3 py-1 md:px-4 md:py-1.5 bg-brand rounded-xl shadow-lg shadow-blue-100 max-w-full">
                                                    <p className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {currentStudent ? t('ampluas', currentStudent.amplua) : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2 w-full">
                                                <div>
                                                    <p className="text-lg md:text-xl font-medium text-gray-400 md:-mb-1">{currentStudent?.lastName}</p>
                                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight wrap-break-word">
                                                        <span className="text-brand">{currentStudent?.firstName}</span>
                                                    </h2>
                                                </div>
                                                <div className="flex flex-col items-center sm:items-start gap-1 pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-brand shrink-0"></div>
                                                        <p className="text-lg md:text-xl font-bold text-gray-700 leading-tight">{currentStudent?.groupName || '—'}</p>
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest sm:pl-4">Группа обучения</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Текущий статус */}
                                    <div className="p-6 md:p-10 bg-linear-to-br from-brand to-[#04346e] rounded-3xl md:rounded-4xl shadow-2xl shadow-blue-100 flex flex-col justify-between text-white relative overflow-hidden min-h-60 sm:min-h-0">
                                        {(() => {
                                            const myRating = overallRating.find(r => r.isSelectedChild);
                                            return (
                                                <>
                                                    <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 text-8xl md:text-[200px] font-black opacity-10 italic select-none pointer-events-none">
                                                        #{myRating?.rank || '?'}
                                                    </div>
                                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                                        <p className="text-lg md:text-xl font-extrabold text-blue-200 uppercase tracking-wider">Текущий статус</p>
                                                        <div className="flex items-baseline flex-wrap gap-3 md:gap-4 mt-6">
                                                            <span className="text-6xl md:text-8xl font-black italic tracking-tighter">
                                                                #{myRating?.rank || '—'}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className="text-xl md:text-2xl text-blue-200 font-medium">в группе</span>
                                                                <span className="text-xs md:text-sm text-blue-300">{myRating?.score} баллов</span>
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
                    
                    {/* ГРАФИКИ */}
                    <section className="w-full">
                        <div className="p-4 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl md:rounded-4xl border border-white/40 shadow-xl shadow-blue-900/5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-extrabold text-brand uppercase tracking-wider">Динамика показателей</h3>
                                    <p className="text-base md:text-lg text-muted font-medium">Прогресс по ключевым упражнениям</p>
                                </div>
                                <div className="w-full md:w-auto scale-95 md:scale-90 md:origin-right relative z-40">
                                    <MetricSelector metrics={metrics} />
                                </div>
                            </div>
                            <div className="h-64 md:h-100 w-full mt-5">
                                {isChartLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-brand rounded-full animate-spin"></div>
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ProgressChart data={chartData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full border border-dashed border-gray-200 rounded-2xl md:rounded-3xl p-4">
                                        <p className="text-brand/60 font-medium text-lg md:text-2xl text-center">Недостаточно данных для графика (нужно минимум 3 записи)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* РЕКОМЕНДАЦИИ */}
                    <section className="w-full">
                        <div className="p-4 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl md:rounded-4xl border border-white/40 shadow-xl shadow-blue-900/5">
                            <div className="mb-6 md:mb-10">
                                <h3 className="text-lg md:text-xl font-extrabold text-brand uppercase tracking-wider">Зоны роста</h3>
                                <p className="text-base md:text-lg text-muted font-medium">Интеллектуальные рекомендации по развитию</p>
                            </div>
                            <div className="w-full mt-5 space-y-4 md:space-y-6">
                                {isRecLoading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                                    </div>
                                ) : recommendations.length > 0 ? (
                                    recommendations.map((rec, index) => (
                                        <div key={index} className="group relative p-5 md:p-8 bg-white/70 backdrop-blur-xl rounded-3xl md:rounded-4xl border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                                    <h4 className="text-xl md:text-2xl font-black text-brand wrap-break-word">{rec.name}</h4>
                                                    <span className="px-2.5 py-0.5 bg-blue-100 text-brand text-xs font-bold rounded-full whitespace-nowrap">Потенциал роста</span>
                                                </div>
                                                <p className="text-gray-500 text-sm md:text-lg mb-3">Показатели можно улучшить. План действий:</p>
                                                <div className="relative p-4 md:p-5 bg-brand/5 rounded-xl md:rounded-2xl border border-brand/10">
                                                    <p className="text-brand font-medium text-base md:text-lg italic leading-relaxed">{rec.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 border border-dashed border-gray-200 rounded-2xl md:rounded-3xl text-center text-gray-400 text-sm md:text-base">
                                        Данные появятся после сдачи нескольких нормативов
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="text-center p-8 md:p-20 bg-white/60 backdrop-blur-md rounded-3xl md:rounded-4xl shadow-lg border border-white/40">
                    <p className="pb-6 md:pb-10 text-xl md:text-2xl text-blue-900/40 font-medium italic leading-snug">У вас пока нет привязанных детей или ребенок не выбран.</p>
                    <button 
                        className="w-full md:w-auto px-5 py-3.5 bg-brand cursor-pointer rounded-xl text-white text-lg md:text-2xl hover:bg-[#41479B] shadow-md hover:shadow-lg transition-all" 
                        onClick={() => setIsModalOpen(true)}
                    >
                        Привязать первого ребенка
                    </button>
                </div>
            )}

            <AddChildModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => window.location.reload()} 
            />
        </div>
    );
}