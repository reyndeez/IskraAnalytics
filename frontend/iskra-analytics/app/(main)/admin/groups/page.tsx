'use client'

import { groupService } from "@/app/components/services/groupService";
import { Pagination } from "@/app/components/UI/Pagination";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { ActivitySelector } from "@/app/components/UI/ActivitySelector";
import { GroupRow } from "@/app/components/UI/GroupRow"; 
import { GroupDataModal } from "@/app/components/UI/GroupDataModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Plus } from "lucide-react";

const SORT_OPTIONS = [
    { id: 'name', name: 'По названию группы' },
    { id: 'coach', name: 'По тренеру' }
];

export default function GroupsPage() {
    return (
        <Suspense fallback={<div className="text-white text-xl p-4">Загрузка...</div>}>
            <GroupsContent />
        </Suspense>
    );
}

function GroupsContent() {
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const [groupData, setGroupData] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const search = searchParams.get('search') || "";
    const sortId = searchParams.get('sortId') || "name";
    const isDescending = searchParams.get('isDescending') === 'true';
    const page = Number(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter') || "active"; 

    const loadGroups = async () => {
        try {
            setIsLoading(true);
            const response = await groupService.findGroups({
                search,
                sortId,
                isDescending,
                page,
                pageSize: 6,
                filter
            });
            setGroupData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, [searchParams]);

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">            
            <h1 className="text-3xl sm:text-6xl font-bold text-brand leading-tight">Панель групп</h1>
            
            <div className="mt-6 sm:mt-10 p-4 sm:p-8 bg-brand rounded-4xl shadow-xl">
                {/* Панель фильтров */}
                <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
                    {/* Левая часть: Поиск и кнопка создания */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-initial">
                            <SearchInput />
                        </div>
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer flex items-center justify-center rounded-2xl bg-white p-3 sm:p-4 text-brand hover:scale-105 transition-transform shrink-0 shadow-md"
                            title="Добавить группу"
                        >
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                    
                    {/* Правая часть: Адаптивный перенос без overflow */}
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

                {/* Список групп */}
                <div className="mt-6 flex flex-col gap-3 sm:gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        groupData?.groups.map((group: any) => (
                            <GroupRow key={group.id} group={group} onRefresh={loadGroups} />
                        ))
                    )}
                    
                    {!isLoading && groupData?.groups.length === 0 && (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Группы не найдены</div>
                    )}
                </div>

                {/* Блок пагинации */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <Pagination
                        totalPages={groupData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>

            {/* Модалка создания группы */}
            <GroupDataModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                group={null}
                onRefresh={loadGroups}
                mode="create"
            />
        </div>
    );
}