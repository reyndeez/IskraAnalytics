'use client'

import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { studentService } from "../services/studentService";
import { ConfirmModal } from "./ConfirmModal";
import { StudentDataModal } from "./StudentDataModal";
import { RestoreConfirmModal } from "./RestoreComfirmModal"; 

interface StudentRowProps {
    metric?: any; 
    student: {
        id: string;
        firstName: string;
        lastName: string;
        patronymic?: string;
        groupName?: string;
        isActive: boolean; 
    };
    onRefresh: () => void;
}

export function StudentRow({ student, onRefresh }: StudentRowProps) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await studentService.deleteStudent(student.id);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при архивации воспитанника");
        } finally {
            setIsDeleteConfirmOpen(false);
        }
    };

    const handleRestore = async () => {
        try {
            await studentService.restoreStudent(student.id); 
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при восстановлении воспитанника");
        } finally {
            setIsRestoreConfirmOpen(false);
        }
    };

    // Формируем сокращенный вариант для мобилок: Иванов И. П.
    const initialInitials = `${student.lastName} ${student.firstName.charAt(0)}.${
        student.patronymic ? ` ${student.patronymic.charAt(0)}.` : ""
    }`;

    return (
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between items-center rounded-2xl bg-white py-3 sm:py-4 px-4 sm:px-6 gap-4 flex-1 shadow-sm min-w-0">
                
                {/* Левая часть: ФИО с адаптивным отображением под экраны */}
                <div className="flex items-center font-semibold text-lg sm:text-2xl min-w-0 flex-1">
                    {/* Вариант для мобильных: Фамилия И. О. */}
                    <span className="inline sm:hidden text-brand truncate">
                        {initialInitials}
                    </span>

                    {/* Вариант для десктопов: Полное имя */}
                    <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-black truncate shrink-0">{student.firstName}</span>
                        <span className="text-brand truncate">
                            {student.lastName} {student.patronymic}
                        </span>
                    </div>
                </div>
                
                {/* Правая часть: Группа */}
                <div className="hidden md:flex items-center shrink-0 ml-auto">
                    <span className={`text-sm sm:text-2xl font-semibold ${student.isActive !== false ? 'text-brand' : 'text-slate-400'}`}>
                        {student.isActive !== false ? (student.groupName || "Без группы") : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия (Удалить / Восстановить) */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => student.isActive !== false ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={student.isActive !== false ? "Архивировать воспитанника" : "Восстановить воспитанника"}
            >
                {student.isActive !== false ? <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Кнопка Редактирования */}
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => setIsEditOpen(true)}
                title="Редактировать"
            >
                <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Модалки */}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Архивировать воспитанника?"
                message={`Вы уверены, что хотите перенести воспитанника "${student.firstName} ${student.lastName}" в архив?`}
            />

            <RestoreConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestore}
                title="Восстановление воспитанника"
                itemName={`${student.firstName} ${student.lastName}`}
            />
            
            <StudentDataModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                student={student}
                onRefresh={onRefresh}
                mode="edit"
            />
        </div>
    );
}