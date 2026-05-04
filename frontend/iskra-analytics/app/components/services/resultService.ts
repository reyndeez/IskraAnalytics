import { request } from "./api"

export const resultService = {
    getResultByStudentId: async (studentId: string) => {
        const res = await request(`/Results/${studentId}`, 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить результаты воспитанника");
        }

        return res.json();
    }
}