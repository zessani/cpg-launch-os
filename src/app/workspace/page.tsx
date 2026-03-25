'use client'

import { useEffect, useState, useRef } from 'react'
import { OnboardingAnswers, WorkspaceContent, RoadmapPhase, Supplier, MarginData, BrandData } from '@/types'
import SummaryBar from '@/components/workspace/SummaryBar'
import RoadmapSection from '@/components/workspace/RoadmapSection'
import SuppliersSection from '@/components/workspace/SuppliersSection'
import MarginsSection from '@/components/workspace/MarginsSection'
import BrandSection from '@/components/workspace/BrandSection'

const WORKSPACE_PLACEHOLDER: WorkspaceContent = {
  roadmap: [
    {
      title: 'Phase 1: Foundation',
      timeline: 'Weeks 1–4',
      milestones: ['Define product specs and formulation', 'Identify and shortlist co-packers', 'Register business entity and obtain EIN'],
    },
    {
      title: 'Phase 2: Production',
      timeline: 'Weeks 5–12',
      milestones: ['Run samples with selected co-packer', 'Finalize packaging and labeling', 'Build DTC website and pre-launch page'],
    },
    {
      title: 'Phase 3: Launch',
      timeline: 'Weeks 13–16',
      milestones: ['Soft launch to warm audience', 'Collect feedback and iterate', 'Optimize unit economics and scale'],
    },
  ],
  suppliers: [
    { name: 'Pacific Coast Canning Co.', type: 'Co-packer', location: 'United States', minOrder: '500 units' },
    { name: 'Nutralab Inc.', type: 'Ingredients', location: 'United States', minOrder: '250 lbs' },
    { name: 'BoxForm Packaging', type: 'Packaging', location: 'United States', minOrder: '1,000 units' },
  ],
  margins: { cogs: '$3.10', price: '$12.99', margin: '76%', breakeven: '3,800 units' },
  brand: {
    names: ['Foundry', 'Origin Co.', 'Craft & Form'],
    tone: ['Authentic', 'Distinct', 'Intentional'],
    tagline: 'Built from the ground up.',
  },
}

export default function Workspace() {
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})
  const [workspaceData, setWorkspaceData] = useState<WorkspaceContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLocalEdits, setHasLocalEdits] = useState(false)
  const aiContentRef = useRef<WorkspaceContent | null>(null)

  useEffect(() => {
    // Load answers
    let parsed: Partial<OnboardingAnswers> = {}
    try {
      const raw = localStorage.getItem('cpg_answers')
      if (raw) parsed = JSON.parse(raw)
    } catch { /* ignore */ }
    setAnswers(parsed)

    // Check for saved edits
    try {
      const saved = localStorage.getItem('cpg_workspace')
      if (saved) {
        setWorkspaceData(JSON.parse(saved))
        setHasLocalEdits(true)
        return // skip AI call
      }
    } catch { /* ignore */ }

    // No saved edits — call AI
    if (Object.keys(parsed).length === 0) return
    setLoading(true)
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: parsed }),
    })
      .then(res => { if (!res.ok) throw new Error(`API error ${res.status}`); return res.json() })
      .then((data: WorkspaceContent) => {
        aiContentRef.current = data
        // Guard: don't overwrite edits made during generation
        if (!localStorage.getItem('cpg_workspace')) {
          setWorkspaceData(data)
        }
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  function handleWorkspaceChange(patch: Partial<WorkspaceContent>) {
    setWorkspaceData(prev => {
      const next = { ...(prev ?? WORKSPACE_PLACEHOLDER), ...patch }
      localStorage.setItem('cpg_workspace', JSON.stringify(next))
      return next
    })
    setHasLocalEdits(true)
  }

  function handleReset() {
    localStorage.removeItem('cpg_workspace')
    if (aiContentRef.current) {
      setWorkspaceData(aiContentRef.current)
      setHasLocalEdits(false)
    } else {
      // No AI result in memory — reload to trigger fresh generation
      window.location.reload()
    }
  }

  const resolved = workspaceData ?? WORKSPACE_PLACEHOLDER

  return (
    <div className="min-h-screen">
      <SummaryBar answers={answers} />

      {(error || hasLocalEdits) && (
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-6">
          {error && <p className="text-xs text-red-500">Generation failed: {error}.</p>}
          {hasLocalEdits && (
            <button onClick={handleReset} className="text-xs text-[#6B7280] hover:text-[#0A0A0A] transition-colors underline underline-offset-2">
              Reset to generated
            </button>
          )}
        </div>
      )}

      <RoadmapSection
        phases={resolved.roadmap}
        loading={loading}
        onChange={(phases: RoadmapPhase[]) => handleWorkspaceChange({ roadmap: phases })}
      />
      <SuppliersSection
        answers={answers}
        suppliers={resolved.suppliers}
        loading={loading}
        onChange={(suppliers: Supplier[]) => handleWorkspaceChange({ suppliers })}
      />
      <MarginsSection
        answers={answers}
        margins={resolved.margins}
        loading={loading}
        onChange={(margins: MarginData) => handleWorkspaceChange({ margins })}
      />
      <BrandSection
        answers={answers}
        brand={resolved.brand}
        loading={loading}
        onChange={(brand: BrandData) => handleWorkspaceChange({ brand })}
      />
    </div>
  )
}
