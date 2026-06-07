'use client'

import { useEffect, useState } from "react";
import { studentService } from "@/app/components/services/studentService";
import { ChevronIcon } from "@/app/components/UI/Icons"; // Подставь свой правильный импорт иконки
import { StudentResponse } from "@/app/models/responses/studentResponse";
import { GroupWithStudentsResponse } from "@/app/models/responses/GroupWithStudentsResponse";
import { createPortal } from "react-dom";
import { Check, Copy, Info, Loader2, User, X } from "lucide-react";
import { t } from "../utils/dictionaries";

interface GroupAccordionProps {
    group: GroupWithStudentsResponse;
}

export function GroupAccordion({ group }: GroupAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full bg-brand rounded-4xl overflow-hidden shadow-md transition-all duration-300 mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer w-full flex items-center justify-between px-8 py-6 text-2xl font-bold text-white hover:bg-[#093d8c] transition-colors focus:outline-none"
            >
                <span>{group.name}</span>
                <ChevronIcon className="w-10 h-10" isOpen={isOpen} />
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-500 pb-6 px-6" : "max-h-0"}`}>
                <div className="flex flex-col gap-3">
                    {group.students && group.students.length > 0 ? (
                        group.students.map((student, index) => (
                            <StudentRow key={student.id} student={student} index={index} />
                        ))
                    ) : (
                        <div className="text-white/70 text-xl italic px-6 py-2">В этой группе пока нет участников</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StudentRow({ student, index }: { student: { id: string; fullName: string }; index: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full bg-white rounded-2xl px-6 py-4 text-xl font-medium shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-muted font-bold w-6">{index + 1}.</span>
                <span>{student.fullName}</span>
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer bg-brand text-white px-5 py-2 rounded-xl font-bold hover:bg-[#093d8c] transition-colors shadow-sm"
            >
                <Info/>
            </button>

            {isModalOpen && (
                <StudentDetailsModal 
                    studentId={student.id} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}

function StudentDetailsModal({ studentId, onClose }: { studentId: string; onClose: () => void }) {
    const [details, setDetails] = useState<StudentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let active = true;
        setMounted(true);
        
        const loadDetails = async () => {
            try {
                setLoading(true);
                const data = await studentService.getStudentById(studentId);
                if (active) setDetails(data);
            } catch (err) {
                console.error("Ошибка при загрузке карточки студента:", err);
            } finally {
                if (active) setLoading(false);
            }
        };
        
        loadDetails();
        
        return () => {
            active = false;
        };
    }, [studentId]);

    if (!mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 cursor-pointer"
            onClick={onClose}
        >
            <div 
                className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Шапка модалки из референса */}
                <div className="bg-brand p-8 text-white relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={32} />
                    </button>
                    <div className="flex items-center gap-6">
                        {loading ? (
                            <div>
                                <h2 className="text-3xl font-bold">Загрузка...</h2>
                                <p className="text-white/80 text-xl">Получаем данные профиля</p>
                            </div>
                        ) : details ? (
                            <div className='flex justify-between items-center'>
                                <p className='text-3xl font-extrabold text-white uppercase tracking-[0.02em]'>Карточка спортсмена</p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-3xl font-bold">Ошибка</h2>
                                <p className="text-white/80 text-xl">Не удалось загрузить данные</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Контентная часть */}
                <div className="p-10 space-y-8">
                    {loading ? (
                        <div className="flex justify-center p-6 text-brand">
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                    ) : details ? (
                        <div className="flex flex-col gap-5 text-xl text-gray-800">
                            <div className="flex flex-col bg-gray-50 p-3 rounded-2xl">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">ФИО</span>
                                <span className="font-bold text-3xl text-brand">
                                    {details.lastName} {details.firstName} {details.patronymic}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Дата рождения</span>
                                    <span className="font-bold text-brand">
                                        {new Date(details.birthDate).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                                <div className="flex flex-col bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Амплуа</span>
                                    <span className="font-bold text-brand">{t('ampluas', details.amplua) || 'Не указано'}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Группа</span>
                                    <span className="font-bold text-brand ">{details.groupName}</span>
                                </div>
                                
                                {/* ИНВАЙТ-КОД С КОПИРОВАНИЕМ */}
                                <div 
                                    onClick={() => {
                                        if (details?.accessCode) {
                                            navigator.clipboard.writeText(details.accessCode);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }
                                    }}
                                    className="flex items-center justify-between bg-brand/5 p-3 rounded-2xl border-2 border-brand/10 hover:border-brand/30 transition-all cursor-pointer group select-none"
                                    title="Нажмите, чтобы скопировать"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Код доступа</span>
                                        <span className="font-mono font-extrabold text-brand tracking-wider text-2xl">
                                            {details.accessCode}
                                        </span>
                                    </div>
                                    <div className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-green text-white' : 'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white'}`}>
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Кнопка закрытия карточки */}
                            <div className="pt-4 flex flex-col gap-4">
                                <button
                                    onClick={onClose}
                                    className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-2xl cursor-pointer hover:brightness-110 transition-all shadow-xl shadow-brand/20"
                                >
                                    Закрыть профиль
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-red-500 text-xl font-bold text-center py-6">
                            Не удалось загрузить данные воспитанника
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}