'use client'

import { UserResponse } from "@/app/models/responses/userResponse";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { useState } from "react";
import { UserService } from "../services/userService";
import { UserDataModal } from "./UserDataModal";

export function UserRow({user, onRefresh} : {user: UserResponse, onRefresh: () => void}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await UserService.deleteUsers(user.id);
            onRefresh();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleUpdateRole = async (userId: string, roleId: string) => {
        try { 
            await UserService.updateUserRole(userId, roleId);
            onRefresh();
            setIsEditOpen(false);
        } catch (error: any) {
            alert(error.message || "Ошибка при смене роли");
        }
    };

    return (
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Основной контент */}
            <div className="flex flex-row justify-between items-center rounded-2xl bg-white py-3 sm:py-4 px-4 sm:px-6 gap-4 flex-1 shadow-sm min-w-0">
                {/* Левая часть */}
                <div className="flex items-center font-semibold text-lg sm:text-2xl min-w-0 gap-2">
                    <span className="text-black truncate">{user.firstName}</span>
                    <span className="text-brand truncate">
                        {user.lastName} {user.patronymic}
                    </span>
                </div>
                {/* Правая часть */}
                <div className="flex items-center shrink-0">
                    <span className={`text-sm sm:text-2xl font-semibold ${
                        user.role === 'Admin' 
                        ? 'text-red'
                        : user.role === 'Coach'
                        ? 'text-green'
                        : 'text-brand'
                    }`}>
                        {user.role}
                    </span>
                </div>
            </div>            
            
            {/* Действия с пользователем */}          
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => setIsModalOpen(true)}
            >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button 
                className="cursor-pointer rounded-2xl bg-white p-3 sm:p-4 text-brand transition-colors hover:bg-gray-50 flex items-center justify-center shrink-0 shadow-sm"
                onClick={() => setIsEditOpen(true)}
            >
                <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Удалить пользователя?"
                message={`Вы уверены, что хотите удалить пользователя ${user.firstName} ${user.lastName} ${user.patronymic}?`}
            />
            
            <UserDataModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                user={user}
                onSave={handleUpdateRole}
            />
        </div>
    );
}