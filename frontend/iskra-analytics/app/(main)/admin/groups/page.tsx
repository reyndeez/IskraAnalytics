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
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const SORT_OPTIONS = [
    { id: 'name', name: 'По названию группы' },
    { id: 'coach', name: 'По тренеру' }
];

export default function GroupsPage() {
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
        <div className="px-4 py-6 md:px-0">            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand">Панель групп</h1>
            <div className="mt-6 md:mt-10 p-4 sm:p-6 md:p-8 bg-brand rounded-3xl md:rounded-4xl">
                {/* Адаптивная панель фильтров */}
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                    {/* Левая часть: Поиск и кнопка создания */}
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
                    {/* Правая часть: Селекторы и сортировка */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                        <div className="flex-1 min-w-32.5 lg:flex-none">
                            <ActivitySelector />
                        </div>
                        <div className="flex-1 min-w-37.5 lg:flex-none">
                            <SortSelector sorts={SORT_OPTIONS} />                        
                        </div>
                        <div className="shrink-0">
                            <SortToggle />
                        </div>
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

                {/* Блок пагинации */}
                <div className="flex justify-center mt-6 md:mt-8 overflow-x-auto w-full">
                    <Pagination
                        totalPages={groupData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>

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