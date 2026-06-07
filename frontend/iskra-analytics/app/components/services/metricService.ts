import { request } from "./api"

export const metricService = {
    //Получить метрики для селектора
    getMetricsForSelector: async () => {
        const res = await request('/Metrics/selector', 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }

        return res.json();
    },

    //Получить все активные метрики
    getMetrics: async () => {
        const res = await request('/Metrics/active', 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }

        return res.json();
    },

    //Найти метрики
    findMetrics: async (params: any): Promise<any> => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        const queryString = new URLSearchParams(filteredParams as any).toString();
        const res = await request(`/Metrics/find?${queryString}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }
        return res.json();
    },

    //Получить все метрики
    getAllMetrics: async () => {
        const res = await request('/Metrics/all', 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить полный список метрик");
        }
        return res.json();
    },

    // Создать метрику
    createMetric: async (data: any) => {
        const res = await request('/Metrics/create', 'POST', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось создать метрику");
        }
        return res.json();
    },

    // Обновить метрику
    updateMetric: async (metricId: string, data: any) => {
        const res = await request(`/Metrics/${metricId}`, 'PUT', data);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось обновить метрику");
        }
        return res.json();
    },

    // Мягкое удаление метрики
    deleteMetric: async (metricId: string) => {
        const res = await request(`/Metrics/delete/${metricId}`, 'DELETE');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось удалить метрику");
        }
        return true;
    },

    // Восстановление метрики
    restoreMetric: async (metricId: string) => {
        const res = await request(`/Metrics/${metricId}/restore`, 'PUT');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Не удалось восстановить метрику");
        }
        return true;
    }
}