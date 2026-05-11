import { google } from 'googleapis';

// Initialize Google Drive API client
function getDriveClient() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    return google.drive({ version: 'v3', auth });
}

// Get the root folder ID from environment
export function getRootFolderId() {
    return process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
}

/**
 * List folders inside a parent folder
 */
export async function listFolders(parentFolderId) {
    const drive = getDriveClient();

    const response = await drive.files.list({
        q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name, mimeType, createdTime)',
        orderBy: 'name',
    });

    return response.data.files || [];
}

/**
 * List files inside a folder (excluding folders)
 */
export async function listFiles(folderId) {
    const drive = getDriveClient();

    const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        orderBy: 'modifiedTime desc',
    });

    return response.data.files || [];
}

/**
 * List all contents of a folder (folders + files)
 */
export async function listFolderContents(folderId) {
    const drive = getDriveClient();

    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        orderBy: 'folder,name',
    });

    const files = response.data.files || [];

    // Separate folders and files
    const folders = files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
    const documents = files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');

    return { folders, files: documents };
}

/**
 * Create a new folder
 */
export async function createFolder(name, parentFolderId) {
    const drive = getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        },
        fields: 'id, name',
    });

    return response.data;
}

/**
 * Create a Google Doc
 */
export async function createGoogleDoc(name, parentFolderId) {
    const drive = getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.document',
            parents: [parentFolderId],
        },
        fields: 'id, name, webViewLink',
    });

    console.log('Drive Create Response:', response.data);

    return {
        id: response.data.id,
        name: response.data.name,
        editUrl: response.data.webViewLink,
    };
}

/**
 * Create a Google Sheet
 */
export async function createGoogleSheet(name, parentFolderId) {
    const drive = getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.spreadsheet',
            parents: [parentFolderId],
        },
        fields: 'id, name, webViewLink',
    });

    return {
        id: response.data.id,
        name: response.data.name,
        editUrl: response.data.webViewLink,
    };
}

/**
 * Upload a file
 */
export async function uploadFile(file, parentFolderId) {
    const drive = getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name: file.name,
            parents: [parentFolderId],
        },
        media: {
            mimeType: file.type,
            body: file.stream(),
        },
        fields: 'id, name, mimeType, size, webViewLink',
    });

    return response.data;
}

/**
 * Get file details
 */
export async function getFile(fileId) {
    const drive = getDriveClient();

    const response = await drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, createdTime',
    });

    return response.data;
}

/**
 * Get preview/edit URL based on file type
 */
export function getFileUrl(fileId, mimeType) {
    if (mimeType === 'application/vnd.google-apps.document') {
        return `https://docs.google.com/document/d/${fileId}/edit`;
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        return `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
    } else if (mimeType === 'application/vnd.google-apps.presentation') {
        return `https://docs.google.com/presentation/d/${fileId}/edit`;
    } else {
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
}

/**
 * Get download URL
 */
export function getDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Delete a file (move to trash)
 */
export async function deleteFile(fileId) {
    const drive = getDriveClient();

    await drive.files.update({
        fileId,
        requestBody: { trashed: true },
    });

    return true;
}
