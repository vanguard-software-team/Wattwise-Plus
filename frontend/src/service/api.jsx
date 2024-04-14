import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const BACKEND_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
const LOGIN_URL = '/login/';
const REFRESH_URL = '/token/refresh/';


function saveAccessToken(accessToken) {
    sessionStorage.setItem('access', accessToken);
}

function getDecodedToken() {
    const token = sessionStorage.getItem('access');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}

function isAuthenticated() {
    const decodedToken = getDecodedToken();
    if (!decodedToken) return false;

    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
        console.log("Token expired.");
        return false;
    }
    return true;
}

function getUserType() {
    const decodedToken = getDecodedToken();
    return decodedToken ? decodedToken.user_type : null;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

function getUserRole() {
    const token = getDecodedToken();
    return token ? token.user_type : null;
}

function getRoleBasedRedirectPath() {
    const role = getUserRole();
    if (role === 'consumer') return '/dashboard';
    if (role === 'provider') return '/provider/dashboard';
    return '/login'; // default redirect if role is undefined or not recognized
}


async function login(email, password) {
    try {
        const response = await api.post(LOGIN_URL, { email, password });
        const { access } = response.data;
        saveAccessToken(access);
        return { access };
    } catch (error) {
        throw error;
    }
}

async function refreshToken() {
    try {
        const response = await api.post(REFRESH_URL);
        const { access } = response.data;
        saveAccessToken(access);
        return access;
    } catch (error) {
        throw error;
    }
}




export { login, refreshToken, getDecodedToken, isAuthenticated, getUserType, getRoleBasedRedirectPath};
