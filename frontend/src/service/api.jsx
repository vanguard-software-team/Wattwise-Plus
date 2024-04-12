import axios from 'axios';

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
const LOGIN_URL = '/login/';


function saveTokens({ access, refresh }) {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
}


const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function login(email, password) {
    try {
        const response = await api.post(LOGIN_URL, { email, password });
        console.log(response.data);
        saveTokens(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export { login };
