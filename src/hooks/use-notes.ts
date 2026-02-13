import { useEffect, useState, useCallback } from 'react';
import { notes as defaultNotes, Note } from '@/lib/mock-data';

const STORAGE_KEY = 'vidyastara_notes_v1';

export default function useNotes() {
    const [notes, setNotes] = useState<Note[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultNotes;
            const parsed = JSON.parse(raw) as Note[];
            return Array.isArray(parsed) ? parsed : defaultNotes;
        } catch (err) {
            console.error('Failed to read notes from localStorage', err);
            return defaultNotes;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch (err) {
            console.error('Failed to write notes to localStorage', err);
        }
    }, [notes]);

    const addNote = useCallback((note: Omit<Note, 'id' | 'date'>) => {
        setNotes(prev => {
            const newNote: Note = {
                ...note,
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0]
            };
            return [newNote, ...prev];
        });
    }, []);

    const removeNote = useCallback((id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    return { notes, addNote, removeNote, setNotes } as const;
}
