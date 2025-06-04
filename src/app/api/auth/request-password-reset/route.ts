import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
      const supabase = await createClient()
      const body = await request.json()
      const { email } = body

      if (!email) {
          return NextResponse.json(
              { error: 'Email is required' },
              { status: 400 }
          )
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      })

      if (error) {
          return NextResponse.json(
              { error: error.message },
              { status: error.status || 400 }
          )
      }

      return NextResponse.json({ message: 'Reset password email sent successfully' })
  } catch (error) {
      console.error(error)
      let errorMessage = 'Failed to send reset password email'
      if (error instanceof Error) {
          errorMessage = error.message
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}