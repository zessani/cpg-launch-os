'use client'

import { useState, useEffect, useRef } from 'react'

interface EditableTextProps {
  value: string
  onChange: (next: string) => void
  multiline?: boolean
  className?: string
  placeholder?: string
  autoFocus?: boolean
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = 'Click to edit…',
  autoFocus = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(autoFocus)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      // Move cursor to end
      const len = draft.length
      inputRef.current?.setSelectionRange(len, len)
    }
  }, [editing])

  // Sync external value changes (e.g. after AI generation) when not editing
  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  function commit() {
    onChange(draft.trim() || value)
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); cancel() }
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit() }
  }

  if (editing) {
    const shared = {
      ref: inputRef,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: handleKeyDown,
      placeholder,
      className: `bg-transparent outline-none border-b border-[#0A0A0A] w-full text-inherit placeholder:text-[#D1D5DB] ${className}`,
    }

    return multiline
      ? <textarea {...shared} rows={3} style={{ resize: 'none' }} />
      : <input type="text" {...shared} />
  }

  return (
    <span
      className={`group/edit relative cursor-text inline-flex items-center gap-1 ${className}`}
      onClick={() => { setDraft(value); setEditing(true) }}
    >
      <span className={value ? '' : 'text-[#D1D5DB]'}>
        {value || placeholder}
      </span>
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-[#D1D5DB] text-[10px] leading-none select-none">
        ✎
      </span>
    </span>
  )
}
