import { useState, useCallback } from 'react';

const AUTH_KEY = 'auth_user';

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

    const getToken = useCallback(() => {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            return parsed.token || null;
        } catch (err) {
            return null;
        }
    }, []);

    const setToken = useCallback((userData: any) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        setUser(userData);
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
