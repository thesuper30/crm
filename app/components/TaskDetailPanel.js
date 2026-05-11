"use client";

import { useTasks } from "../context/TaskContext";
import { useTeam } from "../context/TeamContext";
import { useClients } from "../context/ClientContext";
import { X, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import ActionMenu from "./ActionMenu";

export default function TaskDetailPanel() {
    const { getSelectedTask, closeTask, updateTask, deleteTask, selectedTaskId } = useTasks();
    const { members } = useTeam();
    const { clients } = useClients();
    const task = getSelectedTask();

    if (!selectedTaskId) return null;
    if (!task) return null; // Should not happen if sync works

    const handleAssigneeSelect = (userId) => {
        const user = members.find(u => u.id === userId);
        updateTask(task.id, {
            assigneeId: userId || null,
            assigneeInitials: user ? user.avatar : null,
            assigneeName: user ? user.name : null,
            assigneeColor: user ? user.color : null
        });
    };

    const handleChecklistToggle = (index) => {
        const newChecklist = [...(task.checklist || [])];
        newChecklist[index].completed = !newChecklist[index].completed;
        updateTask(task.id, { checklist: newChecklist });
    };

    const handleAddChecklistItem = () => {
        const newItem = { text: "", completed: false, id: Date.now() };
        updateTask(task.id, {
            checklist: [...(task.checklist || []), newItem]
        });
    };

    const handleUpdateChecklistItem = (index, text) => {
        const newChecklist = [...(task.checklist || [])];
        newChecklist[index].text = text;
        updateTask(task.id, { checklist: newChecklist });
    };

    const handleRemoveChecklistItem = (index) => {
        const newChecklist = (task.checklist || []).filter((_, i) => i !== index);
        updateTask(task.id, { checklist: newChecklist });
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '450px',
                background: 'white',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>

            {/* Header */}
            <header style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'bold', letterSpacing: '0.05em' }}>TASK DETAILS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ActionMenu
                        actions={[
                            {
                                label: 'Delete Task',
                                icon: <Trash2 size={14} />,
                                onClick: () => {
                                    if (confirm('Delete this task?')) {
                                        deleteTask(task.id);
                                        closeTask();
                                    }
                                },
                                danger: true
                            }
                        ]}
                    />
                    <button
                        onClick={closeTask}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                    >
                        <X size={20} />
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                {/* Title */}
                <textarea
                    value={task.title}
                    onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    placeholder="Task title..."
                    style={{
                        width: '100%',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        color: '#333',
                        marginBottom: '24px',
                        lineHeight: '1.2'
                    }}
                    rows={2}
                />

                {/* Metadata Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Client</div>
                    <select
                        value={task.clientId || ""}
                        onChange={(e) => updateTask(task.id, { clientId: e.target.value })}
                        style={{ border: 'none', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}
                    >
                        <option value="">No Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Assignee</div>
                    <select
                        value={task.assigneeId || ""}
                        onChange={(e) => handleAssigneeSelect(e.target.value)}
                        style={{ border: 'none', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}
                    >
                        <option value="">Unassigned</option>
                        {members.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>

                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Priority</div>
                    <select
                        value={task.priority || "medium"}
                        onChange={(e) => updateTask(task.id, { priority: e.target.value })}
                        style={{ border: 'none', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>

                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Status</div>
                    <select
                        value={task.status || "todo"}
                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                        style={{ border: 'none', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                {/* Notes Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#999', marginBottom: '12px' }}>NOTES</h4>
                    <textarea
                        value={task.notes || ""}
                        onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                        placeholder="Add some notes here..."
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '0.95rem',
                            outline: 'none',
                            lineHeight: '1.5',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* Checklist Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: '#999' }}>CHECKLIST</h4>
                        <button
                            onClick={handleAddChecklistItem}
                            style={{ background: 'none', border: 'none', color: '#0066cc', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Plus size={14} /> Add item
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(task.checklist || []).map((item, index) => (
                            <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', gap: '10px', group: 'true' }} className="checklist-item">
                                <button
                                    onClick={() => handleChecklistToggle(index)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: item.completed ? '#333' : '#ccc' }}
                                >
                                    {item.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </button>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => handleUpdateChecklistItem(index, e.target.value)}
                                    placeholder="Task item..."
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        color: item.completed ? '#aaa' : '#333',
                                        textDecoration: item.completed ? 'line-through' : 'none'
                                    }}
                                />
                                <button
                                    onClick={() => handleRemoveChecklistItem(index)}
                                    className="delete-item"
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', opacity: 1 }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ padding: '20px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Created on {new Date(task.createdAt).toLocaleDateString()}</span>
            </footer>
        </div>
    );
}
