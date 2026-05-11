"use client";

import { X, Download, ExternalLink } from 'lucide-react';

export default function PreviewModal({ file, previewUrl, downloadUrl, onClose }) {
    if (!file) return null;

    // For demo purposes, we'll show a placeholder when the Drive file doesn't exist
    // In production, the previewUrl would work directly
    const isRealDriveFile = file.driveFileId.startsWith('1BxiMVs') || file.driveFileId.length > 20;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                height: '60px',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                borderBottom: '1px solid #333'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '6px',
                            display: 'flex'
                        }}
                    >
                        <X size={24} color="white" />
                    </button>
                    <div>
                        <div style={{ color: 'white', fontWeight: '600' }}>{file.name}</div>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>{file.size}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            background: '#333',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Download size={16} /> Download
                    </a>
                </div>
            </div>

            {/* Preview Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                {isRealDriveFile ? (
                    <iframe
                        src={previewUrl}
                        style={{
                            width: '100%',
                            maxWidth: '1000px',
                            height: '100%',
                            border: 'none',
                            borderRadius: '8px',
                            background: 'white'
                        }}
                        allow="autoplay"
                    />
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '60px',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>{file.name}</h3>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            Preview not available for this demo file.
                            <br />
                            In production, Google Drive previews would render here.
                        </p>
                        <div style={{
                            padding: '16px',
                            background: '#f5f5f5',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: '#666'
                        }}>
                            <strong>File Details:</strong>
                            <br />
                            Type: {file.mimeType}
                            <br />
                            Size: {file.size}
                            <br />
                            Created: {file.createdAt}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
