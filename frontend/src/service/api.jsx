import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const BACKEND_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
const LOGIN_URL = '/login/';
const REFRESH_URL = '/token/refresh/';


function saveAccessToken(accessToken, refreshToken) {
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
}

function getDecodedToken() {
    const token = localStorage.getItem('access');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        return null;
    }
}

async function isAuthenticated() {
    const decodedToken = getDecodedToken();
    if (!decodedToken) return false;

    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
        try {
            const access = await refreshToken();
            if (!access) {
                logout();
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
    return true;
}


function getUserType() {
    const decodedToken = getDecodedToken();
    return decodedToken ? decodedToken.user_type : null;
}

function getUserEmail() {
    const decodedToken = getDecodedToken();
    return decodedToken ? decodedToken.email : null;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

function getUserRole() {
    const token = getDecodedToken();
    return token ? token.user_type : null;
}

function getRoleBasedRedirectPath() {
    const role = getUserRole();
    if (role === 'consumer') return '/dashboard';
    if (role === 'provider') return '/provider/dashboard';
    return '/login';
}



async function login(email, password) {
    try {
        const response = await api.post(LOGIN_URL, { email, password });
        const { access, refresh } = response.data;
        saveAccessToken(access, refresh);
        return { access, refresh };
    } catch (error) {
        throw error;
    }
}

function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/';
}


function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
        return null;
    }

    return api.post(REFRESH_URL, { refresh: refresh })
        .then((response) => {
            const { access } = response.data;
            saveAccessToken(access, refresh);
            return access;
        })
        .catch((error) => {
            return null;
        });
}


// DATA FETCHING FUNCTIONS

async function fetchData(endpoint, params = {}) {
    if (!(await isAuthenticated())) {
        console.error("User is not authenticated or token could not be refreshed.");
        return null;
    }

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
        console.error("No access token available.");
        return null;
    }

    try {
        const response = await api.get(endpoint, {
            params: params,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;  
    }
}


async function getConsumerConsumptionHourly(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/consumption/hourly', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getConsumerConsumptionDaily(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/consumption/daily', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getConsumerConsumptionWeekly(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/consumption/weekly', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getConsumerConsumptionMonthly(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/consumption/monthly', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}


async function getConsumerConsumptionAggregateHourly(email) {
    return fetchData('/consumer/aggregate/hours', {
        email: email
    });
}

async function getConsumerConsumptionAggregateDaily(email) {
    return fetchData('/consumer/aggregate/days', {
        email: email
    });
}

async function getConsumerConsumptionAggregateMonthly(email) {
    return fetchData('/consumer/aggregate/months', {
        email: email
    });
}


async function getConsumerInfo(email) {
    return fetchData('/consumer', {
        email: email
    });
}

async function getConsumerInfoByPSN(power_supply_number) {
    return fetchData('/consumer/info/psn', {
        power_supply_number: power_supply_number
    });
}


async function getClusterInfo(cluster_id) {
    return fetchData('/cluster/info', {
        cluster_id: cluster_id
    });
}

async function getClusterConsumptionHourly(cluster_id, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    const test = fetchData('/cluster/consumption/hourly', {
        cluster_id: cluster_id,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
    return test;
}

async function getClusterConsumptionDaily(cluster_id, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/cluster/consumption/daily', {
        cluster_id: cluster_id,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getClusterConsumptionMonthly(cluster_id, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/cluster/consumption/monthly', {
        cluster_id: cluster_id,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getConsumerForecatistingHourly(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/forecasting/consumption/hourly', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getClusterConsumptionAggregateHourly(cluster_id) {
    return fetchData('/cluster/aggregate/hours', {
        cluster_id: cluster_id
    });
}

async function getClusterConsumptionAggregateDaily(cluster_id) {
    return fetchData('/cluster/aggregate/days', {
        cluster_id: cluster_id
    });
}

async function getClusterConsumptionAggregateMonthly(cluster_id) {
    return fetchData('/cluster/aggregate/months', {
        cluster_id: cluster_id
    });
}


async function getConsumerForecatistingDaily(email, startDate, endDate) {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    return fetchData('/consumer/forecasting/consumption/daily', {
        email: email,
        start_date: formattedStartDate,
        end_date: formattedEndDate
    });
}

async function getOutliers() {
    return fetchData('/outliers', {});
}







export {
    login,
    logout,
    refreshToken,
    getDecodedToken,
    isAuthenticated,
    getUserType,
    getUserEmail,
    getConsumerInfo,
    getClusterInfo,
    getRoleBasedRedirectPath,
    getConsumerConsumptionHourly,
    getConsumerConsumptionDaily,
    getConsumerConsumptionWeekly,
    getConsumerConsumptionMonthly,
    getConsumerConsumptionAggregateHourly,
    getConsumerConsumptionAggregateDaily,
    getConsumerConsumptionAggregateMonthly,
    getClusterConsumptionHourly,
    getClusterConsumptionDaily,
    getClusterConsumptionMonthly,
    getClusterConsumptionAggregateHourly,
    getClusterConsumptionAggregateDaily,
    getClusterConsumptionAggregateMonthly,
    getOutliers,
    getConsumerForecatistingHourly,
    getConsumerForecatistingDaily,
    getConsumerInfoByPSN
};
