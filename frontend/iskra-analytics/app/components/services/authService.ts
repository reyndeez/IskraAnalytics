import { LoginRequest } from "../../models/requests/authRequests";
import { request } from "./api";
import { AuthResponse } from "../../models/responses/authResponse";

//Регистрация
export const registerService = {
    register: async (data: LoginRequest) : Promise<void> => {
        const res = await request('/Auth/register', 'POST', data);
        if(!res.ok) throw new Error("Ошибка регистрации");
    }
};

//Авторизация
export const loginService = {
    login: async (data: LoginRequest) : Promise<AuthResponse> => {
        const res = await request('/Auth/login', 'POST', data)
        if(!res.ok)throw new Error("Ошибка входа");
        return res.json();
    }
};