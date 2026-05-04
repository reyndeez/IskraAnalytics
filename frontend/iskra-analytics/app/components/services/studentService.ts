import { request } from "./api"

export const studentService = {
    getChildren: async () => {
        const res = await request('/Students/my-children', 'GET');

        if(!res.ok){
            throw new Error("Не удалось загрузить детей");
        }

        return res.json();    
    }
}