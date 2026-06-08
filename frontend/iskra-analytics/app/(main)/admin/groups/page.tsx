'use client'

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { groupService } from "@/app/components/services/groupService";
import { Pagination } from "@/app/components/UI/Pagination";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { ActivitySelector } from "@/app/components/UI/ActivitySelector";
import { GroupRow } from "@/app/components/UI/GroupRow"; 
import { GroupDataModal } from "@/app/components/UI/GroupDataModal";

const SORT_OPTIONS = [
    { id: 'name', name: 'По названию группы' },
    { id: 'coach', name: 'По тренеру' }
];

// 1. Главный компонент-обертка
export default function GroupsPage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-10">Загрузка панели...</div>}>
            <GroupsContent />
        </Suspense>
    );
}

// 2. Весь ваш функционал выносим сюда
function GroupsContent() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [groupData, setGroupData] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Извлекаем значения
    const search = searchParams.get('search') || "";
    const sortId = searchParams.get('sortId') || "name";
    const isDescending = searchParams.get('isDescending') === 'true';
    const page = Number(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter') || "active"; 

    const loadGroups = async () => {
        try {
            setIsLoading(true);
            const response = await groupService.findGroups({
                search, sortId, isDescending, page, pageSize: 6, filter
            });
            setGroupData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Зависимости от конкретных значений, а не от всего объекта searchParams
    useEffect(() => {
        loadGroups();
    }, [search, sortId, isDescending, page, filter]);

    return (
        <div className="px-4 py-6 md:px-0">            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand">Панель групп</h1>
            <div className="mt-6 md:mt-10 p-4 sm:p-6 md:p-8 bg-brand rounded-3xl md:rounded-4xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                    <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none">
                            <SearchInput />
                        </div>
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer flex items-center justify-center shrink-0 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 text-brand hover:scale-105 transition-transform"
                            title="Добавить группу"
                        >
                            <Plus size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                        <ActivitySelector />
                        <SortSelector sorts={SORT_OPTIONS} />
                        <SortToggle />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        groupData?.groups.map((group: any) => (
                            <GroupRow key={group.id} group={group} onRefresh={loadGroups} />
                        ))
                    )}
                    
                    {!isLoading && groupData?.groups.length === 0 && (
                        <div className="text-white text-center text-xl py-10 font-medium">Группы не найдены</div>
                    )}
                </div>

                <div className="flex justify-center mt-6 md:mt-8 overflow-x-auto w-full">
                    <Pagination
                        totalPages={groupData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>

                <GroupDataModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    group={null}
                    onRefresh={loadGroups}
                    mode="create"
                />
            </div>
        </div>
    );
}