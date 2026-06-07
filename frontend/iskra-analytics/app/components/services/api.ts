//const API_URL = "http://localhost:5172/api";
const API_URL = "http://153.80.184.141:5000";
//ПОМЕНЯТЬ

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
};

export async function request(endpoint: string, method = 'GET', body: any = null) {
    const token = getCookie('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token && token !== "undefined" && token !== "null") {
        const cleanToken = token.trim();
        headers['Authorization'] = `Bearer ${cleanToken}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    console.log("Token for header from cookies:", token);

    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        window.location.href = '/';
    }

    return response;
}