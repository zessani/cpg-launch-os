'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingAnswers, WorkspaceContent, RoadmapPhase, Supplier, MarginData, BrandData } from '@/types'
import SummaryBar from '@/components/workspace/SummaryBar'
import RoadmapSection from '@/components/workspace/RoadmapSection'
import SuppliersSection from '@/components/workspace/SuppliersSection'
import MarginsSection from '@/components/workspace/MarginsSection'
import BrandSection from '@/components/workspace/BrandSection'

export default function Workspace() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})
  const [workspaceData, setWorkspaceData] = useState<WorkspaceContent | null>(null)
  const [hasLocalEdits, setHasLocalEdits] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cpg_answers')
      if (raw) setAnswers(JSON.parse(raw))
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem('cpg_workspace')
      if (saved) {
        setWorkspaceData(JSON.parse(saved))
        setHasLocalEdits(true)
        return
      }
      const ai = localStorage.getItem('cpg_workspace_ai')
      if (ai) {
        setWorkspaceData(JSON.parse(ai))
        return
      }
    } catch { /* ignore */ }

    // Nothing in storage — send back to start
    router.replace('/')
  }, [router])

  function handleWorkspaceChange(patch: Partial<WorkspaceContent>) {
    setWorkspaceData(prev => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      localStorage.setItem('cpg_workspace', JSON.stringify(next))
      return next
    })
    setHasLocalEdits(true)
  }

  function handleReset() {
    localStorage.removeItem('cpg_workspace')
    try {
      const ai = localStorage.getItem('cpg_workspace_ai')
      if (ai) {
        setWorkspaceData(JSON.parse(ai))
        setHasLocalEdits(false)
      }
    } catch { /* ignore */ }
  }

  if (!workspaceData) return null

  return (
    <div className="min-h-screen">
      <SummaryBar answers={answers} />

      {hasLocalEdits && (
        <div className="max-w-5xl mx-auto px-8 py-3">
          <button onClick={handleReset} className="text-xs text-[#6B7280] hover:text-[#0A0A0A] transition-colors underline underline-offset-2">
            Reset to generated
          </button>
        </div>
      )}

      <RoadmapSection
        phases={workspaceData.roadmap}
        onChange={(phases: RoadmapPhase[]) => handleWorkspaceChange({ roadmap: phases })}
      />
      <SuppliersSection
        answers={answers}
        suppliers={workspaceData.suppliers}
        onChange={(suppliers: Supplier[]) => handleWorkspaceChange({ suppliers })}
      />
      <MarginsSection
        answers={answers}
        margins={workspaceData.margins}
        onChange={(margins: MarginData) => handleWorkspaceChange({ margins })}
      />
      <BrandSection
        answers={answers}
        brand={workspaceData.brand}
        onChange={(brand: BrandData) => handleWorkspaceChange({ brand })}
      />
    </div>
  )
}
