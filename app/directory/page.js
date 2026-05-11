"use client";

import Sidebar from '../components/Sidebar';
import { useClients } from '../context/ClientContext';
import { ArrowUpRight, Trash2, Eye, Key } from 'lucide-react';
import Link from 'next/link';
import ActionMenu from '../components/ActionMenu';

export default function DirectoryPage() {
    const { clients, deleteClient, updateClient } = useClients();

    // Filter for Active/Closed
    const ACTIVE_STAGES = ['closed'];
    const activeClients = clients.filter(c => ACTIVE_STAGES.includes(c.stage));

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflowY: 'auto' }}>
                <header style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Active Client Directory (Updated)</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Managing {activeClients.length} closed/active accounts</p>
                    </div>
                    <button style={{ padding: '10px 20px', borderRadius: '8px', background: 'black', color: 'white', fontWeight: 'bold' }}>
                        Export List
                    </button>
                </header>

                <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {activeClients.map(client => (
                        <div
                            key={client.id}
                            onClick={() => window.location.href = `/clients/${client.id}`}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '12px',
                                padding: '24px',
                                transition: 'all 0.2s',
                                background: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#eee';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>{client.industry}</span>
                                <ActionMenu
                                    actions={[
                                        {
                                            label: 'View Portal',
                                            icon: <Eye size={14} />,
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                window.location.href = `/clients/${client.id}`;
                                            }
                                        },
                                        {
                                            label: 'Generate Access',
                                            icon: <Key size={14} />,
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                const password = Math.random().toString(36).slice(-8);
                                                const email = client.email || `${client.name.toLowerCase().replace(/\s+/g, '')}@portal.com`;

                                                updateClient(client.id, {
                                                    portalEmail: email,
                                                    portalPassword: password
                                                });

                                                alert(`Portal Access Generated!\n\nEmail: ${email}\nPassword: ${password}`);
                                            }
                                        },
                                        {
                                            label: 'Delete Client',
                                            icon: <Trash2 size={14} />,
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete ${client.name}?`)) deleteClient(client.id);
                                            },
                                            danger: true
                                        }
                                    ]}
                                />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>{client.name}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <span style={{
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: client.health === 'On Track' ? 'var(--success)' : client.health === 'At Risk' ? 'var(--error)' : 'var(--warning)'
                                }}></span>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>{client.health}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Monthly Value</div>
                                    <div style={{ fontWeight: '600' }}>{client.value}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Owner</div>
                                    <div style={{ fontWeight: '600' }}>{client.owner}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeClients.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                            No active clients found. Move clients to "Closed" stage in the Pipeline to see them here.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
