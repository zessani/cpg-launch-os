'use client'

import { OnboardingAnswers, MarginData } from '@/types'
import EditableText from '@/components/ui/EditableText'

interface MarginsSectionProps {
  answers: Partial<OnboardingAnswers>
  margins: MarginData
  loading?: boolean
  onChange: (margins: MarginData) => void
}

const BUDGET_TO_INVESTMENT: Record<string, number> = {
  'Under $10K':  8000,
  '$10K–$50K':   25000,
  '$50K–$150K':  75000,
  '$150K+':      200000,
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}

function fmt$(n: number) { return `$${n.toFixed(2)}` }
function fmtPct(n: number) { return `${Math.round(n)}%` }
function fmtUnits(n: number) { return `${Math.round(n).toLocaleString()} units` }

export default function MarginsSection({ answers, margins, loading, onChange }: MarginsSectionProps) {
  const investment = BUDGET_TO_INVESTMENT[answers.launchBudget ?? ''] ?? 25000

  function handleChange(key: keyof MarginData, raw: string) {
    const cogs  = parseNum(key === 'cogs'  ? raw : margins.cogs)
    const price = parseNum(key === 'price' ? raw : margins.price)

    let newMargins: MarginData

    if (key === 'cogs' || key === 'price') {
      const marginPct = price > 0 ? ((price - cogs) / price) * 100 : 0
      const breakeven = (price - cogs) > 0 ? investment / (price - cogs) : 0
      newMargins = {
        cogs:      fmt$(cogs),
        price:     fmt$(price),
        margin:    fmtPct(marginPct),
        breakeven: fmtUnits(breakeven),
      }
    } else if (key === 'margin') {
      const marginPct = parseNum(raw)
      const newCogs = price * (1 - marginPct / 100)
      const breakeven = (price - newCogs) > 0 ? investment / (price - newCogs) : 0
      newMargins = {
        cogs:      fmt$(newCogs),
        price:     fmt$(price),
        margin:    fmtPct(marginPct),
        breakeven: fmtUnits(breakeven),
      }
    } else {
      // breakeven edited manually — just update it
      newMargins = { ...margins, breakeven: raw }
    }

    onChange(newMargins)
  }

  const items: { label: string; key: keyof MarginData }[] = [
    { label: 'Unit COGS',           key: 'cogs' },
    { label: 'Target Retail Price', key: 'price' },
    { label: 'Gross Margin',        key: 'margin' },
    { label: 'Break-even Units',    key: 'breakeven' },
  ]

  return (
    <section className="py-12 border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[#6B7280]">Margins</h2>
          {loading && <span className="text-xs text-[#6B7280] italic">Generating…</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {items.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs text-[#6B7280]">{label}</span>
              <EditableText
                value={margins[key]}
                onChange={val => handleChange(key, val)}
                placeholder="—"
                className="text-2xl font-semibold text-[#0A0A0A]"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-[#6B7280] mt-6">
          Edit COGS or price to auto-recalculate margin and break-even.
        </p>
      </div>
    </section>
  )
}
