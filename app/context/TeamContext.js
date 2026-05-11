"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const TeamContext = createContext();

export function TeamProvider({ children }) {
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial session check and listener
    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfile(session.user);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                fetchProfile(session.user);
            } else {
                setCurrentUser(null);
                setIsLoading(false);
            }
        });

        // Also fetch all team members for context
        fetchTeam();

        return () => subscription.unsubscribe();
    }, []);

    // Normalize DB row (snake_case) to app format (camelCase)
    const normalizeProfile = (row) => ({
        ...row,
        roleType: row.role_type || row.roleType || 'editor',
        reportsTo: row.reports_to || row.reportsTo || null,
    });

    const fetchProfile = async (user) => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                setCurrentUser({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0],
                    roleType: 'editor' // default fallback
                });
            } else {
                // Normalize snake_case columns → camelCase so the whole app works
                setCurrentUser(normalizeProfile(data));
            }
        } catch (err) {
            console.error('Profile fetch failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeam = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (!error && data) {
            // Normalize all member rows too
            setMembers(data.map(normalizeProfile));
        }
    };

    const signInWithPassword = async (email, password) => {
        if (!supabase) return { success: false, error: 'Supabase not initialized' };
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };
        return { success: true, user: data.user };
    };

    const signUpWithPassword = async (email, password, name, roleType = 'editor') => {
        if (!supabase) return { success: false, error: 'Supabase not initialized' };
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    name,
                    role_type: roleType 
                }
            }
        });

        if (error) return { success: false, error: error.message };
        return { success: true, user: data.user };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    // Database Actions
    const addMember = async (member) => {
        // Generate a new UUID if one isn't provided
        const memberId = member.id || crypto.randomUUID();

        // Convert camelCase → snake_case for DB
        const dbMember = { ...member, id: memberId, created_at: new Date() };
        if ('roleType' in dbMember) {
            dbMember.role_type = dbMember.roleType;
            delete dbMember.roleType;
        }
        if ('reportsTo' in dbMember) {
            dbMember.reports_to = dbMember.reportsTo;
            delete dbMember.reportsTo;
        }
        
        const { data, error } = await supabase
            .from('profiles')
            .insert([dbMember])
            .select();
        
        if (!error && data) {
            setMembers(prev => [...prev, ...data.map(normalizeProfile)]);
        } else if (error) {
            console.error('Error adding member:', error);
        }
    };

    const updateMember = async (id, updates) => {
        // Convert camelCase app fields → snake_case DB columns
        const dbUpdates = { ...updates };
        if ('roleType' in dbUpdates) {
            dbUpdates.role_type = dbUpdates.roleType;
            delete dbUpdates.roleType;
        }
        if ('reportsTo' in dbUpdates) {
            dbUpdates.reports_to = dbUpdates.reportsTo;
            delete dbUpdates.reportsTo;
        }

        const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', id);
        
        if (!error) {
            // Normalize back to camelCase for local state
            const normalizedUpdates = normalizeProfile({ ...dbUpdates, ...updates });
            setMembers(prev => prev.map(m => m.id === id ? { ...m, ...normalizedUpdates } : m));
            if (currentUser?.id === id) {
                setCurrentUser(prev => ({ ...prev, ...normalizedUpdates }));
            }
        }
    };

    const deleteMember = async (id) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);
        
        if (!error) {
            setMembers(prev => prev.filter(m => m.id !== id));
        }
    };

    const getMemberById = (id) => members.find(m => m.id === id);

    const getClientTeam = (clientId) => {
        return members.filter(m => m.type === 'client' && m.clientId === clientId);
    };

    const getAgencyTeam = () => {
        return members;
    };

    const getAssignableMembers = () => {
        if (!currentUser) return [];
        if (currentUser.roleType === 'super_admin') {
            return members;
        } else if (currentUser.roleType === 'admin') {
            return members.filter(m => m.id === currentUser.id || m.reportsTo === currentUser.id);
        } else {
            return [currentUser];
        }
    };

    return (
        <TeamContext.Provider value={{
            members,
            currentUser,
            isLoading,
            signInWithPassword,
            signUpWithPassword,
            logout,
            getAssignableMembers,
            addMember,
            updateMember,
            deleteMember,
            getMemberById,
            getClientTeam,
            getAgencyTeam
        }}>
            {children}
        </TeamContext.Provider>
    );
}

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        return {
            members: [],
            currentUser: null,
            login: () => { },
            logout: () => { },
            signInWithPassword: () => {},
            signUpWithPassword: () => {},
            setCurrentUserId: () => {},
            getAssignableMembers: () => [],
            addMember: () => { },
            updateMember: () => { },
            deleteMember: () => { },
            getMemberById: () => null,
            getClientTeam: () => [],
            getAgencyTeam: () => []
        };
    }
    return context;
};
