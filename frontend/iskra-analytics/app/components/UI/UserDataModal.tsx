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
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Шапка */}
                <div className="bg-brand p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer">
                        <X size={32} />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-3xl">
                            <User size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-white/80 text-xl">{user.patronymic}</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="flex items-center gap-4 text-brand bg-brand/5 p-4 rounded-2xl">
                        <Mail size={24} />
                        <span className="text-xl font-medium">{user.email || "Email не указан"}</span>
                    </div>

                    {/* Смена роли */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-2xl font-bold text-brand">
                            <ShieldCheck size={28} />
                            Управление ролью
                        </label>

                        {isLoading ? (
                            <div className="flex justify-center p-6 text-brand">
                                <Loader2 className="animate-spin" size={40} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className={`py-4 rounded-2xl text-xl font-bold transition-all cursor-pointer border-2 ${
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

                    <div className="pt-6 flex flex-col gap-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading || (roles.find(r => r.id === selectedRoleId)?.name === user.role)}
                            className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-xl shadow-brand/20"
                        >
                            {isSaving ? "Сохранение..." : "Сохранить изменения"}
                        </button>
                        <button 
                            onClick={onClose} 
                            className="w-full text-gray-400 text-2xl font-medium py-4 border rounded-2xl hover:text-brand transition-colors cursor-pointer"
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