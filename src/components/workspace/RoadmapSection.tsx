'use client'

import { useState } from 'react'
import { RoadmapPhase } from '@/types'
import EditableText from '@/components/ui/EditableText'

interface RoadmapSectionProps {
  phases: RoadmapPhase[]
  loading?: boolean
  onChange: (phases: RoadmapPhase[]) => void
}

export default function RoadmapSection({ phases, loading, onChange }: RoadmapSectionProps) {
  const [pendingFocus, setPendingFocus] = useState<{ phase: number; milestone: number } | null>(null)

  function updatePhaseTitle(pi: number, val: string) {
    onChange(phases.map((p, i) => i === pi ? { ...p, title: val } : p))
  }

  function updatePhaseTimeline(pi: number, val: string) {
    onChange(phases.map((p, i) => i === pi ? { ...p, timeline: val } : p))
  }

  function updateMilestone(pi: number, mi: number, val: string) {
    onChange(phases.map((p, i) => i === pi
      ? { ...p, milestones: p.milestones.map((m, j) => j === mi ? val : m) }
      : p
    ))
    setPendingFocus(null)
  }

  function addMilestone(pi: number) {
    const updated = phases.map((p, i) => i === pi
      ? { ...p, milestones: [...p.milestones, ''] }
      : p
    )
    onChange(updated)
    setPendingFocus({ phase: pi, milestone: updated[pi].milestones.length - 1 })
  }

  function removeMilestone(pi: number, mi: number) {
    if (phases[pi].milestones.length <= 1) return
    onChange(phases.map((p, i) => i === pi
      ? { ...p, milestones: p.milestones.filter((_, j) => j !== mi) }
      : p
    ))
  }

  return (
    <section className="py-12 border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[#6B7280]">Roadmap</h2>
          {loading && <span className="text-xs text-[#6B7280] italic">Generating…</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {phases.map((phase, pi) => (
            <div key={pi} className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <EditableText
                  value={phase.title}
                  onChange={val => updatePhaseTitle(pi, val)}
                  className="font-semibold text-[#0A0A0A]"
                  placeholder="Phase title…"
                />
                <EditableText
                  value={phase.timeline}
                  onChange={val => updatePhaseTimeline(pi, val)}
                  className="text-xs text-[#6B7280]"
                  placeholder="Timeline…"
                />
              </div>

              <ul className="flex flex-col gap-2">
                {phase.milestones.map((m, mi) => (
                  <li key={mi} className="group flex gap-2 text-sm text-[#6B7280]">
                    <span className="mt-[5px] w-1 h-1 rounded-full bg-[#6B7280] shrink-0" />
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <EditableText
                        value={m}
                        onChange={val => updateMilestone(pi, mi, val)}
                        placeholder="Add milestone…"
                        autoFocus={pendingFocus?.phase === pi && pendingFocus?.milestone === mi}
                        className="text-sm text-[#6B7280] flex-1"
                      />
                      {phase.milestones.length > 1 && (
                        <button
                          onClick={() => removeMilestone(pi, mi)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D1D5DB] hover:text-[#6B7280] text-xs shrink-0 mt-0.5"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => addMilestone(pi)}
                className="text-[10px] text-[#D1D5DB] hover:text-[#6B7280] transition-colors text-left"
              >
                + add milestone
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
