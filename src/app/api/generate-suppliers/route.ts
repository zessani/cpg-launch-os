import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { OnboardingAnswers, Supplier } from '@/types'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })

  const { answers } = (await req.json()) as { answers: OnboardingAnswers }
  const client = new Anthropic({ apiKey })

  const product = answers.productSubtype
    ? `${answers.productSubtype} (${answers.productType})`
    : answers.productType

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    tools: [{ type: 'web_search_20260209', name: 'web_search' }],
    messages: [{
      role: 'user',
      content: `Find 3 real, currently operating suppliers for a ${product} brand launching in ${answers.launchMarket}:
1. One co-packer or contract manufacturer
2. One ingredient or raw material supplier
3. One packaging supplier

Search for each and return the real company name, type, location, and realistic minimum order.
Respond with ONLY a valid JSON array and nothing else:
[{"name":"...","type":"...","location":"...","minOrder":"..."},{"name":"...","type":"...","location":"...","minOrder":"..."},{"name":"...","type":"...","location":"...","minOrder":"..."}]`,
    }],
  })

  const textBlock = response.content.findLast(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return NextResponse.json({ error: 'No response' }, { status: 500 })
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*?\]/)
  if (!jsonMatch) return NextResponse.json({ error: 'Could not parse suppliers' }, { status: 500 })

  try {
    const suppliers: Supplier[] = JSON.parse(jsonMatch[0])
    return NextResponse.json(suppliers)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model' }, { status: 500 })
  }
}
