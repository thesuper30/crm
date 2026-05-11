"use client";

import { useState, useEffect } from 'react';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useTasks } from '../../context/TaskContext';
import { useRequests } from '../../context/RequestContext';
import { useClients } from '../../context/ClientContext';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ListTodo,
    Users,
    FilePlus,
    Clock,
    BarChart3,
    MessageSquare,
    LogOut
} from 'lucide-react';

// Components
import PortalOverview from '../../components/ClientPortal/PortalOverview';
import PortalMyTasks from '../../components/ClientPortal/PortalMyTasks';
import PortalTeam from '../../components/ClientPortal/PortalTeam';
import PortalRequests from '../../components/ClientPortal/PortalRequests';
import PortalTimeline from '../../components/ClientPortal/PortalTimeline';
import PortalLeadsReports from '../../components/ClientPortal/PortalLeadsReports';
import PortalMessages from '../../components/ClientPortal/PortalMessages';

export default function PortalDashboard() {
    const { user, logout, loading: authLoading } = usePortalAuth();
    const { tasks } = useTasks();
    const { requests } = useRequests();
    const { getClientById } = useClients();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/portal/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    const client = getClientById(user.id);
    const clientTasks = tasks.filter(t => t.clientId === user.id);
    const clientRequests = requests.filter(r => r.clientId === user.id);

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <PortalOverview client={client} tasks={clientTasks} requests={clientRequests} />;
            case 'My Tasks':
                return <PortalMyTasks tasks={clientTasks} />;
            case 'My Team':
                return <PortalTeam clientId={user.id} />;
            case 'Requests':
                return <PortalRequests clientId={user.id} />;
            case 'Timeline':
                return <PortalTimeline tasks={clientTasks} />;
            case 'Leads & Reports':
                return <PortalLeadsReports client={client} />;
            case 'Messages':
                return (
                    <div style={{ height: 'calc(100vh - 250px)' }}>
                        <PortalMessages contextId={user.id} contextType="Project" />
                    </div>
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'Overview', icon: <LayoutDashboard size={18} /> },
        { id: 'My Tasks', icon: <ListTodo size={18} /> },
        { id: 'My Team', icon: <Users size={18} /> },
        { id: 'Requests', icon: <FilePlus size={18} /> },
        { id: 'Timeline', icon: <Clock size={18} /> },
        { id: 'Leads & Reports', icon: <BarChart3 size={18} /> },
        { id: 'Messages', icon: <MessageSquare size={18} /> },
    ];

    return (
        <div style={{
            height: '100vh',
            background: '#fcfcfc',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Top Bar */}
            <header style={{
                height: '80px',
                background: 'white',
                borderBottom: '1px solid #f0f0f0',
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{client?.name}</h1>
                    <div style={{
                        padding: '6px 14px',
                        background: '#f0fdf4',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        {client?.projectStatus || 'ON TRACK 🟢'}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1a1a1a' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: '600' }}>{user.role}</div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{
                background: 'white',
                padding: '0 40px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                gap: '8px'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 20px',
                            border: 'none',
                            background: 'transparent',
                            color: activeTab === tab.id ? 'black' : '#999',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab.id ? '3px solid black' : '3px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.icon}
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
                    {renderContent()}
                </div>
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
