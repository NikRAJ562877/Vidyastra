import axios from 'axios';

const backendUrl = 'http://localhost:8081/Vidyastra';
const axiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

let token: string | null = null;
let logoutCallback: (() => void) | null = null;

export const setAuthToken = (authToken: string | null) => {
    token = authToken;
};

export const setLogoutCallback = (callback: () => void) => {
    logoutCallback = callback;
};

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    async (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., logout user)
            if (logoutCallback) {
                logoutCallback();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
