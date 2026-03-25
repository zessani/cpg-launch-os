interface ChoiceOptionProps {
  label: string
  selected: boolean
  onSelect: () => void
}

export default function ChoiceOption({ label, selected, onSelect }: ChoiceOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`block w-full text-left py-2 text-xl transition-colors duration-150 ${
        selected
          ? 'text-[#0A0A0A] font-semibold'
          : 'text-[#6B7280] hover:text-[#0A0A0A]'
      }`}
    >
      {label}
    </button>
  )
}
