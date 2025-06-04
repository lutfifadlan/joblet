import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';
  
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
    // The code is automatically handled by Supabase when it's in the URL
    // We need to explicitly call exchangeCodeForSession to process the OAuth code
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError || !data.session) {
      throw new Error(sessionError?.message || 'Failed to exchange code for session');
    }
    
    // Redirect to dashboard or specified redirect URL after successful authentication
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
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
