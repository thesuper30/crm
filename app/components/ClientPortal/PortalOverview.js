"use client";

import { CheckCircle2, Clock, AlertCircle, FilePlus } from 'lucide-react';

export default function PortalOverview({ client, tasks, requests }) {
    const agencyTasks = tasks.filter(t => t.ownerRole === 'Agency' && t.status !== 'done');
    const clientTasks = tasks.filter(t => t.ownerRole === 'Client' && t.status !== 'done');
    const pendingRequests = requests.filter(r => r.status === 'Pending');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Status Header */}
            <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999', letterSpacing: '0.05em', marginBottom: '8px' }}>PROJECT STATUS</div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1a1a1a' }}>{client?.projectStatus || 'ON TRACK 🟢'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999', marginBottom: '8px' }}>LAST UPDATE</div>
                    <div style={{ fontWeight: '700' }}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                {/* Agency Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={16} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>AGENCY WORKING ON</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {agencyTasks.length > 0 ? agencyTasks.map(task => (
                            <div key={task.id} style={{ padding: '16px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '16px', fontSize: '0.95rem', color: '#444', fontWeight: '600' }}>
                                • {task.title} <span style={{ color: '#999', fontSize: '0.8rem', marginLeft: '8px' }}>(Day {task.timelineDay})</span>
                            </div>
                        )) : (
                            <div style={{ padding: '16px', color: '#999', fontSize: '0.9rem' }}>No active agency tasks.</div>
                        )}
                    </div>
                </div>

                {/* Client Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle size={16} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>WAITING ON YOUR TEAM</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {clientTasks.length > 0 ? clientTasks.map(task => (
                            <div key={task.id} style={{
                                padding: '16px',
                                background: '#fffcf5',
                                border: '1px solid #fee2e2',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: '700', color: '#9a3412' }}>{task.title}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ef4444' }}>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                            </div>
                        )) : (
                            <div style={{ padding: '16px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '16px', color: '#10b981', fontWeight: '600' }}>
                                ✅ All clear! No items pending from your side.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Requests Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FilePlus size={16} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>REQUESTS YOU RAISED</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {pendingRequests.length > 0 ? pendingRequests.map(request => (
                        <div key={request.id} style={{ padding: '20px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', background: '#6366f110', padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                                {request.type.toUpperCase()}
                            </div>
                            <div style={{ fontWeight: '700', color: '#1a1a1a' }}>{request.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Status: {request.status}</span>
                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', border: '1px dashed #e0e0e0', borderRadius: '24px', color: '#999' }}>
                            No active work requests. Use the "Requests" tab to raise new items.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
