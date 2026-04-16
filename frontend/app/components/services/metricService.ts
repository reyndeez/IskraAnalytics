import { request } from "./api"

export const metricService = {
    getMetrics: async () => {
        const res = await request('/Metrics/active', 'GET');

        if(!res.ok) {
            throw new Error("Не удалось загрузить метрики");
        }

        return res.json();
    }
}