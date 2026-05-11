import { NextResponse } from 'next/server';
import { listFolders, getRootFolderId } from '../../../../lib/drive';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        // For now, use the root folder ID from env
        // In production, you'd map client IDs to their specific folders
        const rootFolderId = getRootFolderId();
        const folders = await listFolders(rootFolderId);

        return NextResponse.json({
            folders: folders.map(f => ({
                id: f.id,
                name: f.name,
                type: 'folder',
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
