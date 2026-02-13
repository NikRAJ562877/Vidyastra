import { useEffect, useState, useCallback } from 'react';
import { enrollments as defaultEnrollments, Enrollment } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_enrollments_v1';

export default function useEnrollments() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultEnrollments;
            const parsed = JSON.parse(raw) as Enrollment[];
            return Array.isArray(parsed) ? parsed : defaultEnrollments;
        } catch (err) {
            console.error('Failed to read enrollments from localStorage', err);
            return defaultEnrollments;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
        } catch (err) {
            console.error('Failed to write enrollments to localStorage', err);
        }
    }, [enrollments]);

    const add = useCallback((e: Omit<Enrollment, 'id' | 'uniqueId' | 'date'>) => {
        setEnrollments(prev => {
            const newEnrollment: Enrollment = {
                ...e,
                id: Date.now().toString(),
                uniqueId: `ENR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                date: new Date().toISOString().split('T')[0],
            };
            return [newEnrollment, ...prev];
        });
    }, []);

    const updateStatus = useCallback((id: string, status: Enrollment['status']) => {
        setEnrollments(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
    }, []);

    const remove = useCallback((id: string) => {
        setEnrollments(prev => prev.filter(e => e.id !== id));
    }, []);

    return { enrollments, add, updateStatus, remove, setEnrollments } as const;
}
