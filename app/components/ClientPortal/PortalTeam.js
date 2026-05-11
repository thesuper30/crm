"use client";

import { useState } from 'react';
import { useTeam } from '../../context/TeamContext';
import { UserPlus, Mail, Shield, Trash2 } from 'lucide-react';

export default function PortalTeam({ clientId }) {
    const { members, addMember, deleteMember, getClientTeam } = useTeam();
    const clientTeam = getClientTeam(clientId);
    const [showAdd, setShowAdd] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        addMember({
            ...newMember,
            type: 'client',
            clientId: clientId
        });
        setNewMember({ name: '', role: '', email: '' });
        setShowAdd(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>My Team</h2>
                    <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage internal members who can assign and complete tasks.</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
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
                    <UserPlus size={18} /> Invite Member
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f0f0f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr) auto',
                    gap: '16px',
                    alignItems: 'end'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>FULL NAME</label>
                        <input
                            required
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #eee', outline: 'none' }}
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>ROLE</label>
                        <input
                            required
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #eee', outline: 'none' }}
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>EMAIL</label>
                        <input
                            required
                            type="email"
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #eee', outline: 'none' }}
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        />
                    </div>
                    <button type="submit" style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Add</button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {clientTeam.map(member => (
                    <div key={member.id} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid #f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '16px',
                                background: (member.color || '#6366f1') + '10',
                                color: member.color || '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: '800'
                            }}>
                                {member.avatar || member.name[0]}
                            </div>
                            <button
                                onClick={() => deleteMember(member.id)}
                                style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ff4444', cursor: 'pointer', opacity: 0.6 }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a1a' }}>{member.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <Shield size={14} style={{ color: '#ccc' }} /> {member.role}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#999', fontWeight: '600' }}>
                            <Mail size={14} /> {member.email}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
