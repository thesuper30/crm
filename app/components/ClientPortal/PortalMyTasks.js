"use client";

import { useTasks } from '../../context/TaskContext';
import { User, Calendar, Clock } from 'lucide-react';

export default function PortalMyTasks({ tasks }) {
    const clientTasks = tasks.filter(t => t.ownerRole === 'Client');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'waiting-on-client': return { color: '#f59e0b', bg: '#fff7ed', label: 'Pending' };
            case 'in-progress': return { color: '#3b82f6', bg: '#eff6ff', label: 'In Review' };
            case 'done': return { color: '#10b981', bg: '#f0fdf4', label: 'Done' };
            default: return { color: '#6b7280', bg: '#f3f4f6', label: status };
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>TASK NAME</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>ASSIGNED TO</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>DUE</th>
                        <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: '800', color: '#999' }}>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {clientTasks.length > 0 ? clientTasks.map(task => {
                        const style = getStatusStyle(task.status);
                        return (
                            <tr key={task.id} style={{ borderBottom: '1px solid #fafafa', transition: 'background 0.2s' }}>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem' }}>{task.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>{task.taskType || 'Asset'}</div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800' }}>
                                            {task.assignee?.[0] || 'U'}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#444' }}>{task.assignee}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} style={{ color: '#ccc' }} />
                                        {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        background: style.bg,
                                        color: style.color
                                    }}>
                                        {style.label.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                                No tasks assigned to your team yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
