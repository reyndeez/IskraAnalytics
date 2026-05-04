import { request } from "./api";

export const analyticService = {
    getLeaderboard: async (studentId: string, metricId: string) => {
        const res = await request(`/Analytics/leaderboard?studentId=${studentId}&metricId=${metricId}`, 'GET');

        if (!res.ok) {
            throw new Error("Не удалось загрузить рейтинг");
        }

        return res.json();
    },

    getChartData: async (studentId: string, metricId: string) => {
        const res = await request(`/Analytics/chart?studentId=${studentId}&metricId=${metricId}`, 'GET')

        if(!res.ok) {
            throw new Error("Не удалось загрузить данные для графика");
        }

        return res.json();
    },

    getRecommendations: async (studentId: string) => {
        const res = await request(`/Analytics/recommendations?studentId=${studentId}`, 'GET')

        if(!res.ok) {
            throw new Error("Не удалось загрузить данные для рекомендаций");
        }

        return res.json();
    },

        getRatingOverall: async (studentId: string) => {
        const res = await request(`/Analytics/ratingOverall?studentId=${studentId}`, 'GET')

        if(!res.ok) {
            throw new Error("Не удалось загрузить данные для рекомендаций");
        }

        return res.json();
    },
}