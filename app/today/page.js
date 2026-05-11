"use client";

import { useState } from 'react';
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import Sidebar from '../components/Sidebar';
import { useTasks } from '../context/TaskContext';
import { useClients } from '../context/ClientContext';
import TaskCard from '../components/TaskCard';
import TaskColumn from '../components/TaskColumn';

export default function TodayPage() {
    const { getTodayTasks, addTask, insertTaskAfter, updateTask, deleteTask } = useTasks();
    const { clients } = useClients();
    const tasks = getTodayTasks();
    const [activeId, setActiveId] = useState(null);

    // Filter tasks and attach Client Name
    const tasksWithClients = tasks.map(task => {
        const client = clients.find(c => c.id === task.clientId);
        return {
            ...task,
            clientName: client ? client.name : (task.clientName || null)
        };
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleUpdateTask = (id, updates) => {
        updateTask(id, updates);
    };

    const handleAddNext = (currentId) => {
        const currentTask = tasks.find(t => t.id === currentId);
        insertTaskAfter(currentId, {
            title: '',
            status: currentTask ? currentTask.status : 'todo',
            clientId: currentTask ? currentTask.clientId : null,
            clientName: currentTask ? currentTask.clientName : null,
            isNew: true
        });
    };

    const handleRemoveTask = (id) => {
        deleteTask(id);
    };

    const handleAddFirst = (statusColumn) => {
        addTask({
            title: '',
            status: statusColumn,
            dueDate: new Date().toISOString().split('T')[0],
            isNew: true
        });
    };

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) { setActiveId(null); return; }

        const activeTask = tasks.find(t => t.id === active.id);
        const overId = over.id;

        if (activeTask && activeTask.isNew) {
            updateTask(active.id, { isNew: false });
        }

        const statusMap = {
            'ToDo': 'todo',
            'InProgress': 'in-progress',
            'Done': 'done'
        };

        const isColumn = Object.keys(statusMap).includes(overId);

        if (isColumn) {
            updateTask(active.id, { status: statusMap[overId] });
        } else {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask && activeTask.status !== overTask.status) {
                updateTask(active.id, { status: overTask.status });
            }
        }
        setActiveId(null);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                <header style={{ height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Today's Focus</h2>
                </header>
                <div style={{ flex: 1, padding: '40px', display: 'flex', gap: '24px', overflowX: 'auto', background: '#fff' }}>
                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

                        <TaskColumn
                            id="ToDo"
                            title="To Do"
                            tasks={tasksWithClients.filter(t => t.status === 'todo')}
                            onUpdate={handleUpdateTask}
                            onAddNext={handleAddNext}
                            onRemove={handleRemoveTask}
                            onAddFirst={() => handleAddFirst('todo')}
                        />

                        <TaskColumn
                            id="InProgress"
                            title="In Progress"
                            tasks={tasksWithClients.filter(t => t.status === 'in-progress')}
                            onUpdate={handleUpdateTask}
                            onAddNext={handleAddNext}
                            onRemove={handleRemoveTask}
                            onAddFirst={() => handleAddFirst('in-progress')}
                        />

                        <TaskColumn
                            id="Done"
                            title="Done"
                            tasks={tasksWithClients.filter(t => t.status === 'done')}
                            onUpdate={handleUpdateTask}
                            onAddNext={handleAddNext}
                            onRemove={handleRemoveTask}
                            onAddFirst={() => handleAddFirst('done')}
                        />

                        <DragOverlay>
                            {activeId ? <TaskCard task={tasksWithClients.find(t => t.id === activeId)} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </main>
        </div>
    );
}
