'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getQuestions, OnboardingAnswers, WorkspaceContent, Supplier } from '@/types'
import ProgressBar from '@/components/onboarding/ProgressBar'
import QuestionScreen from '@/components/onboarding/QuestionScreen'
import LoadingScreen from '@/components/onboarding/LoadingScreen'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})
  const [generationError, setGenerationError] = useState(false)

  const questions = useMemo(() => getQuestions(answers), [answers])
  const isLoading = step === questions.length

  function generate(savedAnswers: Partial<OnboardingAnswers>) {
    setGenerationError(false)

    // Fire both calls in parallel
    const mainCall = fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: savedAnswers }),
    })
      .then(res => { if (!res.ok) throw new Error('API error'); return res.json() })
      .then((data: WorkspaceContent) => {
        localStorage.setItem('cpg_workspace_ai', JSON.stringify(data))
      })

    // Supplier search runs in parallel — saves to its own key when ready
    fetch('/api/generate-suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: savedAnswers }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((suppliers: Supplier[]) => {
        localStorage.setItem('cpg_suppliers_ai', JSON.stringify(suppliers))
      })
      .catch(() => { /* workspace falls back to suppliers from main call */ })

    // Redirect as soon as main call finishes — don't wait for suppliers
    mainCall
      .then(() => router.push('/workspace'))
      .catch(() => setGenerationError(true))
  }

  useEffect(() => {
    if (!isLoading) return
    localStorage.setItem('cpg_answers', JSON.stringify(answers))
    generate(answers)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  function handleAnswer(val: string) {
    const key = questions[step].id
    setAnswers((prev) => ({ ...prev, [key]: val }))
  }

  function handleContinue() {
    setStep((s) => s + 1)
  }

  const currentAnswer = isLoading
    ? ''
    : (answers[questions[step].id] as string) ?? ''

  return (
    <>
      <ProgressBar step={step} total={questions.length} />

      {isLoading ? (
        <LoadingScreen error={generationError} onRetry={() => generate(answers)} />
      ) : (
        <QuestionScreen
          question={questions[step]}
          stepIndex={step}
          answer={currentAnswer}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
        />
      )}
    </>
  )
}
