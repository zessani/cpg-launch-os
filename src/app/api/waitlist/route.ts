import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  const sheetUrl = process.env.GOOGLE_SHEET_URL
  if (!sheetUrl) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  await fetch(sheetUrl, {
    method: 'POST',
    body: JSON.stringify({ email, source: 'landing' }),
  })
  return NextResponse.json({ ok: true })
}
