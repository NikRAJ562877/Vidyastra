import { useState, useCallback } from 'react';

const AUTH_KEY = 'authUser';


export const useAuth = () => {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error('Failed to parse auth user', err);
            return null;
        }
    });

    const clearDummyData = useCallback(() => {
        const keysToRemove = [
            'vidyastara_achievers_v1',
            'vidyastara_courses_v1',
            'vidyastara_marks_v1',
            'vidyastara_tests_v1',
        ];
        keysToRemove.forEach((key) => {
            if (key !== AUTH_KEY && key !== 'authToken') {
                localStorage.removeItem(key);
            }
        });
    }, []);

    clearDummyData(); // Clear dummy data on initialization

    const getToken = useCallback(() => {
        const token = localStorage.getItem('authToken');
        return token || null;
    }, []);

    const setToken = useCallback((data: any) => {
        if (!data || !data.authToken) {
            console.error('Invalid auth response');
            return;
        }
    
        // Save token separately
        localStorage.setItem('authToken', data.authToken);
    
        // Save user info as JSON
        const userObject = {
            user_id: data.user_id,
           // username: data.username,
            role_id: data.role_id,
        };
    
        localStorage.setItem(AUTH_KEY, JSON.stringify(userObject));
        setUser(userObject);
    
    }, []);

    const removeToken = useCallback(() => {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
    }, []);

    const logout = useCallback(() => {
        removeToken();
        // Optional: call logout API if needed
        window.location.href = '/login';
    }, [removeToken]);

    return {
        user,
        getToken,
        setToken,
        removeToken,
        logout,
        isAuthenticated: !!user,
    };
};
