import { OnboardingAnswers } from '@/types'

interface SummaryBarProps {
  answers: Partial<OnboardingAnswers>
}

const fields: { key: keyof OnboardingAnswers; label: string }[] = [
  { key: 'productType', label: 'Product' },
  { key: 'launchMarket', label: 'Market' },
  { key: 'launchBudget', label: 'Budget' },
  { key: 'stage', label: 'Stage' },
]

export default function SummaryBar({ answers }: SummaryBarProps) {
  return (
    <div className="border-b border-[#E5E5E5] px-8 py-4">
      <div className="max-w-5xl mx-auto flex flex-wrap gap-x-10 gap-y-2">
        {fields.map(({ key, label }) =>
          answers[key] ? (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6B7280] uppercase tracking-wide">{label}</span>
              <span className="text-sm font-medium text-[#0A0A0A]">{answers[key]}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}
