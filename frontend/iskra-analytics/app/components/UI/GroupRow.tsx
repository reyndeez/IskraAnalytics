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

    // Удаление (архивация) группы
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

    // Восстановление группы из архива
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
        <div className="flex flex-row justify-between gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between rounded-2xl bg-white py-4 px-6 gap-6 w-[90%]">
                {/* Левая часть */}
                <div className="flex items-start font-semibold text-2xl gap-4">
                    <span className="text-black">{group.name}</span>
                </div>
                {/* Правая часть */}
                <div className="flex items-center gap-6">
                    <span className="text-2xl font-semibold text-brand">
                        {group.coach?.fullName ? `${group.coach.fullName}` : 'Тренер не назначен'}
                    </span>
                    {/* Теперь "Активна" красится в text-green, как у метрик */}
                    <span className={`text-2xl font-semibold ${group.isActive ? 'text-green' : 'text-slate-400'}`}>
                        {group.isActive ? 'Активна' : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия (Удалить / Восстановить) */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center"
                onClick={() => group.isActive ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={group.isActive ? "Архивировать группу" : "Восстановить группу"}
            >
                {group.isActive ? <Trash2 size={24} /> : <RotateCcw size={24} />}
            </button>

            {/* Кнопка Редактирования */}
            <button 
                className="cursor-pointer rounded-2xl bg-white p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center"
                onClick={() => setIsEditOpen(true)}
                title="Редактировать"
            >
                <Pencil size={24} />
            </button>

            {/* Модалка подтверждения удаления (в архив) */}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Архивировать группу?"
                message={`Вы уверены, что хотите перенести группу "${group.name}" в архив?`}
            />

            {/* Модалка подтверждения восстановления из архива */}
            <RestoreConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestore}
                title="Восстановить группу?"
                itemName={group.name}
            />

            {/* Модалка изменения данных */}
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