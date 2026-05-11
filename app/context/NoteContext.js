"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const NoteContext = createContext();

const mapNote = (n) => ({
    ...n,
    clientId: n.client_id,
    createdAt: n.created_at
});

const unmapNote = (n) => {
    const out = {
        title: n.title,
        content: n.content,
        color: n.color,
        is_pinned: n.is_pinned !== undefined ? n.is_pinned : n.isPinned,
        client_id: n.clientId || n.client_id
    };
    // Remove undefined fields
    Object.keys(out).forEach(key => out[key] === undefined && delete out[key]);
    return out;
};

export function NoteProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
        const channel = supabase
            .channel('public:notes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setNotes(prev => [mapNote(payload.new), ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setNotes(prev => prev.map(n => n.id === payload.new.id ? mapNote(payload.new) : n));
                } else if (payload.eventType === 'DELETE') {
                    setNotes(prev => prev.filter(n => n.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotes = async () => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            setNotes(data.map(mapNote));
        }
        setIsLoading(false);
    };

    const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const addNote = async (note) => {
        const id = generateUUID();
        const dbNote = {
            ...unmapNote(note),
            id,
            created_at: new Date().toISOString(),
            is_pinned: note.isPinned || false,
            color: note.color || '#ffffff'
        };

        const { data, error } = await supabase
            .from('notes')
            .insert([dbNote])
            .select();

        if (error) {
            console.error('Error adding note:', error);
            return null;
        }
        return mapNote(data[0]);
    };

    const updateNote = async (id, updates) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
        const dbUpdates = unmapNote(updates);
        if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;
        
        const { error } = await supabase
            .from('notes')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating note:', error);
            fetchNotes();
        }
    };

    const deleteNote = async (id) => {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
        }
    };

    const getNotesByClient = (clientId) => notes.filter(n => n.clientId === clientId);

    return (
        <NoteContext.Provider value={{
            notes,
            addNote,
            updateNote,
            deleteNote,
            getNotesByClient
        }}>
            {children}
        </NoteContext.Provider>
    );
}

export const useNotes = () => useContext(NoteContext);
