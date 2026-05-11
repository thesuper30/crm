import { NextResponse } from 'next/server';
import { listFolderContents, getFileUrl } from '../../../../../lib/drive';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const { folders, files } = await listFolderContents(id);

        // Helper to determine file type
        const getFileType = (mimeType) => {
            if (mimeType === 'application/vnd.google-apps.document') return 'doc';
            if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'sheet';
            if (mimeType === 'application/vnd.google-apps.presentation') return 'slides';
            return 'upload';
        };

        // Format size
        const formatSize = (size) => {
            if (!size) return 'N/A';
            const bytes = parseInt(size);
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        };

        return NextResponse.json({
            folders: folders.map(f => ({
                id: f.id,
                name: f.name,
                type: 'folder',
                createdAt: f.createdTime,
            })),
            files: files.map(f => ({
                id: f.id,
                name: f.name,
                mimeType: f.mimeType,
                fileType: getFileType(f.mimeType),
                size: formatSize(f.size),
                url: getFileUrl(f.id, f.mimeType),
                createdAt: f.createdTime,
                modifiedAt: f.modifiedTime,
            })),
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folder contents', details: error.message },
            { status: 500 }
        );
    }
}
