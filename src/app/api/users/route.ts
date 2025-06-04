import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { name, email, password } = body;
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const response = await supabase.from('users').update({ name, email, password }).eq('id', session.user.id);
    return NextResponse.json(response, { status: response.status });
}
