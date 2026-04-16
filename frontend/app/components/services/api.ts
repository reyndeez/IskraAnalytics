const API_URL = "http://localhost:5172/api";

export async function request(endpoint: string, method = 'GET', body:any = null) {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

if(token && token !== "undefined" && token !== "null") {
    const cleanToken = token.trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
}
    const config: RequestInit = {
        method,
        headers,
    };

    console.log("Token for header:", token);

    if(body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if(response.status === 401){
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return response;
}