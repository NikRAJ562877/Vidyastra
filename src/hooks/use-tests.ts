import { useEffect, useState, useCallback } from 'react';
import { tests as defaultTests, Test } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_tests_v1';

export default function useTests() {
    const [tests, setTests] = useState<Test[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultTests;
            const parsed = JSON.parse(raw) as Test[];
            return Array.isArray(parsed) ? parsed : defaultTests;
        } catch (err) {
            console.error('Failed to read tests from localStorage', err);
            return defaultTests;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
        } catch (err) {
            console.error('Failed to write tests to localStorage', err);
        }
    }, [tests]);

    const add = useCallback((t: Omit<Test, 'id'>) => {
        setTests(prev => {
            const newTest: Test = {
                ...t,
                id: Date.now().toString(),
            };
            return [newTest, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    }, []);

    const remove = useCallback((id: string) => {
        setTests(prev => prev.filter(t => t.id !== id));
    }, []);

    return { tests, add, remove, setTests } as const;
}
