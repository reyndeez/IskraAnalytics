'use client'

import { useEffect, useState } from "react";
import { groupService } from "@/app/components/services/groupService";
import { GroupWithStudentsResponse } from "@/app/models/responses/GroupWithStudentsResponse";
import { GroupAccordion } from "@/app/components/UI/GroupComponents";

export default function MyGroupsPage() {
    const [groups, setGroups] = useState<GroupWithStudentsResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGroupsData = async () => {
            try {
                setLoading(true);
                const data = await groupService.getGroupsWithStudents();
                setGroups(data);
            } catch (err) {
                console.error("Ошибка при загрузке групп тренера:", err);
            } finally {
                setLoading(false);
            }
        };
        loadGroupsData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 pt-48 text-brand/60 font-medium text-center text-2xl animate-pulse">
                Загрузка закрепленных групп...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    {/* Исправленные адаптивные размеры шрифтов */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">Список групп</h1>
                    <p className="text-brand/60 text-xl sm:text-2xl md:text-3xl mt-2 font-medium">
                        Полный состав команд и информация об участниках
                    </p>
                </div>
            </div>     

            <div className="flex flex-col gap-4 w-full">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <GroupAccordion key={group.id} group={group} />
                    ))
                ) : (
                    <div className="text-brand/40 text-xl md:text-2xl text-center p-10 italic bg-white border-2 border-brand/5 rounded-3xl md:rounded-4xl shadow-sm font-medium">
                        У вас пока нет назначенных тренировочных групп
                    </div>
                )}
            </div>
        </div>
    );
}