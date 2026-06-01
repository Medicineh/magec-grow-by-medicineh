import { useState, useEffect } from 'react';
import { persistentStorage } from '@/lib/browserStorage';
export interface LogEntry {
    id: string;
    date: string; // ISO format
    type: 'Riego' | 'Abono' | 'Poda' | 'Plagas' | 'Cosecha' | 'Nota';
    description: string;
    images?: string[]; // Arrays of base64 strings or URLs
}

export function useLogbook() {
    const [entries, setEntries] = useState<LogEntry[]>(() => {
        const saved = persistentStorage.getJSON<LogEntry[]>('lanzarote-grower-logbook');
        return saved ?? [];
    });

    useEffect(() => {
        persistentStorage.setJSON('lanzarote-grower-logbook', entries);
    }, [entries]);

    const addEntry = (entry: Omit<LogEntry, 'id'>) => {
        const newEntry = { ...entry, id: crypto.randomUUID() };
        setEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const deleteEntry = (id: string) => {
        setEntries(prev => prev.filter(e => e.id !== id));
    };

    const updateEntry = (id: string, updated: Partial<LogEntry>) => {
        setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return { entries, addEntry, deleteEntry, updateEntry };
}
