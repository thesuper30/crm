"use client";

import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function PortalTimeline({ tasks }) {
    const sortedTasks = [...tasks].sort((a, b) => (a.timelineDay || 0) - (b.timelineDay || 0));

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 0' }}>
            <div style={{ position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '15px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: '#f0f0f0'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {sortedTasks.map((task, index) => {
                        const isDone = task.status === 'done';
                        const isCurrent = task.status === 'in-progress' || task.status === 'waiting-on-client';

                        return (
                            <div key={task.id} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isDone ? '#10b981' : (isCurrent ? 'black' : 'white'),
                                    border: isDone ? 'none' : '2px solid #f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isDone || isCurrent ? 'white' : '#ccc',
                                    zIndex: 1,
                                    boxShadow: isCurrent ? '0 0 0 4px rgba(0,0,0,0.05)' : 'none'
                                }}>
                                    {isDone ? <CheckCircle2 size={18} /> : (isCurrent ? <Clock size={16} /> : <Circle size={16} />)}
                                </div>

                                <div style={{ flex: 1, paddingTop: '4px' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: isCurrent ? 'black' : '#999', marginBottom: '4px' }}>
                                        DAY {task.timelineDay || 0}
                                    </div>
                                    <h4 style={{
                                        margin: 0,
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: isDone ? '#666' : '#1a1a1a',
                                        textDecoration: isDone ? 'line-through' : 'none'
                                    }}>
                                        {task.title}
                                    </h4>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#999' }}>
                                        {isDone ? 'Milestone Completed' : (isCurrent ? 'Currently in focus' : 'Upcoming Step')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
