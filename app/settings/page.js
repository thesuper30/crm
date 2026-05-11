"use client";

import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, User, Palette, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcfcfc', overflow: 'hidden' }}>
                <header style={{ height: '70px', display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid var(--border)', background: 'white' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Settings</h2>
                </header>

                <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={20} color="#6366f1" /> Profile Settings
                            </h3>
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>FULL NAME</label>
                                        <input defaultValue="Agency Admin" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                                        <input defaultValue="admin@agencyos.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Palette size={20} color="#ec4899" /> Agency Branding
                            </h3>
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', marginBottom: '8px' }}>AGENCY NAME</label>
                                    <input defaultValue="Super 30" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900' }}>S30</div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Logo Icon</div>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Used in sidebar and portal</p>
                                        <button style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>Change Logo</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Bell size={20} color="#f59e0b" /> Notifications
                            </h3>
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Email me when a client raises a new request</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Daily summary of overdue tasks</span>
                                </label>
                            </div>
                        </section>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button style={{ padding: '14px 32px', borderRadius: '12px', background: 'black', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
