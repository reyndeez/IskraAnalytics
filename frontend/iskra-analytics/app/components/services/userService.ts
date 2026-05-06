import { FindUserRequest } from "@/app/models/requests/findUserRequest";
import { request } from "./api"
import { UserPagedResponse } from "@/app/models/responses/UserPagedResponse";

export const UserService = {
    findUsers: async (params: FindUserRequest): Promise<UserPagedResponse> => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );

        const queryString = new URLSearchParams(filteredParams as any).toString();
        const res = await request(`/Users/find?${queryString}`, 'GET');

        if(!res.ok){
            throw new Error("Не удалось загрузить пользователей");
        }

        return res.json();    
    },

    deleteUsers: async (userId: string) => {
        const res = await request(`/Users/${userId}`, 'DELETE')

        if(!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось удалить пользователя");
        }

        return true;
    }
}