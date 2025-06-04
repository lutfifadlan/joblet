import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { password } = body

        if (!password) {
            return NextResponse.json(
                { error: 'New password is required' },
                { status: 400 }
            )
        }

        // Supabase handles the token through cookies automatically
        const { error } = await supabase.auth.updateUser({
            password
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status || 400 }
            )
        }

        return NextResponse.json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error(error)
        let errorMessage = 'Failed to reset password'
        if (error instanceof Error) {
            errorMessage = error.message
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}