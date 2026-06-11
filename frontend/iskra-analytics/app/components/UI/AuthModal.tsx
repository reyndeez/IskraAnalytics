'use client'

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { jwtDecode } from "jwt-decode";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: 'login' | 'register';
}

interface LoginRequest {
    email: string;
    password?: string;
}

interface AuthResponse {
    token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5172/api";

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
};

async function customRequest(endpoint: string, method = 'GET', body: any = null) {
    const token = getCookie('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token && token !== "undefined" && token !== "null") {
        headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    return response;
}

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'Parent'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuthSuccess = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
            const userRole = rawRole?.toLowerCase(); 

            document.cookie = `token=${token}; path=/; max-age=86400`;
            document.cookie = `role=${userRole}; path=/; max-age=86400`;

            onClose();

            if (userRole === 'admin') {
                window.location.href = '/admin/groups';
            } else if (userRole === 'coach') {
                window.location.href = '/coach/my-groups'; 
            } else if (userRole === 'user') {
                window.location.href = '/user/progress'; 
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            setError("Ошибка авторизации: получен некорректный токен.");
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        try {
            if (activeTab === 'login') {
                const loginData: LoginRequest = {
                    email: formData.email,
                    password: formData.password
                };
                const res = await customRequest('/Auth/login', 'POST', loginData);

                if (res && res.ok) {
                    const data: AuthResponse = await res.json();
                    handleAuthSuccess(data.token);
                } else {
                    setError("Неверный логин или пароль");
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError("Пароли не совпадают");
                    setIsLoading(false);
                    return;
                }
                if (formData.password.length < 8) {
                    setError("Пароль должен быть не короче 8 символов");
                    setIsLoading(false);
                    return;
                }
                const letters = /[a-zA-Za-Я]/;
                if (!letters.test(formData.password)) {
                    setError("Пароль должен содержать хотя бы одну букву");
                    setIsLoading(false);
                    return;
                }

                const res = await customRequest('/Auth/register', 'POST', formData);
                
                if (res && res.ok) {
                    const loginData: LoginRequest = {
                        email: formData.email,
                        password: formData.password
                    };
                    
                    const loginRes = await customRequest('/Auth/login', 'POST', loginData);
                    
                    if (loginRes && loginRes.ok) {
                        const data: AuthResponse = await loginRes.json();
                        handleAuthSuccess(data.token);
                    } else {
                        setError("Аккаунт создан, но не удалось войти автоматически. Войдите вручную.");
                        setActiveTab('login');
                    }
                } else {
                    setError("Ошибка! Возможно такая почта уже есть");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Не удалось связаться с сервером. Проверьте подключение.");
        } finally {
            setIsLoading(false);
        }
    };

    const setTab = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setShowPassword(false);
        setError(null);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setError(null);
        }
    }, [isOpen, initialTab]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="absolute top-6 right-6 text-muted hover:text-brand transition-colors cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
                <div className="flex flex-row gap-8">
                    <button type="button" onClick={() => setTab('login')} className={`text-3xl font-bold mb-6 cursor-pointer ${activeTab === 'login' ? 'text-brand' : 'text-muted'}`}>
                        Вход
                    </button>
                    <button type="button" onClick={() => setTab('register')} className={`text-3xl font-bold mb-6 cursor-pointer ${activeTab === 'register' ? 'text-brand' : 'text-muted'}`}>
                        Регистрация
                    </button>
                </div>
                {activeTab === 'register' && (
                    <div className="flex flex-col space-y-2">
                        <label className="text-xl text-brand font-medium">Имя</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-4 mb-4 border rounded-xl border-brand" placeholder="Иван" required />
                        <label className="text-xl text-brand font-medium">Фамилия</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-4 mb-4 border rounded-xl border-brand" placeholder="Иванов" required />
                    </div>
                )}
                <div className="flex flex-col space-y-2">
                    <label className="text-xl text-brand font-medium">E-mail</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-4 mb-4 border rounded-xl border-brand" placeholder="example@mail.ru" required />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-xl text-brand font-medium">Пароль</label>
                    <div className="relative group">
                        <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Минимум 8 символов" className="w-full p-4 mb-4 border rounded-xl border-brand" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-8 -translate-y-1/2 cursor-pointer">
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path d="m20 15-1.726-2.05" /><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                            )}
                        </button>
                    </div>
                </div>
                {activeTab === 'register' && (
                    <div className="flex flex-col space-y-2">
                        <label className="text-xl text-brand font-medium">Повторите пароль</label>
                        <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full p-4 mb-4 border rounded-xl border-brand" required />
                    </div> 
                )}
                {error && <p className="text-red-500 text-sm font-medium mb-4 text-center">{error}</p>}
                <div className="pt-5 flex justify-center">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-[70%] bg-brand text-white p-4 rounded-xl font-bold text-xl cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Загрузка...' : (activeTab === 'login' ? 'Войти' : 'Создать аккаунт')}
                    </button>
                </div> 
            </form>
        </div>,
        document.body
    );
}