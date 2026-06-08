'use client'

import { studentService } from "@/app/components/services/studentService";
import { Pagination } from "@/app/components/UI/Pagination";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { ActivitySelector } from "@/app/components/UI/ActivitySelector"; 
import { StudentRow } from "@/app/components/UI/StudentRow";
import { StudentDataModal } from "@/app/components/UI/StudentDataModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Plus } from "lucide-react";

const SORT_OPTIONS = [
    { id: 'name', name: 'По имени воспитанника' },
    { id: 'group', name: 'По группе' },
    { id: 'birthDate', name: 'По дате рождения' }
];
export default function StudentPage() {
    return(
    <Suspense fallback={<div className="text-white">Загрузка...</div>}>
        <StudentContent />
    </Suspense>
    );
}

function StudentContent() {
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const [studentData, setStudentData] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const search = searchParams.get('search') || "";
    const sortId = searchParams.get('sortId') || "name";
    const isDescending = searchParams.get('isDescending') === 'true';
    const page = Number(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter') || "active"; 

    const loadStudents = async () => {
        try {
            setIsLoading(true);
            const response = await studentService.findStudents({
                search,
                sortId,
                isDescending,
                page,
                pageSize: 6,
                filter 
            });
            setStudentData(response);
        } catch (error) {
            console.error("Ошибка при загрузке воспитанников:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [searchParams]);

    return (
        <div>            
            <h1 className="text-6xl font-bold text-brand">Панель воспитанников</h1>
            <div className="mt-10 p-8 bg-brand rounded-4xl">
                <div className="flex flex-row justify-between">
                    {/* Левая часть: Поиск и кнопка создания */}
                    <div className="flex items-center gap-6">
                        <SearchInput />
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer flex items-center justify-center rounded-2xl bg-white p-4 text-brand hover:scale-105 transition-transform"
                            title="Добавить воспитанника"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                    {/* Правая часть: Активность и сортировка */}
                    <div className="flex items-end gap-6">
                        <ActivitySelector />
                        <SortSelector sorts={SORT_OPTIONS} />                        
                        <SortToggle />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        studentData?.students?.map((student: any) => (
                            <StudentRow key={student.id} student={student} onRefresh={loadStudents} />
                        ))
                    )}
                    
                    {!isLoading && (!studentData?.students || studentData.students.length === 0) && (
                        <div className="text-white text-center text-2xl py-10 font-medium">Воспитанники не найдены</div>
                    )}
                </div>

                {/* Блок пагинации */}
                <div className="flex justify-center mt-8">
                    <Pagination
                        totalPages={studentData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>

            {/* Модалка создания */}
            <StudentDataModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                student={null}
                onRefresh={loadStudents}
                mode="create"
            />
        </div>
    );
}