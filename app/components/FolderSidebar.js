"use client";

import { FileText, Calendar, Image, Key, BarChart3, Folder } from 'lucide-react';

const FOLDER_ICONS = {
    agreements: FileText,
    calendars: Calendar,
    creatives: Image,
    credentials: Key,
    reports: BarChart3,
};

export default function FolderSidebar({ folders, selectedFolderId, onSelectFolder }) {
    return (
        <div style={{
            width: '240px',
            borderRight: '1px solid #eee',
            background: '#fafafa',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        }}>
            <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#888',
                textTransform: 'uppercase',
                marginBottom: '8px',
                padding: '0 8px'
            }}>
                Folders
            </div>

            {folders.map(folder => {
                const Icon = FOLDER_ICONS[folder.type] || Folder;
                const isSelected = folder.id === selectedFolderId;

                return (
                    <div
                        key={folder.id}
                        onClick={() => onSelectFolder(folder)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: isSelected ? '#fff' : 'transparent',
                            border: isSelected ? '1px solid #eee' : '1px solid transparent',
                            boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.15s'
                        }}
                    >
                        <Icon size={18} color={isSelected ? 'var(--accent-primary)' : '#666'} />
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: isSelected ? '600' : '400',
                            color: isSelected ? '#000' : '#444'
                        }}>
                            {folder.name}
                        </span>
                    </div>
                );
            })}

            {folders.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                    No folders found
                </div>
            )}
        </div>
    );
}
