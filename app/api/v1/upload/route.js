import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req) {
    if (req.method === 'POST') {
        try {
            const formData = await req.formData();
            const file = formData.get('image');

            if (!file) {
                return NextResponse.json(
                    { message: "No file uploaded!" },
                    { status: 400 }
                );
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            const fileName = `${Date.now()}-${file.name}`
            const filePath = path.join(uploadDir, fileName);

            await fs.writeFile(filePath, buffer);

            return NextResponse.json(
                { message: "File uploaded successfully!", filename: fileName },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error uploading file:', error);
            return NextResponse.json(
                { message: "Error uploading file" },
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json(
            { message: "Method not allowed!" },
            { status: 405 }
        );
    }
};
