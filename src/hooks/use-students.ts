import { useEffect, useState, useCallback } from 'react';
import { students as defaultStudents, Student } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_students_v1';

export default function useStudents() {
    const [students, setStudents] = useState<Student[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultStudents;
            const parsed = JSON.parse(raw) as Student[];
            return Array.isArray(parsed) ? parsed : defaultStudents;
        } catch (err) {
            console.error('Failed to read students from localStorage', err);
            return defaultStudents;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        } catch (err) {
            console.error('Failed to write students to localStorage', err);
        }
    }, [students]);

    const add = useCallback((s: Omit<Student, 'id' | 'uniqueId' | 'enrollmentStatus' | 'isFirstLogin' | 'role'>) => {
        setStudents(prev => {
            const newStudent: Student = {
                ...s,
                id: Date.now().toString(),
                uniqueId: `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                enrollmentStatus: 'confirmed',
                isFirstLogin: true,
                role: 'student',
            };
            return [newStudent, ...prev];
        });
    }, []);

    const update = useCallback((id: string, patch: Partial<Student>) => {
        setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    const remove = useCallback((id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    }, []);

    return { students, add, update, remove, setStudents } as const;
}
