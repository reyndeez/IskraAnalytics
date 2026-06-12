'use client'

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Users } from "lucide-react";
import { groupService } from "../services/groupService";
import { UserService } from "../services/userService";
import { RoleService } from "../services/roleService";
import { ChevronIcon } from "./Icons";

interface GroupDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    group?: any;
    onRefresh: () => void;
    mode: 'create' | 'edit';
}

export function GroupDataModal({ isOpen, onClose, group, onRefresh, mode }: GroupDataModalProps) {
    const [name, setName] = useState("");
    const [coachId, setCoachId] = useState("");
    const [coaches, setCoaches] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const selectRef = useRef<HTMLDivElement>(null);

    // 1. Загрузка списка тренеров
    useEffect(() => {
        const loadCoaches = async () => {
            try {
                const roles = await RoleService.getAllRoles();
                const coachRole = roles.find((r: any) => r.name === 'Coach');
                
                if (coachRole) {
                    const response = await UserService.findUsers({ 
                        roleId: coachRole.id,
                        pageSize: 100,
                        page: 1,
                        isDescending: false
                    });
                    setCoaches(response.users || []);
                } else {
                    console.warn("Роль 'Coach' не найдена в системе");
                }
            } catch (error) {
                console.error("Не удалось загрузить тренеров", error);
            }
        };

        if (isOpen) {
            loadCoaches();
        }
    }, [isOpen]);

    // 2. Синхронизация данных (Исправлено: теперь берем id тренера из пришедшего объекта group)
    useEffect(() => {
        setMounted(true);
        if (isOpen && mode === 'edit' && group) {
            setName(group.name || "");
            // Проверяем как прямую ссылку на id, так и вложенный объект, если бэк отдал структуру иначе
            setCoachId(group.coachId || group.coach?.id || "");
        } else if (isOpen && mode === 'create') {
            setName("");
            setCoachId(""); // При создании изначально пусто, сработает плейсхолдер "Выберите тренера"
        }
    }, [isOpen, group, mode]);

    // Закрытие кастомного селектора при клике вовне
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Укажите название группы");
        if (!coachId) return alert("Пожалуйста, выберите тренера для группы");

        setIsSubmitting(true);
        try {
            const payload = { 
                name: name.trim(), 
                coachId 
            };

            if (mode === 'create') {
                await groupService.createGroup(payload);
            } else {
                await groupService.updateGroup(group.id, payload);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.message || "Ошибка при сохранении группы");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCoach = coaches.find(c => c.id === coachId);
    const selectedCoachName = selectedCoach 
        ? `${selectedCoach.firstName} ${selectedCoach.lastName}` 
        : "Выберите тренера *";

    return createPortal(
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={onClose}>
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                
                {/* Шапка модалки */}
                <div className="bg-brand p-8 text-white relative shrink-0">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer">
                        <X size={32} />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-3xl">
                            <Users size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">
                                {mode === 'create' ? 'Создание группы' : 'Редактирование'}
                            </h2>
                            <p className="text-white/80 text-xl">Настройка параметров учебной группы</p>
                        </div>
                    </div>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto flex-1">
                    
                    {/* Поле: Название */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Название группы *</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand"
                            placeholder="Например, Искра льда"
                            required
                        />
                    </div>

                    {/* Поле: Кастомный селектор тренеров */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Назначить тренера *</label>
                        
                        <div className="relative" ref={selectRef}>
                            <button
                                type="button"
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className={`cursor-pointer flex items-center justify-between gap-4 w-full bg-white border rounded-2xl px-6 py-4 text-xl font-medium shadow-sm hover:bg-gray-50 transition-colors ${
                                    coachId ? 'text-gray-900 border-gray-200' : 'text-gray-400 border-brand/20'
                                }`}
                            >
                                <span>{selectedCoachName}</span>
                                <ChevronIcon isOpen={isSelectOpen} className="w-6 h-6 text-brand" />
                            </button>

                            {isSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                                    {coaches.length === 0 ? (
                                        <div className="px-6 py-4 text-lg text-gray-400 italic">
                                            Загрузка списка тренеров...
                                        </div>
                                    ) : (
                                        coaches.map((coach) => {
                                            const fullName = `${coach.firstName} ${coach.lastName}`;
                                            return (
                                                <div
                                                    key={coach.id}
                                                    onClick={() => {
                                                        setCoachId(coach.id);
                                                        setIsSelectOpen(false);
                                                    }}
                                                    className={`px-6 py-4 text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        coachId === coach.id ? 'bg-brand/10 text-brand font-medium' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {fullName}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Нижние кнопки */}
                    <div className="pt-4 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-xl shadow-brand/20"
                        >
                            {isSubmitting ? "Сохранение..." : mode === 'create' ? "Создать группу" : "Сохранить изменения"}
                        </button>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="w-full text-gray-400 text-2xl font-medium py-4 border rounded-2xl hover:text-brand transition-colors cursor-pointer"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}