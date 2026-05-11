"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const NoteContext = createContext();

export function NoteProvider({ children }) {
    const [notes, setNotes] = useState([]);

    // Persistence
    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem('agency_notes');
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            } else {
                setNotes([
                    {
                        id: 'n1',
                        clientId: 'c1',
                        title: 'Q3 Strategy Meeting',
                        content: 'Focus on scaling LinkedIn ads. Client wants +20% leads.',
                        color: '#fff9db', // Yellow
                        isPinned: true,
                        type: 'text',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'n2',
                        clientId: 'c1',
                        title: 'Onboarding Checklist',
                        checklist: [
                            { id: 1, text: 'Access to Google Ads', completed: true },
                            { id: 2, text: 'Brand guidelines shared', completed: false },
                            { id: 3, text: 'Kickoff call scheduled', completed: false }
                        ],
                        color: '#e7f5ff', // Blue
                        isPinned: false,
                        type: 'checklist',
                        createdAt: new Date().toISOString()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error parsing notes from localStorage:', error);
            setNotes([]); // Default to empty array on error
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('agency_notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = (note) => {
        const newNote = {
            ...note,
            id: `note_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isPinned: false,
            color: note.color || '#ffffff'
        };
        setNotes(prev => [newNote, ...prev]);
    };

    const updateNote = (id, updates) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
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
