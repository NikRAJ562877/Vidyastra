import axiosInstance from './axios';

// AI Base URL instance if needed, or just use another axios instance
import axios from 'axios';

const aiAxios = axios.create({
    baseURL: import.meta.env.VITE_AI_BASE_URL,
});

export const getMealPlan = async (data: any) => {
    const response = await aiAxios.post('/meal-plan', data);
    return response.data;
};
