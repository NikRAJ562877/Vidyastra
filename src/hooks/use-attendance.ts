import { useEffect, useState, useCallback } from 'react';
import { attendance as defaultAttendance, Attendance } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_attendance_v1';

export default function useAttendance() {
    const [attendance, setAttendance] = useState<Attendance[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultAttendance;
            const parsed = JSON.parse(raw) as Attendance[];
            return Array.isArray(parsed) ? parsed : defaultAttendance;
        } catch (err) {
            console.error('Failed to read attendance from localStorage', err);
            return defaultAttendance;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
        } catch (err) {
            console.error('Failed to write attendance to localStorage', err);
        }
    }, [attendance]);

    const markAttendance = useCallback((studentId: string, status: Attendance['status'], date?: string) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        setAttendance(prev => {
            const filtered = prev.filter(a => !(a.studentId === studentId && a.date === targetDate));
            return [...filtered, { studentId, status, date: targetDate }];
        });
    }, []);

    const getAttendanceByDate = useCallback((date: string) => {
        return attendance.filter(a => a.date === date);
    }, [attendance]);

    return { attendance, markAttendance, getAttendanceByDate, setAttendance } as const;
}
