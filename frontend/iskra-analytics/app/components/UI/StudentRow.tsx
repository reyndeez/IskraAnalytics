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

    return (
        <div className="flex flex-row justify-between gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between rounded-2xl bg-white py-4 px-6 gap-6 w-[90%]">
                {/* Левая часть */}
                <div className="flex items-start font-semibold text-2xl gap-4">
                    <span className="text-black">{student.firstName}</span>
                    <span className="text-brand">
                        {student.lastName} {student.patronymic}
                    </span>
                </div>
                {/* Правая часть: изменено на text-brand для активных групп */}
                <div className="flex items-end">
                    <span className={`text-2xl font-semibold ${student.isActive !== false ? 'text-brand' : 'text-slate-400'}`}>
                        {student.isActive !== false ? (student.groupName || "Без группы") : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия (Удалить / Восстановить) */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center"
                onClick={() => student.isActive !== false ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={student.isActive !== false ? "Архивировать воспитанника" : "Восстановить воспитанника"}
            >
                {student.isActive !== false ? <Trash2 size={24} /> : <RotateCcw size={24} />}
            </button>

            {/* Кнопка Редактирования */}
            <button 
                className="cursor-pointer rounded-2xl bg-white p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center"
                onClick={() => setIsEditOpen(true)}
                title="Редактировать"
            >
                <Pencil size={24} />
            </button>

            {/* Модалки подтверждения */}
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
            
            {/* Модалка изменения данных */}
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