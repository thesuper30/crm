import { NextResponse } from 'next/server';
import { createGoogleDoc } from '../../../lib/drive';

export async function POST(request) {
    try {
        const { name, folderId } = await request.json();

        if (!name || !folderId) {
            console.error('Missing args:', { name, folderId });
            return NextResponse.json(
                { error: 'Name and folderId are required' },
                { status: 400 }
            );
        }

        console.log('Creating doc:', { name, folderId });
        const doc = await createGoogleDoc(name, folderId);
        console.log('Created doc result:', doc);

        return NextResponse.json({
            id: doc.id,
            name: doc.name,
            editUrl: doc.editUrl,
            fileType: 'doc',
        });
    } catch (error) {
        console.error('Drive API Error Full:', error);
        return NextResponse.json(
            { error: 'Failed to create document', details: error.message },
            { status: 500 }
        );
    }
}
