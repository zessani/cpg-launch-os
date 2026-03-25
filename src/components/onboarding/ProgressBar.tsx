interface ProgressBarProps {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.min((step / total) * 100, 100)
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#E5E5E5] z-50">
      <div
        className="h-full bg-[#0A0A0A] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
