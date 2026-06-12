'use client'

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { UserResponse } from "@/app/models/responses/userResponse";
import { RoleService } from "../services/roleService";
import { t } from "../utils/dictionaries";

interface RoleResponse {
    id: string;
    name: string;
}

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserResponse | null;
    onSave: (userId: string, roleId: string) => Promise<void>;
}

export function UserDataModal({ isOpen, onClose, user, onSave }: UserEditModalProps) {
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            const fetchRoles = async () => {
                setIsLoading(true);
                try {
                    const data = await RoleService.getAllRoles();
                    setRoles(data);
                    
                    const currentRole = data.find((r: RoleResponse) => r.name === user?.role);
                    if (currentRole) {
                        setSelectedRoleId(currentRole.id);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRoles();
        }
    }, [isOpen, user]);

    if (!isOpen || !mounted || !user) return null;

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(user.id, selectedRoleId);
        setIsSaving(false);
        onClose();
    };

    return createPortal(
        <div 
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 cursor-pointer"
            onClick={onClose}
        >
            <div 
                className="relative bg-white w-full max-w-2xl rounded-4xl sm:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Шапка */}
                <div className="bg-brand p-6 sm:p-8 text-white relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="bg-white/20 p-3 sm:p-4 rounded-3xl shrink-0">
                            <User className="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-3xl font-bold leading-tight">{user.firstName} {user.lastName}</h2>
                            <p className="text-white/80 text-base sm:text-xl">{user.patronymic}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                    {/* Поле Email */}
                    <div className="flex items-center gap-3 sm:gap-4 text-brand bg-brand/5 p-3 sm:p-4 rounded-2xl">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                        <span className="text-base sm:text-xl font-medium truncate">{user.email || "Email не указан"}</span>
                    </div>

                    {/* Смена роли */}
                    <div className="space-y-3 sm:space-y-4">
                        <label className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-brand">
                            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                            Управление ролью
                        </label>

                        {isLoading ? (
                            <div className="flex justify-center p-4 text-brand">
                                <Loader2 className="animate-spin" size={36} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className={`py-3 sm:py-4 rounded-2xl text-base sm:text-xl font-bold transition-all cursor-pointer border-2 ${
                                            selectedRoleId === role.id 
                                            ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                                            : 'bg-white text-muted border-gray-100 hover:border-brand/30'
                                        }`}
                                    >
                                        {t('roles', role.name)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Кнопки управления */}
                    <div className="pt-4 flex flex-col gap-3 sm:gap-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading || (roles.find(r => r.id === selectedRoleId)?.name === user.role)}
                            className="w-full bg-brand text-white py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-xl shadow-brand/20"
                        >
                            {isSaving ? "Сохранение..." : "Сохранить изменения"}
                        </button>
                        <button 
                            onClick={onClose} 
                            className="w-full text-gray-400 text-lg sm:text-2xl font-medium py-3 sm:py-4 border rounded-2xl hover:text-brand transition-colors cursor-pointer"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}