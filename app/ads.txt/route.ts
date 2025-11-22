import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const body = 'google.com, pub-6853743390551388, DIRECT, f08c47fec0942fa0'
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}
