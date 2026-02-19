import axiosInstance from './axios';
import { authenticateUser } from '@/lib/mock-data';

export const login = async (credentials: any) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.warn('API login failed, falling back to mock data', error);
        const result = authenticateUser(credentials.email, credentials.password);
        if (result) {
            return result;
        }
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    } catch (error) {
        return { success: true };
    }
};

export const changePassword = async (data: any) => {
    try {
        const response = await axiosInstance.post('/auth/change-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};
