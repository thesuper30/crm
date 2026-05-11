"use client";

import { useRequests } from '../context/RequestContext';
import { useTeam } from '../context/TeamContext';
import { useState } from 'react';
import { Check, X, User, MessageSquare } from 'lucide-react';

export default function IncomingRequests() {
    const { requests, approveRequest, rejectRequest } = useRequests();
    const { getAgencyTeam } = useTeam();
    const agencyTeam = getAgencyTeam();
    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const [selectedAssignee, setSelectedAssignee] = useState({});

    const handleApprove = (requestId) => {
        const assigneeId = selectedAssignee[requestId];
        if (!assigneeId) {
            alert('Please select an agency member to assign this task to.');
            return;
        }
        approveRequest(requestId, assigneeId);
    };

    return (
        <div style={{ padding: '24px', background: 'white', borderRadius: '24px', border: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px' }}>Incoming Work Requests</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingRequests.length > 0 ? pendingRequests.map(request => (
                    <div key={request.id} style={{
                        padding: '24px',
                        background: '#fcfcfc',
                        border: '1px solid #f0f0f0',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', marginBottom: '4px' }}>{request.type.toUpperCase()}</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{request.title}</h3>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>From: {request.requestedBy} • Priority: {request.priority}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => rejectRequest(request.id, 'Discussion needed on scope')}
                                    style={{ padding: '10px', borderRadius: '10px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', cursor: 'pointer' }}
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'black', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Check size={18} /> Approve
                                </button>
                            </div>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#444', lineHeight: '1.5' }}>{request.details}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>ASSIGN TO</div>
                            <select
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee', background: 'white', fontSize: '0.85rem', fontWeight: '600' }}
                                value={selectedAssignee[request.id] || ''}
                                onChange={(e) => setSelectedAssignee({ ...selectedAssignee, [request.id]: e.target.value })}
                            >
                                <option value="">Select Member</option>
                                {agencyTeam.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>No pending requests.</div>
                )}
            </div>
        </div>
    );
}
