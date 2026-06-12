'use client'

import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { groupService } from "../services/groupService";
import { ConfirmModal } from "./ConfirmModal";
import { GroupDataModal } from "./GroupDataModal";
import { RestoreConfirmModal } from "./RestoreComfirmModal";

interface GroupRowProps {
    group: {
        id: string;
        name: string;
        isActive: boolean;
        coach?: {
            id: string;
            fullName: string;
        };
    };
    onRefresh: () => void;
}

export function GroupRow({ group, onRefresh }: GroupRowProps) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await groupService.deleteGroup(group.id);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при архивации группы");
        } finally {
            setIsDeleteConfirmOpen(false);
        }
    };

    const handleRestore = async () => {
        try {
            if (typeof groupService.restoreGroup === 'function') {
                await groupService.restoreGroup(group.id);
            } else {
                await groupService.updateGroup(group.id, { isActive: true });
            }
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при восстановлении группы");
        } finally {
            setIsRestoreConfirmOpen(false);
        }
    };

    return (
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between items-center rounded-2xl bg-white py-3 sm:py-4 px-4 sm:px-6 gap-4 flex-1 shadow-sm min-w-0">
                {/* Левая часть */}
                <div className="flex flex-col sm:flex-row sm:items-center font-semibold text-base sm:text-2xl min-w-0 gap-1 sm:gap-4">
                    <span className="text-black truncate">{group.name}</span>
                    <span className="text-sm sm:text-xl font-medium text-slate-500 truncate">
                        {group.coach?.fullName ? `${group.coach.fullName}` : 'Без тренера'}
                    </span>
                </div>
                {/* Правая часть */}
                <div className="flex items-center shrink-0">
                    <span className={`text-sm sm:text-2xl font-semibold ${group.isActive ? 'text-green' : 'text-slate-400'}`}>
                        {group.isActive ? 'Активна' : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => group.isActive ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={group.isActive ? "Архивировать группу" : "Восстановить группу"}
            >
                {group.isActive ? <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />}
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
                title="Архивировать группу?"
                message={`Вы уверены, что хотите перенести группу "${group.name}" в архив?`}
            />

            <RestoreConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestore}
                title="Восстановить группу?"
                itemName={group.name}
            />

            <GroupDataModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                group={group}
                onRefresh={onRefresh}
                mode="edit"
            />
        </div>
    );
}