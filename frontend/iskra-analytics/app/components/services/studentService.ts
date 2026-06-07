import { StudentResponse } from "@/app/models/responses/studentResponse";
import { request } from "./api"

export const studentService = {
    //Получить детей родителя
    getChildren: async () => {
        const res = await request('/Students/my-children', 'GET');

        if(!res.ok){
            throw new Error("Не удалось загрузить детей");
        }

        return res.json();    
    },

    //Получить студента по id
    getStudentById: async (id: string): Promise<StudentResponse> => {
        const res = await request(`/Students/details/${id}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить детальную информацию о воспитаннике");
        }

        return res.json();
    },

    // Найти воспитанников
    findStudents: async (params: any): Promise<any> => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        const queryString = new URLSearchParams(filteredParams as any).toString();
        const res = await request(`/Students/find?${queryString}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить список воспитанников");
        }
        return res.json();
    },

    // Регистрация нового воспитанника
    createStudent: async (data: any): Promise<StudentResponse> => {
        const res = await request('/Students/register', 'POST', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось зарегистрировать воспитанника");
        }
        return res.json();
    },

    // Привязать ребенка к родителю по коду доступа
    bindChild: async (accessCode: string) => {
        const res = await request('/Students/bind', 'POST', { accessCode });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось привязать профиль воспитанника");
        }
        return true;
    },

    // Получить всех активных воспитанников
    getAllStudents: async (): Promise<StudentResponse[]> => {
        const res = await request('/Students/all', 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить список всех воспитанников");
        }
        return res.json();
    },

    // Получить воспитанников конкретной группы
    getStudentsByGroupId: async (groupId: string): Promise<StudentResponse[]> => {
        const res = await request(`/Students/by-group/${groupId}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить состав группы");
        }
        return res.json();
    },

    // Изменить данные воспитанника
    updateStudent: async (studentId: string, data: any): Promise<StudentResponse> => {
        const res = await request(`/Students/${studentId}`, 'PUT', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось обновить данные воспитанника");
        }
        return res.json();
    },

    // Удалить воспитанника (мягкое удаление)
    deleteStudent: async (studentId: string) => {
        const res = await request(`/Students/${studentId}`, 'DELETE');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось удалить воспитанника");
        }
        return true;
    },

    // Восстановление воспитанника
    restoreStudent: async (studentId: string) => {
        const res = await request(`/Students/${studentId}/restore`, 'PUT');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось восстановить воспитанника");
        }
        return true;
    }
}