'use client'

import { useState } from 'react'
import { OnboardingAnswers, BrandData } from '@/types'
import EditableText from '@/components/ui/EditableText'

interface BrandSectionProps {
  answers: Partial<OnboardingAnswers>
  brand: BrandData
  loading?: boolean
  onChange: (brand: BrandData) => void
}

export default function BrandSection({ answers, brand, loading, onChange }: BrandSectionProps) {
  const [pendingNameIdx, setPendingNameIdx] = useState<number | null>(null)
  const [pendingToneIdx, setPendingToneIdx] = useState<number | null>(null)

  function updateName(i: number, val: string) {
    const names = brand.names.map((n, idx) => idx === i ? val : n)
    onChange({ ...brand, names })
    setPendingNameIdx(null)
  }

  function addName() {
    const names = [...brand.names, '']
    onChange({ ...brand, names })
    setPendingNameIdx(names.length - 1)
  }

  function removeName(i: number) {
    if (brand.names.length <= 1) return
    onChange({ ...brand, names: brand.names.filter((_, idx) => idx !== i) })
  }

  function updateTone(i: number, val: string) {
    const tone = brand.tone.map((t, idx) => idx === i ? val : t)
    onChange({ ...brand, tone })
    setPendingToneIdx(null)
  }

  function addTone() {
    const tone = [...brand.tone, '']
    onChange({ ...brand, tone })
    setPendingToneIdx(tone.length - 1)
  }

  function removeTone(i: number) {
    if (brand.tone.length <= 1) return
    onChange({ ...brand, tone: brand.tone.filter((_, idx) => idx !== i) })
  }

  const customer = answers.targetCustomer ?? '—'

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[#6B7280]">Brand Identity</h2>
          {loading && <span className="text-xs text-[#6B7280] italic">Generating…</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

          {/* Name Ideas */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[#6B7280]">Name Ideas</p>
            <div className="flex flex-col gap-1.5">
              {brand.names.map((n, i) => (
                <div key={i} className="group flex items-center gap-1.5">
                  <EditableText
                    value={n}
                    onChange={val => updateName(i, val)}
                    placeholder="Brand name…"
                    autoFocus={pendingNameIdx === i}
                    className="text-lg font-semibold text-[#0A0A0A]"
                  />
                  {brand.names.length > 1 && (
                    <button
                      onClick={() => removeName(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D1D5DB] hover:text-[#6B7280] text-xs leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addName}
              className="text-[10px] text-[#D1D5DB] hover:text-[#6B7280] transition-colors text-left"
            >
              + add name
            </button>
          </div>

          {/* Tone & Voice */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[#6B7280]">Tone & Voice</p>
            <div className="flex flex-col gap-1.5">
              {brand.tone.map((t, i) => (
                <div key={i} className="group flex items-center gap-1.5">
                  <EditableText
                    value={t}
                    onChange={val => updateTone(i, val)}
                    placeholder="Adjective…"
                    autoFocus={pendingToneIdx === i}
                    className="text-sm text-[#0A0A0A]"
                  />
                  {brand.tone.length > 1 && (
                    <button
                      onClick={() => removeTone(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D1D5DB] hover:text-[#6B7280] text-xs leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addTone}
              className="text-[10px] text-[#D1D5DB] hover:text-[#6B7280] transition-colors text-left"
            >
              + add
            </button>
          </div>

          {/* Tagline */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[#6B7280]">Tagline</p>
            <EditableText
              value={brand.tagline ?? ''}
              onChange={val => onChange({ ...brand, tagline: val })}
              placeholder="Your tagline…"
              className="text-sm text-[#0A0A0A] italic"
            />
          </div>

          {/* Target Customer */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[#6B7280]">Target Customer</p>
            <p className="text-sm text-[#0A0A0A] leading-relaxed">{customer}</p>
          </div>

        </div>
      </div>
    </section>
  )
}
