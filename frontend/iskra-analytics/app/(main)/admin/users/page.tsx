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
import { Suspense, useEffect, useState } from "react";

const SORT_OPTIONS = [
    { id: 'date', name: 'По дате регистрации'},
    { id: 'role', name: 'По роли'},
    { id: 'name', name: 'По имени'}
];

export default function UsersPage() {
    return (
        <Suspense fallback={<div className="text-white text-xl p-4">Загрузка...</div>}>
            <UsersContent />
        </Suspense>
    );
}

function UsersContent() {
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
        try {
            setIsLoading(true);
            const data = await RoleService.getAllRoles();
            const allRolesOption = {id: '', name: 'Все роли'};
            setRoles([allRolesOption, ...data]);
        } catch (error) {
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

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">            
            <h1 className="text-3xl sm:text-6xl font-bold text-brand leading-tight">Панель пользователей</h1>
            
            <div className="mt-6 sm:mt-10 p-4 sm:p-8 bg-brand rounded-4xl shadow-xl">
                {/* Панель фильтров */}
                <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
                    {/* Левая часть: Поиск */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-initial">
                            <SearchInput />
                        </div>
                    </div>
                    
                    {/* Правая часть: Селектор ролей и сортировка монолитно с безопасным переносом строк */}
                    <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-2 sm:gap-4 justify-start lg:justify-end w-full lg:w-auto shrink-0">
                        <div className="flex-1 sm:flex-initial min-w-26.25 sm:min-w-35">
                            <RoleSelector roles={roles}/>
                        </div>
                        <div className="flex-1 sm:flex-initial min-w-28.75 sm:min-w-37.5">
                            <SortSelector sorts={SORT_OPTIONS}/>                        
                        </div>
                        <div className="shrink-0">
                            <SortToggle/>
                        </div>
                    </div>
                </div>

                {/* Данные пользователей */}
                <div className="mt-6 flex flex-col gap-3 sm:gap-4">
                    {isLoading ? (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Загрузка...</div>
                    ) : (
                        userData?.users.map((user) => (
                            <UserRow key={user.id} user={user} onRefresh={loadUsers}/>
                        ))
                    )}
                    
                    {!isLoading && userData?.users.length === 0 && (
                        <div className="text-white text-center text-lg sm:text-2xl py-10 font-medium">Пользователи не найдены</div>
                    )}
                </div>

                {/* Страницы пагинации */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <Pagination
                        totalPages={userData?.totalPages || 1} 
                        currentPage={page} 
                    />
                </div>
            </div>
        </div>
    );
}