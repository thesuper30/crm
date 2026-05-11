import { NextResponse } from 'next/server';
import { listFolderContents, getFileUrl } from '../../../../lib/drive';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const { folders, files } = await listFolderContents(id);

        return NextResponse.json({
            folders: folders.map(f => ({
                id: f.id,
                name: f.name,
                type: 'folder',
            })),
            files: files.map(f => ({
                id: f.id,
                name: f.name,
                mimeType: f.mimeType,
                url: getFileUrl(f.id, f.mimeType),
            }))
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folder contents', details: error.message },
            { status: 500 }
        );
    }
}
