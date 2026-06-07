import { UserResponse } from "@/app/models/responses/userResponse";
import { List, Pencil, Trash2 } from "lucide-react";
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
        <div className="flex flex-row justify-between gap-4">
            {/* Пользователь */}
            <div className="flex flex-row justify-between rounded-2xl bg-white py-4 pl-6 pr-6 gap-6 w-[90%]">
                {/* Левая часть */}
                <div className="flex items-start font-semibold text-2xl gap-4">
                    <span className="text-black">
                        {user.firstName}
                    </span>
                    <span className="text-brand">
                        {user.lastName}
                        {user.patronymic}
                    </span>
                </div>
                {/* Правая часть */}
                <div className="flex items-end">
                    <span className={`text-2xl font-semibold ${
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
            <button className="cursor-pointer rounded-2xl bg-white p-4 text-brand"
            onClick={() => setIsModalOpen(true)}
            >
                <Trash2/>
            </button>
            <button className="cursor-pointer rounded-2xl bg-white p-4 text-brand"
            onClick={() => setIsEditOpen(true)}
            >
                <Pencil/>
                {/* <List/> */}
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