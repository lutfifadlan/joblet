import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ error: error.message, valid: false }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    
    // Ensure user exists in Prisma database
    try {
      const { id, email, user_metadata } = user;
      const name = user_metadata?.full_name || user_metadata?.name || email?.split('@')[0] || 'User';
      
      // Check if user already exists in Prisma
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });
      
      // If user doesn't exist, create them
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id,
            email: email || '',
            name
          }
        });
      }
    } catch (userError) {
      console.error('Error syncing user to Prisma:', userError);
      // Continue with the response even if user sync fails
    }

    return NextResponse.json({
      valid: true,
      user,
    }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, valid: false }, { status: 500 });
  }
}