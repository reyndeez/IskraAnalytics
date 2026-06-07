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
                console.error("Ошибка при загрузке групп:", err);
            } finally {
                setLoading(false);
            }
        };
        loadGroupsData();
    }, []);

    if (loading) {
        return <div className="p-8 pt-48 text-brand/60 font-medium text-center text-2xl">Загрузка групп...</div>;
    }

    return (
        <div className="p-8 pt-48 px-[10%] md:px-[15%] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 ">
                <span>
                    <h1 className="text-6xl font-bold text-brand">Список групп</h1>
                    <p className="text-brand/60 text-4xl mt-2 font-medium">
                        Полный состав команд и информация об участниках
                    </p>
                </span>
            </div>     

            <div className="flex flex-col gap-4 w-full">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <GroupAccordion key={group.id} group={group} />
                    ))
                ) : (
                    <div className="text-gray-500 text-2xl text-center p-10 italic bg-white rounded-4xl shadow-sm">
                        У вас пока нет назначенных групп
                    </div>
                )}
            </div>
        </div>
    );
}