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
      content: `Find 3 real, currently operating suppliers for a ${product} brand launching in ${answers.launchMarket}.

LOCATION: Prioritize suppliers based in or near ${answers.launchMarket}. Only suggest international suppliers if no suitable local option exists.

BUDGET: The founder's total launch budget is ${answers.launchBudget}. Find suppliers whose MOQ is achievable within this budget leaving money for packaging, marketing, and shipping. Prioritize suppliers known to work with startups and first-time founders. Avoid enterprise-scale suppliers.

FOUNDER CONTEXT: This is a first-time founder at the ${answers.stage} stage placing their first order. Suppliers must be willing to work with unestablished brands.

VERIFICATION: For each supplier find a verifiable online presence — website URL, LinkedIn company page, trade directory listing, or Alibaba/IndiaMART profile. Skip any supplier with zero verifiable online presence and find a replacement.

Find exactly:
1. One co-packer or contract manufacturer
2. One ingredient or raw material supplier
3. One packaging supplier

Return ONLY a valid JSON array, nothing else:
[{"name":"...","type":"...","location":"...","minOrder":"...","source":"https://..."},{"name":"...","type":"...","location":"...","minOrder":"...","source":"https://..."},{"name":"...","type":"...","location":"...","minOrder":"...","source":"https://..."}]`,
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
