"use client";

import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

export default function TaskColumn({ id, title, tasks, onUpdate, onAddNext, onRemove, onAddFirst, className, hideClientPicker = false }) {
    const { setNodeRef } = useSortable({ id });

    return (
        <div
            className={className}
            style={{ flex: 1, minWidth: '350px', background: '#fafafa', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#333' }}>{title}</h3>
                <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>{tasks.length}</span>
            </div>

            <div ref={setNodeRef} style={{ flex: 1, overflowY: 'auto' }}>
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onUpdate={onUpdate}
                            onAddNext={onAddNext}
                            onRemove={onRemove}
                            clientName={task.clientName} // Pass pre-resolved or stored clientName
                            hideClientPicker={hideClientPicker}
                        />
                    ))}
                </SortableContext>

                {/* Empty State / Bottom Click Area */}
                {tasks.length === 0 && (
                    <div
                        onClick={onAddFirst}
                        style={{ padding: '12px', color: '#aaa', cursor: 'text', fontStyle: 'italic', fontSize: '0.9rem' }}
                    >
                        Click to add a task...
                    </div>
                )}
            </div>

            {/* "Add Task" Button */}
            <button
                onClick={onAddFirst}
                style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#666',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    transition: 'background 0.2s',
                    justifyContent: 'flex-start'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#eee'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
                <Plus size={18} /> New Task
            </button>
        </div>
    );
}
