"use client";

import { FileText, Image, FileSpreadsheet, FileArchive, Film, File, Eye, Download, MoreVertical } from 'lucide-react';

const FILE_ICONS = {
    'application/pdf': { icon: FileText, color: '#dc2626' },
    'application/vnd.ms-excel': { icon: FileSpreadsheet, color: '#16a34a' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, color: '#16a34a' },
    'image/png': { icon: Image, color: '#7c3aed' },
    'image/jpeg': { icon: Image, color: '#7c3aed' },
    'image/gif': { icon: Image, color: '#7c3aed' },
    'application/zip': { icon: FileArchive, color: '#d97706' },
    'video/mp4': { icon: Film, color: '#0891b2' },
};

function getFileIcon(mimeType) {
    return FILE_ICONS[mimeType] || { icon: File, color: '#6b7280' };
}

export default function FileGrid({ files, onPreview, onDownload, isLoading }) {
    if (isLoading) {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888'
            }}>
                Loading files...
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                gap: '8px'
            }}>
                <File size={48} color="#ddd" />
                <p>No files in this folder</p>
                <p style={{ fontSize: '0.85rem' }}>Upload files to get started</p>
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            alignContent: 'start'
        }}>
            {files.map(file => {
                const { icon: Icon, color } = getFileIcon(file.mimeType);

                return (
                    <div
                        key={file.id}
                        style={{
                            background: 'white',
                            border: '1px solid #eee',
                            borderRadius: '10px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                        onClick={() => onPreview(file)}
                    >
                        {/* File Icon */}
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            background: `${color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon size={24} color={color} />
                        </div>

                        {/* File Info */}
                        <div>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                marginBottom: '4px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {file.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                {file.size} • {file.createdAt}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: 'auto'
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #eee',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Eye size={14} /> Preview
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #eee',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Download size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
