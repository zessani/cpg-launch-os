'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getQuestions, OnboardingAnswers } from '@/types'
import ProgressBar from '@/components/onboarding/ProgressBar'
import QuestionScreen from '@/components/onboarding/QuestionScreen'
import LoadingScreen from '@/components/onboarding/LoadingScreen'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})

  const questions = useMemo(() => getQuestions(answers), [answers])
  const isLoading = step === questions.length

  useEffect(() => {
    if (!isLoading) return
    const id = setTimeout(() => {
      localStorage.setItem('cpg_answers', JSON.stringify(answers))
      router.push('/workspace')
    }, 3000)
    return () => clearTimeout(id)
  }, [isLoading, answers, router])

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
        <LoadingScreen />
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
