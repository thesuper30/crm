import { NextResponse } from 'next/server';
import { createGoogleSheet } from '../../../lib/drive';

export async function POST(request) {
    try {
        const { name, folderId } = await request.json();

        if (!name || !folderId) {
            return NextResponse.json(
                { error: 'Name and folderId are required' },
                { status: 400 }
            );
        }

        const sheet = await createGoogleSheet(name, folderId);

        return NextResponse.json({
            id: sheet.id,
            name: sheet.name,
            editUrl: sheet.editUrl,
            fileType: 'sheet',
        });
    } catch (error) {
        console.error('Drive API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create spreadsheet', details: error.message },
            { status: 500 }
        );
    }
}
