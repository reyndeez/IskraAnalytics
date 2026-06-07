'use client'

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, BarChart3, FileText, Activity, HelpCircle } from "lucide-react";
import { metricService } from "../services/metricService";
import { ChevronIcon } from "./Icons";
import { TRANSLATIONS, UNIT_TO_NUM_MAP, NUM_TO_UNIT_MAP } from "../utils/dictionaries";

interface MetricDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    metric: any | null; 
    onRefresh: () => void;
    mode: 'create' | 'edit';
}

export function MetricDataModal({ isOpen, onClose, metric, onRefresh, mode }: MetricDataModalProps) {
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("Seconds");
    const [isAscending, setIsAscending] = useState(true);
    const [description, setDescription] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        if (isOpen && mode === 'edit' && metric) {
            setName(metric.name || "");
            
            const incomingUnit = metric.unit;
            if (typeof incomingUnit === 'number') {
                setUnit(NUM_TO_UNIT_MAP[incomingUnit] || "Seconds");
            } else {
                setUnit(incomingUnit || "Seconds");
            }

            setIsAscending(metric.isAscending ?? true);
            setDescription(metric.description || "");
            setRecommendation(metric.recommendation || "");
        } else if (isOpen && mode === 'create') {
            setName("");
            setUnit("Seconds");
            setIsAscending(true);
            setDescription("");
            setRecommendation("");
        }
    }, [isOpen, metric, mode]);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Название не может быть пустым");

        setIsSaving(true);
        try {
            const payload = {
                name,
                // Используем импортированный маппинг — на бэк летит число!
                unit: UNIT_TO_NUM_MAP[unit] || 1, 
                isAscending,
                description: description.trim() || null,
                recommendation: recommendation.trim() || null
            };

            if (mode === 'create') {
                await metricService.createMetric(payload);
            } else {
                await metricService.updateMetric(metric.id, payload);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.message || "Ошибка при сохранении метрики");
        } finally {
            setIsSaving(false);
        }
    };

    const unitOptions = Object.keys(TRANSLATIONS.units);

    return createPortal(
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={onClose}>
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                
                <div className="bg-brand p-8 text-white relative shrink-0">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer">
                        <X size={32} />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-3xl">
                            <BarChart3 size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">
                                {mode === 'create' ? 'Создание метрики' : 'Редактирование'}
                            </h2>
                            <p className="text-white/80 text-xl">Настройка спортивных нормативов</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-10 space-y-6 overflow-y-auto flex-1">
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Название метрики *</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand"
                            placeholder="Например, Бег на 30 метров"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Единица измерения</label>
                        <div className="relative" ref={selectRef}>
                            <button
                                type="button"
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-xl font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <span>{TRANSLATIONS.units[unit] || "сек."}</span>
                                <ChevronIcon isOpen={isSelectOpen} className="w-6 h-6 text-brand" />
                            </button>

                            {isSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden max-h-60 overflow-y-auto">
                                    {unitOptions.map((u) => (
                                        <div
                                            key={u}
                                            onClick={() => {
                                                setUnit(u);
                                                setIsSelectOpen(false);
                                            }}
                                            className={`px-6 py-4 text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                                unit === u ? 'bg-brand/10 text-brand font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {TRANSLATIONS.units[u]}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <Activity size={24} /> Критерий лучшего результата
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAscending(true)}
                                className={`py-4 rounded-2xl text-lg font-bold border-2 transition-all cursor-pointer ${
                                    isAscending ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-gray-100'
                                }`}
                            >
                                Меньше — лучше (Время)
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAscending(false)}
                                className={`py-4 rounded-2xl text-lg font-bold border-2 transition-all cursor-pointer ${
                                    !isAscending ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-gray-100'
                                }`}
                            >
                                Больше — лучше (Повторения, См)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <FileText size={24} /> Описание выполнения
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand resize-none"
                            placeholder="Опишите технику выполнения теста..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <HelpCircle size={24} /> Рекомендации по развитию
                        </label>
                        <textarea 
                            value={recommendation}
                            onChange={(e) => setRecommendation(e.target.value)}
                            rows={3}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand resize-none"
                            placeholder="Советы по улучшению данного показателя..."
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-2xl cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? "Сохранение..." : mode === 'create' ? "Создать метрику" : "Сохранить изменения"}
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