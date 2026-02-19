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

export const getStudents = async () => {
    try {
        const response = await axiosInstance.get('/students');
        return response.data;
    } catch (error) {
        return students;
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
