import { userResponse } from "@/app/models/responses/userResponse";
import { List, Trash2 } from "lucide-react";

export function UserRow({user} : {user: userResponse}) {
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
                        user.role === 'admin' 
                        ? 'text-red'
                        : user.role === 'coach'
                        ? 'text-green'
                        : 'text-brand'
                    }`}>
                        {user.role}
                    </span>
                </div>
            </div>            
            {/* Действия с пользователем */}          
            <button className="cursor-pointer rounded-2xl bg-white p-4 text-brand"
            // onClick={}
            >
                <Trash2/>
            </button>
            <button className="cursor-pointer rounded-2xl bg-white p-4 text-brand"
            // onClick={}
            >
                <List/>
            </button>
        </div>
    );
}