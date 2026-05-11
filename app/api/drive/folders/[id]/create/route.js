import { NextResponse } from 'next/server';
import { createFolder } from '../../../../../lib/drive';

export async function POST(request, { params }) {
    const { id } = await params;

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Folder name is required' },
                { status: 400 }
            );
        }

        const folder = await createFolder(name, id);

        return NextResponse.json({
            id: folder.id,
            name: folder.name,
            type: 'folder',
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create folder', details: error.message },
            { status: 500 }
        );
    }
}
