import { NextResponse } from 'next/server';
import { getFile, getFileUrl, getDownloadUrl } from '../../../lib/drive';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const file = await getFile(id);

        return NextResponse.json({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            previewUrl: getFileUrl(file.id, file.mimeType),
            downloadUrl: getDownloadUrl(file.id),
            createdAt: file.createdTime,
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch file details', details: error.message },
            { status: 500 }
        );
    }
}
