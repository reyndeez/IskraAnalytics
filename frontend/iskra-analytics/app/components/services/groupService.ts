import { request } from "./api"

export const groupService = {
    //Получить группы тренера
    getGroupsForCoach: async () => {
        const res = await request('/Groups/my-groups', 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }

        return res.json();
    },

    //Получить группы со студентами
    getGroupsWithStudents: async () => {
        const res = await request('/Groups/my-groups-with-students', 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }

        return res.json();
    },

    // Найти группы
    findGroups: async (params: any): Promise<any> => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        const queryString = new URLSearchParams(filteredParams as any).toString();
        const res = await request(`/Groups/find?${queryString}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить список групп");
        }
        return res.json();
    },

    // Получить все активные группы
    getAllActiveGroups: async () => {
        const res = await request('/Groups/active', 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить активные группы");
        }
        return res.json();
    },
    
    // Получить все группы
    getAllGroups: async () => {
        const res = await request('/Groups', 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить группы");
        }
        return res.json();
    },

    // Создать группу
    createGroup: async (data: any) => {
        const res = await request('/Groups/create', 'POST', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось создать группу");
        }
        return res.json();
    },

    // Обновить группу
    updateGroup: async (groupId: string, data: any) => {
        const res = await request(`/Groups/${groupId}`, 'PUT', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось обновить группу");
        }
        return res.json();
    },

    // Мягкое удаление группы
    deleteGroup: async (groupId: string) => {
        const res = await request(`/Groups/delete/${groupId}`, 'DELETE');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось удалить группу");
        }
        return true;
    },

    // Восстановление группы
    restoreGroup: async (groupId: string) => {
        const res = await request(`/Groups/${groupId}/restore`, 'PUT');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось восстановить группу");
        }
        return true;
    }
}