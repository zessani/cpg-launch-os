interface TextInputProps {
  value: string
  onChange: (val: string) => void
  multiline?: boolean
  placeholder?: string
}

export default function TextInput({ value, onChange, multiline, placeholder }: TextInputProps) {
  const base =
    'w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#0A0A0A] outline-none text-xl text-[#0A0A0A] placeholder:text-[#E5E5E5] transition-colors duration-200 py-2 resize-none'

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Type here…'}
        rows={4}
        className={base}
      />
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Type here…'}
      className={base}
    />
  )
}
