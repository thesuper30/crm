"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('molten_messages');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Save to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem('molten_messages', JSON.stringify(messages));
    }, [messages]);

    // Cross-tab sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'molten_messages' && e.newValue) {
                setMessages(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const sendMessage = useCallback((contextId, text, senderName, senderRole) => {
        const newMessage = {
            id: Date.now(),
            contextId, // Typically clientId
            text,
            senderName,
            senderRole,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    const getMessagesByContext = useCallback((contextId) => {
        return messages.filter(m => m.contextId === contextId);
    }, [messages]);

    return (
        <MessageContext.Provider value={{
            messages,
            sendMessage,
            getMessagesByContext
        }}>
            {children}
        </MessageContext.Provider>
    );
}

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error('useMessages must be used within a MessageProvider');
    return context;
};
