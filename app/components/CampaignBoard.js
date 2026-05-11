"use client";

import { useState } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Megaphone, Calendar, Activity, Plus, Edit2, TrendingUp, Globe, Target, MousePointer2, Trash2 } from 'lucide-react';
import CampaignModal from './CampaignModal';
import ActionMenu from './ActionMenu';

export default function CampaignBoard({ client }) {
    const { getCampaignsByClient, addCampaign, updateCampaign, deleteCampaign } = useCampaigns();
    const campaigns = getCampaignsByClient(client.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    const openAdd = () => {
        setEditingCampaign(null);
        setIsModalOpen(true);
    };

    const openEdit = (campaign) => {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        if (editingCampaign) {
            updateCampaign(editingCampaign.id, data);
        } else {
            addCampaign(data);
        }
    };

    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'seo': return { bg: '#eff6ff', color: '#3b82f6', label: 'SEO' };
            case 'performance': return { bg: '#f0fdf4', color: '#10b981', label: 'PERFORMANCE' };
            case 'both': return { bg: '#f5f3ff', color: '#7c3aed', label: 'MIXED' };
            default: return { bg: '#f3f4f6', color: '#6b7280', label: cat?.toUpperCase() || 'GENERAL' };
        }
    };

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Campaigns</h2>
                    <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage SEO, Performance Marketing, and integrated campaigns.</p>
                </div>
                <button
                    onClick={openAdd}
                    style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} /> Add Campaign
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {campaigns.map(campaign => {
                    const catStyle = getCategoryStyles(campaign.category);
                    const metrics = campaign.metrics || {};
                    const hasPerformance = campaign.category === 'performance' || campaign.category === 'both';
                    const hasSEO = campaign.category === 'seo' || campaign.category === 'both';

                    return (
                        <div key={campaign.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', ...catStyle, borderRadius: '8px', background: catStyle.bg, color: catStyle.color }}>
                                        {campaign.category === 'seo' ? <Globe size={18} /> : (campaign.category === 'performance' ? <Target size={18} /> : <TrendingUp size={18} />)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{campaign.name}</h3>
                                        {hasPerformance && <span style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', fontWeight: '800' }}>{campaign.platform} • {campaign.platformType}</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '800',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: campaign.status === 'active' ? '#f0fdf4' : '#f5f5f5',
                                        color: campaign.status === 'active' ? '#10b981' : '#666',
                                    }}>
                                        {campaign.status?.toUpperCase()}
                                    </span>
                                    <ActionMenu
                                        actions={[
                                            {
                                                label: 'Edit Campaign',
                                                icon: <Edit2 size={14} />,
                                                onClick: () => openEdit(campaign)
                                            },
                                            {
                                                label: 'Delete Campaign',
                                                icon: <Trash2 size={14} />,
                                                onClick: () => confirm(`Delete ${campaign.name}?`) && deleteCampaign(campaign.id),
                                                danger: true
                                            }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: '800', marginBottom: '4px' }}>TYPE</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: catStyle.color }}>{catStyle.label}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: '800', marginBottom: '4px' }}>BUDGET</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{campaign.budget}</div>
                                    </div>
                                </div>

                                {hasPerformance && (
                                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9', marginBottom: hasSEO ? '12px' : '0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Activity size={12} /> Performance
                                            </div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981' }}>{campaign.conversionRate}% Conv.</div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700' }}>LEADS</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.leads || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700' }}>WA</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.whatsapp || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700' }}>CLICKS</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.clicks || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700' }}>CTR</div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#3b82f6' }}>{campaign.ctr}%</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasSEO && (
                                    <div style={{ background: '#fdfcfe', borderRadius: '12px', padding: '16px', border: '1px solid #f5f3ff' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#5b21b6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Globe size={12} /> SEO Vitality
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#7c3aed', fontWeight: '700' }}>TRAFFIC</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.organicTraffic || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#7c3aed', fontWeight: '700' }}>KWS</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.keywords || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#7c3aed', fontWeight: '700' }}>LINKS</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.backlinks || 0}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.6rem', color: '#7c3aed', fontWeight: '700' }}>DA</div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{metrics.da || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '12px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0', fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: '600' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={12} /> Starts: {campaign.startDate}
                                </div>
                                {campaign.lastUpdated && (
                                    <div style={{ fontStyle: 'italic' }}>
                                        Updated: {new Date(campaign.lastUpdated).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {campaigns.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#ccc' }}>
                        <Megaphone size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                        <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>No active campaigns for this client.</p>
                        <button onClick={openAdd} style={{ color: '#000', fontWeight: '700', background: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', marginTop: '16px', cursor: 'pointer' }}>Create First Campaign</button>
                    </div>
                )}
            </div>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingCampaign}
                clientId={client.id}
            />
        </div>
    );
}

