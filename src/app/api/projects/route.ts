import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_JOBLET_API_URL || 'http://localhost:8080';

export async function GET() {
  try {
    const url = `${API_BASE_URL}/api/v1/projects`;
    const backendRes = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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
