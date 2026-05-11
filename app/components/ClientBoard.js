"use client";

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import ClientColumn from './ClientColumn';
import ClientCard from './ClientCard';
// import { STAGES, INITIAL_CLIENTS } from '../data/clients'; // No longer using INITIAL_CLIENTS here
import { STAGES } from '../data/clients';
import styles from './ClientBoard.module.css';

export default function ClientBoard({ clients, onUpdateClient }) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeClient = clients.find(c => c.id === active.id);
        const overId = over.id;

        // If dropped over a column (stage id)
        if (STAGES.find(s => s.id === overId)) {
            if (activeClient.stage !== overId) {
                onUpdateClient(active.id, { stage: overId });
            }
        }
        // If dropped over another card
        else {
            const overClient = clients.find(c => c.id === overId);
            if (overClient && activeClient.stage !== overClient.stage) {
                onUpdateClient(active.id, { stage: overClient.stage });
            }
        }

        setActiveId(null);
    };

    const getClientsByStage = (stageId) => {
        return clients.filter(c => c.stage === stageId);
    };

    const activeClient = activeId ? clients.find(c => c.id === activeId) : null;

    return (
        <div className={styles.boardContainer}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.board}>
                    {STAGES.map(stage => (
                        <ClientColumn
                            key={stage.id}
                            stage={stage}
                            clients={getClientsByStage(stage.id)}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeClient ? <ClientCard client={activeClient} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
