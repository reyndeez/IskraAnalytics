'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: 'login' | 'register';
}

export default function AuthModal({isOpen, onClose, initialTab}: AuthModalProps ) {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false)

    const setTab = (tab: 'login'| 'register') => {
    setActiveTab(tab);
    setShowPassword(false);
        };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if(isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab])

    if(!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md  ">
                <button onClick={onClose} 
                className="absolute top-6 right-6 text-[#808080] hover:text-[#064592] transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div className="flex flex-row gap-8">
                    <button onClick={() => setTab('login') }className={`text-3xl font-bold text-[#064592] mb-6 cursor-pointer ${activeTab === 'login' ? 'text-[#064592]' : 'text-[#808080]'}`}>
                        Вход
                    </button>
                    <button onClick={() => setTab('register') }className={`text-3xl font-bold text-[#064592] mb-6 cursor-pointer ${activeTab === 'register' ? 'text-[#064592]' : 'text-[#808080]'}`}>
                        Регистрация
                    </button>
                </div>
                {activeTab === 'register' && (
                    <div className="flex flex-col space-y-2">
                        <label className="text-xl text-[#064592] font-medium">Имя</label>
                        <input className="w-full p-4 mb-4 border rounded-xl border-[#064592]" placeholder="Иван" />

                        <label className="text-xl text-[#064592] font-medium">Фамилия</label>
                        <input className="w-full p-4 mb-4 border rounded-xl border-[#064592]" placeholder="Иванов" />
                    </div>
                )}
                <div className="flex flex-col space-y-2">
                    <label className="text-xl text-[#064592] font-medium">E-mail</label>
                    <input className="w-full p-4 mb-4 border rounded-xl border-[#064592]" placeholder="example@mail.ru" />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-xl text-[#064592] font-medium">Пароль</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Минимум 8 символов"
                            className="w-full p-4 mb-4 border rounded-xl border-[#064592]"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-8 -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                                
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            )}
                        </button>
                    </div>
                </div>
                    {activeTab === 'register' && (
                    <div className="flex flex-col space-y-2">
                        <label className="text-xl text-[#064592] font-medium">Повторите </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 mb-4 border rounded-xl border-[#064592]"
                        />
                    </div> 
                )}
                <div className="pt-5 flex justify-center">
                    {/* Добавить OnClick */}
                    <button className="w-[70%] bg-[#064592] text-white p-4 rounded-xl font-bold text-xl cursor-pointer">{activeTab === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
                </div> 
            </div>
        </div>,
        document.body
    );
}
