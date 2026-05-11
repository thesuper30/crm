"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CampaignContext = createContext();

const mapCampaign = (c) => ({
    ...c,
    clientId: c.client_id,
    startDate: c.start_date,
    endDate: c.end_date,
    createdAt: c.created_at
});

const unmapCampaign = (c) => {
    const out = {
        name: c.name,
        status: c.status,
        budget: c.budget,
        spend: c.spend,
        progress: c.progress,
        client_id: c.clientId || c.client_id,
        start_date: c.startDate || c.start_date,
        end_date: c.endDate || c.end_date
    };
    // Remove undefined fields
    Object.keys(out).forEach(key => out[key] === undefined && delete out[key]);
    return out;
};

export function CampaignProvider({ children }) {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch & Realtime Subscription
    useEffect(() => {
        fetchCampaigns();

        const channel = supabase
            .channel('public:campaigns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setCampaigns(prev => [...prev, mapCampaign(payload.new)]);
                } else if (payload.eventType === 'UPDATE') {
                    setCampaigns(prev => prev.map(c => c.id === payload.new.id ? mapCampaign(payload.new) : c));
                } else if (payload.eventType === 'DELETE') {
                    setCampaigns(prev => prev.filter(c => c.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            setCampaigns(data.map(mapCampaign));
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

    const addCampaign = async (campaignData) => {
        const id = campaignData.id || generateUUID();
        const dbCampaign = {
            ...unmapCampaign(campaignData),
            id,
            status: campaignData.status || 'Planning',
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('campaigns')
            .insert([dbCampaign])
            .select();

        if (error) {
            console.error('Error adding campaign:', error);
            return null;
        }
        return mapCampaign(data[0]);
    };

    const updateCampaign = async (id, updates) => {
        // Optimistic update
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        const dbUpdates = unmapCampaign(updates);
        const { error } = await supabase
            .from('campaigns')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating campaign:', error);
            fetchCampaigns();
        }
    };

    const deleteCampaign = async (id) => {
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting campaign:', error);
        }
    };

    const getCampaignsByClient = (clientId) => campaigns.filter(c => c.clientId === clientId);

    return (
        <CampaignContext.Provider value={{
            campaigns,
            isLoading,
            addCampaign,
            updateCampaign,
            deleteCampaign,
            getCampaignsByClient
        }}>
            {children}
        </CampaignContext.Provider>
    );
}

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        return {
            campaigns: [],
            isLoading: true,
            addCampaign: () => {},
            updateCampaign: () => {},
            deleteCampaign: () => {},
            getCampaignsByClient: () => []
        };
    }
    return context;
};
