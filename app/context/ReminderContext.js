"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ReminderContext = createContext();

export function ReminderProvider({ children }) {
    const [reminders, setReminders] = useState([]);

    // Persistence
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedReminders = localStorage.getItem('agency_reminders');
                if (savedReminders) {
                    setReminders(JSON.parse(savedReminders));
                } else {
                    setReminders([
                        { id: 'rem1', text: 'Call TechFlow for Q3 pitch', time: 'Today 2:00 PM', isDone: false },
                        { id: 'rem2', text: 'Renew SEO subscription', time: 'Monday 10:00 AM', isDone: false }
                    ]);
                }
            } catch (error) {
                console.error('Error parsing reminders from localStorage:', error);
                setReminders([
                    { id: 'rem1', text: 'Call TechFlow for Q3 pitch', time: 'Today 2:00 PM', isDone: false },
                    { id: 'rem2', text: 'Renew SEO subscription', time: 'Monday 10:00 AM', isDone: false }
                ]);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('agency_reminders', JSON.stringify(reminders));
        }
    }, [reminders]);

    const addReminder = (text, time) => {
        const newReminder = {
            id: `rem_${Date.now()}`,
            text,
            time: time || 'Soon',
            isDone: false,
            createdAt: new Date().toISOString()
        };
        setReminders(prev => [newReminder, ...prev]);
    };

    const toggleReminder = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, isDone: !r.isDone } : r));
    };

    const deleteReminder = (id) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <ReminderContext.Provider value={{
            reminders,
            addReminder,
            toggleReminder,
            deleteReminder
        }}>
            {children}
        </ReminderContext.Provider>
    );
}

export const useReminders = () => useContext(ReminderContext);
