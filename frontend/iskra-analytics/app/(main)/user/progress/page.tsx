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
    const isAddModalOpen = searchParams.get('addClick') === 'true';

    const [children, setChildren] = useState<StudentResponse[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);

    const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartDataResponse[]>([]);
    const [isChartLoading, setIsChartLoading] = useState(false);

    const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
    const [overallRating, setOverallRating] = useState<LeaderboardResponse[]>([]);
    const [isRecLoading, setIsRecLoading] = useState(false);

    const fetchAnalytics = async (id: string) => {
        setIsRecLoading(true);
        try {
            const recData = await analyticService.getRecommendations(id);
            const validRecs = (recData || []).filter((r: RecommendationResponse) => r && r.name && r.recommendation?.trim());
            setRecommendations(validRecs);

            const ratingData = await analyticService.getRatingOverall(id);
            setOverallRating(ratingData || []);
        } catch (err) {
            console.error("Ошибка при загрузке аналитики:", err);
            setRecommendations([]);
        } finally {
            setIsRecLoading(false);
        }
    };

    const fetchChartData = async (id: string, metricId: string) => {
        setIsChartLoading(true);
        try {
            const data = await analyticService.getChartData(id, metricId);
            setChartData(data || []);
        } catch (err) {
            console.error(err);
            setChartData([]);
        } finally {
            setIsChartLoading(false);
        }
    };

    // Первичная инициализация данных
    useEffect(() => {
        const initializePage = async () => {
            try {
                const [childrenData, metricsData] = await Promise.all([
                    studentService.getChildren(),
                    metricService.getMetricsForSelector()
                ]);

                const validChildren = childrenData || [];
                setChildren(validChildren);
                setMetrics(metricsData || []);

                const currentParams = new URLSearchParams(window.location.search);
                let shouldUpdateUrl = false;

                const savedStudentId = localStorage.getItem('selectedStudentId');
                let targetStudentId = currentParams.get('studentId');

                if (!targetStudentId && savedStudentId && validChildren.some((c: StudentResponse) => c.id.toString() === savedStudentId)) {
                    targetStudentId = savedStudentId;
                    currentParams.set('studentId', targetStudentId);
                    shouldUpdateUrl = true;
                } else if (!targetStudentId && validChildren.length > 0) {
                    targetStudentId = validChildren[0].id.toString();
                    currentParams.set('studentId', targetStudentId!);
                    shouldUpdateUrl = true;
                }

                if (targetStudentId) {
                    setActiveStudentId(targetStudentId);
                }

                if (!currentParams.get('metricId') && metricsData?.length > 0) {
                    currentParams.set('metricId', metricsData[0].id);
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
    }, [router]);

    useEffect(() => {
        if (studentId) {
            setActiveStudentId(studentId);
        }
    }, [studentId]);

    useEffect(() => {
        if (activeStudentId) {
            fetchAnalytics(activeStudentId);
        }
    }, [activeStudentId]);

    useEffect(() => {
        if (activeStudentId && activeMetricId) {
            fetchChartData(activeStudentId, activeMetricId);
        }
    }, [activeStudentId, activeMetricId]);

    const handleCloseModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('addClick');
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480">
            {/* Заголовок страницы */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-12">
                <div className="space-y-1 max-w-full wrap-break-word">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">Прогресс</h1>
                    <p className="text-xl sm:text-2xl md:text-4xl mt-2 font-medium text-brand/60">
                        Мониторинг личных достижений спортсмена
                    </p>
                </div>
                <div className="w-full lg:w-auto flex justify-start lg:justify-end">
                    <ChildSwitcher childrenList={children} />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white/40 backdrop-blur-md rounded-3xl md:rounded-4xl border border-white/40">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-brand font-semibold text-sm md:text-2xl">Загружаем данные профиля...</p>
                </div>
            ) : activeStudentId ? (
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* КАРТОЧКИ */}
                    <section>
                        {(() => {
                            const currentStudent = children.find(c => c.id.toString() === activeStudentId);                
                            return (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">                        
                                    {/* Карточка спортсмена */}
                                    <div className="p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-3xl md:rounded-4xl border border-white/40 shadow-xl shadow-blue-900/5 flex flex-col justify-between min-h-60 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm md:text-xl font-extrabold text-brand uppercase tracking-wider">Карточка спортсмена</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="bg-brand text-white w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl font-black shadow-xl shadow-blue-200 uppercase">
                                                    {currentStudent?.firstName?.[0] || '?' }
                                                </div>
                                                <div className="mt-3 px-3 py-1 bg-brand rounded-xl shadow-lg shadow-blue-100 max-w-40">
                                                    <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider block truncate">
                                                        {currentStudent ? t('ampluas', currentStudent.amplua) : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2 w-full min-w-0">
                                                <div className="wrap-break-word">
                                                    <p className="text-base md:text-2xl font-medium text-gray-400">{currentStudent?.lastName}</p>
                                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                                        <span className="text-brand">{currentStudent?.firstName}</span>
                                                    </h2>
                                                </div>
                                                <div className="flex flex-col items-center sm:items-start gap-1 pt-1">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-2 h-2 rounded-full bg-brand shrink-0"></div>
                                                        <p className="text-base md:text-lg font-bold text-gray-700 truncate">{currentStudent?.groupName || '—'}</p>
                                                    </div>
                                                    <p className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest sm:pl-4">Группа обучения</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Текущий статус */}
                                    <div className="p-6 md:p-8 bg-linear-to-br from-brand to-[#04346e] rounded-3xl md:rounded-4xl shadow-2xl shadow-blue-100 flex flex-col justify-between text-white relative overflow-hidden min-h-60">
                                        {(() => {
                                            const myRating = overallRating.find(r => r.isSelectedChild);
                                            return (
                                                <>
                                                    <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 text-7xl md:text-9xl font-black opacity-10 italic select-none pointer-events-none">
                                                        #{myRating?.rank || '?'}
                                                    </div>
                                                    <div className="relative z-10 h-full flex flex-col justify-between w-full">
                                                        <p className="text-sm md:text-base font-extrabold text-blue-200 uppercase tracking-wider">Текущий статус</p>
                                                        <div className="flex items-baseline flex-wrap gap-2 md:gap-3 mt-4">
                                                            <span className="text-5xl md:text-7xl font-black italic tracking-tighter">
                                                                #{myRating?.rank || '-'}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className="text-base md:text-xl text-blue-200 font-medium">в группе</span>
                                                                <span className="text-[11px] md:text-sm text-blue-300">{myRating?.score || 0} баллов</span>
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
                        <div className="p-4 md:p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-base md:text-2xl font-extrabold text-brand uppercase tracking-wider">Динамика показателей</h3>
                                    <p className="text-sm md:text-xl text-gray-500 font-medium">Прогресс по ключевым упражнениям</p>
                                </div>
                                <div className="w-full sm:w-auto relative z-30">
                                    <MetricSelector metrics={metrics} />
                                </div>
                            </div>
                            <div className="h-64 md:h-80 w-full mt-2">
                                {isChartLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-brand rounded-full animate-spin"></div>
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ProgressChart data={chartData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full border border-dashed border-gray-200 rounded-2xl p-4">
                                        <p className="text-brand/60 font-medium text-sm md:text-xl text-center">Недостаточно данных для построения графика (требуется от 3 замеров)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* РЕКОМЕНДАЦИИ (ЗОНЫ РОСТА) */}
                    <section className="w-full">
                        <div className="p-4 md:p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                            <div className="mb-4">
                                <h3 className="text-base md:text-2xl font-extrabold text-brand uppercase tracking-wider">Зоны роста</h3>
                                <p className="text-sm md:text-xl text-gray-500 font-medium">Интеллектуальные рекомендации по развитию</p>
                            </div>
                            <div className="w-full mt-4 space-y-4">
                                {isRecLoading ? (
                                    <div className="flex justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                                    </div>
                                ) : recommendations.length > 0 ? (
                                    recommendations.map((rec, index) => (
                                        <div key={index} className="group relative p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h4 className="text-lg md:text-xl font-black text-brand wrap-break-word max-w-full">{rec.name}</h4>
                                                    <span className="px-2.5 py-0.5 bg-blue-100 text-brand text-[10px] font-bold rounded-full whitespace-nowrap">Потенциал роста</span>
                                                </div>
                                                <p className="text-gray-400 text-xs md:text-sm mb-2">Рекомендация по улучшению показателей:</p>
                                                <div className="relative p-4 bg-brand/5 rounded-xl border border-brand/10">
                                                    <p className="text-brand font-medium text-sm md:text-base italic leading-relaxed whitespace-pre-line">{rec.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 border border-dashed border-gray-200 rounded-2xl text-center text-brand/60 text-sm md:text-xl font-medium">
                                        Спортсмен отлично справляется со всеми нормативами! Зоны роста появятся при обнаружении отстающих показателей.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="text-center p-6 md:p-16 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-white/40">
                    <p className="pb-6 text-lg md:text-xl text-blue-900/50 font-medium italic leading-snug">У вас пока нет привязанных детей или ребенок не выбран.</p>
                    <button 
                        className="w-full sm:w-auto px-6 py-3 bg-brand cursor-pointer rounded-xl text-white font-semibold text-base hover:bg-[#41479B] shadow-md transition-all" 
                        onClick={() => router.push('?addClick=true')}
                    >
                        Привязать первого ребенка
                    </button>
                </div>
            )}

            <AddChildModal 
                isOpen={isAddModalOpen} 
                onClose={handleCloseModal} 
                onSuccess={() => window.location.reload()} 
            />
        </div>
    );
}