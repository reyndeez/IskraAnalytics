'use client'

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Calendar, Users, Shield } from "lucide-react";
import { groupService } from "../services/groupService";
import { studentService } from "../services/studentService";
import { TRANSLATIONS } from "../utils/dictionaries";
import { ChevronIcon } from "./Icons";
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { format, parseISO, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const AMPLUA_TO_NUM_MAP: Record<string, number> = {
    'Goalkeeper': 1,
    'Forward': 2,
    'Defender': 3
};

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
    
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    
    const [groupId, setGroupId] = useState("");
    const [amplua, setAmplua] = useState("Goalkeeper");
    
    const [groups, setGroups] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false);
    const [isAmpluaSelectOpen, setIsAmpluaSelectOpen] = useState(false);

    const groupSelectRef = useRef<HTMLDivElement>(null);
    const ampluaSelectRef = useRef<HTMLDivElement>(null);

    // Вычисляем динамический диапазон лет на основе выбранной даты, чтобы админу всегда хватало места
    const currentYear = new Date().getFullYear();
    const selectedYear = birthDate ? birthDate.getFullYear() : currentYear;
    
    // Нижняя граница: либо 2000 год, либо еще на 10 лет раньше выбранного (если это взрослый игрок)
    const startYear = Math.min(2000, selectedYear - 10);
    // Верхняя граница: текущий год
    const endYear = currentYear;

    useEffect(() => {
        setMounted(true);
    }, []);

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
            setPatronymic(student.patronymic || "");
            
            if (student.birthDate) {
                const parsed = parseISO(student.birthDate);
                setBirthDate(isValid(parsed) ? parsed : undefined);
            } else {
                setBirthDate(undefined);
            }
            
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
            setBirthDate(undefined); 
            setGroupId("");
            setAmplua("Goalkeeper");
        }
    }, [isOpen, student, mode]);

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
                birthDate: birthDate.toISOString(), 
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
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4" onClick={onClose}>
            <div className="relative bg-white w-full max-w-2xl rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                
                {/* Шапка модалки */}
                <div className="bg-brand p-5 sm:p-8 text-white relative shrink-0">
                    <button onClick={onClose} className="absolute top-5 right-5 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors cursor-pointer p-1">
                        <X className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="bg-white/20 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shrink-0">
                            <UserPlus className="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>
                        <div className="min-w-0 pr-6">
                            <h2 className="text-xl sm:text-3xl font-bold truncate">
                                {mode === 'create' ? 'Добавление' : 'Редактирование'}
                            </h2>
                            <p className="text-white/80 text-sm sm:text-xl truncate">Личные данные воспитанника</p>
                        </div>
                    </div>
                </div>

                {/* Форма */}
                <form onSubmit={handleSave} className="p-5 sm:p-10 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
                    
                    {/* Фамилия */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand">Faмилия</label>
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border-2 border-brand/10 p-3 sm:p-4 text-base sm:text-xl outline-none focus:border-brand"
                            placeholder="Иванов"
                            required
                        />
                    </div>

                    {/* Имя */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand">Имя</label>
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border-2 border-brand/10 p-3 sm:p-4 text-base sm:text-xl outline-none focus:border-brand"
                            placeholder="Иван"
                            required
                        />
                    </div>

                    {/* Отчество */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand">Отчество</label>
                        <input 
                            type="text"
                            value={patronymic}
                            onChange={(e) => setPatronymic(e.target.value)}
                            className="w-full rounded-xl sm:rounded-2xl border-2 border-brand/10 p-3 sm:p-4 text-base sm:text-xl outline-none focus:border-brand"
                            placeholder="Иванович"
                            required
                        />
                    </div>

                    {/* Кастомный календарь */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand flex items-center gap-2">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" /> Дата рождения
                        </label>
                        <Popover className="relative w-full">
                            {({ close }) => (
                                <>
                                    <PopoverButton type="button" className="
                                        cursor-pointer flex items-center justify-between gap-4 w-full bg-white 
                                        border-2 border-brand/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 
                                        text-base sm:text-xl font-medium text-gray-900 shadow-sm text-left outline-none focus:border-brand
                                    ">
                                        <span className={birthDate ? "text-gray-900" : "text-gray-400"}>
                                            {birthDate ? format(birthDate, 'd MMMM yyyy', { locale: ru }) : "Выберите дату"}
                                        </span>
                                        <ChevronIcon isOpen={false} className="w-5 h-5 sm:w-6 sm:h-6 text-brand shrink-0" />
                                    </PopoverButton>

                                    <Transition
                                        as={React.Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <PopoverPanel className="absolute z-160 mt-2 left-0 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 outline-none max-w-full overflow-x-auto">
                                            <DayPicker
                                                mode="single"
                                                selected={birthDate}
                                                onSelect={(date) => {
                                                    setBirthDate(date);
                                                    close(); 
                                                }}
                                                locale={ru}
                                                
                                                captionLayout="dropdown"
                                                // Динамические границы диапазона (авто-расширение)
                                                startMonth={new Date(startYear, 0)}
                                                endMonth={new Date(endYear, 11)}
                                                
                                                modifiersStyles={{
                                                    selected: { 
                                                        backgroundColor: 'var(--color-brand, #111)',
                                                        color: 'white',
                                                        borderRadius: '12px'
                                                    }
                                                }}
                                                styles={{
                                                    caption_label: { display: 'none' },
                                                    dropdown: {
                                                        cursor: 'pointer',
                                                        padding: '6px 12px',
                                                        borderRadius: '12px',
                                                        border: '2px solid rgba(17, 17, 17, 0.08)',
                                                        backgroundColor: '#fff',
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        color: '#1c1c1c',
                                                        marginRight: '6px',
                                                        outline: 'none'
                                                    }
                                                }}
                                            />
                                        </PopoverPanel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>

                    {/* Выбор Амплуа */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand flex items-center gap-2">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6" /> Игровое амплуа
                        </label>
                        <div className="relative" ref={ampluaSelectRef}>
                            <button
                                type="button"
                                onClick={() => setIsAmpluaSelectOpen(!isAmpluaSelectOpen)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border-2 border-brand/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-xl font-medium text-gray-900 shadow-sm"
                            >
                                <span className="truncate">{TRANSLATIONS.ampluas[amplua] || "Вратарь"}</span>
                                <ChevronIcon isOpen={isAmpluaSelectOpen} className="w-5 h-5 sm:w-6 sm:h-6 text-brand shrink-0" />
                            </button>

                            {isAmpluaSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg z-150 overflow-hidden">
                                    {ampluaOptions.map((ampKey) => (
                                        <div
                                            key={ampKey}
                                            onClick={() => {
                                                setAmplua(ampKey);
                                                setIsAmpluaSelectOpen(false);
                                            }}
                                            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
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
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-base sm:text-xl font-bold text-brand flex items-center gap-2">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6" /> Назначить группу
                        </label>
                        <div className="relative" ref={groupSelectRef}>
                            <button
                                type="button"
                                onClick={() => setIsGroupSelectOpen(!isGroupSelectOpen)}
                                className="cursor-pointer flex items-center justify-between gap-4 w-full bg-white border-2 border-brand/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-xl font-medium text-gray-900 shadow-sm"
                            >
                                <span className="truncate">{selectedGroupName}</span>
                                <ChevronIcon isOpen={isGroupSelectOpen} className="w-5 h-5 sm:w-6 sm:h-6 text-brand shrink-0" />
                            </button>

                            {isGroupSelectOpen && (
                                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg z-150 overflow-hidden max-h-48 sm:max-h-60 overflow-y-auto">
                                    {groups.map((g) => (
                                        <div
                                            key={g.id}
                                            onClick={() => {
                                                setGroupId(g.id);
                                                setIsGroupSelectOpen(false);
                                            }}
                                            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg cursor-pointer hover:bg-gray-50 transition-colors ${
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
                    <div className="pt-2 sm:pt-4 flex flex-col gap-2 sm:gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand text-white py-3 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-md"
                        >
                            {isSubmitting ? "Сохранение..." : mode === 'create' ? "Добавить воспитанника" : "Сохранить изменения"}
                        </button>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="w-full text-gray-400 text-lg sm:text-2xl font-medium py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl hover:text-brand transition-colors cursor-pointer"
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