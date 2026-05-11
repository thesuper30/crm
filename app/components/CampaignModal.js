"use client";

import { useState, useEffect } from 'react';
import { X, TrendingUp, BarChart3, Globe, MousePointer2, UserCheck, MessageSquare, Phone, Eye } from 'lucide-react';
import { INITIAL_CLIENTS } from '../data/clients';

const PLATFORMS = {
    'google': {
        label: 'Google Ads',
        types: ['Search', 'Performance Max', 'Display', 'Video', 'Shopping', 'Demand Gen']
    },
    'meta': {
        label: 'Meta Ads',
        types: ['Awareness', 'Traffic', 'Sales', 'Leads', 'Engagement', 'App Promotion']
    },
    'linkedin': {
        label: 'LinkedIn Ads',
        types: ['Brand Awareness', 'Website Visits', 'Engagement', 'Video Views', 'Lead Gen', 'Conversions', 'Job Applicants']
    }
};

export default function CampaignModal({ isOpen, onClose, onSave, initialData, clientId }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'seo', // 'seo', 'performance', 'both'
        platform: 'google',
        platformType: '',
        status: 'active',
        budget: '₹0',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        clientId: clientId || '',
        metrics: {
            // SEO
            organicTraffic: 0,
            keywords: 0,
            backlinks: 0,
            da: 0,
            // Performance
            leads: 0,
            sales: 0,
            whatsapp: 0,
            calls: 0,
            clicks: 0,
            impressions: 0
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                metrics: initialData.metrics || {
                    organicTraffic: 0, keywords: 0, backlinks: 0, da: 0,
                    leads: 0, sales: 0, whatsapp: 0, calls: 0, clicks: 0, impressions: 0
                }
            });
        } else {
            setFormData(prev => ({
                ...prev,
                clientId: clientId || '',
                name: '',
                category: 'seo',
                platform: 'google',
                platformType: PLATFORMS['google'].types[0],
                status: 'active',
                budget: '₹0',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                metrics: {
                    organicTraffic: 0, keywords: 0, backlinks: 0, da: 0,
                    leads: 0, sales: 0, whatsapp: 0, calls: 0, clicks: 0, impressions: 0
                }
            }));
        }
    }, [initialData, isOpen, clientId]);

    if (!isOpen) return null;

    const handleMetricChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            metrics: {
                ...prev.metrics,
                [field]: parseFloat(value) || 0
            }
        }));
    };

    // Auto-calculations
    const calculateCTR = () => {
        const { clicks, impressions } = formData.metrics;
        if (!impressions) return 0;
        return ((clicks / impressions) * 100).toFixed(2);
    };

    const calculateConvRate = () => {
        const { leads, sales, whatsapp, calls, clicks } = formData.metrics;
        if (!clicks) return 0;
        const totalConvs = leads + sales + whatsapp + calls;
        return ((totalConvs / clicks) * 100).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            ctr: calculateCTR(),
            conversionRate: calculateConvRate(),
            lastUpdated: new Date().toISOString()
        };
        onSave(finalData);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', width: '600px', maxHeight: '90vh', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{initialData ? 'Edit Campaign' : 'Create Campaign'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px', letterSpacing: '0.05em' }}>CAMPAIGN NAME</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Summer Performance Push"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                        {!clientId && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px', letterSpacing: '0.05em' }}>CLIENT</label>
                                <select
                                    required
                                    value={formData.clientId}
                                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', background: 'white', fontSize: '0.9rem' }}
                                >
                                    <option value="">Select Client</option>
                                    {INITIAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        {clientId && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px', letterSpacing: '0.05em' }}>STATUS</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', background: 'white', fontSize: '0.9rem' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="completed">Completed</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Hierarchy Selection */}
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '12px', letterSpacing: '0.05em' }}>CAMPAIGN HIERARCHY</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['seo', 'performance', 'both'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: formData.category === cat ? '#000' : '#e2e8f0',
                                        background: formData.category === cat ? '#000' : 'white',
                                        color: formData.category === cat ? 'white' : '#64748b',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        textTransform: 'capitalize',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat === 'both' ? 'SEO + Performance' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Performance Platform Options */}
                    {(formData.category === 'performance' || formData.category === 'both') && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>PLATFORM</label>
                                <select
                                    value={formData.platform}
                                    onChange={e => setFormData({
                                        ...formData,
                                        platform: e.target.value,
                                        platformType: PLATFORMS[e.target.value].types[0]
                                    })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: 'white', fontSize: '0.9rem' }}
                                >
                                    {Object.entries(PLATFORMS).map(([id, info]) => (
                                        <option key={id} value={id}>{info.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>CAMPAIGN TYPE</label>
                                <select
                                    value={formData.platformType}
                                    onChange={e => setFormData({ ...formData, platformType: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: 'white', fontSize: '0.9rem' }}
                                >
                                    {PLATFORMS[formData.platform].types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Metrics Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(formData.category === 'seo' || formData.category === 'both') && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Globe size={16} color="#3b82f6" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>SEO Metrics</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>TRAFFIC</label>
                                        <input type="number" value={formData.metrics.organicTraffic} onChange={e => handleMetricChange('organicTraffic', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>KEYWORDS</label>
                                        <input type="number" value={formData.metrics.keywords} onChange={e => handleMetricChange('keywords', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>BACKLINKS</label>
                                        <input type="number" value={formData.metrics.backlinks} onChange={e => handleMetricChange('backlinks', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>DA</label>
                                        <input type="number" value={formData.metrics.da} onChange={e => handleMetricChange('da', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(formData.category === 'performance' || formData.category === 'both') && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <TrendingUp size={16} color="#10b981" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Performance Metrics</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>LEADS</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <UserCheck size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.leads} onChange={e => handleMetricChange('leads', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>SALES</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <BarChart3 size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.sales} onChange={e => handleMetricChange('sales', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>WHATSAPP</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <MessageSquare size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.whatsapp} onChange={e => handleMetricChange('whatsapp', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>CALLS</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Phone size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.calls} onChange={e => handleMetricChange('calls', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>CLICKS</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <MousePointer2 size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.clicks} onChange={e => handleMetricChange('clicks', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#888', marginBottom: '4px' }}>IMPRESSIONS</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Eye size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
                                            <input type="number" value={formData.metrics.impressions} onChange={e => handleMetricChange('impressions', e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid #eee' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Auto-calc summary */}
                                <div style={{ display: 'flex', gap: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                                    <div>
                                        <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: '800' }}>AUTO-CTR: </span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534' }}>{calculateCTR()}%</span>
                                    </div>
                                    <div style={{ width: '1px', background: '#bbf7d0' }} />
                                    <div>
                                        <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: '800' }}>CONV. RATE: </span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534' }}>{calculateConvRate()}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dates & Budget */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>BUDGET</label>
                            <input
                                required
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>START DATE</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>END DATE</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '800', cursor: 'pointer', background: 'white', color: '#64748b' }}>Cancel</button>
                        <button type="submit" style={{ flex: 1.5, padding: '14px', borderRadius: '10px', background: 'black', color: 'white', fontWeight: '800', cursor: 'pointer', border: 'none' }}>Save Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

