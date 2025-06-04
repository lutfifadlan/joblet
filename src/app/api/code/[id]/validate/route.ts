import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_JOBLET_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const cookieStore = await cookies();
    const token = cookieStore.get("jc_token")?.value;
    const url = `${API_BASE_URL}/api/v1/code/${id}/validate`;
    const backendRes = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}