'use client'

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Calendar, Users, Shield } from "lucide-react";
import { groupService } from "../services/groupService";
import { studentService } from "../services/studentService";
import { TRANSLATIONS } from "../utils/dictionaries";
import { ChevronIcon } from "./Icons";

// Прямой маппинг для отправки на бэкенд (Строка -> Число)
const AMPLUA_TO_NUM_MAP: Record<string, number> = {
    'Goalkeeper': 1,
    'Forward': 2,
    'Defender': 3
};

// Обратный маппинг для безопасного распознавания данных с бэка (Число -> Строка)
const NUM_TO_AMPLUA_MAP: Record<number, string> = {
    1: 'Goalkeeper',
    2: 'Forward',
    3: 'Defender'
};

interface StudentDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    student?: any; 
    onRefresh: () => void;
    mode: 'create' | 'edit';
}

export function StudentDataModal({ isOpen, onClose, student, onRefresh, mode }: StudentDataModalProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [groupId, setGroupId] = useState("");
    const [amplua, setAmplua] = useState("Goalkeeper"); // Строковый ключ по умолчанию
    
    const [groups, setGroups] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Состояния для дропдаунов
    const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false);
    const [isAmpluaSelectOpen, setIsAmpluaSelectOpen] = useState(false);

    const groupSelectRef = useRef<HTMLDivElement>(null);
    const ampluaSelectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Загрузка групп
    useEffect(() => {
        if (isOpen) {
            const loadGroups = async () => {
                try {
                    const data = await groupService.getAllActiveGroups();
                    setGroups(data);
                } catch (error) {
                    console.error("Ошибка загрузки групп в модалку:", error);
                }
            };
            loadGroups();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && mode === 'edit' && student) {
            setFirstName(student.firstName || "");
            setLastName(student.lastName || "");
            setPatronymic(student.patronymic || ""); // Отчество гарантированно строка
            
            setBirthDate(student.birthDate ? student.birthDate.split('T')[0] : "");
            
            // Берем groupId напрямую или из вложенного объекта группы
            setGroupId(student.groupId || student.group?.id || "");
            
            const incomingAmplua = student.amplua;
            if (typeof incomingAmplua === 'number') {
                setAmplua(NUM_TO_AMPLUA_MAP[incomingAmplua] || "Goalkeeper");
            } else {
                setAmplua(incomingAmplua || "Goalkeeper");
            }
        } else if (isOpen && mode === 'create') {
            setFirstName("");
            setLastName("");
            setPatronymic("");
            setBirthDate(""); 
            setGroupId("");
            setAmplua("Goalkeeper");
        }
    }, [isOpen, student, mode]);

    // Закрытие дропдаунов по клику снаружи
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (groupSelectRef.current && !groupSelectRef.current.contains(target)) {
                setIsGroupSelectOpen(false);
            }
            if (ampluaSelectRef.current && !ampluaSelectRef.current.contains(target)) {
                setIsAmpluaSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Строгая валидация
        if (!lastName.trim()) return alert("Поле 'Фамилия' обязательно для заполнения");
        if (!firstName.trim()) return alert("Поле 'Имя' обязательно для заполнения");
        if (!patronymic.trim()) return alert("Поле 'Отчество' обязательно для заполнения");
        if (!birthDate) return alert("Пожалуйста, укажите дату рождения");
        if (!groupId || groupId.trim() === "") return alert("Пожалуйста, выберите группу для воспитанника");

        setIsSubmitting(true);
        try {
            const payload = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                patronymic: patronymic.trim(),
                
                birthDate: birthDate ? new Date(birthDate).toISOString() : new Date().toISOString(), 
                
                amplua: AMPLUA_TO_NUM_MAP[amplua] || 1,
            
                photoUrl: student?.photoUrl || "", 
                
                groupId: groupId
            };

            if (mode === 'create') {
                await studentService.createStudent(payload);
            } else {
                await studentService.updateStudent(student.id, payload);
            }
            
            onRefresh();
            onClose();
        } catch (error: any) {
            console.error("Ошибка сохранения воспитанника:", error);
            alert(error.message || "Ошибка при сохранении данных воспитанника");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGroupObj = groups.find(g => g.id === groupId);
    const selectedGroupName = selectedGroupObj ? selectedGroupObj.name : "Выберите группу";

    const ampluaOptions = Object.keys(TRANSLATIONS.ampluas);

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
                            <UserPlus size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">
                                {mode === 'create' ? 'Добавление воспитанника' : 'Редактирование профиля'}
                            </h2>
                            <p className="text-white/80 text-xl">Личные данные и учебные группы</p>
                        </div>
                    </div>
                </div>

                {/* Форма */}
                <form onSubmit={handleSave} className="p-10 space-y-6 overflow-y-auto flex-1">
                    
                    {/* Фамилия */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Фамилия</label>
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand"
                            placeholder="Иванов"
                            required
                        />
                    </div>

                    {/* Имя */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Имя</label>
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand"
                            placeholder="Иван"
                            required
                        />
                    </div>

                    {/* Отчество */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand">Отчество</label>
                        <input 
                            type="text"
                            value={patronymic}
                            onChange={(e) => setPatronymic(e.target.value)}
                            className="w-full rounded-2xl border-2 border-brand/10 p-4 text-xl outline-none focus:border-brand"
                            placeholder="Иванович"
                            required
                        />
                    </div>

                    {/* Дата рождения */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <Calendar size={24} /> Дата рождения
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border-gray-200 rounded-2xl px-6 py-4 text-xl font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors outline-none focus:border-brand border-2"
                                required
                            />
                        </div>
                    </div>

                    {/* Выбор Амплуа */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <Shield size={24} /> Игровое амплуа
                        </label>
                        
                        <div className="relative" ref={ampluaSelectRef}>
                            <button
                                type="button"
                                onClick={() => setIsAmpluaSelectOpen(!isAmpluaSelectOpen)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-xl font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <span>{TRANSLATIONS.ampluas[amplua] || "Вратарь"}</span>
                                <ChevronIcon isOpen={isAmpluaSelectOpen} className="w-6 h-6 text-brand" />
                            </button>

                            {isAmpluaSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                    {ampluaOptions.map((ampKey) => (
                                        <div
                                            key={ampKey}
                                            onClick={() => {
                                                setAmplua(ampKey);
                                                setIsAmpluaSelectOpen(false);
                                            }}
                                            className={`px-6 py-4 text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                                amplua === ampKey ? 'bg-brand/10 text-brand font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {TRANSLATIONS.ampluas[ampKey]}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Выбор группы */}
                    <div className="space-y-2">
                        <label className="text-xl font-bold text-brand flex items-center gap-2">
                            <Users size={24} /> Назначить группу
                        </label>
                        
                        <div className="relative" ref={groupSelectRef}>
                            <button
                                type="button"
                                onClick={() => setIsGroupSelectOpen(!isGroupSelectOpen)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-xl font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <span>{selectedGroupName}</span>
                                <ChevronIcon isOpen={isGroupSelectOpen} className="w-6 h-6 text-brand" />
                            </button>

                            {isGroupSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-150 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                                    {groups.map((g) => (
                                        <div
                                            key={g.id}
                                            onClick={() => {
                                                setGroupId(g.id);
                                                setIsGroupSelectOpen(false);
                                            }}
                                            className={`px-6 py-4 text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                                groupId === g.id ? 'bg-brand/10 text-brand font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {g.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="pt-4 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-xl shadow-brand/20"
                        >
                            {isSubmitting ? "Сохранение..." : mode === 'create' ? "Добавить воспитанника" : "Сохранить изменения"}
                        </button>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="w-full text-gray-400 text-2xl font-medium py-4 border border-gray-200 rounded-2xl hover:text-brand transition-colors cursor-pointer"
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