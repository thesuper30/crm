"use client";

import { useState, use } from 'react';
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Target, Users, BarChart3, Globe, MousePointer2, UserCheck, MessageSquare, Phone, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCampaigns, updateCampaign } from '../../context/CampaignContext';
import { useClients } from '../../context/ClientContext';
import { useTeam } from '../../context/TeamContext';
import CampaignModal from '../../components/CampaignModal';

export default function CampaignDetailPage({ params }) {
    const { id } = use(params);
    const { campaigns, updateCampaign } = useCampaigns();
    const { clients } = useClients();
    const { getAgencyTeam } = useTeam();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const campaign = campaigns.find(c => c.id === id);
    const agencyTeam = getAgencyTeam();

    if (!campaign) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <p>Campaign not found.</p>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return { bg: '#dcfce7', text: '#16a34a' };
            case 'draft': return { bg: '#f3f4f6', text: '#6b7280' };
            case 'paused': return { bg: '#fef3c7', text: '#d97706' };
            case 'completed': return { bg: '#dbeafe', text: '#2563eb' };
            default: return { bg: '#f3f4f6', text: '#6b7280' };
        }
    };

    const statusStyle = getStatusColor(campaign.status);
    const metrics = campaign.metrics || {};
    const hasPerformance = campaign.category === 'performance' || campaign.category === 'both';
    const hasSEO = campaign.category === 'seo' || campaign.category === 'both';

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcfcfc', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link href="/campaigns" style={{ padding: '8px', borderRadius: '8px', background: '#f5f5f5', display: 'flex' }}>
                            <ArrowLeft size={18} color="#666" />
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{campaign.name}</h2>
                                <span style={{
                                    background: campaign.category === 'seo' ? '#eff6ff' : (campaign.category === 'performance' ? '#f0fdf4' : '#f5f3ff'),
                                    color: campaign.category === 'seo' ? '#3b82f6' : (campaign.category === 'performance' ? '#10b981' : '#7c3aed'),
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase'
                                }}>
                                    {campaign.category}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>{campaign.clientName || clients.find(c => c.id === campaign.clientId)?.name}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            padding: '6px 12px',
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                        }}>
                            {campaign.status}
                        </span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', background: 'white' }}
                        >
                            Edit Detail
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    {/* Primary Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                                <DollarSign size={16} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em' }}>BUDGET</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{campaign.budget}</div>
                        </div>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                                <Target size={16} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em' }}>PLATFORM</span>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'capitalize' }}>{campaign.platform || 'General'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{campaign.platformType || campaign.category}</div>
                        </div>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                                <Calendar size={16} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em' }}>DURATION</span>
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '800' }}>{campaign.startDate}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>to {campaign.endDate || 'Ongoing'}</div>
                        </div>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                                <TrendingUp size={16} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em' }}>PERFORMANCE</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{campaign.conversionRate || 0}%</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Avg. Conv. Rate</div>
                        </div>
                    </div>

                    {/* Metrics Sections */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {hasPerformance && (
                                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ padding: '8px', background: '#f0fdf4', color: '#10b981', borderRadius: '10px' }}><BarChart3 size={20} /></div>
                                            <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Performance Intelligence</h3>
                                        </div>
                                        <div style={{ padding: '4px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>CTR: {campaign.ctr}%</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={12} /> LEADS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.leads || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12} /> WHATSAPP</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.whatsapp || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> CALLS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.calls || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MousePointer2 size={12} /> CLICKS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.clicks || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> IMPRESSIONS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.impressions || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={12} /> SALES</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.sales || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {hasSEO && (
                                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{ padding: '8px', background: '#eff6ff', color: '#3b82f6', borderRadius: '10px' }}><Globe size={20} /></div>
                                        <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>SEO Vitality Metrics</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px' }}>ORGANIC TRAFFIC</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.organicTraffic || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px' }}>KEYWORDS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.keywords || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px' }}>BACKLINKS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.backlinks || 0}</div>
                                        </div>
                                        <div style={{ padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', marginBottom: '8px' }}>DOMAIN AUTH</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.da || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'sticky', top: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Users size={20} color="#6366f1" />
                                    <h3 style={{ fontWeight: '800', fontSize: '1rem' }}>Strategy Team</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {agencyTeam.slice(0, 3).map((member, i) => (
                                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: '#f9fafb' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '10px',
                                                background: member.color || '#6366f1',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '800',
                                                fontSize: '0.8rem'
                                            }}>
                                                {member.avatar || member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{member.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#666' }}>{member.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', background: 'transparent', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>+ Assign Member</button>
                            </div>
                        </div>
                    </div>
                </div>

                <CampaignModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={campaign}
                    onSave={(data) => updateCampaign(campaign.id, data)}
                />
            </main>
        </div>
    );
}

