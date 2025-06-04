import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: authError.status || 400 }
            );
        }

        // Create user in Prisma database
        const user = await prisma.user.create({
            data: {
                id: authData.user?.id as string, // Use Supabase user ID as Prisma user ID
                email,
                name
            }
        });

        return NextResponse.json(
            { 
                user: authData.user,
                session: authData.session,
                dbUser: user
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
    