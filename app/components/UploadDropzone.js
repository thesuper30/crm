"use client";

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

export default function UploadDropzone({ folderId, onUploadComplete }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock upload result
        const newFile = {
            id: `file_${Date.now()}`,
            folderId: folderId,
            name: file.name,
            mimeType: file.type,
            driveFileId: `drive_${Date.now()}`,
            size: formatFileSize(file.size),
            createdAt: new Date().toISOString().split('T')[0],
        };

        setUploading(false);
        setUploadedFile(newFile);

        // Clear success message after 2 seconds
        setTimeout(() => {
            setUploadedFile(null);
        }, 2000);

        if (onUploadComplete) {
            onUploadComplete(newFile);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
                border: `2px dashed ${isDragging ? 'var(--accent-primary)' : '#ddd'}`,
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? '#fffbeb' : 'white',
                transition: 'all 0.2s'
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #eee',
                        borderTopColor: 'var(--accent-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ color: '#666' }}>Uploading...</span>
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : uploadedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={48} color="var(--success)" />
                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                        {uploadedFile.name} uploaded!
                    </span>
                </div>
            ) : (
                <>
                    <Upload size={32} color={isDragging ? 'var(--accent-primary)' : '#888'} style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {isDragging ? 'Drop file here' : 'Drop files here or click to upload'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                        PDF, Docs, Images, Videos supported
                    </div>
                </>
            )}
        </div>
    );
}
