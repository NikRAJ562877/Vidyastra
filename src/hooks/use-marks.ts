import { useEffect, useState, useCallback } from 'react';
import { marks as defaultMarks, Mark } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_marks_v1';

export default function useMarks() {
    const [marks, setMarks] = useState<Mark[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultMarks;
            const parsed = JSON.parse(raw) as Mark[];
            return Array.isArray(parsed) ? parsed : defaultMarks;
        } catch (err) {
            console.error('Failed to read marks from localStorage', err);
            return defaultMarks;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
        } catch (err) {
            console.error('Failed to write marks to localStorage', err);
        }
    }, [marks]);

    const updateMark = useCallback((testId: string, studentId: string, subject: string, marksValue: number | null, totalMarks: number = 100) => {
        setMarks(prev => {
            const existingIndex = prev.findIndex(m => m.testId === testId && m.studentId === studentId && m.subject === subject);
            
            if (existingIndex > -1) {
                // Update existing
                const newList = [...prev];
                newList[existingIndex] = { ...newList[existingIndex], marks: marksValue, totalMarks };
                return newList;
            } else {
                // Add new
                const newMark: Mark = {
                    id: `MARK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    testId,
                    studentId,
                    subject,
                    marks: marksValue,
                    totalMarks
                };
                return [...prev, newMark];
            }
        });
    }, []);

    const batchUpdate = useCallback((newMarks: Mark[]) => {
        setMarks(prev => {
            const newList = [...prev];
            newMarks.forEach(nm => {
                const index = newList.findIndex(m => m.testId === nm.testId && m.studentId === nm.studentId && m.subject === nm.subject);
                if (index > -1) {
                    newList[index] = nm;
                } else {
                    newList.push(nm);
                }
            });
            return newList;
        });
    }, []);

    return { marks, updateMark, batchUpdate, setMarks } as const;
}
