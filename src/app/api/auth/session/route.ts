import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    console.log(session);

    if (error) {
      return NextResponse.json({ error: error.message, valid: false }, { status: 401 });
    }

    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      user: session.user,
      expires: session.expires_at
    }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, valid: false }, { status: 500 });
  }
}