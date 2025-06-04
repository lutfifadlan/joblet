import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, message } = body;

    if (!email || !message) {
        return NextResponse.json({ error: 'Missing email or message' }, {
            status: 400,
        });
    }

    const contact = await prisma.contact.create({
        data: {
            email,
            message
        }
    });

    return NextResponse.json({ success: true, contact }, {
        status: 200,
    });
}