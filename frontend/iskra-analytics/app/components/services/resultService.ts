import { request } from "./api"

export const resultService = {
    getResultByStudentId: async (studentId: string) => {
        const res = await request(`/Results/${studentId}`, 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить результаты воспитанника");
        }

        return res.json();
    },

    getResultsForMeasurement: async (groupId: string, metricId: string, date: string) => {
        const query = `groupId=${groupId}&metricId=${metricId}&date=${date}`;
        const res = await request(`/Results/measurements?${query}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить результаты измерений для группы");
        }

        return res.json();
    },

    upsertResult: async (data: { resultId: string | null, studentId: string, metricId: string, date: string, value: number }) => {
        const res = await request('/Results/upsert', 'POST', data);

        if (!res.ok) {
            throw new Error("Не удалось сохранить результат замера");
        }

        return res.text(); 
    }
}