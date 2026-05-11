"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Folder, Trash2, Eye } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import ActionMenu from './ActionMenu';
import styles from './ClientCard.module.css';

export default function ClientCard({ client, isOverlay }) {
    const { deleteClient } = useClients();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: client.id,
        data: {
            type: 'Client',
            client,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const getHealthColor = (health) => {
        switch (health) {
            case 'On Track': return 'var(--success)';
            case 'Needs Attention': return 'var(--warning)';
            case 'At Risk': return 'var(--error)';
            default: return 'gray';
        }
    };

    const handleCardClick = (e) => {
        // Prevent navigation if we are dragging or if clicking an interactive element
        if (!isDragging) {
            window.location.href = `/clients/${client.id}`;
        }
    };

    const handleFolderClick = (e) => {
        e.stopPropagation();
        alert(`Opening Drive Folder for ${client.name}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${client.name}?`)) {
            deleteClient(client.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${styles.card} ${isOverlay ? styles.overlay : ''}`}
            onClick={handleCardClick}
        >
            <div className={styles.header}>
                <div className={styles.industry}>{client.industry}</div>
                <ActionMenu
                    actions={[
                        {
                            label: 'View Details',
                            icon: <Eye size={14} />,
                            onClick: () => window.location.href = `/clients/${client.id}`
                        },
                        {
                            label: 'Delete Client',
                            icon: <Trash2 size={14} />,
                            onClick: handleDelete,
                            danger: true
                        }
                    ]}
                />
            </div>

            <div className={styles.name}>{client.name}</div>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <span className={styles.priority} data-priority={client.priority}>{client.priority}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={styles.lastActivity}>{client.lastActivity}</span>
                        <span className={styles.owner}>{client.owner ? client.owner.charAt(0) : '?'}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.health}>
                        <span
                            className={styles.healthDot}
                            style={{ backgroundColor: getHealthColor(client.health) }}
                        />
                        {client.health}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Folder
                            size={16}
                            className={styles.folderIcon}
                            onClick={handleFolderClick}
                            color="#888"
                            style={{ cursor: 'pointer' }}
                        />
                        <div className={styles.value}>{client.value}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
