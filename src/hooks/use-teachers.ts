import { useEffect, useState, useCallback } from 'react';
import { teachers as defaultTeachers, Teacher } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_teachers_v1';

export default function useTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultTeachers;
            const parsed = JSON.parse(raw) as Teacher[];
            return Array.isArray(parsed) ? parsed : defaultTeachers;
        } catch (err) {
            console.error('Failed to read teachers from localStorage', err);
            return defaultTeachers;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
        } catch (err) {
            console.error('Failed to write teachers to localStorage', err);
        }
    }, [teachers]);

    const add = useCallback((t: Omit<Teacher, 'id' | 'role' | 'isFirstLogin'>) => {
        setTeachers(prev => {
            const newTeacher: Teacher = {
                ...t,
                id: Date.now().toString(),
                role: 'teacher',
                isFirstLogin: true,
            };
            return [newTeacher, ...prev];
        });
    }, []);

    const update = useCallback((id: string, patch: Partial<Teacher>) => {
        setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
    }, []);

    const remove = useCallback((id: string) => {
        setTeachers(prev => prev.filter(t => t.id !== id));
    }, []);

    return { teachers, add, update, remove, setTeachers } as const;
}
