"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BillingModal({ isOpen, onClose, onSave, initialData, clientId }) {
    const [formData, setFormData] = useState({
        title: '',
        retainerFee: 0,
        advancePaid: 0,
        dueDate: '',
        status: 'pending',
        clientId: clientId
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                retainerFee: 0,
                advancePaid: 0,
                dueDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                clientId: clientId
            });
        }
    }, [initialData, isOpen, clientId]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', width: '450px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{initialData ? 'Edit Billing Card' : 'Add Billing Card'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#666', marginBottom: '8px' }}>TITLE</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. March Retainer"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#666', marginBottom: '8px' }}>RETAINER FEE (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.retainerFee}
                                onChange={e => setFormData({ ...formData, retainerFee: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#666', marginBottom: '8px' }}>ADVANCE PAID (₹)</label>
                            <input
                                type="number"
                                value={formData.advancePaid}
                                onChange={e => setFormData({ ...formData, advancePaid: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#666', marginBottom: '8px' }}>DUE DATE</label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#666', marginBottom: '8px' }}>STATUS</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', background: 'white' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #eee', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'black', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
