"use client";

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ClientCard from './ClientCard';
import styles from './ClientColumn.module.css';

export default function ClientColumn({ stage, clients }) {
    const { setNodeRef } = useDroppable({
        id: stage.id,
    });

    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <h3 className={styles.title}>{stage.title}</h3>
                <span className={styles.count}>{clients.length}</span>
            </div>
            <div ref={setNodeRef} className={styles.droppableArea}>
                <SortableContext items={clients} strategy={verticalListSortingStrategy}>
                    {clients.map((client) => (
                        <ClientCard key={client.id} client={client} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
