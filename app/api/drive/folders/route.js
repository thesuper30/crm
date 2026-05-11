import { NextResponse } from 'next/server';
import { listFolders, getRootFolderId } from '../../../lib/drive';

export async function GET() {
    try {
        const rootFolderId = getRootFolderId();

        if (!rootFolderId) {
            return NextResponse.json(
                { error: 'GOOGLE_DRIVE_ROOT_FOLDER_ID not configured' },
                { status: 500 }
            );
        }

        const folders = await listFolders(rootFolderId);

        return NextResponse.json({
            folders: folders.map(f => ({
                id: f.id,
                name: f.name,
                type: 'folder',
                createdAt: f.createdTime,
            }))
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folders', details: error.message },
            { status: 500 }
        );
    }
}
