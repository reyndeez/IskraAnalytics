'use client'

import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { metricService } from "../services/metricService";
import { ConfirmModal } from "./ConfirmModal";
import { MetricDataModal } from "./MetricDataModal";
import { RestoreConfirmModal } from "./RestoreComfirmModal";

interface MetricRowProps {
    metric: {
        id: string;
        name: string;
        isActive: boolean;
        description?: string;
        recommendation?: string;
        unit?: string;
    };
    onRefresh: () => void;
}

export function MetricRow({ metric, onRefresh }: MetricRowProps) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Удаление (архивация) метрики
    const handleDelete = async () => {
        try {
            await metricService.deleteMetric(metric.id);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при архивации метрики");
        } finally {
            setIsDeleteConfirmOpen(false);
        }
    };

    // Восстановление метрики из архива
    const handleRestore = async () => {
        try {
            await metricService.restoreMetric(metric.id);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Ошибка при восстановлении метрики");
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
                    <span className="text-black">{metric.name}</span>
                </div>
                {/* Правая часть */}
                <div className="flex items-end">
                    <span className={`text-2xl font-semibold ${metric.isActive ? 'text-green' : 'text-slate-400'}`}>
                        {metric.isActive ? 'Активна' : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center"
                onClick={() => metric.isActive ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={metric.isActive ? "Архивировать метрику" : "Восстановить метрику"}
            >
                {metric.isActive ? <Trash2 size={24} /> : <RotateCcw size={24} />}
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
                title="Архивировать метрику?"
                message={`Вы уверены, что хотите перенести метрику "${metric.name}" в архив?`}
            />

            {/* Модалка подтверждения восстановления из архива */}
            <RestoreConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestore}
                title="Восстановление метрики"
                itemName={metric.name}
            />
            
            {/* Модалка изменения данных */}
            <MetricDataModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                metric={metric}
                onRefresh={onRefresh}
                mode="edit"
            />
        </div>
    );
}