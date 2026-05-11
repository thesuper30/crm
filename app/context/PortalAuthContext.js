"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useClients } from './ClientContext';

const PortalAuthContext = createContext();

export function PortalAuthProvider({ children }) {
    const { clients } = useClients();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('portal_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const client = clients.find(c => c.portalEmail === email && c.portalPassword === password);
        if (client) {
            const userData = {
                id: client.id,
                name: client.name,
                email: client.portalEmail,
                role: 'Client Admin' // Default for now
            };
            setUser(userData);
            if (typeof window !== 'undefined') {
                localStorage.setItem('portal_user', JSON.stringify(userData));
            }
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('portal_user');
        }
    };

    return (
        <PortalAuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </PortalAuthContext.Provider>
    );
}

export function usePortalAuth() {
    const context = useContext(PortalAuthContext);
    if (!context) {
        throw new Error('usePortalAuth must be used within a PortalAuthProvider');
    }
    return context;
}
