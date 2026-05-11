"use client";

import { useState } from 'react';
import { useNotes } from '../context/NoteContext';
import NoteCard from './NoteCard';
import { Plus, CheckSquare, Type, Search, Pin } from 'lucide-react';

export default function NoteBoard({ clientId }) {
    const { getNotesByClient, addNote, updateNote, deleteNote } = useNotes();
    const clientNotes = getNotesByClient(clientId);
    const [searchQuery, setSearchQuery] = useState('');
    const [newNote, setNewNote] = useState({ title: '', content: '', type: 'text', checklist: [] });
    const [isCreating, setIsCreating] = useState(false);

    const filteredNotes = clientNotes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pinnedNotes = filteredNotes.filter(n => n.isPinned);
    const otherNotes = filteredNotes.filter(n => !n.isPinned);

    const handleAddNote = () => {
        if (!newNote.title && !newNote.content && newNote.checklist.length === 0) {
            setIsCreating(false);
            return;
        }

        addNote({
            ...newNote,
            clientId,
            createdAt: new Date().toISOString()
        });

        setNewNote({ title: '', content: '', type: 'text', checklist: [] });
        setIsCreating(false);
    };

    const addChecklistItem = () => {
        setNewNote(prev => ({
            ...prev,
            type: 'checklist',
            checklist: [...prev.checklist, { id: Date.now(), text: '', completed: false }]
        }));
    };

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Quick Create Area */}
            <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
                {!isCreating ? (
                    <div
                        onClick={() => setIsCreating(true)}
                        style={{
                            background: 'white',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: '1px solid #ddd',
                            color: '#666',
                            cursor: 'text',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <span>Take a note...</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                <CheckSquare size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <input
                            autoFocus
                            placeholder="Title"
                            value={newNote.title}
                            onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                            style={{ border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: '700' }}
                        />
                        {newNote.type === 'text' ? (
                            <textarea
                                placeholder="Note content..."
                                value={newNote.content}
                                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                                style={{ border: 'none', outline: 'none', fontSize: '0.95rem', resize: 'none', minHeight: '80px' }}
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {newNote.checklist.map((item, i) => (
                                    <input
                                        key={item.id}
                                        placeholder="Add item..."
                                        value={item.text}
                                        onChange={e => {
                                            const cl = [...newNote.checklist];
                                            cl[i].text = e.target.value;
                                            setNewNote({ ...newNote, checklist: cl });
                                        }}
                                        style={{ border: 'none', outline: 'none', fontSize: '0.9rem' }}
                                    />
                                ))}
                                <button
                                    onClick={addChecklistItem}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.85rem', textAlign: 'left', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Plus size={14} /> Add item
                                </button>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setNewNote({ ...newNote, type: 'text' })}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: newNote.type === 'text' ? '#1a1a1a' : '#aaa' }}
                                >
                                    <Type size={18} />
                                </button>
                                <button
                                    onClick={() => { if (newNote.type !== 'checklist') addChecklistItem(); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: newNote.type === 'checklist' ? '#1a1a1a' : '#aaa' }}
                                >
                                    <CheckSquare size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddNote}
                                style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* pinned Section */}
            {pinnedNotes.length > 0 && (
                <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Pin size={12} /> Pinned
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                        {pinnedNotes.map(note => (
                            <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
                        ))}
                    </div>
                </div>
            )}

            {/* Others Section */}
            <div>
                {pinnedNotes.length > 0 && <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Others</h4>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {otherNotes.map(note => (
                        <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
                    ))}
                </div>
            </div>

            {filteredNotes.length === 0 && !isCreating && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#ccc' }}>
                    <Plus size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>No notes found for this client.</p>
                    <p style={{ fontSize: '0.9rem' }}>Capture meeting minutes, checklists, and strategy thoughts here.</p>
                </div>
            )}
        </div>
    );
}
