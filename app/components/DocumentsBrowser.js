"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Plus, FileText, FileSpreadsheet, Folder, Upload, File, Calendar, Image, Key, BarChart3, Loader2 } from 'lucide-react';
import PreviewModal from './PreviewModal';

// Folder type icons for sidebar
const FOLDER_TYPE_ICONS = {
    'Agreements': { icon: FileText, color: '#dc2626' },
    'Content Calendars': { icon: Calendar, color: '#7c3aed' },
    'Creatives': { icon: Image, color: '#0891b2' },
    'Credentials': { icon: Key, color: '#d97706' },
    'Reports': { icon: BarChart3, color: '#16a34a' },
};

// File type icons
const FILE_ICONS = {
    doc: { icon: FileText, color: '#4285f4', label: 'Google Doc' },
    sheet: { icon: FileSpreadsheet, color: '#0f9d58', label: 'Google Sheet' },
    slides: { icon: FileText, color: '#f59e0b', label: 'Google Slides' },
    upload: { icon: File, color: '#6b7280', label: 'File' },
};

export default function DocumentsBrowser({ clientId }) {
    const [rootFolders, setRootFolders] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [subfolders, setSubfolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewMenu, setShowNewMenu] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [creating, setCreating] = useState(false);

    // Fetch root folders on mount
    useEffect(() => {
        async function fetchRootFolders() {
            try {
                const response = await fetch('/api/drive/folders');
                const data = await response.json();

                if (data.folders && data.folders.length > 0) {
                    setRootFolders(data.folders);
                    setCurrentFolderId(data.folders[0].id);
                    setBreadcrumbs([data.folders[0]]);
                }
            } catch (error) {
                console.error('Failed to fetch root folders:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRootFolders();
    }, []);

    // Fetch folder contents when current folder changes
    const fetchFolderContents = useCallback(async (folderId) => {
        if (!folderId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/drive/folders/${folderId}/contents`);
            const data = await response.json();

            setSubfolders(data.folders || []);
            setFiles(data.files || []);
        } catch (error) {
            console.error('Failed to fetch folder contents:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentFolderId) {
            fetchFolderContents(currentFolderId);
        }
    }, [currentFolderId, fetchFolderContents]);

    const navigateToFolder = (folder) => {
        setCurrentFolderId(folder.id);

        // Check if this is a root folder
        const isRootFolder = rootFolders.some(rf => rf.id === folder.id);

        if (isRootFolder) {
            setBreadcrumbs([folder]);
        } else {
            // Check if folder is already in breadcrumbs
            const existingIndex = breadcrumbs.findIndex(b => b.id === folder.id);
            if (existingIndex >= 0) {
                setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
            } else {
                setBreadcrumbs([...breadcrumbs, folder]);
            }
        }
        setShowNewMenu(false);
    };

    const handleCreateDoc = async () => {
        const name = prompt('Enter document name:');
        if (name) {
            // Open tab immediately to avoid popup blocker
            const newTab = window.open('about:blank', '_blank');
            if (newTab) newTab.document.write('Creating document...');

            setCreating(true);
            try {
                const response = await fetch('/api/drive/docs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, folderId: currentFolderId }),
                });
                const doc = await response.json();

                if (doc.editUrl) {
                    if (newTab) {
                        newTab.location.href = doc.editUrl;
                    } else {
                        window.open(doc.editUrl, '_blank');
                    }
                    fetchFolderContents(currentFolderId);
                } else {
                    if (newTab) newTab.close();
                    alert('Failed to create document: No URL returned');
                }
            } catch (error) {
                if (newTab) newTab.close();
                console.error('Failed to create doc:', error);
                alert('Failed to create document');
            } finally {
                setCreating(false);
            }
        }
        setShowNewMenu(false);
    };

    const handleCreateSheet = async () => {
        const name = prompt('Enter sheet name:');
        if (name) {
            // Open tab immediately to avoid popup blocker
            const newTab = window.open('about:blank', '_blank');
            if (newTab) newTab.document.write('Creating spreadsheet...');

            setCreating(true);
            try {
                const response = await fetch('/api/drive/sheets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, folderId: currentFolderId }),
                });
                const sheet = await response.json();

                if (sheet.editUrl) {
                    if (newTab) {
                        newTab.location.href = sheet.editUrl;
                    } else {
                        window.open(sheet.editUrl, '_blank');
                    }
                    fetchFolderContents(currentFolderId);
                } else {
                    if (newTab) newTab.close();
                    alert('Failed to create spreadsheet: No URL returned');
                }
            } catch (error) {
                if (newTab) newTab.close();
                console.error('Failed to create sheet:', error);
                alert('Failed to create spreadsheet');
            } finally {
                setCreating(false);
            }
        }
        setShowNewMenu(false);
    };

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            setCreating(true);
            try {
                const response = await fetch(`/api/drive/folders/${currentFolderId}/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newFolderName.trim() }),
                });
                const folder = await response.json();

                if (folder.id) {
                    setSubfolders(prev => [...prev, folder]);
                }
            } catch (error) {
                console.error('Failed to create folder:', error);
                alert('Failed to create folder');
            } finally {
                setCreating(false);
                setNewFolderName('');
                setShowNewFolderInput(false);
            }
        }
        setShowNewMenu(false);
    };

    const handleFileClick = (file) => {
        if (file.url) {
            window.open(file.url, '_blank');
        } else {
            setPreviewFile(file);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCreating(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folderId', currentFolderId);

                // For now, just show success (upload endpoint would need multipart handling)
                alert(`Upload functionality coming soon! File: ${file.name}`);
                // In production: await fetch('/api/drive/upload', { method: 'POST', body: formData });
            } catch (error) {
                console.error('Failed to upload:', error);
            } finally {
                setCreating(false);
            }
        }
        setShowNewMenu(false);
    };

    if (loading && rootFolders.length === 0) {
        return (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '8px' }}>
                <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
            {/* Left Sidebar - Main Folders with Icons */}
            <div style={{ width: '220px', borderRight: '1px solid #eee', background: '#fafafa', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', marginBottom: '8px', padding: '0 8px' }}>
                    Folders
                </div>
                {rootFolders.map(folder => {
                    const iconConfig = FOLDER_TYPE_ICONS[folder.name] || { icon: Folder, color: '#666' };
                    const Icon = iconConfig.icon;
                    const isSelected = breadcrumbs[0]?.id === folder.id;

                    return (
                        <div
                            key={folder.id}
                            onClick={() => navigateToFolder(folder)}
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
                            <Icon size={18} color={isSelected ? iconConfig.color : '#666'} />
                            <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#000' : '#444' }}>
                                {folder.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Breadcrumbs */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {breadcrumbs.map((crumb, i) => (
                            <div key={crumb.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {i > 0 && <ChevronRight size={16} color="#888" />}
                                <button
                                    onClick={() => navigateToFolder(crumb)}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: i === breadcrumbs.length - 1 ? '#f5f5f5' : 'transparent',
                                        fontWeight: i === breadcrumbs.length - 1 ? '600' : '400',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {crumb.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                            {/* Subfolders */}
                            {subfolders.map(folder => (
                                <div
                                    key={folder.id}
                                    onClick={() => navigateToFolder(folder)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #eee',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <Folder size={40} color="#f59e0b" fill="#fef3c7" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center', wordBreak: 'break-word' }}>{folder.name}</span>
                                </div>
                            ))}

                            {/* Files */}
                            {files.map(file => {
                                const { icon: Icon, color, label } = FILE_ICONS[file.fileType] || FILE_ICONS.upload;
                                return (
                                    <div
                                        key={file.id}
                                        onClick={() => handleFileClick(file)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Icon size={40} color={color} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center', wordBreak: 'break-word' }}>{file.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#888' }}>{file.size || label}</span>
                                    </div>
                                );
                            })}

                            {/* Empty State */}
                            {subfolders.length === 0 && files.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: '#888' }}>
                                    <Folder size={48} color="#ddd" style={{ marginBottom: '12px' }} />
                                    <p>This folder is empty</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewFile && (
                <PreviewModal
                    file={previewFile}
                    previewUrl={`https://drive.google.com/file/d/${previewFile.id}/preview`}
                    downloadUrl={`https://drive.google.com/uc?export=download&id=${previewFile.id}`}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
}
