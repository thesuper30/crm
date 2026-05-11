"use client";

import Sidebar from '../components/Sidebar';
import IncomingRequests from '../components/IncomingRequests';

export default function RequestsPage() {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcfcfc', padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px', color: '#1a1a1a' }}>Incoming Requests</h1>
                    <p style={{ color: '#666', marginBottom: '40px', fontWeight: '600' }}>Review and approve new work items submitted by your clients.</p>

                    <IncomingRequests />
                </div>
            </main>
        </div>
    );
}
