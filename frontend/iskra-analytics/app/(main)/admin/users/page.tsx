'use client'

import { RoleService } from "@/app/components/services/roleService";
import { UserService } from "@/app/components/services/userService";
import { Pagination } from "@/app/components/UI/Pagination";
import { RoleSelector } from "@/app/components/UI/RolesSelector";
import { SearchInput } from "@/app/components/UI/SearchInput";
import { SortSelector } from "@/app/components/UI/SortSelector";
import { SortToggle } from "@/app/components/UI/SortToggle";
import { UserRow } from "@/app/components/UI/UserRow";
import { RoleResponse } from "@/app/models/responses/roleResponse";
import { UserPagedResponse } from "@/app/models/responses/UserPagedResponse";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SORT_OPTIONS = [
    { id: 'date', name: 'По дате регистрации'},
    { id: 'role', name: 'По роли'},
    { id: 'name', name: 'По имени'}
]

export default function UsersPage(){
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    const [userData, setUserData] = useState<UserPagedResponse | null>(null);

    const search = searchParams.get('search') || "";
    const selectedRole = searchParams.get('roleId') || "";
    const sortId = searchParams.get('sortId') || "name";
    const isDescending = searchParams.get('isDescending') === 'true';
    const page = Number(searchParams.get('page')) || 1;

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

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await UserService.findUsers({
                search,
                roleId: selectedRole,
                sortId,
                isDescending,
                page,
                pageSize: 6
            });
            setUserData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRolesData();
    }, []);

    useEffect(() => {
        loadUsers();
    }, [searchParams]);

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
                    {isLoading ? (
                        <div className="text-white text-center text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        userData?.users.map((user) => (
                            <UserRow key={user.id} user={user} onRefresh={loadUsers}/>
                        ))
                    )}
                    
                    {!isLoading && userData?.users.length === 0 && (
                        <div className="text-white text-center text-2xl py-10 font-medium">Пользователи не найдены</div>
                    )}
                </div>
                {/* Страницы */}
                <div className="flex justify-center mt-8">
                    <Pagination
                        totalPages={userData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>
        </div>
    );
}
