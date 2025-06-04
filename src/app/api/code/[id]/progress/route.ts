import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_JOBLET_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const cookieStore = await cookies();
    const token = cookieStore.get("jc_token")?.value;
    const url = `${API_BASE_URL}/api/v1/code/${id}/progress`;
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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const cookieStore = await cookies();
    const token = cookieStore.get("jc_token")?.value;
    const url = `${API_BASE_URL}/api/v1/code/${id}/progress`;
    const backendRes = await fetch(url, {
      method: 'POST',
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("jc_token")?.value;
    const url = `${API_BASE_URL}/api/v1/code/${id}/progress`;
    
    // First check if the progress record exists by using GET
    const checkRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // If progress doesn't exist, create it first
    if (checkRes.status === 404) {
      console.log("Progress not found, creating a new one...");
      // Create a new progress record using the backend's create endpoint
      try {
        const createRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!createRes.ok) {
          console.error("Failed to create progress record:", await createRes.text());
          return NextResponse.json({ error: "Failed to create progress record" }, { status: 500 });
        }
      } catch (createError) {
        console.error("Error creating progress record:", createError);
        return NextResponse.json({ error: "Error creating progress record" }, { status: 500 });
      }
    }
    
    // Now update the progress
    const backendRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    
    if (!backendRes.ok) {
      console.error("Failed to update progress:", await backendRes.text());
      return NextResponse.json({ error: "Failed to update progress" }, { status: backendRes.status });
    }
    
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

