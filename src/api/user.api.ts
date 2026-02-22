import axiosInstance from './axios';
import { students, teachers } from '@/lib/mock-data';

export const getUserProfile = async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
};

export const updateUserProfile = async (data: any) => {
    const response = await axiosInstance.patch('/user/profile', data);
    return response.data;
};
export const getadmin = async () => {
    try {
        const response = await axiosInstance.get('/1');
        return response.data;
    } catch (error) {
        return students;
    }
};

export const getStudents = async () => {
    try {
        const response = await axiosInstance.get('/students');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error; // Re-throw the error to handle it at a higher level
    }
};

export const getTeachers = async () => {
    try {
        const response = await axiosInstance.get('/teachers');
        return response.data;
    } catch (error) {
        return teachers;
    }
};
