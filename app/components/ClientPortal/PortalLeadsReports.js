"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, MousePointer2, BarChart, Activity, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useClients } from '../../context/ClientContext';

export default function PortalLeadsReports({ client }) {
    const { updateClient } = useClients();
    const [view, setView] = useState('performance');
    const [qualified, setQualified] = useState(client?.metrics?.performance?.qualified || 0);
    const [converted, setConverted] = useState(client?.metrics?.performance?.converted || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    const metrics = client?.metrics || {};

    const handleUpdate = async () => {
        setIsUpdating(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        const updatedMetrics = {
            ...metrics,
            performance: {
                ...metrics.performance,
                qualified: parseInt(qualified),
                converted: parseInt(converted)
            }
        };

        updateClient(client.id, { metrics: updatedMetrics });
        setIsUpdating(false);
        alert('CRM Data Updated Successfully!');
    };

    const StatCard = ({ label, value, icon, color, subValue }) => (
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: color + '10', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999', letterSpacing: '0.05em', marginBottom: '4px' }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1a1a1a' }}>{value}</div>
                {subValue && <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', marginTop: '4px' }}>{subValue}</div>}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Leads & Reports</h2>
                    <p style={{ color: '#666', margin: '4px 0 0 0' }}>Real-time performance metrics and shared campaign results.</p>
                </div>
                <div style={{ display: 'flex', background: '#f0f0f0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                    <button
                        onClick={() => setView('performance')}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: view === 'performance' ? 'white' : 'transparent', color: view === 'performance' ? 'black' : '#666', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: view === 'performance' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setView('seo')}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: view === 'seo' ? 'white' : 'transparent', color: view === 'seo' ? 'black' : '#666', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: view === 'seo' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
                    >
                        SEO
                    </button>
                </div>
            </div>

            {view === 'performance' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <StatCard label="Total Leads" value={metrics.performance?.leads} icon={<Users size={20} />} color="#6366f1" subValue={`CPL: ₹${metrics.performance?.cpl}`} />
                        <StatCard label="Qualified Leads" value={metrics.performance?.qualified} icon={<CheckCircle2 size={20} />} color="#10b981" subValue={`${((metrics.performance?.qualified / metrics.performance?.leads) * 100).toFixed(1)}% Qualification`} />
                        <StatCard label="Conversions" value={metrics.performance?.converted} icon={<ShoppingCart size={20} />} color="#ec4899" subValue={`${((metrics.performance?.converted / metrics.performance?.qualified) * 100).toFixed(1)}% Close Rate`} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #f0f0f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '24px' }}>Update Qualification (Client Responsibility)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>QUALIFIED LEADS</label>
                                    <input
                                        type="number"
                                        value={qualified}
                                        onChange={(e) => setQualified(e.target.value)}
                                        style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', fontSize: '1.2rem', fontWeight: '700' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>CONVERTED LEADS</label>
                                    <input
                                        type="number"
                                        value={converted}
                                        onChange={(e) => setConverted(e.target.value)}
                                        style={{ padding: '14px', borderRadius: '12px', border: '1px solid #eee', fontSize: '1.2rem', fontWeight: '700' }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                style={{
                                    marginTop: '24px',
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: isUpdating ? '#ccc' : 'black',
                                    color: 'white',
                                    fontWeight: '800',
                                    border: 'none',
                                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isUpdating ? 'Updating...' : 'Update CRM Data'}
                            </button>
                        </div>
                        <div style={{ background: 'black', padding: '32px', borderRadius: '32px', color: 'white' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>EXPENDITURE</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>₹{metrics.performance?.spend.toLocaleString()}</div>
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Ad Spending</span>
                                    <span style={{ fontWeight: '700', color: 'white' }}>₹{(metrics.performance?.spend * 0.8).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                    <span>Management Fee</span>
                                    <span style={{ fontWeight: '700', color: 'white' }}>₹{(metrics.performance?.spend * 0.2).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        <StatCard label="Total Clicks" value={metrics.seo?.clicks} icon={<MousePointer2 size={18} />} color="#3b82f6" />
                        <StatCard label="Impressions" value={metrics.seo?.impressions.toLocaleString()} icon={<BarChart size={18} />} color="#8b5cf6" />
                        <StatCard label="Avg. Position" value={metrics.seo?.avgPosition} icon={<Activity size={18} />} color="#10b981" />
                        <StatCard label="Click-Through Rate" value={`${metrics.seo?.ctr}%`} icon={<TrendingUp size={18} />} color="#f59e0b" />
                    </div>
                    <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '32px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h3 style={{ fontWeight: '800', marginBottom: '8px' }}>Organic Visibility Trend</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Search Console integration is active. Your average position for core keywords has improved by 2 spots this month.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
