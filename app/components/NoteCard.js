"use client";

import { Pin, Trash2, CheckCircle2, Circle, Palette } from 'lucide-react';
import { useState } from 'react';

export default function NoteCard({ note, onUpdate, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const colors = [
        { name: 'White', hex: '#ffffff' },
        { name: 'Red', hex: '#f8d7da' },
        { name: 'Yellow', hex: '#fff3cd' },
        { name: 'Green', hex: '#d4edda' },
        { name: 'Blue', hex: '#cce5ff' },
        { name: 'Purple', hex: '#e2e3e5' },
    ];

    const toggleChecklist = (index) => {
        const newChecklist = [...(note.checklist || [])];
        newChecklist[index].completed = !newChecklist[index].completed;
        onUpdate(note.id, { checklist: newChecklist });
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setShowColors(false); }}
            style={{
                background: note.color || '#fff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #eee',
                boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '140px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>{note.title}</h3>
                <button
                    onClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: note.isPinned ? '#1a1a1a' : '#ddd', padding: '4px' }}
                >
                    <Pin size={18} fill={note.isPinned ? '#1a1a1a' : 'none'} />
                </button>
            </div>

            {note.type === 'checklist' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {note.checklist.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleChecklist(i)}>
                            {item.completed ? <CheckCircle2 size={16} color="#1a1a1a" /> : <Circle size={16} color="#ccc" />}
                            <span style={{ fontSize: '0.9rem', color: item.completed ? '#999' : '#333', textDecoration: item.completed ? 'line-through' : 'none' }}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {note.content}
                </p>
            )}

            <div style={{
                marginTop: 'auto',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s'
            }}>
                <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                    <button
                        onClick={() => setShowColors(!showColors)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                    >
                        <Palette size={16} />
                    </button>
                    {showColors && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            background: 'white',
                            padding: '8px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            gap: '8px',
                            zIndex: 10
                        }}>
                            {colors.map(c => (
                                <div
                                    key={c.hex}
                                    onClick={() => { onUpdate(note.id, { color: c.hex }); setShowColors(false); }}
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.hex, border: '1px solid #ddd', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => onDelete(note.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
