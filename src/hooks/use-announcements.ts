import { useEffect, useState, useCallback } from 'react';
import { defaultAnnouncements, Announcement } from '@/lib/mock-data';

const STORAGE_KEY = 'announcements_v1';

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultAnnouncements;
      const parsed = JSON.parse(raw) as Announcement[];
      return Array.isArray(parsed) && parsed.length ? parsed : defaultAnnouncements;
    } catch (err) {
      console.error('Failed to read announcements from localStorage', err);
      return defaultAnnouncements;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    } catch (err) {
      console.error('Failed to write announcements to localStorage', err);
    }
  }, [announcements]);

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? (JSON.parse(e.newValue) as Announcement[]) : defaultAnnouncements;
        setAnnouncements(parsed);
      } catch (err) {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((a: Omit<Announcement, 'id'>) => {
    setAnnouncements(prev => {
      const next = [{ ...a, id: Date.now() }, ...prev];
      return next;
    });
  }, []);

  const update = useCallback((id: Announcement['id'], patch: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const remove = useCallback((id: Announcement['id']) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  const replaceAll = useCallback((next: Announcement[]) => setAnnouncements(next), []);

  return { announcements, add, update, remove, replaceAll, setAnnouncements } as const;
}
