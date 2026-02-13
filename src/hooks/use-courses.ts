import { useEffect, useState, useCallback } from 'react';
import { courses as defaultCourses, Course } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_courses_v1';

export default function useCourses() {
    const [courses, setCourses] = useState<Course[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultCourses;
            const parsed = JSON.parse(raw) as Course[];
            return Array.isArray(parsed) && parsed.length ? parsed : defaultCourses;
        } catch (err) {
            console.error('Failed to read courses from localStorage', err);
            return defaultCourses;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        } catch (err) {
            console.error('Failed to write courses to localStorage', err);
        }
    }, [courses]);

    // sync across tabs
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY) return;
            try {
                const parsed = e.newValue ? (JSON.parse(e.newValue) as Course[]) : defaultCourses;
                setCourses(parsed);
            } catch (err) {
                /* ignore */
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const add = useCallback((c: Omit<Course, 'id'>) => {
        setCourses(prev => {
            const newCourse = { ...c, id: Date.now().toString() };
            return [...prev, newCourse];
        });
    }, []);

    const update = useCallback((id: string, patch: Partial<Course>) => {
        setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
    }, []);

    const remove = useCallback((id: string) => {
        setCourses(prev => prev.filter(c => c.id !== id));
    }, []);

    return { courses, add, update, remove, setCourses } as const;
}
