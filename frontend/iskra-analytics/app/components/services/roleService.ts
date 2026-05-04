import { request } from "./api"

export const RoleService ={
    getAllRoles: async () => {
        const res = await request('/Roles', 'GET');

        if(!res.ok){
            throw new Error("Не удалось загрузить роли");
        }

        return res.json();
    },
}