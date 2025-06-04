import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=${encodeURIComponent(error_description || error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=No code provided`);
  }

  try {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        
    if (sessionError || !data.session) {
      throw new Error(sessionError?.message || 'Failed to exchange code for session');
    }
    
    // Redirect to the specified destination or dashboard by default
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
  } catch (error: unknown) {
    console.error('Error in auth callback:', error);
    let errorMessage = 'Authentication failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
