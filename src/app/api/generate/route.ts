import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { OnboardingAnswers } from '@/types'

const WorkspaceSchema = z.object({
  roadmap: z.array(z.object({
    title: z.string(),
    timeline: z.string(),
    milestones: z.array(z.string()),
  })),
  suppliers: z.array(z.object({
    name: z.string(),
    type: z.string(),
    location: z.string(),
    minOrder: z.string(),
  })),
  margins: z.object({
    cogs: z.string(),
    price: z.string(),
    margin: z.string(),
    breakeven: z.string(),
  }),
  brand: z.object({
    names: z.array(z.string()),
    tone: z.array(z.string()),
    tagline: z.string(),
  }),
})

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const { answers } = (await req.json()) as { answers: OnboardingAnswers }

  const client = new Anthropic({ apiKey })

  const product = answers.productSubtype
    ? `${answers.productSubtype} (${answers.productType})`
    : answers.productType

  const prompt = `You are a CPG (Consumer Packaged Goods) launch advisor. A founder has answered questions about their brand. Generate a personalized launch workspace.

Founder profile:
- Product: ${product}
- Launch market: ${answers.launchMarket}
- Target customer: ${answers.targetCustomer}
- Budget: ${answers.launchBudget}
- Manufacturing plan: ${answers.manufacturing}
- Current stage: ${answers.stage}
- Brand vision: ${answers.brandVision}

Generate exactly:

1. roadmap — 3 phases with 3 milestones each. Each milestone should be a specific, actionable task (not generic). Use their actual product category, budget, and stage to make it real. Example of a GOOD milestone: "Source food-grade citric acid and natural flavors from a certified US supplier". Example of BAD: "Source ingredients". Phase titles format: "Phase 1: [Name]".

2. suppliers — 3 suppliers: one co-packer, one ingredient/material supplier, one packaging supplier. Use plausible real-sounding company names specific to the product type and market (e.g. for a US beverage: "Pacific Beverage Co-Pack, Sacramento CA"). Include realistic minimum orders.

3. margins — realistic CPG unit economics for their exact product type and budget tier. Be specific (e.g. for an energy drink at $10K–$50K budget: COGS ~$0.85/can, retail ~$3.49, margin ~76%, breakeven ~14,000 units).

4. brand — 3 creative brand name ideas (just the name itself, no description, no explanation, no dash, no parentheses — e.g. "Floe", "Brisk Theory", "Swell"), 3 tone adjectives that fit their target customer, and a punchy tagline under 8 words. Names must reflect their actual brand vision text.

Be highly specific. Generic answers are not acceptable.`

  const response = await client.messages.parse({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    output_config: {
      format: zodOutputFormat(WorkspaceSchema),
    },
  })

  return NextResponse.json(response.parsed_output)
}
