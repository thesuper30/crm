// Enhanced Documents Database with Subfolder Support
// In production, this would be PostgreSQL/Supabase

export const FOLDER_TYPES = [
    { id: 'agreements', name: 'Agreements', icon: '📄' },
    { id: 'calendars', name: 'Content Calendars', icon: '📅' },
    { id: 'creatives', name: 'Creatives', icon: '🎨' },
    { id: 'credentials', name: 'Credentials', icon: '🔐' },
    { id: 'reports', name: 'Reports', icon: '📊' },
];

// Folders with parent support
let FOLDERS = [
    // Client 1 - TechFlow
    { id: 'f1-root', clientId: 'c1', parentFolderId: null, name: 'Documents', type: 'root', driveFolderId: 'drive_c1_root' },
    { id: 'f1-1', clientId: 'c1', parentFolderId: 'f1-root', name: 'Agreements', type: 'system', driveFolderId: 'drive_c1_agreements' },
    { id: 'f1-2', clientId: 'c1', parentFolderId: 'f1-root', name: 'Content Calendars', type: 'system', driveFolderId: 'drive_c1_calendars' },
    { id: 'f1-3', clientId: 'c1', parentFolderId: 'f1-root', name: 'Creatives', type: 'system', driveFolderId: 'drive_c1_creatives' },
    { id: 'f1-4', clientId: 'c1', parentFolderId: 'f1-root', name: 'Credentials', type: 'system', driveFolderId: 'drive_c1_credentials' },
    { id: 'f1-5', clientId: 'c1', parentFolderId: 'f1-root', name: 'Reports', type: 'system', driveFolderId: 'drive_c1_reports' },
    // Subfolder example
    { id: 'f1-1-1', clientId: 'c1', parentFolderId: 'f1-1', name: 'Contracts', type: 'custom', driveFolderId: 'drive_c1_contracts' },
    { id: 'f1-1-2', clientId: 'c1', parentFolderId: 'f1-1', name: 'NDAs', type: 'custom', driveFolderId: 'drive_c1_ndas' },

    // Client 2 - GreenEarth
    { id: 'f2-root', clientId: 'c2', parentFolderId: null, name: 'Documents', type: 'root', driveFolderId: 'drive_c2_root' },
    { id: 'f2-1', clientId: 'c2', parentFolderId: 'f2-root', name: 'Agreements', type: 'system', driveFolderId: 'drive_c2_agreements' },
    { id: 'f2-2', clientId: 'c2', parentFolderId: 'f2-root', name: 'Content Calendars', type: 'system', driveFolderId: 'drive_c2_calendars' },
    { id: 'f2-3', clientId: 'c2', parentFolderId: 'f2-root', name: 'Creatives', type: 'system', driveFolderId: 'drive_c2_creatives' },
    { id: 'f2-4', clientId: 'c2', parentFolderId: 'f2-root', name: 'Credentials', type: 'system', driveFolderId: 'drive_c2_credentials' },
    { id: 'f2-5', clientId: 'c2', parentFolderId: 'f2-root', name: 'Reports', type: 'system', driveFolderId: 'drive_c2_reports' },
];

// Files with file_type support
let FILES = [
    // TechFlow - Agreements
    { id: 'file1', folderId: 'f1-1', name: 'Master Service Agreement', fileType: 'doc', mimeType: 'application/vnd.google-apps.document', driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', size: '245 KB', createdAt: '2026-01-02' },
    { id: 'file2', folderId: 'f1-1-1', name: 'Service Contract v2', fileType: 'doc', mimeType: 'application/vnd.google-apps.document', driveFileId: 'doc_contract_v2', size: '128 KB', createdAt: '2026-01-03' },
    // TechFlow - Calendars
    { id: 'file3', folderId: 'f1-2', name: 'Q1 2026 Content Calendar', fileType: 'sheet', mimeType: 'application/vnd.google-apps.spreadsheet', driveFileId: 'sheet_q1_calendar', size: '89 KB', createdAt: '2026-01-05' },
    // TechFlow - Creatives
    { id: 'file4', folderId: 'f1-3', name: 'Brand Guidelines', fileType: 'upload', mimeType: 'application/pdf', driveFileId: '1brand123', size: '4.2 MB', createdAt: '2026-01-04' },
    { id: 'file5', folderId: 'f1-3', name: 'Hero Banner', fileType: 'upload', mimeType: 'image/png', driveFileId: '1hero789', size: '2.1 MB', createdAt: '2026-01-06' },
    // TechFlow - Reports
    { id: 'file6', folderId: 'f1-5', name: 'SEO Report - Dec 2025', fileType: 'doc', mimeType: 'application/vnd.google-apps.document', driveFileId: 'doc_seo_dec', size: '1.8 MB', createdAt: '2026-01-10' },
    { id: 'file7', folderId: 'f1-5', name: 'Traffic Analytics', fileType: 'sheet', mimeType: 'application/vnd.google-apps.spreadsheet', driveFileId: 'sheet_traffic', size: '456 KB', createdAt: '2026-01-12' },
];

// ===== QUERY FUNCTIONS =====

export function getRootFolder(clientId) {
    return FOLDERS.find(f => f.clientId === clientId && f.parentFolderId === null);
}

export function getSubfolders(parentFolderId) {
    return FOLDERS.filter(f => f.parentFolderId === parentFolderId);
}

export function getFilesInFolder(folderId) {
    return FILES.filter(f => f.folderId === folderId);
}

export function getFolderById(folderId) {
    return FOLDERS.find(f => f.id === folderId);
}

export function getFileById(fileId) {
    return FILES.find(f => f.id === fileId);
}

export function getBreadcrumbPath(folderId) {
    const path = [];
    let current = getFolderById(folderId);
    while (current) {
        path.unshift(current);
        current = current.parentFolderId ? getFolderById(current.parentFolderId) : null;
    }
    return path;
}

// ===== MUTATION FUNCTIONS =====

export function createFolder(clientId, parentFolderId, name) {
    const newFolder = {
        id: `folder_${Date.now()}`,
        clientId,
        parentFolderId,
        name,
        type: 'custom',
        driveFolderId: `drive_folder_${Date.now()}`,
    };
    FOLDERS.push(newFolder);
    return newFolder;
}

export function createFile(folderId, name, fileType) {
    const mimeTypes = {
        doc: 'application/vnd.google-apps.document',
        sheet: 'application/vnd.google-apps.spreadsheet',
    };

    const newFile = {
        id: `file_${Date.now()}`,
        folderId,
        name,
        fileType,
        mimeType: mimeTypes[fileType] || 'application/octet-stream',
        driveFileId: `drive_${fileType}_${Date.now()}`,
        size: '0 KB',
        createdAt: new Date().toISOString().split('T')[0],
    };
    FILES.push(newFile);
    return newFile;
}

// For uploaded files
export function addUploadedFile(folderId, name, mimeType, size) {
    const newFile = {
        id: `file_${Date.now()}`,
        folderId,
        name,
        fileType: 'upload',
        mimeType,
        driveFileId: `drive_upload_${Date.now()}`,
        size,
        createdAt: new Date().toISOString().split('T')[0],
    };
    FILES.push(newFile);
    return newFile;
}
