'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question } from '@/types'
import ChoiceOption from './ChoiceOption'
import TextInput from './TextInput'

interface QuestionScreenProps {
  question: Question
  stepIndex: number
  answer: string
  onAnswer: (val: string) => void
  onContinue: () => void
}

export default function QuestionScreen({
  question,
  stepIndex,
  answer,
  onAnswer,
  onContinue,
}: QuestionScreenProps) {
  const [otherText, setOtherText] = useState('')
  const [otherSelected, setOtherSelected] = useState(false)

  // Reset other state when step changes
  useEffect(() => {
    setOtherText('')
    setOtherSelected(false)
  }, [stepIndex])

  const isChoice = question.type === 'choice'
  const hasAnswer = answer.trim().length > 0

  function handleChoiceSelect(opt: string) {
    if (opt === 'Other' && isChoice) {
      setOtherSelected(true)
      setOtherText('')
      onAnswer('')
      return
    }
    setOtherSelected(false)
    onAnswer(opt)
    setTimeout(onContinue, 160)
  }

  function handleOtherTextChange(val: string) {
    setOtherText(val)
    onAnswer(val)
  }

  const showContinue = !isChoice || (otherSelected && hasAnswer)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="min-h-screen flex flex-col items-center justify-center px-6"
      >
        <div className="w-full max-w-lg flex flex-col gap-10">
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-[#0A0A0A]">
            {question.text}
          </h2>

          <div className="flex flex-col gap-1">
            {isChoice && question.options?.map((opt) => (
              <ChoiceOption
                key={opt}
                label={opt}
                selected={otherSelected ? opt === 'Other' : answer === opt}
                onSelect={() => handleChoiceSelect(opt)}
              />
            ))}

            {otherSelected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4"
              >
                <TextInput
                  value={otherText}
                  onChange={handleOtherTextChange}
                  placeholder="Describe your product…"
                />
              </motion.div>
            )}

            {question.type === 'text' && (
              <TextInput
                value={answer}
                onChange={onAnswer}
                placeholder="Type here…"
              />
            )}

            {question.type === 'textarea' && (
              <TextInput
                value={answer}
                onChange={onAnswer}
                multiline
                placeholder="Share your vision…"
              />
            )}
          </div>

          <AnimatePresence>
            {showContinue && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={onContinue}
                  className="bg-[#0A0A0A] text-[#FAFAF9] px-6 py-3 text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
                >
                  Continue →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
