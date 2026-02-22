import axiosInstance, { setAuthToken } from './axios';
import { authenticateUser } from '@/lib/mock-data';

export const login = async (credentials: any) => {
    try {
        const response = await axiosInstance.post('/user/login', credentials);

        console.log('Login API response:', response.data.authToken); // Debugging: Log the response

        // Set the token globally for axios
        if (response.data && response.data.authToken) {
            setAuthToken(response.data.token);
        }

        return response.data;
    } catch (error) {
        console.warn('API login failed, falling back to mock data', error);

        console.error('Login request failed:', {
            url: '/user/login',
            payload: credentials,
            error: error.response ? error.response.data : error.message,
        });

        if (error.response && error.response.status === 500) {
            throw new Error('Server error occurred. Please try again later.');
        }

        // Check if the error has a response with a message
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }

        // Fallback to mock data
        const result = authenticateUser(credentials.email, credentials.password);
        if (result) {
            return result;
        }

        // Throw a generic error if no specific message is available
        throw new Error('Login failed. Please check your credentials and try again.');
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
