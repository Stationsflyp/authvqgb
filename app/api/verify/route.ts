import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ verified: true })
  
  response.cookies.set('cloudflare_verify', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
