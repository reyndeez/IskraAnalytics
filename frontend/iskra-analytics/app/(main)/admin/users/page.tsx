'use client'

import { RoleService } from "@/app/components/services/roleService";
import { SearchIcon, SortIcon } from "@/app/components/UI/Icons";
import { RoleSelector } from "@/app/components/UI/RolesSelector";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { UserRow } from "@/app/components/UI/UserRow";
import { RoleResponse } from "@/app/models/responses/roleResponse";
import { useEffect, useState } from "react";

const SORT_OPTIONS = [
    { id: 'date', name: 'По дате регистрации'},
    { id: 'role', name: 'По роли'},
    { id: 'name', name: 'По имени'}
]

export default function UsersPage(){
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRolesData = async () => {
        try{
            setIsLoading(true);
            const data = await RoleService.getAllRoles();

            const allRolesOption = {id: '', name: 'Все роли'};
            setRoles([allRolesOption, ...data])
        } catch(error){
            console.error(error);            
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRolesData();
    }, []);

    return(
        <div>            
            <h1 className="text-6xl font-bold text-brand">Панель пользователей</h1>
            {/* Панель */}
            <div className="mt-10 p-8 bg-brand rounded-4xl">
                {/* Верхний ряд */}
                <div className="flex flex-row justify-between">
                    {/* Левая часть */}
                    <div className="flex items-start gap-6">
                        <SearchInput />
                    </div>
                    {/* Правая часть */}
                    <div className="flex items-end gap-6">
                        {/* Фильтр по роли */}
                        <RoleSelector roles={roles}/>
                        {/* Сортировка */}
                        <SortSelector sorts={SORT_OPTIONS}/>                        
                        {/* По возрастанию/убыванию */}
                        <SortToggle/>
                    </div>
                </div>
                {/* Данные пользователей */}
                <div className="mt-6 flex flex-col gap-4">
                    {/* временные данные */}
                    {[1,2,3,4,5, 6, 7,].map((i) => (
                        <UserRow
                            key={i}
                            user={{
                                id: String(i),
                                firstName: "Имя",
                                lastName: "Фамилия",
                                role: i % 3 === 0 ? "admin" : i % 2 === 0 ? "coach" : "user"
                            }}
                        />
                    ))}
                </div>
                {/* Страницы */}
                <div className="flex items-center">
                    
                </div>
            </div>
        </div>
    );
}
