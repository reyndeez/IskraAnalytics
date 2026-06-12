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
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between items-center rounded-2xl bg-white py-3 sm:py-4 px-4 sm:px-6 gap-4 flex-1 shadow-sm min-w-0">
                {/* Левая часть */}
                <div className="flex items-center font-semibold text-lg sm:text-2xl min-w-0">
                    <span className="text-black truncate">{metric.name}</span>
                </div>
                {/* Правая часть */}
                <div className="flex items-center shrink-0">
                    <span className={`text-sm sm:text-2xl font-semibold ${metric.isActive ? 'text-green' : 'text-slate-400'}`}>
                        {metric.isActive ? 'Активна' : 'В архиве'}
                    </span>
                </div>
            </div>            
            
            {/* Кнопка Действия */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => metric.isActive ? setIsDeleteConfirmOpen(true) : setIsRestoreConfirmOpen(true)}
                title={metric.isActive ? "Архивировать метрику" : "Восстановить метрику"}
            >
                {metric.isActive ? <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Кнопка Редактирования */}
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => setIsEditOpen(true)}
                title="Редактировать"
            >
                <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Модалки подтверждения действий */}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Архивировать метрику?"
                message={`Вы уверены, что хотите перенести метрику "${metric.name}" в архив?`}
            />

            <RestoreConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestore}
                title="Восстановление метрики"
                itemName={metric.name}
            />
            
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