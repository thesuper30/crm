"use client";

import { TrendingUp, DollarSign, Users, Download, ArrowUpRight } from 'lucide-react';

export default function PortalReports({ stats }) {
    if (!stats) return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No report data available for this month.</div>;

    const cards = [
        { label: 'Total Leads', value: stats.leads, icon: <Users size={20} />, color: '#6366f1', trend: '+12%' },
        { label: 'Ad Spend', value: `₹${stats.spend.toLocaleString()}`, icon: <DollarSign size={20} />, color: '#10b981', trend: '-5%' },
        { label: 'Avg. CPL', value: `₹${stats.cpl}`, icon: <TrendingUp size={20} />, color: '#f59e0b', trend: '-8%' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>This Month's Performance</h2>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'white',
                    border: '1px solid #eee',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                }}>
                    <Download size={18} /> Download PDF
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {cards.map(card => (
                    <div key={card.label} style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid #f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: card.color + '10',
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {card.icon}
                            </div>
                            <div style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: '#f0fdf4',
                                color: '#10b981',
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <ArrowUpRight size={12} /> {card.trend}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#999', fontWeight: '600', marginBottom: '4px' }}>{card.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a' }}>{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                padding: '40px',
                borderRadius: '24px',
                color: 'white',
                marginTop: '16px'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 12px 0' }}>Agency Strategic Note</h3>
                <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.6', maxWidth: '800px' }}>
                    Campaign performance is trending up. The lead quality has improved by 20% after the latest creative refresh. We're on track to hit the target of 50 leads by the end of the month.
                </p>
            </div>
        </div>
    );
}
