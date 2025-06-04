import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/google/url`)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
