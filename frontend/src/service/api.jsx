import axios from 'axios';

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
const LOGIN_URL = '/login';

const api = axios.create({
    baseURL: BACKEND_URL,  // Use the environment variable for the base URL
    headers: {
        'Content-Type': 'application/json'
    }
});

async function login(email, password) {
    try {
        const response = await api.post(LOGIN_URL, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response || error);
        throw error;
    }
}

export { login };
