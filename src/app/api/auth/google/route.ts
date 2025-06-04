import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  // Get the request URL to use as fallback
  const requestUrl = new URL(req.url);
  try {
    const supabase = await createClient();
    // Use requestUrl.origin as fallback if NEXT_PUBLIC_BASE_URL is not available
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    console.log('Google sign-in initiated with redirectTo:', `${baseUrl}/api/auth/callback`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    let errorMessage = 'Failed to initiate Google sign-in';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
