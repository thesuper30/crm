"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const BillingContext = createContext();

export function BillingProvider({ children }) {
    const [billingCards, setBillingCards] = useState([]);

    // Persistence
    useEffect(() => {
        try {
            const saved = localStorage.getItem('agency_billing');
            if (saved) {
                setBillingCards(JSON.parse(saved));
            } else {
                setBillingCards([
                    {
                        id: 'b1',
                        clientId: 'c1',
                        title: 'January Retainer',
                        retainerFee: 5000,
                        advancePaid: 2000,
                        dueDate: '2026-01-05',
                        paidDate: '2026-01-04',
                        status: 'paid'
                    },
                    {
                        id: 'b2',
                        clientId: 'c1',
                        title: 'February Retainer',
                        retainerFee: 5000,
                        advancePaid: 0,
                        dueDate: '2026-02-05',
                        paidDate: null,
                        status: 'pending'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error parsing billing data from localStorage:', error);
            setBillingCards([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('agency_billing', JSON.stringify(billingCards));
    }, [billingCards]);

    const addBillingCard = (card) => {
        const newCard = {
            ...card,
            id: `bill_${Date.now()}`,
            status: card.status || 'pending'
        };
        setBillingCards(prev => [...prev, newCard]);
    };

    const updateBillingCard = (id, updates) => {
        setBillingCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteBillingCard = (id) => {
        setBillingCards(prev => prev.filter(c => c.id !== id));
    };

    const getBillingByClient = (clientId) => billingCards.filter(c => c.clientId === clientId);

    return (
        <BillingContext.Provider value={{
            billingCards,
            addBillingCard,
            updateBillingCard,
            deleteBillingCard,
            getBillingByClient
        }}>
            {children}
        </BillingContext.Provider>
    );
}

export const useBilling = () => useContext(BillingContext);
