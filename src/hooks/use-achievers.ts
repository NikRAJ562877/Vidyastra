import { useEffect, useState, useCallback } from 'react';
import { students } from '@/lib/mock-data';

export interface Achiever {
  id: string;
  studentId?: string;
  name: string;
  class: string;
  avg: number;
  rank: number;
  imageUrl?: string;
  isCustom?: boolean;
  category: 'ALL' | 'NEET' | 'JEE' | 'CLASSES 6-10';
}

const STORAGE_KEY = 'vidyastara_achievers_v1';

// Seed initial achievers
const getInitialAchievers = (): Achiever[] => {
  const categories: Achiever['category'][] = ['NEET', 'JEE', 'CLASSES 6-10'];
  
  return students
    .map((s, idx) => {
      const mockAvg = 85 + Math.random() * 10;
      // Cyclically assign categories for seed data
      const category = categories[idx % categories.length];
      
      return {
        id: `seed-${s.id}`,
        studentId: s.id,
        name: s.name,
        class: s.class,
        avg: mockAvg,
        rank: 0,
        isCustom: false,
        category: category
      };
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10) // More seeds for marquee
    .map((a, i) => ({ ...a, rank: i + 1 }));
};

export default function useAchievers() {
  const [achievers, setAchievers] = useState<Achiever[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getInitialAchievers();
      const parsed = JSON.parse(raw) as Achiever[];
      return Array.isArray(parsed) && parsed.length ? parsed : getInitialAchievers();
    } catch (err) {
      console.error('Failed to read achievers from localStorage', err);
      return getInitialAchievers();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievers));
    } catch (err) {
      console.error('Failed to write achievers to localStorage', err);
    }
  }, [achievers]);

  const add = useCallback((a: Omit<Achiever, 'id' | 'rank'>) => {
    setAchievers(prev => {
      const newAchiever = { 
        ...a, 
        id: Date.now().toString(),
        rank: prev.length + 1
      };
      return [...prev, newAchiever];
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<Achiever>) => {
    setAchievers(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const remove = useCallback((id: string) => {
    setAchievers(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // Re-rank
      return filtered.map((a, i) => ({ ...a, rank: i + 1 }));
    });
  }, []);

  const reorder = useCallback((startIndex: number, endIndex: number) => {
    setAchievers(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((a, i) => ({ ...a, rank: i + 1 }));
    });
  }, []);

  return { achievers, add, update, remove, reorder, setAchievers } as const;
}
