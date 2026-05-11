"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, Upload, Calendar, User, Info } from 'lucide-react';

export default function PortalTaskCard({ task }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isClientTask = task.ownerRole === 'Client';

    const getStatusStyles = (status) => {
        switch (status) {
            case 'waiting-on-client':
                return { bg: '#fff7ed', color: '#f59e0b', label: 'Waiting on Client' };
            case 'in-progress':
                return { bg: '#eff6ff', color: '#3b82f6', label: 'In Progress (Agency)' };
            case 'done':
                return { bg: '#f0fdf4', color: '#10b981', label: 'Completed' };
            default:
                return { bg: '#f3f4f6', color: '#6b7280', label: 'Pending' };
        }
    };

    const styles = getStatusStyles(task.status);

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        background: isClientTask ? '#6366f115' : '#10b98115',
                        color: isClientTask ? '#6366f1' : '#10b981',
                        letterSpacing: '0.02em'
                    }}>
                        {(task.ownerRole || 'Agency').toUpperCase()}
                    </span>
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        letterSpacing: '0.02em'
                    }}>
                        {task.taskType || 'Task'}
                    </span>
                </div>
                <div style={{ color: '#999', fontSize: '0.75rem', fontWeight: '600' }}>
                    <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {mounted ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '...'}
                </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#1a1a1a', lineHeight: '1.4' }}>
                {task.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                        {task.assignee?.[0]}
                    </div>
                    <span>{task.assignee}</span>
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#eee' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Info size={14} style={{ color: '#ccc' }} />
                    <span>Timeline: Day {task.timelineDay || 0}</span>
                </div>
            </div>

            <div style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '12px',
                background: styles.bg,
                color: styles.color,
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: styles.color }} />
                {styles.label}
            </div>

            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px',
                paddingTop: '16px',
                borderTop: '1px solid #f9f9f9'
            }}>
                <button style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #eee',
                    background: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                }}>
                    <MessageSquare size={14} /> Comment
                </button>
                <button style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #eee',
                    background: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                }}>
                    <Upload size={14} /> Upload
                </button>
            </div>
        </div>
    );
}
