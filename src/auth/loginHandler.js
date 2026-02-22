import axios from 'axios';
import { setAuthToken } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';

const backendUrl = 'http://localhost:8081/Vidyastra';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${backendUrl}/user/login`, { email, password });
        const { token, user } = response.data;

        if (token && user) {
            // Save token and user data in local storage
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('authToken', token);

            // Set token globally for axios
            setAuthToken(token);

            // Use the useAuth hook to update the authentication state
            const { setToken } = useAuth();
            setToken(user);

            // Redirect based on user role
            if (user.role === 1) {
                window.location.href = '/admin-dashboard';
            } else if (user.role === 2) {
                window.location.href = '/teacher-dashboard';
            } else if (user.role === 3) {
                window.location.href = '/student-dashboard';
            } else {
                console.error('Invalid role');
            }
        } else {
            throw new Error('Invalid login response.');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
};

export default login;