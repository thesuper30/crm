"use client";

import { useState } from 'react';
import { useRequests } from '../../context/RequestContext';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { Plus, Send, Clock, CheckCircle2, XCircle, SendHorizontal } from 'lucide-react';

export default function PortalRequests({ clientId }) {
    const { requests, addRequest } = useRequests();
    const { user } = usePortalAuth();
    const clientRequests = requests.filter(r => r.clientId === clientId);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'New Work',
        details: '',
        timeline: '7 days',
        priority: 'Medium'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addRequest({
            ...formData,
            clientId,
            requestedBy: user.name
        });
        setFormData({ title: '', type: 'New Work', details: '', timeline: '7 days', priority: 'Medium' });
        setShowForm(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} style={{ color: '#f59e0b' }} />;
            case 'Approved': return <CheckCircle2 size={16} style={{ color: '#10b981' }} />;
            case 'Rejected': return <XCircle size={16} style={{ color: '#ef4444' }} />;
            default: return null;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Work Requests</h2>
                    <p style={{ color: '#666', margin: '4px 0 0 0' }}>Request new landing pages, campaign changes, or technical support.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} /> New Request
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: 'white',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>REQUEST TITLE</label>
                            <input
                                required
                                placeholder="e.g., New Landing Page for Feb Campaign"
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', fontSize: '1rem' }}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>TYPE</label>
                            <select
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', background: 'white' }}
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>New Work</option>
                                <option>Change Request</option>
                                <option>Support</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>DETAILS</label>
                        <textarea
                            required
                            placeholder="Provide specific context, requirements, and any reference links..."
                            style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', minHeight: '120px', resize: 'vertical', fontSize: '1rem' }}
                            value={formData.details}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>EXPECTED TIMELINE</label>
                            <input
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', outline: 'none' }}
                                value={formData.timeline}
                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>PRIORITY</label>
                            <select
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', background: 'white' }}
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '12px 32px', borderRadius: '12px', border: 'none', background: 'black', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <SendHorizontal size={18} /> Submit Request
                        </button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {clientRequests.length > 0 ? clientRequests.map(request => (
                    <div key={request.id} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#f8f8f8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getStatusIcon(request.status)}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1a1a1a' }}>{request.title}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', marginTop: '4px' }}>
                                    {request.type} • Requested by {request.requestedBy} • {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                background: request.status === 'Pending' ? '#fff7ed' : (request.status === 'Approved' ? '#f0fdf4' : '#fef2f2'),
                                color: request.status === 'Pending' ? '#f59e0b' : (request.status === 'Approved' ? '#10b981' : '#ef4444'),
                                letterSpacing: '0.05em'
                            }}>
                                {request.status.toUpperCase()}
                            </div>
                            {request.rejectionReason && (
                                <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px', maxWidth: '200px' }}>{request.rejectionReason}</div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '0.9rem', border: '1px dashed #e0e0e0', borderRadius: '32px' }}>
                        No work requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
