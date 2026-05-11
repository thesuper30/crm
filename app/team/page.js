"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTeam } from '../context/TeamContext';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamMemberDetailPanel from '../components/TeamMemberDetailPanel';
import NewMemberModal from '../components/NewMemberModal';
import { UserPlus, Search, Filter, Users } from 'lucide-react';

export default function TeamPage() {
    const { members, addMember } = useTeam();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const roles = ['All', ...new Set((members || []).map(m => m.role).filter(Boolean))];

    const filteredMembers = (members || []).filter(m => {
        const matchesSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.role || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'All' || m.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#fcfcfc' }}>
            <Sidebar />

            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#1a1a1a' }}>Team</h1>
                        <p style={{ color: '#666', marginTop: '8px' }}>Manage agency members, roles, and current workload.</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                            background: '#1a1a1a',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#333'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#1a1a1a'}
                    >
                        <UserPlus size={18} /> Add Member
                    </button>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', color: '#aaa' }} />
                        <input
                            type="text"
                            placeholder="Search team members or roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                borderRadius: '10px',
                                border: '1px solid #eee',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {roles.map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: selectedRole === role ? '#1a1a1a' : '#eee',
                                    background: selectedRole === role ? '#1a1a1a' : 'white',
                                    color: selectedRole === role ? 'white' : '#666',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Team Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredMembers.map(member => (
                        <TeamMemberCard
                            key={member.id}
                            member={member}
                            onClick={() => setSelectedMemberId(member.id)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredMembers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                        <Users size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>No team members found matching your search.</p>
                    </div>
                )}
            </main>

            {/* Member Detail Sidebar */}
            {selectedMemberId && (
                <TeamMemberDetailPanel
                    memberId={selectedMemberId}
                    onClose={() => setSelectedMemberId(null)}
                />
            )}

            {/* Add Member Modal */}
            <NewMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addMember}
            />
        </div>
    );
}
