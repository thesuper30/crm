"use client";

import { useState } from 'react';
import { CreditCard, Calendar, Clock, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import BillingModal from './BillingModal';

export default function BillingBoard({ client }) {
    const { getBillingByClient, addBillingCard, updateBillingCard } = useBilling();
    const billingCards = getBillingByClient(client.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    const formatCurrency = (val) => `₹${(val || 0).toLocaleString()}`;

    const handleSave = (data) => {
        if (editingCard) {
            updateBillingCard(editingCard.id, data);
        } else {
            addBillingCard(data);
        }
    };

    const openEdit = (card) => {
        setEditingCard(card);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingCard(null);
        setIsModalOpen(true);
    };

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Billing & Profit</h2>
                    <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage monthly retainers, advances, and payment tracking.</p>
                </div>
                <button
                    onClick={openAdd}
                    style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} /> Add Billing Card
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {billingCards.map(card => {
                    const outstanding = (card.retainerFee || 0) - (card.advancePaid || 0);
                    const isOverdue = !card.paidDate && new Date(card.dueDate) < new Date();

                    return (
                        <div
                            key={card.id}
                            onClick={() => openEdit(card)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #eee',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Card Header */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '8px', color: '#666' }}><CreditCard size={18} /></div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{card.title}</h3>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    padding: '4px 10px',
                                    borderRadius: '100px',
                                    background: card.status === 'paid' ? '#f0fdf4' : (isOverdue ? '#fef2f2' : '#fffbeb'),
                                    color: card.status === 'paid' ? '#10b981' : (isOverdue ? '#ef4444' : '#f59e0b')
                                }}>
                                    {card.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px', fontWeight: '600' }}>RETAINER FEE</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{formatCurrency(card.retainerFee)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px', fontWeight: '600' }}>ADVANCE PAID</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(card.advancePaid)}</div>
                                </div>
                                <div style={{ gridColumn: '1 / -1', background: '#f8f9fa', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: '700' }}>OUTSTANDING AMOUNT</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: outstanding > 0 ? '#1a1a1a' : '#10b981' }}>
                                            {formatCurrency(outstanding)}
                                        </div>
                                    </div>
                                    {isOverdue && (
                                        <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                                            <AlertCircle size={16} /> LATE
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div style={{ padding: '16px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#666' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} /> Due: {card.dueDate}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {card.paidDate ? (
                                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={14} /> Paid on {card.paidDate}
                                        </div>
                                    ) : (
                                        <div style={{ color: '#999' }}><Clock size={14} /> Awaiting Payment</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <BillingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingCard}
                clientId={client.id}
            />
        </div>
    );
}
